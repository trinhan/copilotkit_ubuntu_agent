# Use Python 3.12 slim as the base image
FROM python:3.12-slim

# Install system dependencies, Node.js, and uv
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && pip install uv \
    && rm -rf /var/lib/apt/lists/*

# Set working directory once at the start
WORKDIR /app

# Enable uv speed optimizations
ENV UV_PROJECT_ENVIRONMENT=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# --- Frontend Setup ---
# Copy only package files first for better caching
COPY my-copilot-app/package*.json ./my-copilot-app/
WORKDIR /app/my-copilot-app
RUN npm ci

# Copy ONLY frontend source and build
COPY my-copilot-app/ ./
RUN npm run build

# --- Backend Setup ---
# Move back to root for backend and final assembly
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen
COPY adk-agent/ ./adk-agent/

# Copy start.sh to root
COPY start.sh ./
RUN chmod +x start.sh

# Final Assembly
EXPOSE 3000

# Set the entrypoint to our startup script
ENTRYPOINT ["./start.sh"]
