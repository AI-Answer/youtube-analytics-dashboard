#!/usr/bin/env python3
"""
Initialize channel data for the YouTube Analytics dashboard.
This script creates initial channel and metrics data so the dashboard can display information.
"""
import sys
import os
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.models.base import BaseModel
# Import all models to ensure relationships are properly resolved
from app.models.channel import Channel, ChannelMetrics
from app.models.video import Video
from app.models.traffic import WebsiteTraffic
from app.models.auth import OAuthToken

def init_channel_data():
    """Initialize channel data for @SaminYasar_"""

    # Create sync engine (SQLite doesn't need async for this script)
    database_url = settings.DATABASE_URL.replace("sqlite+aiosqlite://", "sqlite:///")
    engine = create_engine(database_url, echo=True)

    # Create tables
    BaseModel.metadata.create_all(engine)

    # Create session
    Session = sessionmaker(bind=engine)

    with Session() as session:
        # Check if channel already exists
        existing_channel = session.get(Channel, "UCzGcYErpBX4ldvv0l7MWLfw")
        
        if not existing_channel:
            # Create channel record
            channel = Channel(
                channel_id="UCzGcYErpBX4ldvv0l7MWLfw",
                channel_handle="@SaminYasar_",
                channel_name="SaminYasar_",
                channel_description="YouTube channel for SaminYasar_",
                subscriber_count=1250,  # Example data
                video_count=15,
                view_count=25000,
                is_active=True,
                last_updated=datetime.utcnow(),
                published_at=datetime(2020, 1, 1)  # Example date
            )
            session.add(channel)
            
            # Create some historical metrics
            base_date = datetime.utcnow() - timedelta(days=30)
            
            for i in range(30):
                date = base_date + timedelta(days=i)
                subscribers = 1200 + (i * 2)  # Growing by 2 subscribers per day
                views = 24000 + (i * 50)  # Growing by 50 views per day
                
                metrics = ChannelMetrics(
                    channel_id="UCzGcYErpBX4ldvv0l7MWLfw",
                    date=date,
                    subscriber_count=subscribers,
                    video_count=15,
                    view_count=views,
                    subscriber_growth=2 if i > 0 else 0,
                    subscriber_growth_rate=0.17 if i > 0 else 0.0,  # ~2/1200 * 100
                    view_growth=50 if i > 0 else 0,
                    view_growth_rate=0.21 if i > 0 else 0.0,  # ~50/24000 * 100
                    data_source="initialization"
                )
                session.add(metrics)
            
            session.commit()
            print("✅ Channel data initialized successfully!")
            print(f"📊 Channel: {channel.channel_name} ({channel.channel_handle})")
            print(f"👥 Subscribers: {channel.subscriber_count:,}")
            print(f"📹 Videos: {channel.video_count}")
            print(f"👀 Views: {channel.view_count:,}")
            print(f"📈 Historical data: 30 days of metrics created")
        else:
            print("ℹ️  Channel data already exists!")
            print(f"📊 Channel: {existing_channel.channel_name} ({existing_channel.channel_handle})")
            print(f"👥 Subscribers: {existing_channel.subscriber_count:,}")

    engine.dispose()

if __name__ == "__main__":
    init_channel_data()
