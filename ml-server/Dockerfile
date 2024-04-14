# Use the official Python image as base
FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    FASTAPI_HOST=0.0.0.0 \
    FASTAPI_PORT=8000

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        libopencv-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI application code into the container
COPY . .

# Expose the port on which the FastAPI server will run
EXPOSE $FASTAPI_PORT

# Command to run the FastAPI application
CMD ["uvicorn", "main:app", "--host", "${FASTAPI_HOST}", "--port", "${FASTAPI_PORT}"]
