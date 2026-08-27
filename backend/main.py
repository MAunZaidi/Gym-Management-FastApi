from fastapi import FastAPI
from contextlib import asynccontextmanager
from database import engine, Base
from routes import AdminRoute, MemberRoute, MembershipPlanRoute, TrainerRoute, AttendanceRoute, MembershipRoute


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

app.include_router(AdminRoute.router)
app.include_router(MemberRoute.router)
app.include_router(MembershipPlanRoute.router)
app.include_router(TrainerRoute.router)
app.include_router(AttendanceRoute.router)
app.include_router(MembershipRoute.router)
