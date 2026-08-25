from pydantic import BaseModel
from datetime import datetime

class CheckInData(BaseModel):
    member_id: int

class CheckOutData(BaseModel):
    member_id: int

class AttendanceResponse(BaseModel):
    id: int
    member_id: int
    check_in: datetime
    check_out: datetime | None = None

    class Config:
        from_attributes = True
