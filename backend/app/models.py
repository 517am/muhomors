# backend/app/models.py

from sqlalchemy import Column, Integer, String
from datetime import datetime
from .database import Base

# Таблица пользователей
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    created_at = Column(String(50), default=str(datetime.utcnow()))