import os
from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import tickets

app = FastAPI(
    title="Support CRM API",
    description="Customer support ticket management API",
    version="1.0.0",
)

allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "")
origins = [origin.strip() for origin in allowed_origins_raw.split(",") if origin.strip()]
for default_origin in ["http://localhost:5173", "http://127.0.0.1:5173"]:
    if default_origin not in origins:
        origins.append(default_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(tickets.router)


@app.get("/")
def root():
    return {"message": "Support CRM API is running"}


@app.get("/health")
def health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {"status": "healthy", "database": "connected"}