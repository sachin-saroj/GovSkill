import asyncio
import os
import sys
from sqlalchemy import select

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.core.security import get_password_hash
from app.db.session import async_session_maker
from app.models.user import User


async def seed_initial_users():
    admin_email = os.getenv("ADMIN_EMAIL", "admin@govskill.local")
    admin_password = os.getenv("ADMIN_PASSWORD", "AdminPass123!")
    emp_email = os.getenv("EMPLOYEE_EMAIL", "employee@govskill.local")
    emp_password = os.getenv("EMPLOYEE_PASSWORD", "Employee123!")

    async with async_session_maker() as db:
        # Seed Admin
        result = await db.execute(select(User).where(User.email == admin_email))
        existing_admin = result.scalar_one_or_none()
        if not existing_admin:
            admin_user = User(
                email=admin_email,
                password_hash=get_password_hash(admin_password),
                role="admin",
            )
            db.add(admin_user)
            print(f"[Seed] Successfully created initial admin user '{admin_email}'.")
        else:
            print(f"[Seed] Admin user '{admin_email}' already exists.")

        # Seed Employee
        result_emp = await db.execute(select(User).where(User.email == emp_email))
        existing_emp = result_emp.scalar_one_or_none()
        if not existing_emp:
            emp_user = User(
                email=emp_email,
                password_hash=get_password_hash(emp_password),
                role="employee",
            )
            db.add(emp_user)
            print(f"[Seed] Successfully created initial employee user '{emp_email}'.")
        else:
            print(f"[Seed] Employee user '{emp_email}' already exists.")

        await db.commit()


if __name__ == "__main__":
    asyncio.run(seed_initial_users())
