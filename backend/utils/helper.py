from sqlalchemy.ext.asyncio import AsyncSession
import jwt
from model import Admin
from fastapi import HTTPException, Depends
from sqlalchemy import select
import os
from dotenv import  load_dotenv
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime
from database import getdb

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM  = "HS256"


oauth2_scheme  = OAuth2PasswordBearer(tokenUrl="login")
async def is_auth(token:str = Depends(oauth2_scheme) ,db:AsyncSession = Depends(getdb)):
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = data.get('_id')
    user_exp = data.get('exp')
    
    current_time = datetime.now().timestamp()
    if current_time > user_exp:
        raise HTTPException(status_code=401, detail="Session Expired ... Retry Login")
    
    is_user = await db.execute(select(Admin).where(Admin.id == user_id))
    is_user = is_user.scalar_one_or_none()
    if not is_user:
         raise HTTPException(status_code=401, detail="You are not authorized!")

    return is_user