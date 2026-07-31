from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.database import Base, engine
from backend.models import user, patient, analysis, report
from backend.routes.analysis import router as analysis_router
from backend.routes.auth import router as auth_router
from backend.routes.patient import router as patient_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AudAI API",
    description="AI-assisted Pure Tone Audiometry Diagnosis & Disability Predictor",
    version="1.0.0"
)

# Enable CORS for Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(patient_router)
app.include_router(analysis_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "AudAI Backend API",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }