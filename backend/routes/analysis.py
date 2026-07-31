import io
import json
import pandas as pd
from typing import Dict, Any, Optional
from pydantic import BaseModel

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.models.patient import Patient
from backend.models.analysis import Analysis
from backend.services.predictor import analyze_audiogram
from backend.services.pdf_service import generate_pdf_report

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)

REQUIRED_COLUMNS = [
    "L_250", "L_500", "L_1000", "L_2000", "L_4000", "L_8000",
    "R_250", "R_500", "R_1000", "R_2000", "R_4000", "R_8000"
]

class ManualAudiogramInput(BaseModel):
    patient_id: Optional[str] = "PAT-1001"
    patient_name: Optional[str] = "John Doe"
    age: Optional[int] = 45
    gender: Optional[str] = "Male"
    user_id: Optional[int] = 1
    L_250: float
    L_500: float
    L_1000: float
    L_2000: float
    L_4000: float
    L_8000: float
    R_250: float
    R_500: float
    R_1000: float
    R_2000: float
    R_4000: float
    R_8000: float


def _get_or_create_patient(db: Session, patient_str_id: str, name: str = "Anonymous", age: int = 45, gender: str = "Unknown") -> Patient:
    patient = db.query(Patient).filter(Patient.patient_id == patient_str_id).first()
    if not patient:
        patient = Patient(
            patient_id=patient_str_id,
            name=name,
            age=age,
            gender=gender
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)
    return patient


def _process_and_save_analysis(patient_data: dict, db: Session, filename: str = "manual_entry"):
    # Extract Patient Metadata
    patient_str_id = str(patient_data.get("patient_id", patient_data.get("PatientID", "PAT-1001")))
    patient_name = str(patient_data.get("patient_name", patient_data.get("name", "John Doe")))
    try:
        age = int(patient_data.get("age", 45))
    except Exception:
        age = 45
    gender = str(patient_data.get("gender", "Male"))
    user_id = int(patient_data.get("user_id", 1))

    # Auto-register patient if not present
    patient_record = _get_or_create_patient(db, patient_str_id, patient_name, age, gender)

    # Run AI Prediction Engine
    result = analyze_audiogram(patient_data)

    diagnosis = result.get("diagnosis", "Unknown")
    confidence = float(result.get("confidence_score", 0))
    disability_percentage = float(result.get("disability_percentage", 0))
    pta_left = float(result.get("pta_left", 0))
    pta_right = float(result.get("pta_right", 0))

    max_pta = max(pta_left, pta_right)
    if max_pta <= 25:
        severity = "Normal"
    elif max_pta <= 40:
        severity = "Mild"
    elif max_pta <= 55:
        severity = "Moderate"
    elif max_pta <= 70:
        severity = "Moderately Severe"
    elif max_pta <= 90:
        severity = "Severe"
    else:
        severity = "Profound"

    recommendations = result.get("recommendations", [])
    recommendation_text = " ".join(str(item) for item in recommendations)
    if not recommendation_text:
        recommendation_text = "Clinical evaluation recommended."

    # Save complete record linking to actual Patient DB ID
    analysis_record = Analysis(
        patient_id=patient_record.id,
        user_id=user_id,
        hearing_loss_type=diagnosis,
        severity=severity,
        confidence=confidence,
        disability_percentage=disability_percentage,
        recommendation=recommendation_text,
        audiogram_data=json.dumps(result)
    )

    db.add(analysis_record)
    db.commit()
    db.refresh(analysis_record)

    return {
        "status": "success",
        "filename": filename,
        "patient": {
            "id": patient_record.id,
            "patient_id": patient_record.patient_id,
            "name": patient_record.name,
            "age": patient_record.age,
            "gender": patient_record.gender
        },
        "analysis_id": analysis_record.id,
        "result": result
    }


@router.post("/predict")
async def predict_audiogram_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read CSV: {str(e)}")

    missing_columns = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_columns:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "CSV is missing required audiogram frequency columns.",
                "missing_columns": missing_columns
            }
        )

    if df.empty:
        raise HTTPException(status_code=400, detail="CSV contains no patient data.")

    patient_data = df.iloc[0].to_dict()
    try:
        return _process_and_save_analysis(patient_data, db, file.filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")


@router.post("/predict-json")
def predict_audiogram_json(
    input_data: ManualAudiogramInput,
    db: Session = Depends(get_db)
):
    patient_dict = input_data.dict()
    try:
        return _process_and_save_analysis(patient_dict, db, "Manual Form Input")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")


@router.get("/history")
def get_analysis_history(db: Session = Depends(get_db)):
    analyses = db.query(Analysis).order_by(Analysis.created_at.desc()).all()
    
    history_list = []
    for item in analyses:
        patient = db.query(Patient).filter(Patient.id == item.patient_id).first()
        patient_str_id = patient.patient_id if patient else f"PAT-{item.patient_id}"
        patient_name = patient.name if patient else "Patient"

        parsed_data = None
        if item.audiogram_data:
            try:
                parsed_data = json.loads(item.audiogram_data)
            except Exception:
                pass
                
        history_list.append({
            "analysis_id": item.id,
            "patient_db_id": item.patient_id,
            "patient_id": patient_str_id,
            "patient_name": patient_name,
            "diagnosis": item.hearing_loss_type,
            "severity": item.severity,
            "confidence": item.confidence,
            "disability_percentage": item.disability_percentage,
            "recommendation": item.recommendation,
            "audiogram_frequencies": parsed_data.get("audiogram_frequencies", []) if parsed_data else [],
            "created_at": item.created_at.strftime("%Y-%m-%d %H:%M:%S") if item.created_at else ""
        })

    return {
        "status": "success",
        "count": len(history_list),
        "history": history_list
    }


@router.get("/{analysis_id}")
def get_individual_analysis(analysis_id: int, db: Session = Depends(get_db)):
    item = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    patient = db.query(Patient).filter(Patient.id == item.patient_id).first()

    parsed_data = None
    if item.audiogram_data:
        try:
            parsed_data = json.loads(item.audiogram_data)
        except Exception:
            pass

    return {
        "status": "success",
        "analysis_id": item.id,
        "patient": {
            "id": patient.id if patient else item.patient_id,
            "patient_id": patient.patient_id if patient else f"PAT-{item.patient_id}",
            "name": patient.name if patient else "Unknown",
            "age": patient.age if patient else 45,
            "gender": patient.gender if patient else "Male"
        },
        "diagnosis": item.hearing_loss_type,
        "severity": item.severity,
        "confidence": item.confidence,
        "disability_percentage": item.disability_percentage,
        "recommendation": item.recommendation,
        "details": parsed_data,
        "created_at": item.created_at.strftime("%Y-%m-%d %H:%M:%S") if item.created_at else ""
    }


@router.get("/report/{analysis_id}/pdf")
def download_pdf_report(analysis_id: int, db: Session = Depends(get_db)):
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    patient = db.query(Patient).filter(Patient.id == record.patient_id).first()

    analysis_dict = {
        "analysis_id": record.id,
        "patient_id": patient.patient_id if patient else f"PAT-{record.patient_id}",
        "diagnosis": record.hearing_loss_type,
        "severity": record.severity,
        "confidence": record.confidence,
        "disability_percentage": record.disability_percentage,
        "recommendation": record.recommendation
    }

    patient_info = {
        "age": patient.age if patient else 45,
        "gender": patient.gender if patient else "Male",
        "doctor_name": "Dr. Mayank Sharma (ENT & Audiology)"
    }

    if record.audiogram_data:
        try:
            extra = json.loads(record.audiogram_data)
            analysis_dict["raw_input"] = extra.get("raw_input", {})
            analysis_dict["audiogram_frequencies"] = extra.get("audiogram_frequencies", [])
            analysis_dict["recommendations"] = extra.get("recommendations", [record.recommendation])
        except Exception:
            pass

    pdf_bytes = generate_pdf_report(analysis_dict, patient_info)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=AudAI_Report_{analysis_dict['patient_id']}.pdf"
        }
    )


@router.delete("/{analysis_id}")
def delete_analysis_record(analysis_id: int, db: Session = Depends(get_db)):
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    
    db.delete(record)
    db.commit()
    return {"status": "success", "message": f"Record {analysis_id} deleted successfully."}