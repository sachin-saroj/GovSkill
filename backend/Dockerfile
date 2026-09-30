# Use Python 3.11 slim base image for lean production footprint and compatibility
FROM python:3.11-slim

# Prevent Python from writing .pyc files and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system dependencies:
# - tesseract-ocr & tesseract-ocr-eng: native OCR engine and English language training data
# - libgl1 & libglib2.0-0: runtime graphics dependencies for PyMuPDF rendering
# - curl: healthcheck probing
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create a non-privileged user
RUN useradd -m -u 1000 appuser

# Copy requirements first to leverage Docker layer caching
COPY requirements.txt /app/requirements.txt

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code and migration assets
COPY --chown=appuser:appuser . /app/

# Ensure workspace and uploads directory are writable by appuser and entrypoint is executable
RUN mkdir -p /app/uploads && chown -R appuser:appuser /app && chmod -R 775 /app && chmod +x /app/entrypoint.sh

# Switch to non-root user
USER appuser

# Expose FastAPI default port and Render internal port
EXPOSE 8000 10000

# Production startup entrypoint (runs alembic migrations, admin seed, and uvicorn)
CMD ["/app/entrypoint.sh"]
