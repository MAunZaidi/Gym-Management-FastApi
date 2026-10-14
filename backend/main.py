import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text
from database import engine, Base
from routes import AdminRoute, MemberRoute, MembershipPlanRoute, TrainerRoute, AttendanceRoute, MembershipRoute,GymClassesRoute, PaymentRoute, ClassBooking


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

frontend_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:3000,https://adapt-gym-management.vercel.app",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["system"])
async def health_check():
    async with engine.connect() as connection:
        await connection.execute(text("select 1"))
    return {"status": "ok", "database": "connected"}

app.include_router(AdminRoute.router)
app.include_router(MemberRoute.router)
app.include_router(MembershipPlanRoute.router)
app.include_router(TrainerRoute.router)
app.include_router(AttendanceRoute.router)
app.include_router(MembershipRoute.router)
app.include_router(GymClassesRoute.router)
app.include_router(PaymentRoute.router)
app.include_router(ClassBooking.router)
