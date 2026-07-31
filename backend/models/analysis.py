from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from backend.database.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(Integer, nullable=False)

    user_id = Column(Integer, nullable=False)

    hearing_loss_type = Column(String, nullable=False)

    severity = Column(String, nullable=False)

    confidence = Column(Float, nullable=False)

    disability_percentage = Column(Float, nullable=False)

    recommendation = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
