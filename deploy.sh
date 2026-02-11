#!/bin/bash

# Load environment variables from .env if it exists
if [ -f .env ]; then
  # Sourcing .env file
  export $(grep -v '^#' .env | xargs)
fi

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-$(gcloud config get-value project)}
SERVICE_NAME="test-upload"
REGION=${GOOGLE_CLOUD_LOCATION}
SERVICE_ACCOUNT=${SERVICE_ACCOUNT}
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Starting Deployment for ${SERVICE_NAME} to Project: ${PROJECT_ID} using service account ${SERVICE_ACCOUNT}"

#1. Build and Push to Google Container Registry
echo "📦 Building and pushing Docker image..."
gcloud builds submit --tag ${IMAGE_NAME} .

# 2. Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --service-account ${SERVICE_ACCOUNT} \
  --description "Monolithic Data Companion Agent"

echo "✅ Deployment Complete!"
gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)'