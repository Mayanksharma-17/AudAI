from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
import hashlib

from backend.database.database import get_db
from backend.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    hospital: Optional[str] = "General Hospital"
    department: Optional[str] = "Audiology & ENT"
    phone: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == req.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists."
        )

    new_user = User(
        name=req.name,
        email=req.email,
        password_hash=hash_password(req.password),
        hospital=req.hospital,
        department=req.department,
        phone=req.phone
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "status": "success",
        "message": "User registered successfully.",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "hospital": new_user.hospital,
            "department": new_user.department
        },
        "token": f"token-audai-{new_user.id}"
    }

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    pwd_hash = hash_password(req.password)
    user = db.query(User).filter(
        User.email == req.email,
        User.password_hash == pwd_hash
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    return {
        "status": "success",
        "message": "Login successful.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "hospital": user.hospital,
            "department": user.department
        },
        "token": f"token-audai-{user.id}"
    }
