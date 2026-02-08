# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import users  # <-- ИМПОРТИРУЕМ наш роутер

# Создаём таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EduRewards API",
    description="Платформа для обучения с наградами",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ПОДКЛЮЧАЕМ роутер пользователей
app.include_router(users.router)

@app.get("/")
def home():
    return {"message": "🎉 Сервер работает! Теперь есть /users/register"}

@app.get("/test")
def test():
    return {"status": "ok", "message": "Попробуй зарегистрироваться!"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Запускаем сервер...")
    print("📡 Адрес: http://localhost:8000")
    print("📚 Документация: http://localhost:8000/docs")
    print("👤 Регистрация: POST http://localhost:8000/users/register")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
    