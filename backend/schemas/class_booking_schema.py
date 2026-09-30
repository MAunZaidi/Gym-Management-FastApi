from pydantic import BaseModel, Field
from model import BookingStatus
from datetime import date


class ClassBooking(BaseModel):
    class_id:int
    member_id:int
    booking_date:date = Field(default_factory=date.today)
    
    
class ClassBookingResponse(ClassBooking):
    id: int
    status:BookingStatus
    
    class Config:
        from_attributes = True
