# YouTube Analytics Setup Guide

This guide will help you set up and run the YouTube Analytics tracking system.

## Prerequisites

- Python 3.8+ (for backend)
- Node.js 18+ (for frontend)
- Redis (for caching, optional)
- Google Cloud Console account (for YouTube API access)

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL=sqlite:///./youtube_analytics.db

# Google OAuth Configuration (Required)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# YouTube API Configuration (Required)
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=UCYourChannelIdHere
YOUTUBE_CHANNEL_HANDLE=@SaminYasar_

# ScrapeCreators API Configuration
SCRAPECREATORS_API_KEY=wHAmZcysPNY6yDhX0impv2Lv5dg1
SCRAPECREATORS_BASE_URL=https://api.scrapecreators.com

# JWT Configuration (Generate a secure key)
SECRET_KEY=your_super_secret_jwt_key_here_change_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379/0

# Other settings
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO
```

### 5. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3 and YouTube Analytics API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:8000/auth/google/callback`
5. Copy Client ID and Client Secret to your `.env` file

### 6. Get YouTube API Key

1. In Google Cloud Console, go to APIs & Services > Credentials
2. Create API Key
3. Restrict the key to YouTube Data API v3
4. Copy the API key to your `.env` file

### 7. Find Your YouTube Channel ID

1. Go to your YouTube channel
2. Click on your profile picture > Settings > Advanced settings
3. Copy your Channel ID to the `.env` file

### 8. Run the Backend Server
```bash
# Using the run script
python run.py

# Or directly with uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- Main API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit the `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=YouTube Analytics
NEXT_PUBLIC_YOUTUBE_CHANNEL_HANDLE=@SaminYasar_
NEXT_PUBLIC_YOUTUBE_CHANNEL_URL=https://www.youtube.com/@SaminYasar_
NODE_ENV=development
```

### 4. Run the Frontend Server
```bash
npm run dev
```

The frontend will be available at: http://localhost:3000

## Testing the Setup

### 1. Test Backend API
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test root endpoint
curl http://localhost:8000/
```

### 2. Test Authentication Flow
1. Open http://localhost:3000/auth
2. Click "Continue with Google"
3. Complete OAuth flow
4. You should be redirected back to the dashboard

### 3. Test Data Sync
1. After authentication, click "Sync" in the header
2. Check the API logs for data fetching activity

## Optional: Redis Setup

For better performance, install and run Redis:

### macOS (using Homebrew)
```bash
brew install redis
brew services start redis
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

### Windows
Download and install Redis from the official website or use Docker.

## Database Management

The application uses SQLite by default. For production, consider PostgreSQL:

```env
DATABASE_URL=postgresql://username:password@localhost/youtube_analytics
```

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt` again

2. **Google OAuth errors**
   - Check redirect URI matches exactly
   - Ensure APIs are enabled in Google Cloud Console
   - Verify client ID and secret are correct

3. **YouTube API quota exceeded**
   - YouTube API has daily quotas
   - Consider implementing caching
   - Use ScrapeCreators API as fallback

4. **CORS errors**
   - Check `BACKEND_CORS_ORIGINS` in backend config
   - Ensure frontend URL is included

5. **Database errors**
   - Check database URL format
   - Ensure database file permissions (for SQLite)

### Logs

Backend logs are available in the console where you run the server.
Frontend logs are in the browser console and terminal.

## Production Deployment

For production deployment:

1. **Backend:**
   - Use PostgreSQL instead of SQLite
   - Set `DEBUG=false`
   - Use a proper WSGI server like Gunicorn
   - Set up proper logging
   - Use environment variables for secrets

2. **Frontend:**
   - Run `npm run build`
   - Deploy to Vercel, Netlify, or similar
   - Update API URL to production backend

3. **Security:**
   - Use HTTPS
   - Set proper CORS origins
   - Use strong JWT secrets
   - Enable rate limiting

## API Documentation

Once the backend is running, visit:
- http://localhost:8000/docs for interactive Swagger documentation
- http://localhost:8000/redoc for ReDoc documentation
- See `backend/API_DOCUMENTATION.md` for detailed API reference

## Support

If you encounter issues:
1. Check the logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all required APIs are enabled in Google Cloud Console
4. Check that your YouTube channel is accessible and has analytics data
