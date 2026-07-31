from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from backend.database.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    analysis_id = Column(Integer, nullable=False)

    file_path = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
