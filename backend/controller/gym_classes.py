from sqlalchemy.ext.asyncio import AsyncSession
from model import Trainer, Gym_class
from fastapi import HTTPException
from schemas.gym_classes_schema import GymClasses
from sqlalchemy import select

async def GetGymClasses(db:AsyncSession):
    result = await db.execute(select(Gym_class))
    return result.scalars().all()


async def CreateGymClasses(db:AsyncSession, body:GymClasses):
    is_trainer = await db.execute(select(Trainer).where(Trainer.id == body.trainer_id))
    result =  is_trainer.scalar_one_or_none()
    if result is None:
        raise(HTTPException(
            status_code=404,
            detail= "Trainer not Found"
         ))
        
    gym_class = Gym_class(**body.model_dump())
    
    db.add(gym_class)
    await db.commit()
    await db.refresh(gym_class)
    return gym_class
        