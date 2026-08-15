from sqlalchemy.ext.asyncio import AsyncSession
import jwt
from schemas.admin_schema import AdminCreate,LoginCreate
from model import Admin
from fastapi import HTTPException
from sqlalchemy import select
from pwdlib import PasswordHash
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import os
from dotenv import  load_dotenv
load_dotenv()
from datetime import datetime, timedelta, timezone

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM  = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


password_hashing_object = PasswordHash.recommended()

def get_password_hashed(password):
     return password_hashing_object.hash(password)
 
def verifypassword(plainpassword:str, hashed_password:str)->bool:
    return password_hashing_object.verify(plainpassword, hashed_password)

async def AdminBorn(db:AsyncSession, user:AdminCreate):
    if not user.name or not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Values are not inserted!")
    
    result = await db.execute(select(Admin).where(Admin.email==user.email))
    is_user = result.scalar_one_or_none()
    if is_user:
        raise HTTPException(status_code=400, detail="Email already exists..try different email")
    
    hashed_password = get_password_hashed(user.password)
    
    adminUser = Admin(
        name = user.name,
        email = user.email,
        password = hashed_password
    )
    db.add(adminUser)
    await db.commit()
    await db.refresh(adminUser)
    return adminUser
        
async def LoginLogic(db:AsyncSession, admin_body:LoginCreate):
    user_result = await db.execute(select(Admin).where(Admin.email==admin_body.email))
    is_user = user_result.scalar_one_or_none()
    if not is_user:
        raise HTTPException(status_code=401, detail="User not exists")
    if not verifypassword(admin_body.password, is_user.password):     
        raise HTTPException(status_code=401, detail="Wrong Password")
    
    #---CODE TO GENERATE TOKEN-----
    expired_delta = None
    if expired_delta:
        exp = datetime.now(timezone.utc) + expired_delta
    else:
        exp = datetime.now(timezone.utc) + timedelta(minutes=10)
    Token = jwt.encode({"_id":is_user.id, "exp":exp}, SECRET_KEY, algorithm=ALGORITHM)
    
    return{
        "access_token":Token,
        "token_type":"bearer",
        "user":is_user
    }
    