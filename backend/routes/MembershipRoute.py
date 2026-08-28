from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import getdb
from model import Admin, MembershipStatus
from schemas import membership_schema
from controller import membership
import utils.helper as helper

router = APIRouter(prefix="/memberships", tags=["memberships"])

@router.post("", response_model=membership_schema.Membership_Response)
async def CreateMembership(Membershipbody:membership_schema.Memberships, db:AsyncSession = Depends(getdb),user: Admin = Depends(helper.is_auth)):
    return await membership.RegisterMembership(db, Membershipbody)

@router.get("", response_model=list[membership_schema.Membership_Response])
async def GetMembership(
    status:MembershipStatus| None = None,
    member_id:int | None = None,
    plan_name:str | None = None,
    db:AsyncSession = Depends(getdb)):
    return await membership.GetMembership(db, status, member_id, plan_name)