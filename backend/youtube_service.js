#!/usr/bin/env node

/**
 * YouTube Data Service using youtubei.js
 * This service fetches comprehensive YouTube data without requiring OAuth
 */

const { Innertube } = require('youtubei.js');

class YouTubeDataService {
    constructor() {
        this.youtube = null;
    }

    async initialize() {
        if (!this.youtube) {
            this.youtube = await Innertube.create();
        }
        return this.youtube;
    }

    async getChannelData(channelIdentifier) {
        try {
            await this.initialize();

            // Try to get channel by identifier (handle or ID)
            const channel = await this.youtube.getChannel(channelIdentifier);

            if (!channel) {
                throw new Error(`Channel not found: ${channelIdentifier}`);
            }

            console.log('Channel object structure:', JSON.stringify(channel, null, 2));

            // Get basic channel info with safe property access
            const channelInfo = {
                channel_id: channel.header?.id || channel.id || 'unknown',
                channel_name: channel.header?.title?.text || channel.title?.text || 'Unknown Channel',
                channel_handle: channelIdentifier,
                channel_description: channel.header?.description?.text || channel.description?.text || '',
                subscriber_count: this.parseSubscriberCount(channel.header?.subscriber_count?.text || channel.subscriber_count?.text),
                video_count: channel.videos_count || channel.header?.videos_count || 0,
                view_count: 0, // Will be calculated from videos
                avatar_url: channel.header?.author?.thumbnails?.[0]?.url || channel.thumbnails?.[0]?.url,
                banner_url: channel.header?.banner?.thumbnails?.[0]?.url || channel.banner?.thumbnails?.[0]?.url,
                is_verified: channel.header?.is_verified || channel.is_verified || false,
                country: channel.header?.country?.text || channel.country?.text,
                joined_date: channel.header?.joined_date?.text || channel.joined_date?.text,
                custom_url: channel.header?.custom_url || channel.custom_url
            };

            return channelInfo;
        } catch (error) {
            console.error('Error fetching channel data:', error);
            throw error;
        }
    }

    async getChannelVideos(channelHandle, limit = 50) {
        try {
            await this.initialize();
            
            const channel = await this.youtube.getChannel(channelHandle);
            if (!channel) {
                throw new Error(`Channel not found: ${channelHandle}`);
            }

            // Get channel videos
            const videos = await channel.getVideos();
            const videoList = [];
            let totalViews = 0;

            for (let i = 0; i < Math.min(limit, videos.videos.length); i++) {
                const video = videos.videos[i];
                
                const videoData = {
                    video_id: video.id,
                    title: video.title.text,
                    description: video.description?.text || '',
                    published_at: video.published.text,
                    duration: video.duration?.text,
                    view_count: this.parseViewCount(video.view_count?.text),
                    like_count: 0, // Not available in basic video list
                    comment_count: 0, // Not available in basic video list
                    thumbnail_url: video.thumbnails?.[0]?.url,
                    is_live: video.is_live || false,
                    is_upcoming: video.is_upcoming || false,
                    privacy_status: 'public' // Assume public if in channel listing
                };

                totalViews += videoData.view_count;
                videoList.push(videoData);
            }

            return {
                videos: videoList,
                total_views: totalViews,
                has_more: videos.has_continuation
            };
        } catch (error) {
            console.error('Error fetching channel videos:', error);
            throw error;
        }
    }

    async getVideoDetails(videoId) {
        try {
            await this.initialize();
            
            const video = await this.youtube.getInfo(videoId);
            
            if (!video) {
                throw new Error(`Video not found: ${videoId}`);
            }

            const videoData = {
                video_id: videoId,
                title: video.basic_info.title,
                description: video.basic_info.short_description,
                published_at: video.basic_info.upload_date,
                duration: video.basic_info.duration?.text,
                view_count: video.basic_info.view_count,
                like_count: video.basic_info.like_count || 0,
                comment_count: video.basic_info.comment_count || 0,
                thumbnail_url: video.basic_info.thumbnail?.[0]?.url,
                tags: video.basic_info.keywords || [],
                category: video.basic_info.category,
                is_live: video.basic_info.is_live || false,
                privacy_status: 'public'
            };

            return videoData;
        } catch (error) {
            console.error('Error fetching video details:', error);
            throw error;
        }
    }

    async searchChannel(query) {
        try {
            await this.initialize();
            
            const search = await this.youtube.search(query, { type: 'channel' });
            const channels = [];

            for (const result of search.results) {
                if (result.type === 'Channel') {
                    channels.push({
                        channel_id: result.id,
                        channel_name: result.title.text,
                        channel_handle: result.canonical_base_url?.split('/').pop(),
                        subscriber_count: this.parseSubscriberCount(result.subscriber_count?.text),
                        avatar_url: result.thumbnails?.[0]?.url,
                        is_verified: result.is_verified || false
                    });
                }
            }

            return channels;
        } catch (error) {
            console.error('Error searching channels:', error);
            throw error;
        }
    }

    parseSubscriberCount(subscriberText) {
        if (!subscriberText) return 0;
        
        const text = subscriberText.toLowerCase().replace(/[,\s]/g, '');
        
        if (text.includes('k')) {
            return Math.round(parseFloat(text.replace('k', '')) * 1000);
        } else if (text.includes('m')) {
            return Math.round(parseFloat(text.replace('m', '')) * 1000000);
        } else if (text.includes('subscribers')) {
            return parseInt(text.replace('subscribers', '')) || 0;
        }
        
        return parseInt(text) || 0;
    }

    parseViewCount(viewText) {
        if (!viewText) return 0;
        
        const text = viewText.toLowerCase().replace(/[,\s]/g, '');
        
        if (text.includes('k')) {
            return Math.round(parseFloat(text.replace('k', '')) * 1000);
        } else if (text.includes('m')) {
            return Math.round(parseFloat(text.replace('m', '')) * 1000000);
        } else if (text.includes('b')) {
            return Math.round(parseFloat(text.replace('b', '')) * 1000000000);
        } else if (text.includes('views')) {
            return parseInt(text.replace('views', '')) || 0;
        }
        
        return parseInt(text) || 0;
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const service = new YouTubeDataService();

    try {
        switch (command) {
            case 'channel':
                const channelHandle = args[1];
                if (!channelHandle) {
                    console.error('Usage: node youtube_service.js channel @channelhandle');
                    process.exit(1);
                }
                const channelData = await service.getChannelData(channelHandle);
                console.log(JSON.stringify(channelData, null, 2));
                break;

            case 'videos':
                const handle = args[1];
                const limit = parseInt(args[2]) || 20;
                if (!handle) {
                    console.error('Usage: node youtube_service.js videos @channelhandle [limit]');
                    process.exit(1);
                }
                const videosData = await service.getChannelVideos(handle, limit);
                console.log(JSON.stringify(videosData, null, 2));
                break;

            case 'video':
                const videoId = args[1];
                if (!videoId) {
                    console.error('Usage: node youtube_service.js video VIDEO_ID');
                    process.exit(1);
                }
                const videoData = await service.getVideoDetails(videoId);
                console.log(JSON.stringify(videoData, null, 2));
                break;

            case 'search':
                const query = args[1];
                if (!query) {
                    console.error('Usage: node youtube_service.js search "search query"');
                    process.exit(1);
                }
                const searchResults = await service.searchChannel(query);
                console.log(JSON.stringify(searchResults, null, 2));
                break;

            default:
                console.error('Available commands: channel, videos, video, search');
                console.error('Examples:');
                console.error('  node youtube_service.js channel @SaminYasar_');
                console.error('  node youtube_service.js videos @SaminYasar_ 10');
                console.error('  node youtube_service.js video dQw4w9WgXcQ');
                console.error('  node youtube_service.js search "Samin Yasar"');
                process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = YouTubeDataService;
