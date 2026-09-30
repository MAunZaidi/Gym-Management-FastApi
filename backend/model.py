from database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Date, Boolean, DateTime, func, Enum, Float, Numeric, ForeignKey, Time,UniqueConstraint
from datetime import datetime, date, time
from decimal import Decimal

import enum

class Gender(str, enum.Enum):
    Male = "Male"
    Female = "Female"
    Other = "Other"

class MembershipStatus(str, enum.Enum):
    ACTIVE = "Active",
    EXPIRED = "Expired",
    CANCELLED = "Cancelled"
    
class DaysOfWeek(str, enum.Enum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"

class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    DUE = "DUE"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"
    
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
    class_bookings: Mapped[list["ClassBooking"]] = relationship(back_populates="member")

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
    gym_classes: Mapped[list["Gym_class"]] = relationship(back_populates="trainer")

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
    payment:Mapped[list["Payment"]] = relationship(back_populates="memberships")
    
    
class Gym_class(Base):
    __tablename__ = "gym_classes"
    id:Mapped[int] = mapped_column(primary_key=True, index=True)
    name:Mapped[str] = mapped_column(String(200), nullable=False)
    trainer_id:Mapped[int] = mapped_column(ForeignKey("Trainers.id"), nullable=False)
    day_of_week:Mapped[DaysOfWeek] = mapped_column(Enum(DaysOfWeek), nullable=False)
    start_time:Mapped[time] = mapped_column(Time,nullable=False)
    duration_min:Mapped[int] = mapped_column(Integer,nullable=False)
    capacity:Mapped[int] = mapped_column(Integer, nullable=False)
    trainer:Mapped[Trainer] = relationship(back_populates="gym_classes")
    class_bookings: Mapped[list["ClassBooking"]] = relationship(back_populates="gym_classes")
    

class Payment(Base):
    __tablename__ = "payment"
    id:Mapped[int] = mapped_column(primary_key=True, index=True)
    membership_id:Mapped[int] = mapped_column(ForeignKey("memberships.id"))
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 3))
    payment_date:Mapped[date] = mapped_column(Date)
    payment_method:Mapped[str] = mapped_column(String(100))
    status:Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus))
    invoice_no:Mapped[str] = mapped_column(String(100))
    memberships:Mapped["Membership"] = relationship(back_populates="payment")



class BookingStatus(str, enum.Enum):
    BOOKED = "BOOKED"
    CANCELLED = "CANCELLED"
    ATTENDED = "ATTENDED"
    NO_SHOW = "NO_SHOW"


class ClassBooking(Base):
    __tablename__ = "class_bookings"
    __table_args__ = (UniqueConstraint(
            "class_id",
            "member_id",
            name="uq_class_member_booking"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True,index=True)
    class_id: Mapped[int] = mapped_column( ForeignKey("gym_classes.id"), nullable=False)
    member_id: Mapped[int] = mapped_column(ForeignKey("members.id"),nullable=False)
    booking_date: Mapped[date] = mapped_column(Date,default=date.today,nullable=False)
    status: Mapped[BookingStatus] = mapped_column(Enum(BookingStatus),default=BookingStatus.BOOKED,nullable=False)
    gym_classes: Mapped["Gym_class"] = relationship(back_populates="class_bookings")
    member: Mapped["Member"] = relationship(back_populates="class_bookings")
    