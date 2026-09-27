from pydantic import BaseModel,Field
from model import PaymentStatus
from datetime import date
from decimal import Decimal

class Payment(BaseModel):
    membership_id:int
    amount: Decimal = Field(gt=0)
    payment_date:date
    payment_method:str
    status:PaymentStatus
    invoice_no:str
    
class PaymentResponse(Payment):
    id: int
    
    class Config:
        from_attributes = True

    