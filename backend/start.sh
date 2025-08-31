#!/bin/bash

# Render startup script for FastAPI backend

echo "Starting YouTube Analytics Backend..."

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Set environment variables for production
export ENVIRONMENT=production
export DEBUG=false

# Create database tables if they don't exist
echo "Initializing database..."
python3 -c "from app.core.database import create_tables; create_tables()"

# Run database migrations if needed
echo "Running database migrations..."
python3 -c "
import os
import sqlite3
from pathlib import Path

# Check if pretty_slug column exists, if not run migration
db_path = 'youtube_analytics.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if pretty_slug column exists
    cursor.execute('PRAGMA table_info(utm_links)')
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'pretty_slug' not in columns:
        print('Running pretty_slug migration...')
        exec(open('migrations/add_pretty_slug_to_utm_links.py').read())
    else:
        print('Database is up to date')
    
    conn.close()
else:
    print('Database will be created on first request')
"

# Start the FastAPI server
echo "Starting FastAPI server on port $PORT..."
exec python3 -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
