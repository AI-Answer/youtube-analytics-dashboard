"""
UTM Link tracking models for video-driven traffic analytics.
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class UTMLink(Base):
    """UTM tracking links associated with YouTube videos."""
    __tablename__ = "utm_links"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String(255), nullable=False, index=True)  # No FK constraint to allow new videos
    destination_url = Column(Text, nullable=False)
    utm_source = Column(String(100), default="youtube", nullable=False)
    utm_medium = Column(String(100), default="video", nullable=False)
    utm_campaign = Column(String(255), nullable=False)  # Usually video_id
    utm_content = Column(String(255), nullable=True)  # Optional additional content
    utm_term = Column(String(255), nullable=True)  # Optional search terms
    
    # Generated tracking URL
    tracking_url = Column(Text, nullable=False)
    pretty_slug = Column(String(100), unique=True, nullable=True)  # Pretty URL slug

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_active = Column(Integer, default=1)  # 1 = active, 0 = inactive
    
    # Relationships
    # Note: No direct relationship to Video model to allow tracking new videos
    clicks = relationship("LinkClick", back_populates="utm_link", cascade="all, delete-orphan")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_utm_video_active', 'video_id', 'is_active'),
        Index('idx_utm_created', 'created_at'),
    )

    def __repr__(self):
        return f"<UTMLink(id={self.id}, video_id={self.video_id}, destination={self.destination_url[:50]}...)>"


class LinkClick(Base):
    """Individual click events for UTM tracking links."""
    __tablename__ = "link_clicks"

    id = Column(Integer, primary_key=True, index=True)
    utm_link_id = Column(Integer, ForeignKey("utm_links.id"), nullable=False, index=True)
    
    # Click metadata
    clicked_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    user_agent = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 compatible
    referrer = Column(Text, nullable=True)
    
    # Optional tracking data
    country = Column(String(2), nullable=True)  # ISO country code
    device_type = Column(String(50), nullable=True)  # mobile, desktop, tablet
    browser = Column(String(100), nullable=True)
    
    # Relationships
    utm_link = relationship("UTMLink", back_populates="clicks")
    
    # Indexes for analytics queries
    __table_args__ = (
        Index('idx_click_link_date', 'utm_link_id', 'clicked_at'),
        Index('idx_click_date', 'clicked_at'),
        Index('idx_click_country', 'country'),
    )

    def __repr__(self):
        return f"<LinkClick(id={self.id}, utm_link_id={self.utm_link_id}, clicked_at={self.clicked_at})>"
