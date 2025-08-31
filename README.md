# YouTube Analytics Tracking System

A comprehensive YouTube analytics tracking system built with FastAPI backend and modern web frontend.

## Project Overview

This system tracks YouTube analytics data for the channel [@SaminYasar_](https://www.youtube.com/@SaminYasar_) with the following features:

### Core Metrics Tracked:
- **Channel-level metrics:** Total views, subscriber count, week-over-week growth
- **Video-level metrics:** Individual video performance, growth rates, trending analysis
- **External traffic:** Website click-through tracking and conversion metrics

### Data Sources:
- **YouTube Data API v3** with Google OAuth 2.0 authentication
- **ScrapeCreators API** for additional data scraping

## Project Structure

```
SalesTrack/
├── backend/                 # FastAPI REST API server
│   ├── app/
│   │   ├── api/            # API routes and endpoints
│   │   ├── core/           # Core configuration and settings
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic and external API integrations
│   │   └── main.py         # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   └── .env.example       # Environment variables template
├── frontend/               # Web interface
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client services
│   │   └── styles/         # CSS and styling
│   ├── package.json        # Node.js dependencies
│   └── public/             # Static assets
└── README.md              # This file
```

## Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Google OAuth and YouTube API credentials
python run.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

📖 **For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Key Features

- **Real-time Analytics:** Track YouTube metrics with automated data collection
- **Growth Analysis:** Week-over-week growth calculations and trend analysis
- **OAuth Integration:** Secure Google authentication for YouTube data access
- **RESTful API:** Well-documented endpoints for external integrations
- **Responsive Design:** Clean, Gumroad-inspired interface for all devices

## Environment Variables

See `.env.example` files in both backend and frontend directories for required configuration.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is private and proprietary.
