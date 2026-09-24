from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import getdb
from schemas import gym_classes_schema
from controller import gym_classes
import utils.helper as helper

router = APIRouter(prefix="/gym-class", tags=["gym_classes"])


@router.get("", response_model=list[gym_classes_schema.GymClassesResponse])
async def GetGymClasses(db:AsyncSession = Depends(getdb)):
    return await gym_classes.GetGymClasses(db)