from sqlalchemy.ext.asyncio import AsyncSession
from model import Trainer
from fastapi import HTTPException
from schemas.trainer_schema import TrainerData
from sqlalchemy import select

def error_msg(user):
    if user is None:
        raise(HTTPException(
            status_code=404,
            detail= "Trainer not Found"
        ))

async def GetTrainer(db:AsyncSession):
    result = await db.execute(select(Trainer))
    return result.scalars().all()


async def RegisterTrainer(db: AsyncSession, trainer: TrainerData):
    result = await db.execute(select(Trainer).where(Trainer.email==trainer.email))
    is_email = result.scalar_one_or_none()
    if is_email:
        raise HTTPException(status_code=400, detail="This Email is Taken")

    add_trainer = Trainer(
        name = trainer.name,
        email = trainer.email,
        phone = trainer.phone,
        specialization = trainer.specialization,
        salary = trainer.salary,
        joined_date = trainer.joined_date,
        is_active = trainer.is_active
    )
    db.add(add_trainer)
    await db.commit()
    await db.refresh(add_trainer)
    return add_trainer

async def GetTrainerByid(db:AsyncSession, id:int):
    result = await db.execute(select(Trainer).where(Trainer.id == id))
    is_trainer = result.scalar_one_or_none()
    error_msg(is_trainer)
    return is_trainer

async def UpdateTrainer(db:AsyncSession, id:int, trainer:TrainerData):
    result = await db.execute(select(Trainer).where(Trainer.id == id))
    is_trainer = result.scalar_one_or_none()
    error_msg(is_trainer)

    for key, value in trainer.model_dump().items():
        setattr(is_trainer, key, value)

    await db.commit()
    await db.refresh(is_trainer)
    return is_trainer


async def DeleteTrainer(db:AsyncSession, id:int):
    result = await db.execute(select(Trainer).where(Trainer.id == id))
    is_trainer = result.scalar_one_or_none()
    error_msg(is_trainer)

    await db.delete(is_trainer)
    await db.commit()
    return{
        "Message":"Trainer has been deleted Sucessfully"
    }
