from sqlalchemy import Column, Integer, String
from backend.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    hospital = Column(String, nullable=True)

    email = Column(String, unique=True, index=True, nullable=False)

    password_hash = Column(String, nullable=False)

    phone = Column(String, nullable=True)

    department = Column(String, nullable=True)
