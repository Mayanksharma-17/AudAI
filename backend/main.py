from fastapi import FastAPI
from backend.database.database import Base, engine
from backend.models import user, patient, analysis, report
from backend.routes.analysis import router as analysis_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AudAI API",
    description="AI-assisted Pure Tone Audiometry Analysis",
    version="1.0.0"
)

app.include_router(analysis_router)

@app.get("/")
def root():
    return {
        "message": "AudAI Backend is running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }