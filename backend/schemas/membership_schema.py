from pydantic import BaseModel


class MembershipData(BaseModel):
    name: str
    duration: str
    price: float
    decription: str
    is_active: bool

class MembershipResponse(MembershipData):
    id: int

    class Config:
        from_attributes = True