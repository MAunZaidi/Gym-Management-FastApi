from sqlalchemy.ext.asyncio import AsyncSession
import jwt
from model import Admin
from fastapi import HTTPException, Request
from sqlalchemy import select
import os
from dotenv import  load_dotenv
load_dotenv()
from datetime import datetime

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM  = "HS256"

async def is_auth(request: Request, db:AsyncSession):
    token = request.headers.get("authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    get_token_clean = token.split(" ")[-1]
    try:
        data = jwt.decode(get_token_clean, SECRET_KEY, algorithms=[ALGORITHM])
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