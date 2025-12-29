#!/bin/bash

# Configuration
PROJECT_ID=$(gcloud config get-value project)
SERVICE_NAME="kifiapp-backend"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Check for required variables
if [ -z "$DATABASE_URL" ]; then
    read -p "Enter your DATABASE_URL (postgresql://...): " DATABASE_URL
fi

if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -hex 32)
    echo "Generated new JWT_SECRET: $JWT_SECRET"
fi

echo "🚀 Starting GCP Deployment for Project: $PROJECT_ID"

# Build and Push using Cloud Build
echo "Building and pushing image to Google Container Registry..."
gcloud builds submit --tag $IMAGE_NAME .

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "DATABASE_URL=$DATABASE_URL" \
  --set-env-vars "JWT_SECRET=$JWT_SECRET"

echo "✅ Deployment finished!"
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'
