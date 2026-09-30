from datetime import date

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from model import BookingStatus, ClassBooking, Gym_class, Member
from schemas.class_booking_schema import ClassBooking as ClassBookingData


def booking_not_found(booking):
    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Class booking not Found"
        )


async def validate_member(db: AsyncSession, member_id: int):
    result = await db.execute(select(Member).where(Member.id == member_id))
    member = result.scalar_one_or_none()

    if member is None:
        raise HTTPException(
            status_code=404,
            detail="Member not Found"
        )
    if not member.is_active:
        raise HTTPException(
            status_code=400,
            detail="Member is Inactive"
        )

    return member


async def validate_gym_class(db: AsyncSession, class_id: int):
    result = await db.execute(select(Gym_class).where(Gym_class.id == class_id))
    gym_class = result.scalar_one_or_none()

    if gym_class is None:
        raise HTTPException(
            status_code=404,
            detail="Gym class not Found"
        )

    return gym_class


async def ensure_class_has_capacity(db: AsyncSession,gym_class: Gym_class,booking_date: date):
    result = await db.execute(
        select(func.count(ClassBooking.id)).where(
            ClassBooking.class_id == gym_class.id,
            ClassBooking.booking_date == booking_date,
            ClassBooking.status == BookingStatus.BOOKED
        )
    )
    booked_count = result.scalar_one()

    if booked_count >= gym_class.capacity:
        raise HTTPException(
            status_code=400,
            detail="Class capacity is full"
        )


async def ScheduleClass(db: AsyncSession, body: ClassBookingData):
    await validate_member(db, body.member_id)
    gym_class = await validate_gym_class(db, body.class_id)
    await ensure_class_has_capacity(db, gym_class, body.booking_date)

    existing_result = await db.execute(
        select(ClassBooking).where(
            ClassBooking.class_id == body.class_id,
            ClassBooking.member_id == body.member_id
        )
    )
    existing_booking = existing_result.scalar_one_or_none()

    if existing_booking is not None:
        if existing_booking.status != BookingStatus.CANCELLED:
            raise HTTPException(
                status_code=400,
                detail="Member already booked this class"
            )

        existing_booking.booking_date = body.booking_date
        existing_booking.status = BookingStatus.BOOKED
        await db.commit()
        await db.refresh(existing_booking)
        return existing_booking

    class_booking = ClassBooking(
        class_id=body.class_id,
        member_id=body.member_id,
        booking_date=body.booking_date,
        status=BookingStatus.BOOKED
    )

    db.add(class_booking)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Unable to schedule class booking"
        )

    await db.refresh(class_booking)
    return class_booking


async def GetClassBookings(db: AsyncSession,member_id: int | None = None,class_id: int | None = None,status: BookingStatus | None = None,booking_date: date | None = None):
    query = select(ClassBooking)

    if member_id is not None:
        query = query.where(ClassBooking.member_id == member_id)
    if class_id is not None:
        query = query.where(ClassBooking.class_id == class_id)
    if status is not None:
        query = query.where(ClassBooking.status == status)
    if booking_date is not None:
        query = query.where(ClassBooking.booking_date == booking_date)

    result = await db.execute(query)
    return result.scalars().all()


async def GetClassBookingById(db: AsyncSession, id: int):
    result = await db.execute(select(ClassBooking).where(ClassBooking.id == id))
    class_booking = result.scalar_one_or_none()
    booking_not_found(class_booking)
    return class_booking


async def CancelClassBooking(db: AsyncSession, id: int):
    class_booking = await GetClassBookingById(db, id)

    if class_booking.status != BookingStatus.CANCELLED:
        class_booking.status = BookingStatus.CANCELLED
        await db.commit()

    return {
        "Message": "Class booking has been cancelled Sucessfully"
    }
