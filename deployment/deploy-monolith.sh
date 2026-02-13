#!/bin/bash

# deploy-monolith.sh
# This script builds and deploys the monolithic container (Frontend + Backend + Agent) to Google Cloud Run.

# Exit immediately if a command exits with a non-zero status
set -e

# Load environment variables
# Check current directory, then parent directory for .env
if [ -f "./.env" ]; then
    echo "📄 Loading environment variables from ./.env"
    export $(grep -v '^#' ./.env | xargs)
elif [ -f "../.env" ]; then
    echo "📄 Loading environment variables from ../.env"
    export $(grep -v '^#' ../.env | xargs)
else
    echo "⚠️  Warning: .env file not found. ensure required variables are set in your environment."
fi

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-$(gcloud config get-value project)}
SERVICE_NAME=${SERVICE_NAME:-"ubuntu-monolith"}
REGION=${GOOGLE_CLOUD_LOCATION:-"us-central1"}
SERVICE_ACCOUNT=${SERVICE_ACCOUNT}
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Mandatory Parameter Validation
MISSING_VARS=()
[ -z "$PROJECT_ID" ] && MISSING_VARS+=("GOOGLE_CLOUD_PROJECT")
[ -z "$MODEL_NAME" ] && MISSING_VARS+=("MODEL_NAME")
[ -z "$GOOGLE_CLOUD_LOCATION" ] && MISSING_VARS+=("GOOGLE_CLOUD_LOCATION")
[ -z "$BIGQUERY_DATASET" ] && MISSING_VARS+=("BIGQUERY_DATASET")
[ -z "$BIGQUERY_TABLE" ] && MISSING_VARS+=("BIGQUERY_TABLE")
[ -z "$SERVICE_ACCOUNT" ] && MISSING_VARS+=("SERVICE_ACCOUNT")
[ -z "$SERVICE_NAME" ] && MISSING_VARS+=("SERVICE_NAME")
[ -z "$REGION" ] && MISSING_VARS+=("REGION")

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Error: The following required environment variables are missing:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo "Please set them in your .env file or environment and try again."
    exit 1
fi

echo "🚀 Starting Deployment for ${SERVICE_NAME} to Project: ${PROJECT_ID}"
echo "📍 Region: ${REGION}"
echo "👤 Service Account: ${SERVICE_ACCOUNT:-'default'}"

# 1. Build and Push to Google Container Registry
echo "📦 Building and pushing Docker image..."
# Run from root directory to ensure context is correct
cd ..
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
  --allow-unauthenticated \
  --description "Monolithic Ubuntu Helpdesk Agent"

echo "✅ Deployment Complete!"
gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)'
