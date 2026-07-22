from database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer

class Admin(Base):
    __tablename__ = "Admin"
    id:Mapped[int] = mapped_column(primary_key=True, index=True)
    name:Mapped[str] = mapped_column(String(100), nullable=False)
    email:Mapped[str] = mapped_column(String(30))
    password: Mapped[str] = mapped_column(String(255))
    
