import os
import importlib.util
from typing import Dict, Any

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)

PREDICT_PATH = os.path.join(PROJECT_ROOT, "AI", "predict.py")

spec = importlib.util.spec_from_file_location(
    "audai_predict",
    PREDICT_PATH
)

if spec is None or spec.loader is None:
    raise RuntimeError(
        f"Could not load AI predictor from {PREDICT_PATH}"
    )

ai_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ai_module)

AudiogramPredictor = ai_module.AudiogramPredictor

try:
    predictor = AudiogramPredictor()
except Exception as e:
    predictor = None
    MODEL_ERROR = str(e)


def analyze_audiogram(
    patient_data: Dict[str, Any]
) -> Dict[str, Any]:

    if predictor is None:
        raise RuntimeError(
            f"AI model could not be loaded: {MODEL_ERROR}"
        )

    required_columns = [
        "L_250",
        "L_500",
        "L_1000",
        "L_2000",
        "L_4000",
        "L_8000",
        "R_250",
        "R_500",
        "R_1000",
        "R_2000",
        "R_4000",
        "R_8000"
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in patient_data
    ]

    if missing_columns:
        raise ValueError(
            f"Missing audiogram columns: {missing_columns}"
        )

    cleaned_data = {}

    for column in required_columns:
        try:
            cleaned_data[column] = float(
                patient_data[column]
            )
        except (ValueError, TypeError):
            raise ValueError(
                f"Invalid value for {column}: {patient_data[column]}"
            )

    return predictor.predict(cleaned_data)