# Use the official Python image
FROM python:3.11-slim

# Allow logs to appear immediately
ENV PYTHONUNBUFFERED True

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run the web service on container startup
# Cloud Run sets the PORT env var automatically
ENV PORT 8000
CMD exec uvicorn main:app --host 0.0.0.0 --port $PORT
