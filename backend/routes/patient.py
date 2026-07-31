from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import json

from backend.database.database import get_db
from backend.models.patient import Patient
from backend.models.analysis import Analysis

router = APIRouter(
    prefix="/patients",
    tags=["Patient Management"]
)

class PatientCreateRequest(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str
    phone: Optional[str] = None
    medical_history: Optional[str] = None

@router.post("/", status_code=201)
def create_patient(req: PatientCreateRequest, db: Session = Depends(get_db)):
    existing = db.query(Patient).filter(Patient.patient_id == req.patient_id).first()
    if existing:
        return {
            "status": "exists",
            "message": "Patient already registered.",
            "patient": {
                "id": existing.id,
                "patient_id": existing.patient_id,
                "name": existing.name,
                "age": existing.age,
                "gender": existing.gender
            }
        }

    patient = Patient(
        patient_id=req.patient_id,
        name=req.name,
        age=req.age,
        gender=req.gender
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)

    return {
        "status": "success",
        "message": "Patient created successfully.",
        "patient": {
            "id": patient.id,
            "patient_id": patient.patient_id,
            "name": patient.name,
            "age": patient.age,
            "gender": patient.gender
        }
    }

@router.get("/")
def get_all_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).all()
    patient_list = []
    
    for p in patients:
        analysis_count = db.query(Analysis).filter(Analysis.patient_id == p.id).count()
        patient_list.append({
            "id": p.id,
            "patient_id": p.patient_id,
            "name": p.name,
            "age": p.age,
            "gender": p.gender,
            "total_analyses": analysis_count
        })

    return {
        "status": "success",
        "count": len(patient_list),
        "patients": patient_list
    }

@router.get("/{patient_id}")
def get_patient_profile(patient_id: str, db: Session = Depends(get_db)):
    # Match either internal DB integer ID or string PAT-xxx ID
    patient = db.query(Patient).filter(
        (Patient.patient_id == patient_id) | (Patient.id == (int(patient_id) if patient_id.isdigit() else -1))
    ).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    analyses = db.query(Analysis).filter(Analysis.patient_id == patient.id).order_by(Analysis.created_at.desc()).all()

    history = []
    for item in analyses:
        parsed_data = None
        if item.audiogram_data:
            try:
                parsed_data = json.loads(item.audiogram_data)
            except Exception:
                pass
                
        history.append({
            "analysis_id": item.id,
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
        "patient": {
            "id": patient.id,
            "patient_id": patient.patient_id,
            "name": patient.name,
            "age": patient.age,
            "gender": patient.gender
        },
        "history_count": len(history),
        "history": history
    }
