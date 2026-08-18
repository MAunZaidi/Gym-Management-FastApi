from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import getdb
from schemas.membership_plan import MembershipPlan_Data
from controller import membership_plan

router = APIRouter(prefix="/plan", tags=["MembershipPlan"])

@router.post("", response_model=MembershipPlan_Data)
async def CreateMS(
    ms_plan:MembershipPlan_Data,
    db:AsyncSession = Depends(getdb)
):
    return await membership_plan.CreateMembership(db, ms_plan)
    
@router.get("", response_model=list[MembershipPlan_Data])
async def GetMS(
    db:AsyncSession = Depends(getdb)
):
    return await membership_plan.GetMembership(db)

@router.get("/{ms_id}", response_model=MembershipPlan_Data)
async def GetMSById(
    ms_id:int,
    db:AsyncSession = Depends(getdb)
):
    return await membership_plan.GetMembershipByid(db, ms_id)


@router.put("/{ms_id}", response_model=MembershipPlan_Data)
async def UpdateMS(
    ms_plan:MembershipPlan_Data,
    ms_id:int,
    db:AsyncSession = Depends(getdb)
):
    return await membership_plan.UpdateMembership(db, ms_id, ms_plan)


@router.delete("/{ms_id}")
async def DeleteMS(
    ms_id:int,
    db:AsyncSession = Depends(getdb)
):
    return await membership_plan.DeleteMembership(db, ms_id)