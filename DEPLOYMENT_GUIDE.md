# YouTube Analytics Dashboard - Render Deployment Guide

## 🚀 Quick Deployment Steps

### Prerequisites
- GitHub repository: `AI-Answer/youtube-analytics-dashboard`
- Render account with API key: `rnd_MOaHExNeduqpe6r11WnIwVOdcbsm`
- Required API keys and credentials

### Option 1: Blueprint Deployment (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect repository: `AI-Answer/youtube-analytics-dashboard`
4. Render will detect `render.yaml` and create both services automatically
5. Set environment variables when prompted

### Option 2: Manual Service Creation

#### Backend Service
- **Name**: `youtube-analytics-backend`
- **Repository**: `AI-Answer/youtube-analytics-dashboard`
- **Root Directory**: `backend`
- **Runtime**: Python 3.11
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `chmod +x start.sh && ./start.sh`
- **Plan**: Free

#### Frontend Service  
- **Name**: `youtube-analytics-frontend`
- **Repository**: `AI-Answer/youtube-analytics-dashboard`
- **Root Directory**: `frontend`
- **Runtime**: Node 18
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free

## 🔑 Environment Variables

### Backend Service
```
ENVIRONMENT=production
DATABASE_URL=sqlite:///youtube_analytics.db
CORS_ORIGINS=*
PYTHON_VERSION=3.11.0
SECRET_KEY=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=your-channel-id
SCRAPECREATORS_API_KEY=wHAmZcysPNY6yDhX0impv2Lv5dg1
```

### Frontend Service
```
NODE_ENV=production
NODE_VERSION=18.17.0
NEXT_PUBLIC_API_URL=https://youtube-analytics-backend.onrender.com
NEXT_TELEMETRY_DISABLED=1
```

## 🗄️ Database Configuration

The backend uses SQLite with a persistent disk:
- **Disk Name**: `youtube-analytics-data`
- **Mount Path**: `/opt/render/project/src/backend`
- **Size**: 1 GB

## 🌐 Expected URLs

After deployment:
- **Backend**: `https://youtube-analytics-backend.onrender.com`
- **Frontend**: `https://youtube-analytics-frontend.onrender.com`
- **API Docs**: `https://youtube-analytics-backend.onrender.com/docs`

## 🔗 Pretty URLs Testing

Test these endpoints after deployment:
- `https://youtube-analytics-backend.onrender.com/api/v1/go/bookedin-product`
- `https://youtube-analytics-backend.onrender.com/api/v1/utm-links`

## 🎯 Custom Domain Setup

1. Go to service settings in Render dashboard
2. Click "Custom Domains"
3. Add your domain (e.g., `analytics.yourdomain.com`)
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_API_URL` in frontend service

## ✅ Deployment Verification

1. Check service logs for any errors
2. Visit frontend URL to ensure it loads
3. Test UTM link creation and tracking
4. Verify pretty URL redirects work
5. Test click tracking functionality

## 🐛 Troubleshooting

### Common Issues
- **Build failures**: Check Python/Node versions
- **Database errors**: Verify persistent disk is mounted
- **CORS errors**: Check `CORS_ORIGINS` environment variable
- **API connection**: Verify `NEXT_PUBLIC_API_URL` is correct

### Logs
- Backend logs: `render logs -s youtube-analytics-backend`
- Frontend logs: `render logs -s youtube-analytics-frontend`
