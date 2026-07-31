"""
AudAI - Audiogram Dataset Generator
Generates synthetic clinical audiogram data based on WHO Pure Tone Audiometry standards.
"""

import numpy as np
import pandas as pd
import os

def generate_audiogram_dataset(num_samples=3000, seed=42):
    np.random.seed(seed)
    
    categories = [
        "Normal", 
        "Mild Hearing Loss", 
        "Moderate Hearing Loss", 
        "Moderately Severe Hearing Loss", 
        "Severe Hearing Loss", 
        "Profound Hearing Loss",
        "High Frequency Loss",
        "Asymmetric Loss"
    ]
    
    # Probabilities for categories in typical population dataset
    cat_probs = [0.25, 0.20, 0.15, 0.12, 0.10, 0.05, 0.08, 0.05]
    
    records = []
    
    for i in range(num_samples):
        cat = np.random.choice(categories, p=cat_probs)
        age = np.random.randint(18, 85)
        gender = np.random.choice(["Male", "Female"])
        
        # Base decibels for left and right ears based on category
        if cat == "Normal":
            base_l = np.random.uniform(5, 20)
            base_r = base_l + np.random.normal(0, 3)
            slope_l, slope_r = 0, 0
            
        elif cat == "Mild Hearing Loss":
            base_l = np.random.uniform(26, 40)
            base_r = base_l + np.random.normal(0, 4)
            slope_l, slope_r = np.random.uniform(0, 5), np.random.uniform(0, 5)
            
        elif cat == "Moderate Hearing Loss":
            base_l = np.random.uniform(41, 55)
            base_r = base_l + np.random.normal(0, 5)
            slope_l, slope_r = np.random.uniform(2, 8), np.random.uniform(2, 8)
            
        elif cat == "Moderately Severe Hearing Loss":
            base_l = np.random.uniform(56, 70)
            base_r = base_l + np.random.normal(0, 5)
            slope_l, slope_r = np.random.uniform(2, 10), np.random.uniform(2, 10)
            
        elif cat == "Severe Hearing Loss":
            base_l = np.random.uniform(71, 90)
            base_r = base_l + np.random.normal(0, 5)
            slope_l, slope_r = np.random.uniform(0, 10), np.random.uniform(0, 10)
            
        elif cat == "Profound Hearing Loss":
            base_l = np.random.uniform(91, 115)
            base_r = np.random.uniform(91, 115)
            slope_l, slope_r = np.random.uniform(-5, 5), np.random.uniform(-5, 5)
            
        elif cat == "High Frequency Loss":
            base_l = np.random.uniform(10, 20) # normal low freq
            base_r = np.random.uniform(10, 20)
            slope_l, slope_r = np.random.uniform(30, 55), np.random.uniform(30, 55) # steep drop at 4k-8k
            
        elif cat == "Asymmetric Loss":
            base_l = np.random.uniform(10, 25) # one good ear
            base_r = np.random.uniform(50, 80) # one bad ear
            if np.random.rand() > 0.5:
                base_l, base_r = base_r, base_l # swap left and right randomly
            slope_l, slope_r = np.random.uniform(0, 10), np.random.uniform(0, 10)

        # Frequencies: 250, 500, 1000, 2000, 4000, 8000 Hz
        freq_factors = [0.0, 0.1, 0.2, 0.4, 0.7, 1.0] # frequency gradient
        
        l_thresholds = []
        r_thresholds = []
        
        for ff in freq_factors:
            val_l = base_l + (ff * slope_l) + np.random.normal(0, 2.5)
            val_r = base_r + (ff * slope_r) + np.random.normal(0, 2.5)
            
            # Clip between -10 dB (super high sensitivity) and 120 dB (profound)
            val_l = float(np.clip(val_l, -10, 120))
            val_r = float(np.clip(val_r, -10, 120))
            
            # Round to nearest 5 dB as standard audiometers do
            l_thresholds.append(round(val_l / 5.0) * 5)
            r_thresholds.append(round(val_r / 5.0) * 5)
            
        rec = {
            "patient_id": f"PAT-{1000+i}",
            "age": age,
            "gender": gender,
            "L_250": l_thresholds[0],
            "L_500": l_thresholds[1],
            "L_1000": l_thresholds[2],
            "L_2000": l_thresholds[3],
            "L_4000": l_thresholds[4],
            "L_8000": l_thresholds[5],
            "R_250": r_thresholds[0],
            "R_500": r_thresholds[1],
            "R_1000": r_thresholds[2],
            "R_2000": r_thresholds[3],
            "R_4000": r_thresholds[4],
            "R_8000": r_thresholds[5],
            "diagnosis": cat
        }
        records.append(rec)
        
    df = pd.DataFrame(records)
    output_path = os.path.join(os.path.dirname(__file__), "audiogram_dataset.csv")
    df.to_csv(output_path, index=False)
    print(f"✅ Generated dataset with {num_samples} samples saved to: {output_path}")

if __name__ == "__main__":
    generate_audiogram_dataset()
