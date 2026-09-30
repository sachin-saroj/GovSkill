#!/bin/sh
set -e

echo "==> Running database migrations..."
alembic upgrade head

echo "==> Seeding initial accounts..."
python -m app.db.seed_admin || true

PORT_TO_BIND="${PORT:-8000}"
echo "==> Starting FastAPI application on port ${PORT_TO_BIND}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT_TO_BIND}"
