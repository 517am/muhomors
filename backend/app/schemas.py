# backend/app/schemas.py

from pydantic import BaseModel, EmailStr
from typing import Optional

# Это как анкета для регистрации
class UserCreate(BaseModel):
    username: str        # Имя пользователя
    email: EmailStr      # Почта (EmailStr проверяет, что это настоящая почта)
    password: str        # Пароль
    full_name: Optional[str] = None  # Полное имя (не обязательно)

# Это как визитка пользователя
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    
    class Config:
        from_attributes = True  # Позволяет превращать SQLAlchemy модели в Pydantic