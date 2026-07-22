from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set. Add it to backend/.env")


engine = create_async_engine(
    DATABASE_URL,
    echo = True
)


AsyncSession = async_sessionmaker(
    bind=engine,
    expire_on_commit=False
)


class Base(DeclarativeBase):
    pass

async def getdb():
    async with AsyncSession() as db:
        yield db
