from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import getdb
from model import Admin
from schemas.membership_schema import MembershipData
from controller import membership
import utils.helper as helper

router = APIRouter(prefix="/plan", tags=["Memberships"])

@router.post("", response_model=MembershipData)
async def CreateMS(
    ms_plan:MembershipData,
    db:AsyncSession = Depends(getdb),
    user: Admin = Depends(helper.is_auth)
):
    return await membership.CreateMembership(db, ms_plan)

@router.get("", response_model=list[MembershipData])
async def GetMS(
    db:AsyncSession = Depends(getdb)
):
    return await membership.GetMembership(db)

@router.get("/{ms_id}", response_model=MembershipData)
async def GetMSById(
    ms_id:int,
    db:AsyncSession = Depends(getdb)
):
    return await membership.GetMembershipByid(db, ms_id)


@router.put("/{ms_id}", response_model=MembershipData)
async def UpdateMS(
    ms_plan:MembershipData,
    ms_id:int,
    db:AsyncSession = Depends(getdb),
    user: Admin = Depends(helper.is_auth)
):
    return await membership.UpdateMembership(db, ms_id, ms_plan)


@router.delete("/{ms_id}")
async def DeleteMS(
    ms_id:int,
    db:AsyncSession = Depends(getdb),
    user: Admin = Depends(helper.is_auth)
):
    return await membership.DeleteMembership(db, ms_id)