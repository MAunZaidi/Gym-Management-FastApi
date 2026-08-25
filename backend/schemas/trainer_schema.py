from pydantic import BaseModel
from datetime import date


class TrainerData(BaseModel):
    name: str
    email: str
    phone: str
    specialization: str
    salary: float
    joined_date: date
    is_active: bool

class TrainerResponse(TrainerData):
    id: int

    class Config:
        from_attributes = True
