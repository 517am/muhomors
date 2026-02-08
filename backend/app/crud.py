# backend/app/crud.py
# CRUD = Create, Read, Update, Delete (Создать, Прочитать, Обновить, Удалить)

from sqlalchemy.orm import Session
from . import models, schemas, auth

# 1. Найти пользователя по email
def get_user_by_email(db: Session, email: str):
    """Ищем пользователя в базе по email"""
    # db.query = "ищи в базе"
    # filter = "где email равен переданному email"
    # .first() = "возьми первого найденного"
    return db.query(models.User).filter(models.User.email == email).first()

# 2. Найти пользователя по имени
def get_user_by_username(db: Session, username: str):
    """Ищем пользователя по имени"""
    return db.query(models.User).filter(models.User.username == username).first()

# 3. СОЗДАТЬ нового пользователя
def create_user(db: Session, user: schemas.UserCreate):
    """Создаём нового пользователя в базе"""
    
    # 1. Шифруем пароль (превращаем в секретный код)
    hashed_password = auth.hash_password(user.password)
    
    # 2. Создаём объект пользователя
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    
    # 3. Добавляем в базу
    db.add(db_user)      # Говорим базе: "запомни этого пользователя"
    db.commit()          # Сохраняем изменения
    db.refresh(db_user)  # Обновляем данные (получаем ID)
    
    # 4. Возвращаем созданного пользователя
    return db_user