from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from controller import class_booking
from database import getdb
from model import Admin, BookingStatus
from schemas import class_booking_schema
import utils.helper as helper


router = APIRouter(prefix="/classes", tags=["Class Bookings"])


@router.post("", response_model=class_booking_schema.ClassBookingResponse)
async def ScheduleClass(
    body: class_booking_schema.ClassBooking,
    db: AsyncSession = Depends(getdb),
    user: Admin = Depends(helper.is_auth)
):
    return await class_booking.ScheduleClass(db, body)


@router.get("", response_model=list[class_booking_schema.ClassBookingResponse])
async def GetClassBookings(
    member_id: int | None = None,
    class_id: int | None = None,
    status: BookingStatus | None = None,
    booking_date: date | None = None,
    db: AsyncSession = Depends(getdb)
):
    return await class_booking.GetClassBookings(
        db,
        member_id,
        class_id,
        status,
        booking_date
    )


@router.get("/{class_booking_id}", response_model=class_booking_schema.ClassBookingResponse)
async def GetClassBookingById(
    class_booking_id: int,
    db: AsyncSession = Depends(getdb)
):
    return await class_booking.GetClassBookingById(db, class_booking_id)


@router.delete("/{class_booking_id}")
async def CancelClassBooking(
    class_booking_id: int,
    db: AsyncSession = Depends(getdb),
    user: Admin = Depends(helper.is_auth)
):
    return await class_booking.CancelClassBooking(db, class_booking_id)
