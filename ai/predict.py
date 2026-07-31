"""
AudAI - Prediction & Inference Engine
Handles audiogram input, feature extraction, AI classification, 
disability percentage calculation (WHO/Government standards), 
and clinical recommendation generation.
"""

import pandas as pd
import numpy as np
import joblib
import os
from typing import Union, Dict, Any, List

class AudiogramPredictor:
    def __init__(self, model_path: str = None):
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
            
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model file not found at {model_path}. Please run train.py first."
            )
            
        saved_artifact = joblib.load(model_path)
        self.model = saved_artifact["model"]
        self.metadata = saved_artifact["metadata"]
        self.freq_cols = [
            'L_250', 'L_500', 'L_1000', 'L_2000', 'L_4000', 'L_8000',
            'R_250', 'R_500', 'R_1000', 'R_2000', 'R_4000', 'R_8000'
        ]

    def _extract_features_single(self, input_dict: Dict[str, float]) -> pd.DataFrame:
        """
        Extract features from a single patient's audiogram dictionary.
        """
        df = pd.DataFrame([input_dict])
        
        # Ensure all required frequency keys exist
        for col in self.freq_cols:
            if col not in df.columns:
                raise ValueError(f"Missing required audiogram frequency column: '{col}'")
            df[col] = df[col].astype(float)
            
        X = pd.DataFrame()
        for col in self.freq_cols:
            X[col] = df[col]
            
        # Speech Pure Tone Average (500Hz, 1000Hz, 2000Hz, 4000Hz)
        X['pta_left'] = df[['L_500', 'L_1000', 'L_2000', 'L_4000']].mean(axis=1)
        X['pta_right'] = df[['R_500', 'R_1000', 'R_2000', 'R_4000']].mean(axis=1)
        
        # High & Low frequency averages
        X['high_freq_left'] = df[['L_4000', 'L_8000']].mean(axis=1)
        X['high_freq_right'] = df[['R_4000', 'R_8000']].mean(axis=1)
        X['low_freq_left'] = df[['L_250', 'L_500']].mean(axis=1)
        X['low_freq_right'] = df[['R_250', 'R_500']].mean(axis=1)
        
        # Asymmetry and Slopes
        X['asymmetry_pta'] = (X['pta_left'] - X['pta_right']).abs()
        X['asymmetry_high'] = (X['high_freq_left'] - X['high_freq_right']).abs()
        X['slope_left'] = df['L_8000'] - df['L_250']
        X['slope_right'] = df['R_8000'] - df['R_250']
        X['max_pta'] = X[['pta_left', 'pta_right']].max(axis=1)
        X['min_pta'] = X[['pta_left', 'pta_right']].min(axis=1)
        
        return X

    def calculate_disability_percentage(self, pta_left: float, pta_right: float) -> Dict[str, float]:
        """
        Calculates Hearing Disability Percentage based on Ministry of Social Justice & Empowerment / WHO Guidelines.
        Monoaural Impairment % = max(0, min(100, (PTA - 25) * 1.5))
        Bilateral Impairment % = (4 * Better_Ear_Disability + 1 * Worse_Ear_Disability) / 5
        """
        mono_l = max(0.0, min(100.0, (pta_left - 25.0) * 1.5))
        mono_r = max(0.0, min(100.0, (pta_right - 25.0) * 1.5))
        
        better_ear = min(mono_l, mono_r)
        worse_ear = max(mono_l, mono_r)
        
        bilateral_disability = (4.0 * better_ear + 1.0 * worse_ear) / 5.0
        
        return {
            "disability_percentage": round(bilateral_disability, 2),
            "left_ear_disability": round(mono_l, 2),
            "right_ear_disability": round(mono_r, 2)
        }

    def get_recommendation(self, diagnosis: str, pta_left: float, pta_right: float) -> List[str]:
        """
        Returns clinical actionable recommendations based on predicted diagnosis and severity.
        """
        max_pta = max(pta_left, pta_right)
        asym = abs(pta_left - pta_right)
        recs = []
        
        if diagnosis == "Normal" or max_pta <= 25:
            recs.append("Hearing thresholds are within normal limits (≤ 25 dB HL).")
            recs.append("Recommend routine annual audiometric monitoring.")
            recs.append("Advise standard hearing conservation practices (e.g., ear protection in >85 dB environments).")
            
        elif diagnosis == "Mild Hearing Loss" or (25 < max_pta <= 40):
            recs.append("Mild hearing loss detected in speech frequencies.")
            recs.append("Consider trial of low-gain digital hearing aids or personal sound amplification products (PSAPs).")
            recs.append("Follow-up audiometry recommended in 6 months.")
            
        elif diagnosis == "Moderate Hearing Loss" or (40 < max_pta <= 55):
            recs.append("Moderate hearing loss detected. Digital hearing aid evaluation and fitting strongly advised.")
            recs.append("Speech-in-noise testing recommended to evaluate functional listening performance.")
            recs.append("Consultation with an Audiologist/ENT specialist.")
            
        elif diagnosis == "Moderately Severe Hearing Loss" or (55 < max_pta <= 70):
            recs.append("Moderately severe hearing loss detected.")
            recs.append("Prescription high-power digital hearing aids or middle ear implants indicated.")
            recs.append("Comprehensive Speech Discrimination and Tympanometry assessment recommended.")
            
        elif diagnosis == "Severe Hearing Loss" or (70 < max_pta <= 90):
            recs.append("Severe hearing loss identified across key audiometric frequencies.")
            recs.append("Immediate ENT consultation for medical workup.")
            recs.append("Evaluation for high-power digital hearing aids or Cochlear Implant (CI) candidacy.")
            
        elif diagnosis == "Profound Hearing Loss" or max_pta > 90:
            recs.append("Profound hearing loss detected (PTA > 90 dB HL).")
            recs.append("Urgent Cochlear Implant (CI) multidisciplinary evaluation recommended.")
            recs.append("Auditory rehabilitation and assistive tactile/visual communication technology advised.")
            
        elif diagnosis == "High Frequency Loss":
            recs.append("High-frequency audiometric drop observed (sloping sensory loss pattern).")
            recs.append("Open-fit hearing aid with frequency lowering technology recommended.")
            recs.append("Evaluate occupational/recreational noise exposure history.")
            
        elif diagnosis == "Asymmetric Loss" or asym >= 15:
            recs.append(f"Significant inter-aural asymmetry detected ({round(asym, 1)} dB difference).")
            recs.append("ENT consult recommended for retrocochlear pathology evaluation (MRI / ABR testing).")
            recs.append("Unilateral hearing aid or CROS/BiCROS system fitting evaluation.")
            
        else:
            recs.append("Comprehensive otological and audiological evaluation recommended.")
            recs.append("Repeat pure tone audiometry with bone conduction threshold verification.")

        if asym >= 15 and diagnosis != "Asymmetric Loss":
            recs.append(f"Note: Inter-aural asymmetry of {round(asym, 1)} dB observed. ENT consultation advised.")
            
        return recs

    def predict(self, input_data: Union[Dict[str, float], str, pd.DataFrame]) -> Dict[str, Any]:
        """
        Runs full inference pipeline:
        Takes dict, CSV path, or DataFrame and returns structured analysis result.
        """
        if isinstance(input_data, str): # file path
            df_raw = pd.read_csv(input_data)
            row_dict = df_raw.iloc[0].to_dict()
        elif isinstance(input_data, pd.DataFrame):
            row_dict = input_data.iloc[0].to_dict()
        else:
            row_dict = input_data
            
        X_feat = self._extract_features_single(row_dict)
        
        # ML Model Prediction
        prediction = self.model.predict(X_feat)[0]
        probs = self.model.predict_proba(X_feat)[0]
        confidence_score = round(float(np.max(probs)) * 100, 2)
        
        pta_l = round(float(X_feat['pta_left'].iloc[0]), 2)
        pta_r = round(float(X_feat['pta_right'].iloc[0]), 2)
        
        # Disability Calculation
        disability_info = self.calculate_disability_percentage(pta_l, pta_r)
        
        # Recommendations
        recommendations = self.get_recommendation(prediction, pta_l, pta_r)
        
        # Pre-formatted chart points for Recharts frontend visualization
        chart_data = [
            {"frequency": 250, "left_ear": row_dict['L_250'], "right_ear": row_dict['R_250']},
            {"frequency": 500, "left_ear": row_dict['L_500'], "right_ear": row_dict['R_500']},
            {"frequency": 1000, "left_ear": row_dict['L_1000'], "right_ear": row_dict['R_1000']},
            {"frequency": 2000, "left_ear": row_dict['L_2000'], "right_ear": row_dict['R_2000']},
            {"frequency": 4000, "left_ear": row_dict['L_4000'], "right_ear": row_dict['R_4000']},
            {"frequency": 8000, "left_ear": row_dict['L_8000'], "right_ear": row_dict['R_8000']},
        ]
        
        return {
            "status": "success",
            "diagnosis": str(prediction),
            "confidence_score": confidence_score,
            "pta_left": pta_l,
            "pta_right": pta_r,
            "disability_percentage": disability_info["disability_percentage"],
            "left_ear_disability": disability_info["left_ear_disability"],
            "right_ear_disability": disability_info["right_ear_disability"],
            "recommendations": recommendations,
            "audiogram_frequencies": chart_data,
            "raw_input": {k: row_dict[k] for k in self.freq_cols if k in row_dict}
        }

if __name__ == "__main__":
    print("Testing AudiogramPredictor Engine...")
    predictor = AudiogramPredictor()
    
    # Sample Test Case: Moderate hearing loss
    sample_audiogram = {
        "L_250": 35, "L_500": 45, "L_1000": 50, "L_2000": 55, "L_4000": 60, "L_8000": 65,
        "R_250": 30, "R_500": 40, "R_1000": 45, "R_2000": 50, "R_4000": 55, "R_8000": 60
    }
    
    res = predictor.predict(sample_audiogram)
    print("\nPrediction Result:")
    import json
    print(json.dumps(res, indent=2))
