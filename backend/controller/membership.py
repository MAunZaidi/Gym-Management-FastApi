from sqlalchemy.ext.asyncio import AsyncSession
from schemas.membership_schema import MembershipData
from model import Membership
from sqlalchemy import select
from fastapi import HTTPException


def error_msg(user):
    if user is None:
        raise(HTTPException(
            status_code=404,
            detail= "User not Found"
        )
    )
        
async def CreateMembership(db:AsyncSession, ms_plan:MembershipData):
    ms_plan_entry = Membership(
        name = ms_plan.name,
        duration = ms_plan.duration,
        price = ms_plan.price,
        decription = ms_plan.decription,
        is_active = ms_plan.is_active
    )
    db.add(ms_plan_entry)
    await db.commit()
    await db.refresh(ms_plan_entry)
    return ms_plan_entry

async def GetMembership(db:AsyncSession):
    result = await db.execute(select(Membership))
    return result.scalars().all()


async def GetMembershipByid(db:AsyncSession, id:int):
    result = await db.execute(select(Membership).where(Membership.id==id))
    is_msplan = result.scalar_one_or_none()
    error_msg(is_msplan)
    return is_msplan

async def UpdateMembership(db:AsyncSession, id:int, ms_plan:MembershipData):
    result = await db.execute(select(Membership).where(Membership.id==id))
    is_msplan = result.scalar_one_or_none()
    error_msg(is_msplan)
    
    for key, value in ms_plan.model_dump().items():
        setattr(is_msplan, key, value)
        
    await db.commit()
    await db.refresh(is_msplan)
    return is_msplan

async def DeleteMembership(db:AsyncSession, id:int):
    result = await db.execute(select(Membership).where(Membership.id==id))
    is_msplan = result.scalar_one_or_none()
    error_msg(is_msplan)
    
    await db.delete(is_msplan)
    await db.commit()
    return{
        "Message":"Membership has been deleted Sucessfully"
    }
