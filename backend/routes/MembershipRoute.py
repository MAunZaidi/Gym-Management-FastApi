from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import getdb
from model import Admin
from schemas import membership_schema
from controller import membership
import utils.helper as helper

router = APIRouter(prefix="/memberships", tags=["memberships"])

@router.post("", response_model=membership_schema.Membership_Response)
async def CreateMembership(Membershipbody:membership_schema.Memberships, db:AsyncSession = Depends(getdb),user: Admin = Depends(helper.is_auth)):
    return await membership.RegisterMembership(db, Membershipbody)