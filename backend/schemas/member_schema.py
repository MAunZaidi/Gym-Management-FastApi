from pydantic import BaseModel
from datetime import date


class MemberData(BaseModel):
    name:str
    email : str
    phone : str
    gender : str
    dob : date
    address : str
    is_active : bool