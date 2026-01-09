#!/bin/bash

# Configuration
PROJECT_ID=$(gcloud config get-value project)
SERVICE_NAME="ubuntu-agent"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Starting Deployment for ${SERVICE_NAME} to Project: ${PROJECT_ID}"

# 1. Build and Push to Google Container Registry
echo "📦 Building and pushing Docker image..."
gcloud builds submit --tag ${IMAGE_NAME} .

# 2. Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --description "Monolithic Ubuntu Helpdesk Agent"

# The --port 3000 tells Cloud Run to send traffic to our frontend's default port.
# The backend runs internally on port 8000.

echo "✅ Deployment Complete!"
gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)'
