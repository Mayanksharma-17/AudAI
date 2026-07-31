import os
import sys
from typing import Dict, Any

# Ensure project root is in sys.path so we can import ai.predict directly
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

try:
    from ai.predict import AudiogramPredictor
    predictor = AudiogramPredictor()
    MODEL_ERROR = None
except Exception as e:
    predictor = None
    MODEL_ERROR = str(e)


def analyze_audiogram(patient_data: Dict[str, Any]) -> Dict[str, Any]:
    if predictor is None:
        raise RuntimeError(
            f"AI model could not be loaded: {MODEL_ERROR}"
        )

    required_columns = [
        "L_250", "L_500", "L_1000", "L_2000", "L_4000", "L_8000",
        "R_250", "R_500", "R_1000", "R_2000", "R_4000", "R_8000"
    ]

    missing_columns = [
        col for col in required_columns if col not in patient_data
    ]

    if missing_columns:
        raise ValueError(
            f"Missing audiogram frequency columns: {missing_columns}"
        )

    cleaned_data = {}
    for col in required_columns:
        try:
            cleaned_data[col] = float(patient_data[col])
        except (ValueError, TypeError):
            raise ValueError(
                f"Invalid numerical value for {col}: {patient_data[col]}"
            )

    return predictor.predict(cleaned_data)