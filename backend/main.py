from fastapi import FastAPI, Depends, Request
from contextlib import asynccontextmanager
from database import engine, Base, getdb
import model
import schemas, controller, utils.helper as helper
from sqlalchemy.ext.asyncio import AsyncSession

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

@app.post("/signup", response_model=schemas.AdminResponse)
async def createAdmin(
    User:schemas.AdminCreate,
    db:AsyncSession = Depends(getdb)
):
    return await controller.AdminBorn(db,User)


@app.post("/login", response_model=schemas.LoginResponse)
async def LoginAdmin(
    LoginBody:schemas.LoginCreate,
    db:AsyncSession = Depends(getdb)
):
    return await controller.LoginLogic(db, LoginBody)


@app.get("/is_auth", response_model=schemas.AdminResponse)
async def is_auth(
    request: Request,
    db:AsyncSession = Depends(getdb)
):
    return await helper.is_auth(request, db)
