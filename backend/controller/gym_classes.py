from sqlalchemy.ext.asyncio import AsyncSession
from model import Trainer, Gym_class
from fastapi import HTTPException
from schemas.gym_classes_schema import GymClasses
from sqlalchemy import select

async def GetGymClasses(db:AsyncSession):
    result = await db.execute(select(Gym_class))
    return result.scalars().all()



    