import asyncio

from sqlalchemy import text

from database import engine


async def main():
    async with engine.begin() as conn:
        await conn.execute(
            text('ALTER TABLE "Admin" ALTER COLUMN password TYPE VARCHAR(255)')
        )
    await engine.dispose()


asyncio.run(main())
