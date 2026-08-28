from pydantic import BaseModel
from datetime import date

class Memberships(BaseModel):
    member_id:int
    plan_id:int
    trainer_id:int | None = None
    start_date:date
    
class Membership_Response(Memberships):
    id:int
    end_date: date
    status: str
    
    class Config:
            from_attributes = True
            

class Renew_Membership_Response(BaseModel):
    start_date:date
    end_date:date