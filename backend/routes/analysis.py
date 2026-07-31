import io
import pandas as pd

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.models.analysis import Analysis
from backend.services.predictor import analyze_audiogram


router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


REQUIRED_COLUMNS = [
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


@router.post("/predict")
async def predict_audiogram(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported."
        )

    contents = await file.read()

    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read CSV: {str(e)}"
        )

    missing_columns = [
        column
        for column in REQUIRED_COLUMNS
        if column not in df.columns
    ]

    if missing_columns:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "CSV is missing required audiogram columns.",
                "missing_columns": missing_columns
            }
        )

    if df.empty:
        raise HTTPException(
            status_code=400,
            detail="CSV contains no patient data."
        )

    patient_data = df.iloc[0].to_dict()

    try:
        result = analyze_audiogram(patient_data)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    diagnosis = result.get("diagnosis", "Unknown")
    confidence = float(result.get("confidence_score", 0))
    disability_percentage = float(
        result.get("disability_percentage", 0)
    )

    pta_left = float(result.get("pta_left", 0))
    pta_right = float(result.get("pta_right", 0))

    if max(pta_left, pta_right) <= 25:
        severity = "Normal"
    elif max(pta_left, pta_right) <= 40:
        severity = "Mild"
    elif max(pta_left, pta_right) <= 55:
        severity = "Moderate"
    elif max(pta_left, pta_right) <= 70:
        severity = "Moderately Severe"
    elif max(pta_left, pta_right) <= 90:
        severity = "Severe"
    else:
        severity = "Profound"

    recommendations = result.get("recommendations", [])

    recommendation_text = " ".join(
        str(item) for item in recommendations
    )

    if not recommendation_text:
        recommendation_text = "Clinical evaluation recommended."

    patient_id = str(
        patient_data.get(
            "PatientID",
            patient_data.get("patient_id", "UNKNOWN")
        )
    )

    try:
        numeric_patient_id = int(patient_id)
    except (ValueError, TypeError):
        numeric_patient_id = 0

    analysis = Analysis(
        patient_id=numeric_patient_id,
        user_id=1,
        hearing_loss_type=diagnosis,
        severity=severity,
        confidence=confidence,
        disability_percentage=disability_percentage,
        recommendation=recommendation_text
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return {
        "filename": file.filename,
        "patient_id": patient_id,
        "analysis_id": analysis.id,
        "result": result
    }


@router.get("/history")
def get_analysis_history(
    db: Session = Depends(get_db)
):
    analyses = (
        db.query(Analysis)
        .order_by(Analysis.created_at.desc())
        .all()
    )

    return {
        "status": "success",
        "count": len(analyses),
        "history": [
            {
                "analysis_id": analysis.id,
                "patient_id": analysis.patient_id,
                "diagnosis": analysis.hearing_loss_type,
                "severity": analysis.severity,
                "confidence": analysis.confidence,
                "disability_percentage": analysis.disability_percentage,
                "recommendation": analysis.recommendation,
                "created_at": analysis.created_at
            }
            for analysis in analyses
        ]
    }