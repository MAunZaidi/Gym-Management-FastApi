from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import getdb
from model import Admin
from schemas import member_schema, attendance_schema
from controller import member, attendance
import utils.helper as helper

router = APIRouter(prefix="/members", tags=["Members"])


@router.post("", response_model=member_schema.MemberResponse)
async def CreateMember(MemberBody: member_schema.MemberData, db: AsyncSession = Depends(getdb), user: Admin = Depends(helper.is_auth)):
    return await member.RegisterMember(db, MemberBody)


@router.get("", response_model=list[member_schema.MemberResponse])
async def GetMembers(db: AsyncSession = Depends(getdb)):
    return await member.GetMember(db)


@router.get("/{memberid}", response_model=member_schema.MemberResponse)
async def GetMemberById(memberid: int, db: AsyncSession = Depends(getdb)):
    return await member.GetMemberByid(db, memberid)


@router.put("/{memberid}", response_model=member_schema.MemberResponse)
async def UpdateMember(memberid: int, MemberBody: member_schema.MemberData, db: AsyncSession = Depends(getdb), user: Admin = Depends(helper.is_auth)):
    return await member.UpdateMember(db, memberid, MemberBody)


@router.delete("/{memberid}")
async def DeleteMember(memberid: int, db: AsyncSession = Depends(getdb), user: Admin = Depends(helper.is_auth)):
    return await member.DeleteMember(db, memberid)


@router.get("/{member_id}/attendance", response_model=list[attendance_schema.AttendanceResponse])
async def GetMemberAttendance(member_id:int, db:AsyncSession=Depends(getdb)):
    return await attendance.GetAttendance(db, member_id, None)