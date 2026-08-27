from sqlalchemy.ext.asyncio import AsyncSession
from model import Membership, Member, MembershipPlan
from fastapi import HTTPException
from schemas.membership_schema import Memberships, Renew_Membership_Response
from sqlalchemy import select
from datetime import timedelta

def error_msg(user):
    if user is None:
        raise(HTTPException(
            status_code=404,
            detail= "Membership not Found"
        ))
        
async def RegisterMembership(db:AsyncSession, body:Memberships):
    query = select(Member).where(Member.id==body.member_id)
    result = await db.execute(query)
    is_member = result.scalar_one_or_none()
    if is_member is None:
        raise HTTPException(
        status_code=404, 
        detail="Please Register the Member"
    )    
    if not is_member.is_active:
        raise HTTPException(
        status_code=400,
        detail="Member is Inactive"
    )
    
    query = select(MembershipPlan).where(MembershipPlan.id==body.plan_id)
    result  = await db.execute(query)
    is_plan = result.scalar_one_or_none()
    if is_plan is None:
        raise HTTPException(
            status_code=404, 
            detail="Gym does not offer this plan"
        )
    if not is_plan.is_active:
        raise HTTPException(
            status_code=400,
            detail="Plan is Inactive"
        )
    membership_subscription = Memberships(
        member_id=body.member_id,
        plan_id=body.plan_id,
        trainer_id=body.trainer_id,
        start_date=body.start_date,
        end_date=body.start_date + timedelta(days=is_plan.duration),
        status=body.status
    )
    db.add(membership_subscription)
    await db.commit()
    await db.refresh(membership_subscription)
    return membership_subscription
    