from sqlalchemy.ext.asyncio import AsyncSession
from model import Membership, Member, MembershipPlan, MembershipStatus, Trainer
from fastapi import HTTPException
from schemas.membership_schema import Memberships, UpdateMembership
from sqlalchemy import select
from datetime import date, timedelta

def error_msg(user):
    if user is None:
        raise(HTTPException(
            status_code=404,
            detail= "Membership not Found"
        ))


def get_plan_duration(plan: MembershipPlan):
    return int(plan.duration)


async def validate_trainer(db: AsyncSession, trainer_id: int | None):
    if trainer_id is None:
        return

    result = await db.execute(select(Trainer).where(Trainer.id == trainer_id))
    trainer = result.scalar_one_or_none()
    if trainer is None:
        raise HTTPException(
            status_code=404,
            detail="Trainer not Found"
        )
    if not trainer.is_active:
        raise HTTPException(
            status_code=400,
            detail="Trainer is Inactive"
        )
        
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
    await validate_trainer(db, body.trainer_id)

    membership_subscription = Membership(
        member_id=body.member_id,
        plan_id=body.plan_id,
        trainer_id=body.trainer_id,
        start_date=body.start_date,
        end_date=body.start_date + timedelta(days=get_plan_duration(is_plan)),
        status=MembershipStatus.ACTIVE
    )
    db.add(membership_subscription)
    await db.commit()
    await db.refresh(membership_subscription)
    return membership_subscription


async def GetMembership(db:AsyncSession, status:MembershipStatus | None = None, member_id:int | None = None, plan_name: str | None = None):
    query = select(Membership)
    if status is not None:
        query = query.where(Membership.status==status)
    if member_id is not None:
        query = query.where(Membership.member_id==member_id)
    if plan_name is not None:
        query = query.join(MembershipPlan).where(MembershipPlan.name==plan_name)
    result = await db.execute(query)
    return result.scalars().all()


async def GetMembershipByid(db: AsyncSession, id: int):
    result = await db.execute(select(Membership).where(Membership.id == id))
    is_membership = result.scalar_one_or_none()
    error_msg(is_membership)
    return is_membership


async def UpdateMembershipByid(db: AsyncSession, id: int, body: UpdateMembership):
    is_membership = await GetMembershipByid(db, id)
    update_data = body.model_dump(exclude_unset=True)

    for field in ("start_date", "end_date", "status"):
        if field in update_data and update_data[field] is None:
            raise HTTPException(
                status_code=400,
                detail=f"{field} cannot be null"
            )

    if "trainer_id" in update_data:
        await validate_trainer(db, update_data["trainer_id"])

    start_date = update_data.get("start_date", is_membership.start_date)
    end_date = update_data.get("end_date", is_membership.end_date)
    if end_date < start_date:
        raise HTTPException(
            status_code=400,
            detail="end_date cannot be before start_date"
        )

    for key, value in update_data.items():
        setattr(is_membership, key, value)

    await db.commit()
    await db.refresh(is_membership)
    return is_membership


async def RenewMembership(db: AsyncSession, id: int):
    is_membership = await GetMembershipByid(db, id)
    result = await db.execute(select(MembershipPlan).where(MembershipPlan.id == is_membership.plan_id))
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

    is_membership.end_date = is_membership.end_date + timedelta(days=get_plan_duration(is_plan))
    is_membership.status = MembershipStatus.ACTIVE

    await db.commit()
    await db.refresh(is_membership)
    return is_membership


async def CancelMembership(db: AsyncSession, id: int):
    is_membership = await GetMembershipByid(db, id)
    is_membership.status = MembershipStatus.CANCELLED

    await db.commit()
    return {
        "Message": "Membership has been cancelled Sucessfully"
    }


async def GetExpiringSoonMemberships(db: AsyncSession, days: int = 7):
    if days < 0:
        raise HTTPException(
            status_code=400,
            detail="days must be greater than or equal to 0"
        )

    today = date.today()
    expiry_date = today + timedelta(days=days)
    result = await db.execute(
        select(Membership).where(
            Membership.status == MembershipStatus.ACTIVE,
            Membership.end_date >= today,
            Membership.end_date <= expiry_date
        )
    )
    return result.scalars().all()
    
    
