from pydantic import BaseModel

class AdminCreate(BaseModel):
    name:str
    email:str
    password:str
    
class AdminResponse(BaseModel):
    name:str
    email:str
    password:str
    
    class Config:
        from_attributes = True

class LoginCreate(BaseModel):
    email:str
    password:str
    
class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: AdminResponse
    