from pydantic import BaseModel


class MembershipPlan_Data(BaseModel):
    name: str
    duration: str
    price: float
    decription: str
    is_active: bool