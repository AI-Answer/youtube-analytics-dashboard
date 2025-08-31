# Docker Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- GA4 service account JSON file
- Environment variables configured

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd SalesTrack
cp .env.example .env
```

### 2. Configure Environment
Edit `.env` file with your settings:
```bash
# Required
BASE_URL=https://yourdomain.com
GA4_PROPERTY_ID=your_ga4_property_id
YOUTUBE_API_KEY=your_youtube_api_key

# Optional
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SCRAPE_CREATORS_API_KEY=your_api_key
```

### 3. Add GA4 Service Account
Place your GA4 service account JSON file at:
```
backend/ga4-service-account.json
```

### 4. Deploy
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📦 Individual Service Deployment

### Backend Only
```bash
cd backend
docker build -t youtube-analytics-backend .
docker run -p 8000:8000 \
  -e BASE_URL=https://yourdomain.com \
  -e GA4_PROPERTY_ID=your_property_id \
  -v $(pwd)/ga4-service-account.json:/app/ga4-service-account.json:ro \
  youtube-analytics-backend
```

### Frontend Only
```bash
cd frontend
docker build -t youtube-analytics-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://yourdomain.com \
  youtube-analytics-frontend
```

## 🌐 Production Deployment

### Option 1: Single Server
```bash
# Set production environment
export BASE_URL=https://yourdomain.com
export NEXT_PUBLIC_API_URL=https://yourdomain.com

# Deploy with production settings
docker-compose -f docker-compose.yml up -d
```

### Option 2: Separate Servers

#### Backend Server
```bash
cd backend
docker build -t youtube-analytics-backend .
docker run -d \
  --name youtube-backend \
  -p 8000:8000 \
  --restart unless-stopped \
  -e BASE_URL=https://api.yourdomain.com \
  -v /path/to/ga4-service-account.json:/app/ga4-service-account.json:ro \
  youtube-analytics-backend
```

#### Frontend Server
```bash
cd frontend
docker build -t youtube-analytics-frontend .
docker run -d \
  --name youtube-frontend \
  -p 3000:3000 \
  --restart unless-stopped \
  -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com \
  youtube-analytics-frontend
```

## 🔧 Configuration Options

### Environment Variables

#### Backend
- `BASE_URL`: Your backend domain (for UTM links)
- `DATABASE_URL`: Database connection string
- `GA4_PROPERTY_ID`: Google Analytics 4 property ID
- `SUPABASE_URL`: Supabase project URL (optional)
- `SUPABASE_KEY`: Supabase anon key (optional)
- `YOUTUBE_API_KEY`: YouTube Data API key
- `SCRAPE_CREATORS_API_KEY`: ScrapeCreators API key

#### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NODE_ENV`: Environment (production/development)

### Volume Mounts
- `./backend/ga4-service-account.json:/app/ga4-service-account.json:ro`
- `backend_data:/app/data` (for persistent data)

## 🔍 Health Checks

Both services include health checks:
- **Backend**: `GET /health`
- **Frontend**: `GET /` (homepage)

Check service health:
```bash
# All services
docker-compose ps

# Individual service logs
docker-compose logs backend
docker-compose logs frontend
```

## 🚀 Cloud Deployment Examples

### AWS ECS/Fargate
1. Push images to ECR
2. Create ECS task definitions
3. Deploy services with load balancer

### Google Cloud Run
```bash
# Build and push
docker build -t gcr.io/PROJECT_ID/youtube-backend ./backend
docker push gcr.io/PROJECT_ID/youtube-backend

# Deploy
gcloud run deploy youtube-backend \
  --image gcr.io/PROJECT_ID/youtube-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### DigitalOcean App Platform
Use the included `render.yaml` as reference for app platform configuration.

## 🔒 Security Notes

1. **Never commit sensitive files**:
   - `ga4-service-account.json`
   - `.env` files with real credentials

2. **Use environment variables** for all secrets

3. **Enable HTTPS** in production

4. **Restrict database access** to application only

## 🛠️ Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Common fixes
- Verify GA4 service account file exists
- Check environment variables
- Ensure port 8000 is available
```

#### Frontend can't connect to backend
```bash
# Check network connectivity
docker-compose exec frontend curl http://backend:8000/health

# Verify environment variables
docker-compose exec frontend env | grep NEXT_PUBLIC_API_URL
```

#### Database issues
```bash
# Reset database (development only)
docker-compose down -v
docker-compose up -d
```

## 📊 Monitoring

### View real-time logs
```bash
docker-compose logs -f --tail=100
```

### Resource usage
```bash
docker stats
```

### Service status
```bash
docker-compose ps
```
