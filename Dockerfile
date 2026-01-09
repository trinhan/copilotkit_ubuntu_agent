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

# Set working directory
WORKDIR /app

# --- Backend Setup ---
# Copy Python configuration and install dependencies
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

# --- Frontend Setup ---
# Copy frontend and install dependencies
COPY my-copilot-app/package.json my-copilot-app/package-lock.json ./my-copilot-app/
WORKDIR /app/my-copilot-app
RUN npm install

# Copy frontend source and build
COPY my-copilot-app/ ./
RUN npm run build

# --- Final Assembly ---
WORKDIR /app
# Copy the rest of the application code
COPY . .

# Ensure start.sh is executable
RUN chmod +x start.sh

# Expose the port (Cloud Run will set this via environment variable)
EXPOSE 3000

# Set the entrypoint to our startup script
ENTRYPOINT ["./start.sh"]
