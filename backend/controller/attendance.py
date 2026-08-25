from sqlalchemy.ext.asyncio import AsyncSession
from model import Attendance, Member
from fastapi import HTTPException
from schemas.attendance_schema import CheckInData, CheckOutData
from sqlalchemy import select, func
from datetime import datetime, timezone, date


async def CheckIn(db: AsyncSession, body: CheckInData):
    result = await db.execute(select(Member).where(Member.id == body.member_id))
    is_member = result.scalar_one_or_none()
    if is_member is None:
        raise HTTPException(status_code=404, detail="Member not Found")

    result = await db.execute(
        select(Attendance).where(
            Attendance.member_id == body.member_id,
            Attendance.check_out.is_(None)
        )
    )
    is_checked_in = result.scalar_one_or_none()
    if is_checked_in:
        raise HTTPException(status_code=400, detail="Member is already checked in")

    entry = Attendance(member_id=body.member_id)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


async def CheckOut(db: AsyncSession, body: CheckOutData):
    result = await db.execute(select(Attendance).where(
            Attendance.member_id == body.member_id,
            Attendance.check_out.is_(None)
        ).order_by(Attendance.check_in.desc())
    )
    is_checked_in = result.scalars().first()
    if is_checked_in is None:
        raise HTTPException(status_code=404, detail="No active check-in found for this member")

    is_checked_in.check_out = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(is_checked_in)
    return is_checked_in


async def GetAttendance(db: AsyncSession, member_id: int | None, date_filter: date | None):
    query = select(Attendance)
    if member_id is not None:
        query = query.where(Attendance.member_id == member_id)
    if date_filter is not None:
        query = query.where(func.date(Attendance.check_in) == date_filter)

    result = await db.execute(query)
    return result.scalars().all()


async def GetTodayAttendance(db: AsyncSession):
    result = await db.execute(select(Attendance).where(Attendance.check_out.is_(None)))
    return result.scalars().all()
