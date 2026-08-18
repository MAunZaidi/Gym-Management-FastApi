from pydantic import BaseModel


class MembershipData(BaseModel):
    name: str
    duration: str
    price: float
    decription: str
    is_active: bool