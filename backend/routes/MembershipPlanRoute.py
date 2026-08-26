from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import getdb
from model import Admin
from schemas.membership_plan_schema import MembershipPlanData, MembershipPlanResponse
from controller import membership_plan
import utils.helper as helper

router = APIRouter(prefix="/plan", tags=["Membership Plans"])

@router.post("", response_model=MembershipPlanResponse)
async def CreateMS(
    ms_plan:MembershipPlanData,
    db:AsyncSession = Depends(getdb),
    user: Admin = Depends(helper.is_auth)
):
    return await membership_plan.CreateMembershipPlan(db, ms_plan)

@router.get("", response_model=list[MembershipPlanResponse])
async def GetMS(
    db:AsyncSession = Depends(getdb)
):
    return await membership_plan.GetMembershipPlan(db)

@router.get("/{ms_id}", response_model=MembershipPlanResponse)
async def GetMSById(
    ms_id:int,
    db:AsyncSession = Depends(getdb)
):
    return await membership_plan.GetMembershipPlanByid(db, ms_id)


@router.put("/{ms_id}", response_model=MembershipPlanResponse)
async def UpdateMS(
    ms_plan:MembershipPlanData,
    ms_id:int,
    db:AsyncSession = Depends(getdb),
    user: Admin = Depends(helper.is_auth)
):
    return await membership_plan.UpdateMembershipPlan(db, ms_id, ms_plan)


@router.delete("/{ms_id}")
async def DeleteMS(
    ms_id:int,
    db:AsyncSession = Depends(getdb),
    user: Admin = Depends(helper.is_auth)
):
    return await membership_plan.DeleteMembershipPlan(db, ms_id)
