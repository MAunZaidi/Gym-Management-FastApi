from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from controller import payment
from database import getdb
from model import Admin, PaymentStatus
from schemas import payment_schema
import utils.helper as helper


router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("", response_model=payment_schema.PaymentResponse)
async def RecordPayment(body: payment_schema.Payment,db: AsyncSession = Depends(getdb),user: Admin = Depends(helper.is_auth)):
    return await payment.RecordPayment(db, body)


@router.get("", response_model=list[payment_schema.PaymentResponse])
async def GetPayments(member_id: int | None = None,status: PaymentStatus | None = None,payment_date: date | None = None,db: AsyncSession = Depends(getdb)):
    return await payment.GetPayment(db, member_id, status, payment_date)


@router.get("/{payment_id}", response_model=payment_schema.PaymentResponse)
async def GetPaymentById(payment_id: int, db: AsyncSession = Depends(getdb)
):
    return await payment.GetPaymentById(db, payment_id)


@router.put("/{payment_id}", response_model=payment_schema.PaymentResponse)
async def EditPaymentRoute(body:payment_schema.Payment, payment_id: int, db: AsyncSession = Depends(getdb), user: Admin = Depends(helper.is_auth)):
    return await payment.EditPayment(db, payment_id, body)