from sqlalchemy.ext.asyncio import AsyncSession
from model import Member
from fastapi import HTTPException
from schemas.member_schema import MemberData
from sqlalchemy import select

def error_msg(user):
    if user is None:
        raise(HTTPException(
            status_code=404,
            detail= "User not Found"
        ))

async def GetMember(db:AsyncSession):
    result = await db.execute(select(Member))
    return result.scalars().all()
    
    
async def RegisterMember(db: AsyncSession, user: MemberData):
    result = await db.execute(select(Member).where(Member.email==user.email))
    is_email = result.scalar_one_or_none()
    if is_email:
        raise HTTPException(status_code=400, detail="This Email is Taken")
        
    add_member = Member(
        name = user.name,
        email = user.email,
        phone = user.phone,
        gender = user.gender,
        dob = user.dob,
        address = user.address,
        is_active = user.is_active
    )
    db.add(add_member)
    await db.commit()
    await db.refresh(add_member)
    return add_member
    
async def GetMemberByid(db:AsyncSession, id:int):
    result = await db.execute(select(Member).where(Member.id == id))
    is_member = result.scalar_one_or_none()
    error_msg(is_member)
    return is_member
    
async def UpdateMember(db:AsyncSession, id:int, user:MemberData):
    result = await db.execute(select(Member).where(Member.id == id))
    is_member = result.scalar_one_or_none()
    error_msg(is_member)
    
    for key, value in user.model_dump().items():
        setattr(is_member, key, value)
        
    await db.commit()
    await db.refresh(is_member)
    return is_member


async def DeleteMember(db:AsyncSession, id:int):
    result = await db.execute(select(Member).where(Member.id == id))
    is_member = result.scalar_one_or_none()
    error_msg(is_member)
    
    await db.delete(is_member)
    await db.commit()
    return{
        "Message":"Item has been deleted Sucessfully"
    }