from sqlalchemy.ext.asyncio import AsyncSession
from schemas.membership_plan_schema import MembershipPlanData
from model import MembershipPlan
from sqlalchemy import select
from fastapi import HTTPException


def error_msg(user):
    if user is None:
        raise(HTTPException(
            status_code=404,
            detail= "User not Found"
        )
    )

async def CreateMembershipPlan(db:AsyncSession, ms_plan:MembershipPlanData):
    ms_plan_entry = MembershipPlan(
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

async def GetMembershipPlan(db:AsyncSession):
    result = await db.execute(select(MembershipPlan))
    return result.scalars().all()


async def GetMembershipPlanByid(db:AsyncSession, id:int):
    result = await db.execute(select(MembershipPlan).where(MembershipPlan.id==id))
    is_msplan = result.scalar_one_or_none()
    error_msg(is_msplan)
    return is_msplan

async def UpdateMembershipPlan(db:AsyncSession, id:int, ms_plan:MembershipPlanData):
    result = await db.execute(select(MembershipPlan).where(MembershipPlan.id==id))
    is_msplan = result.scalar_one_or_none()
    error_msg(is_msplan)

    for key, value in ms_plan.model_dump().items():
        setattr(is_msplan, key, value)

    await db.commit()
    await db.refresh(is_msplan)
    return is_msplan

async def DeleteMembershipPlan(db:AsyncSession, id:int):
    result = await db.execute(select(MembershipPlan).where(MembershipPlan.id==id))
    is_msplan = result.scalar_one_or_none()
    error_msg(is_msplan)

    await db.delete(is_msplan)
    await db.commit()
    return{
        "Message":"Membership Plan has been deleted Sucessfully"
    }
