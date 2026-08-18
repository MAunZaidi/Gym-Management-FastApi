from database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Date, Boolean, DateTime, func, Enum, Float
from datetime import datetime, date
import enum

class Gender(str, enum.Enum):
    Male = "Male"
    Female = "Female"
    Other = "Other"
    
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
    
    
class Membership(Base):
    __tablename__ = "Memberships"
    id:Mapped[int] = mapped_column(primary_key=True)
    name:Mapped[str] = mapped_column(String(100), nullable=False)
    duration:Mapped[int] = mapped_column(String(200))
    price:Mapped[float] = mapped_column(Float)
    decription:Mapped[str] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
