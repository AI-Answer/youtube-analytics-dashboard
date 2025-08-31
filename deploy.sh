#!/bin/bash

# YouTube Analytics Dashboard Deployment Script
set -e

echo "🚀 YouTube Analytics Dashboard Deployment"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Using: $COMPOSE_CMD"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration before continuing."
    echo "   Required: BASE_URL, GA4_PROPERTY_ID, YOUTUBE_API_KEY"
    read -p "Press Enter when ready to continue..."
fi

# Check if GA4 service account exists
if [ ! -f backend/ga4-service-account.json ]; then
    echo "⚠️  GA4 service account file not found at backend/ga4-service-account.json"
    echo "   This is optional but recommended for GA4 integration."
    read -p "Continue without GA4 integration? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Please add your GA4 service account JSON file and run again."
        exit 1
    fi
fi

# Build and start services
echo "🔨 Building Docker images..."
$COMPOSE_CMD build

echo "🚀 Starting services..."
$COMPOSE_CMD up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
if curl -f http://localhost:8000/health &> /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    echo "📋 Backend logs:"
    $COMPOSE_CMD logs backend --tail=20
fi

if curl -f http://localhost:3000 &> /dev/null; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    echo "📋 Frontend logs:"
    $COMPOSE_CMD logs frontend --tail=20
fi

echo ""
echo "🎉 Deployment complete!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/docs"
echo ""
echo "📋 Useful commands:"
echo "   View logs: $COMPOSE_CMD logs -f"
echo "   Stop services: $COMPOSE_CMD down"
echo "   Restart: $COMPOSE_CMD restart"
echo "   Update: git pull && $COMPOSE_CMD up -d --build"
