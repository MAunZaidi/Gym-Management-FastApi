from sqlalchemy.ext.asyncio import AsyncSession
from model import Trainer, Gym_class
from fastapi import HTTPException
from schemas.gym_classes_schema import GymClasses
from sqlalchemy import select


def error_msg(user):
    if user is None:
        raise(HTTPException(
        status_code=404,
        detail= "Gym class not Found"
    ))
        
async def GetGymClasses(db:AsyncSession):
    result = await db.execute(select(Gym_class))
    return result.scalars().all()

async def ValidateTrainer(db:AsyncSession, trainer_id:int):
    is_trainer = await db.execute(select(Trainer).where(Trainer.id == trainer_id))
    result =  is_trainer.scalar_one_or_none()
    if result is None:
        raise(HTTPException(
        status_code=404,
        detail= "Trainer not Found"
    ))
        
async def CreateGymClasses(db:AsyncSession, body:GymClasses):
    await ValidateTrainer(db, body.trainer_id)
   
        
    gym_class = Gym_class(**body.model_dump())
    
    db.add(gym_class)
    await db.commit()
    await db.refresh(gym_class)
    return gym_class
        

async def GetGymClassesById(db:AsyncSession, id:int):
    result = await db.execute(select(Gym_class).where(Gym_class.id == id))
    is_gym_class = result.scalar_one_or_none()
    error_msg(is_gym_class)
    return is_gym_class


async def UpdateGymClasses(db:AsyncSession, body:GymClasses, id:int):
    await ValidateTrainer(db, body.trainer_id)
    is_gym_class = await GetGymClassesById(db, id)
    updated_data = body.model_dump()
    
    for key, value in updated_data.items():
        setattr(is_gym_class, key, value)

    await db.commit()
    await db.refresh(is_gym_class)
    return is_gym_class 


async def DeleteGymClass(db:AsyncSession, id:int):
    is_gym_class = await GetGymClassesById(db, id)
    error_msg(is_gym_class)
    await db.delete(is_gym_class)
    await db.commit()
    return{
        "Message":"Trainer has been deleted Sucessfully"
    }