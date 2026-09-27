from sqlalchemy.ext.asyncio import AsyncSession
from model import Payment as PaymentModel, Membership, PaymentStatus
from fastapi import HTTPException
from schemas.payment_schema import Payment as PaymentData
from sqlalchemy import select
from datetime import date


async def RecordPayment(db: AsyncSession, body: PaymentData):
    membership_result = await db.execute(
        select(Membership).where(Membership.id == body.membership_id)
    )
    membership = membership_result.scalar_one_or_none()
    if membership is None:
        raise HTTPException(
            status_code=404,
            detail="Membership not Found"
        )

    invoice_result = await db.execute(
        select(PaymentModel).where(PaymentModel.invoice_no == body.invoice_no)
    )
    if invoice_result.scalars().first() is not None:
        raise HTTPException(
            status_code=400,
            detail="Invoice number already exists"
        )

    payment = PaymentModel(**body.model_dump())
    db.add(payment)
    await db.commit()
    await db.refresh(payment)
    return payment

async def GetPayment(db: AsyncSession,member_id: int | None = None,status: PaymentStatus | None = None,payment_date: date | None = None):
    query = select(PaymentModel)

    if member_id is not None:
        query = query.join(Membership, PaymentModel.membership_id == Membership.id).where(Membership.member_id == member_id)

    if status is not None:
        query = query.where(PaymentModel.status == status)

    if payment_date is not None:
        query = query.where(PaymentModel.payment_date == payment_date)

    result = await db.execute(query)
    return result.scalars().all()


async def GetPaymentById(db: AsyncSession, payment_id: int):
    result = await db.execute(
        select(PaymentModel).where(PaymentModel.id == payment_id)
    )
    payment = result.scalar_one_or_none()

    if payment is None:
        raise HTTPException(
            status_code=404,
            detail="Payment not Found"
        )

    return payment

