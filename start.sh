#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# 1. Start the Python backend in the background
# We bind it to 0.0.0.0:8000 so the frontend can reach it internally at 127.0.0.1:8000
echo "🚀 Starting Python Backend..."
uv run uvicorn main:app --host 0.0.0.0 --port 8000 &

# 2. Actively wait for the backend to be ready
echo "⏳ Waiting for backend to start..."
MAX_RETRIES=30
RETRY_COUNT=0
while ! curl -s http://127.0.0.1:8000/ > /dev/null && [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  sleep 5
  RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "❌ Backend failed to start in time."
  exit 1
fi

echo "✅ Backend is UP!"

# 3. Start the Next.js frontend in the foreground
PORT="${PORT:-3000}"
echo "🚀 Starting Next.js Frontend on port $PORT..."
cd my-copilot-app
npm run start -- -p $PORT -H 0.0.0.0
