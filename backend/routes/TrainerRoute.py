from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import getdb
from model import Admin
from schemas import trainer_schema
from controller import trainer
import utils.helper as helper

router = APIRouter(prefix="/trainers", tags=["Trainers"])


@router.post("", response_model=trainer_schema.TrainerResponse)
async def CreateTrainer(TrainerBody: trainer_schema.TrainerData, db: AsyncSession = Depends(getdb), user: Admin = Depends(helper.is_auth)):
    return await trainer.RegisterTrainer(db, TrainerBody)


@router.get("", response_model=list[trainer_schema.TrainerResponse])
async def GetTrainers(db: AsyncSession = Depends(getdb)):
    return await trainer.GetTrainer(db)


@router.get("/{trainerid}", response_model=trainer_schema.TrainerResponse)
async def GetTrainerById(trainerid: int, db: AsyncSession = Depends(getdb)):
    return await trainer.GetTrainerByid(db, trainerid)


@router.put("/{trainerid}", response_model=trainer_schema.TrainerResponse)
async def UpdateTrainer(trainerid: int, TrainerBody: trainer_schema.TrainerData, db: AsyncSession = Depends(getdb), user: Admin = Depends(helper.is_auth)):
    return await trainer.UpdateTrainer(db, trainerid, TrainerBody)


@router.delete("/{trainerid}")
async def DeleteTrainer(trainerid: int, db: AsyncSession = Depends(getdb), user: Admin = Depends(helper.is_auth)):
    return await trainer.DeleteTrainer(db, trainerid)
