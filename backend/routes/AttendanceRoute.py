from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import getdb
from model import Admin
from schemas.attendance_schema import CheckInData, CheckOutData, AttendanceResponse
from controller import attendance
import utils.helper as helper
from datetime import date

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/check-in", response_model=AttendanceResponse)
async def CheckIn(body: CheckInData, db: AsyncSession = Depends(getdb), user: Admin = Depends(helper.is_auth)):
    return await attendance.CheckIn(db, body)


@router.post("/check-out", response_model=AttendanceResponse)
async def CheckOut(body: CheckOutData, db: AsyncSession = Depends(getdb), user: Admin = Depends(helper.is_auth)):
    return await attendance.CheckOut(db, body)


@router.get("", response_model=list[AttendanceResponse])
async def GetAttendance(member_id: int | None = None, date: date | None = None, db: AsyncSession = Depends(getdb)):
    return await attendance.GetAttendance(db, member_id, date)


@router.get("/today", response_model=list[AttendanceResponse])
async def GetTodayAttendance(db: AsyncSession = Depends(getdb)):
    return await attendance.GetTodayAttendance(db)
