from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import getdb
from model import Admin
from schemas import admin_schema
from controller import admin
import utils.helper as helper

router = APIRouter(tags=["Admin"])


@router.post("/signup", response_model=admin_schema.AdminResponse)
async def createAdmin(User: admin_schema.AdminCreate, db: AsyncSession = Depends(getdb)):
    return await admin.AdminBorn(db, User)


@router.post("/login", response_model=admin_schema.LoginResponse)
async def LoginAdmin(LoginBody: admin_schema.LoginCreate, db: AsyncSession = Depends(getdb)):
    return await admin.LoginLogic(db, LoginBody)


@router.get("/is_auth", response_model=admin_schema.AdminResponse)
async def is_auth(user: Admin = Depends(helper.is_auth)):
    return user
