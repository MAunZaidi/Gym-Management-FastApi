from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import getdb
from model import Admin
from schemas import gym_classes_schema
from controller import gym_classes
import utils.helper as helper

router = APIRouter(prefix="/gym-class", tags=["gym_classes"])


@router.get("", response_model=list[gym_classes_schema.GymClassesResponse])
async def GetGymClasses(db:AsyncSession = Depends(getdb)):
    return await gym_classes.GetGymClasses(db)

@router.post("", response_model = gym_classes_schema.GymClassesResponse)
async def CreateGymClasses(body:gym_classes_schema.GymClasses, db:AsyncSession = Depends(getdb)):
    return await gym_classes.CreateGymClasses(db, body)


@router.get("/{gym_class_id}", response_model=gym_classes_schema.GymClassesResponse)
async def GetGymClassById(gym_class_id: int, db: AsyncSession = Depends(getdb)):
    return await gym_classes.GetGymClassesById(db, gym_class_id)


@router.put("/{gym_class_id}", response_model=gym_classes_schema.GymClassesResponse)
async def UpdateGymClass(
    gym_class_id: int,
    body: gym_classes_schema.GymClasses,
    db: AsyncSession = Depends(getdb),
    user: Admin = Depends(helper.is_auth)
):
    return await gym_classes.UpdateGymClasses(db, body, gym_class_id)


@router.delete("/{gym_class_id}")
async def DeleteGymClass(
    gym_class_id: int,
    db: AsyncSession = Depends(getdb),
    user: Admin = Depends(helper.is_auth)
):
    return await gym_classes.DeleteGymClass(db, gym_class_id)
