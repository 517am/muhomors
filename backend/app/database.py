# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

# Загружаем настройки из .env
load_dotenv()

# Берём адрес базы из настроек
DATABASE_URL = os.getenv("DATABASE_URL")

# Создаём "двигатель" для работы с базой
engine = create_engine(DATABASE_URL)

# Создаём "сессии" - это как телефонная линия к базе
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для всех таблиц
Base = declarative_base()

# Функция для получения доступа к базе
def get_db():
    db = SessionLocal()
    try:
        yield db  # Открываем доступ
    finally:
        db.close()  # Закрываем доступ