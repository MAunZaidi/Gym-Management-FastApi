import os

from dotenv import load_dotenv
from sqlalchemy.engine import URL, make_url
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


def _database_url() -> tuple[URL, bool]:
    raw_url = os.getenv("DATABASE_URL", "").strip()
    if not raw_url:
        raise RuntimeError(
            "DATABASE_URL is not set. Add it to backend/.env locally and to "
            "the Vercel backend project's environment variables."
        )

    try:
        url = make_url(raw_url)
    except Exception as exc:
        raise RuntimeError("DATABASE_URL is not a valid PostgreSQL URL.") from exc

    if url.drivername in {"postgres", "postgresql"}:
        url = url.set(drivername="postgresql+asyncpg")
    elif url.drivername != "postgresql+asyncpg":
        raise RuntimeError(
            "DATABASE_URL must start with postgresql:// or postgresql+asyncpg://."
        )

    hostname = (url.host or "").lower()
    is_supabase = hostname.endswith(".supabase.co") or hostname.endswith(
        ".supabase.com"
    )
    is_transaction_pooler = is_supabase and url.port == 6543

    if is_transaction_pooler:
        # Supavisor transaction mode does not support session-level prepared
        # statements. Disable both SQLAlchemy's and asyncpg's statement caches.
        url = url.update_query_dict({"prepared_statement_cache_size": "0"})

    return url, is_supabase


DATABASE_URL, IS_SUPABASE = _database_url()

connect_args: dict[str, object] = {}
if IS_SUPABASE:
    connect_args["ssl"] = "require"
    if DATABASE_URL.port == 6543:
        connect_args["statement_cache_size"] = 0

engine = create_async_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=os.getenv("SQL_ECHO", "false").lower() == "true",
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=int(os.getenv("DB_POOL_SIZE", "1")),
    max_overflow=int(os.getenv("DB_MAX_OVERFLOW", "0")),
    pool_timeout=int(os.getenv("DB_POOL_TIMEOUT", "30")),
)

SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)


class Base(DeclarativeBase):
    pass


async def getdb():
    async with SessionLocal() as db:
        yield db
