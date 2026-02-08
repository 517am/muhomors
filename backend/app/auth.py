# backend/app/auth.py

import hashlib
import os
from dotenv import load_dotenv

load_dotenv()

# Берём настройки
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

def hash_password(password: str) -> str:
    """Простой хэш пароля (для обучения)"""
    salt = os.urandom(32)
    
    # Создаём хэш
    hashed = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000
    )
    
    return salt.hex() + hashed.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверяем пароль"""
    try:
        # Извлекаем соль
        salt = bytes.fromhex(hashed_password[:64])
        stored_hash = hashed_password[64:]
        
        # Считаем хэш
        new_hash = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt,
            100000
        ).hex()
        
        return new_hash == stored_hash
    except:
        return False