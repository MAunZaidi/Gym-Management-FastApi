from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from database import engine, Base, getdb
from model import Admin
from schemas import admin_schema, member_schema
import utils.helper as helper
from controller import admin, member
from sqlalchemy.ext.asyncio import AsyncSession

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

@app.post("/signup", response_model=admin_schema.AdminResponse)
async def createAdmin(User:admin_schema.AdminCreate,db:AsyncSession = Depends(getdb)):
    return await admin.AdminBorn(db,User)

@app.post("/login", response_model=admin_schema.LoginResponse)
async def LoginAdmin(LoginBody:admin_schema.LoginCreate, db:AsyncSession = Depends(getdb)):
    return await admin.LoginLogic(db, LoginBody)

@app.get("/is_auth", response_model=admin_schema.AdminResponse)
async def is_auth(user: Admin = Depends(helper.is_auth)):
    return user

@app.post("/members", response_model=member_schema.MemberResponse)
async def CreateMember(MemberBody: member_schema.MemberData, db:AsyncSession = Depends(getdb), user:Admin = Depends(helper.is_auth)):
    return await member.RegisterMember(db,MemberBody)

@app.get("/members", response_model=list[member_schema.MemberResponse])
async def GetMembers(db:AsyncSession = Depends(getdb)):
    return await member.GetMember(db)

@app.get("/members/{memberid}", response_model=member_schema.MemberResponse)
async def GetMembers(memberid:int, db:AsyncSession = Depends(getdb)):
    return await member.GetMemberByid(db, memberid)

@app.put("/members/{memberid}", response_model=member_schema.MemberResponse)
async def UpdateMember(memberid:int, MemberBody:member_schema.MemberData, db:AsyncSession = Depends(getdb), user:Admin = Depends(helper.is_auth)):
    return await member.UpdateMember(db, memberid, MemberBody)

@app.delete("/members/{memberid}")
async def DeleteMember(memberid:int, db:AsyncSession = Depends(getdb), user:Admin = Depends(helper.is_auth)):
    return await member.DeleteMember(db, memberid)