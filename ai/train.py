"""
AudAI - Model Training Pipeline
Trains a Random Forest Classifier to predict hearing loss categories from Pure Tone Audiometry data.
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

def extract_features(df):
    """
    Feature engineering pipeline for Pure Tone Audiometry.
    Extracts Pure Tone Averages (PTA), High-Frequency Averages, Asymmetry, and Slopes.
    """
    X = pd.DataFrame()
    
    # 1. Raw frequencies
    freq_cols = ['L_250', 'L_500', 'L_1000', 'L_2000', 'L_4000', 'L_8000',
                 'R_250', 'R_500', 'R_1000', 'R_2000', 'R_4000', 'R_8000']
    
    for col in freq_cols:
        X[col] = df[col]
        
    # 2. Pure Tone Average (PTA) for speech frequencies (500Hz, 1000Hz, 2000Hz, 4000Hz)
    X['pta_left'] = df[['L_500', 'L_1000', 'L_2000', 'L_4000']].mean(axis=1)
    X['pta_right'] = df[['R_500', 'R_1000', 'R_2000', 'R_4000']].mean(axis=1)
    
    # 3. High Frequency Average (4000Hz, 8000Hz)
    X['high_freq_left'] = df[['L_4000', 'L_8000']].mean(axis=1)
    X['high_freq_right'] = df[['R_4000', 'R_8000']].mean(axis=1)
    
    # 4. Low Frequency Average (250Hz, 500Hz)
    X['low_freq_left'] = df[['L_250', 'L_500']].mean(axis=1)
    X['low_freq_right'] = df[['R_250', 'R_500']].mean(axis=1)
    
    # 5. Asymmetry Metrics
    X['asymmetry_pta'] = (X['pta_left'] - X['pta_right']).abs()
    X['asymmetry_high'] = (X['high_freq_left'] - X['high_freq_right']).abs()
    
    # 6. Frequency Slopes (High minus Low threshold)
    X['slope_left'] = df['L_8000'] - df['L_250']
    X['slope_right'] = df['R_8000'] - df['R_250']
    
    # 7. Max & Min ear PTA
    X['max_pta'] = X[['pta_left', 'pta_right']].max(axis=1)
    X['min_pta'] = X[['pta_left', 'pta_right']].min(axis=1)
    
    return X

def train_model():
    dataset_path = os.path.join(os.path.dirname(__file__), "dataset", "audiogram_dataset.csv")
    
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}. Run generate_dataset.py first.")
        
    print(f"Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)
    
    # Prepare features (X) and target (y)
    X = extract_features(df)
    y = df['diagnosis']
    
    print(f"Dataset shape: {X.shape}, Target classes: {y.nunique()}")
    
    # Train-test split (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Initialize Random Forest Classifier
    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=15,
        min_samples_split=4,
        random_state=42,
        n_jobs=-1
    )
    
    print("Training Random Forest Classifier...")
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print("\n" + "="*50)
    print(f"🎯 Model Accuracy: {accuracy * 100:.2f}%")
    print("="*50)
    print("\nClassification Report:\n")
    print(classification_report(y_test, y_pred))
    
    # Save model artifacts
    model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
    metadata = {
        "feature_names": list(X.columns),
        "classes": list(model.classes_),
        "accuracy": float(accuracy)
    }
    
    joblib.dump({"model": model, "metadata": metadata}, model_path)
    print(f"✅ Trained model saved to: {model_path}")

if __name__ == "__main__":
    train_model()
