# backend/app/routers/users.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas, database

# Создаём роутер (группу маршрутов)
router = APIRouter(prefix="/users", tags=["users"])
# prefix="/users" = все пути будут начинаться с /users
# tags=["users"] = в документации будут в группе "users"

# МАРШРУТ 1: Регистрация нового пользователя
@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    """
    Регистрация нового пользователя
    
    - **username**: уникальное имя пользователя
    - **email**: почта (должна быть уникальной)
    - **password**: пароль
    - **full_name**: полное имя (не обязательно)
    """
    
    # 1. Проверяем, нет ли уже пользователя с таким email
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        # Если нашли - выдаём ошибку
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email уже зарегистрирован"
        )
    
    # 2. Проверяем, нет ли уже пользователя с таким именем
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTP_400_BAD_REQUEST,
            detail="Имя пользователя уже занято"
        )
    
    # 3. Если всё хорошо - создаём пользователя
    return crud.create_user(db=db, user=user)

# МАРШРУТ 2: Получить список всех пользователей (для теста)
@router.get("/", response_model=List[schemas.UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    """Получить список пользователей"""
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users