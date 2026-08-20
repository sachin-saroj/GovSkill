import asyncio
import os
import sys
from sqlalchemy import select

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.core.security import get_password_hash
from app.db.session import async_session_maker
from app.models.user import User


async def seed_admin_user():
    admin_email = os.getenv("ADMIN_EMAIL", "admin@govskill.local")
    admin_password = os.getenv("ADMIN_PASSWORD", "AdminPass123!")

    async with async_session_maker() as db:
        result = await db.execute(select(User).where(User.email == admin_email))
        existing_admin = result.scalar_one_or_none()

        if existing_admin:
            print(f"[Seed] Admin user '{admin_email}' already exists.")
            return

        admin_user = User(
            email=admin_email,
            password_hash=get_password_hash(admin_password),
            role="admin",
        )
        db.add(admin_user)
        await db.commit()
        print(f"[Seed] Successfully created initial admin user '{admin_email}'.")


if __name__ == "__main__":
    asyncio.run(seed_admin_user())
