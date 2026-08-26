from pydantic import BaseModel


class MembershipPlanData(BaseModel):
    name: str
    duration: str
    price: float
    decription: str
    is_active: bool

class MembershipPlanResponse(MembershipPlanData):
    id: int

    class Config:
        from_attributes = True