from database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Date, Boolean, DateTime, func, Enum, Float, Numeric, ForeignKey
from datetime import datetime, date
import enum

class Gender(str, enum.Enum):
    Male = "Male"
    Female = "Female"
    Other = "Other"

class MembershipStatus(str, enum.Enum):
    ACTIVE = "Active",
    EXPIRED = "Expired",
    CANCELLED = "Cancelled"
    
    
class Admin(Base):
    __tablename__ = "Admin"
    id:Mapped[int] = mapped_column(primary_key=True, index=True)
    name:Mapped[str] = mapped_column(String(100), nullable=False)
    email:Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(255))

class Member(Base):
    __tablename__ = "members"
    id:Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20))
    gender: Mapped[Gender] = mapped_column(Enum(Gender))
    dob: Mapped[date] = mapped_column(Date)
    address: Mapped[str] = mapped_column(String(225))
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    attendance:Mapped[list["Attendance"]] = relationship(back_populates="member")
    memberships:Mapped[list["Membership"]] = relationship(back_populates="member")


class MembershipPlan(Base):
    __tablename__ = "MembershipPlan"
    id:Mapped[int] = mapped_column(primary_key=True)
    name:Mapped[str] = mapped_column(String(100), nullable=False)
    duration:Mapped[int] = mapped_column(String(200))
    price:Mapped[float] = mapped_column(Float)
    decription:Mapped[str] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    memberships:Mapped[list["Membership"]] = relationship(back_populates="plan")

class Trainer(Base):
    __tablename__ = "Trainers"
    id:Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20))
    specialization: Mapped[str] = mapped_column(String(100))
    salary: Mapped[float] = mapped_column(Numeric(10, 2))
    joined_date: Mapped[date] = mapped_column(Date)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    memberships: Mapped[list["Membership"]] = relationship(back_populates="trainer")

class Attendance(Base):
    __tablename__ = "Attendance"
    id:Mapped[int] = mapped_column(primary_key=True, index= True)
    member_id:Mapped[int] = mapped_column(ForeignKey("members.id"))
    member:Mapped["Member"] = relationship(back_populates="attendance")
    check_in:Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    check_out: Mapped[datetime | None] = mapped_column(DateTime(timezone=True),nullable=True)
    

class Membership(Base):
    __tablename__ = "memberships"
    id:Mapped[int] = mapped_column(primary_key=True, index=True)
    member_id:Mapped[int] = mapped_column(ForeignKey("members.id"))
    plan_id:Mapped[int] = mapped_column(ForeignKey("MembershipPlan.id"))
    trainer_id:Mapped[int | None] = mapped_column(ForeignKey("Trainers.id"),nullable=True)
    start_date:Mapped[date] = mapped_column(Date)
    end_date:Mapped[date] = mapped_column(Date)
    status:Mapped[MembershipStatus] = mapped_column(Enum(MembershipStatus), nullable=False)
    member:Mapped["Member"] = relationship(back_populates="memberships")
    plan:Mapped["MembershipPlan"] = relationship(back_populates="memberships")
    trainer:Mapped["Trainer"] = relationship(back_populates="memberships")