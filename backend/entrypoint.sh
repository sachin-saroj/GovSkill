#!/bin/sh

echo "==> Checking database connection and running migrations..."
if alembic upgrade head; then
    echo "==> Primary database migrations applied successfully."
else
    echo "==> Primary database (PostgreSQL) is unreachable or suspended. Activating SQLite fallback..."
    export DATABASE_URL="sqlite+aiosqlite:///./govskill.db"
    alembic upgrade head
    echo "==> SQLite fallback database initialized successfully."
fi

PORT_TO_BIND="${PORT:-8000}"
echo "==> Starting FastAPI application on port ${PORT_TO_BIND}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT_TO_BIND}"
