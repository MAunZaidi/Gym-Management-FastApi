from pydantic import BaseModel
from datetime import date
from model import MembershipStatus

class Memberships(BaseModel):
    member_id:int
    plan_id:int
    trainer_id:int | None = None
    start_date:date


class UpdateMembership(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    trainer_id: int | None = None
    status: MembershipStatus | None = None
    
class Membership_Response(Memberships):
    id:int
    end_date: date
    status: str
    
    class Config:
            from_attributes = True
            

class Renew_Membership_Response(BaseModel):
    start_date:date
    end_date:date

    class Config:
            from_attributes = True
