import React, { useState } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import Layout from '@/components/Layout/Layout';
import apiClient from '@/services/api';
import {
  GlobeAltIcon,
  ArrowUpIcon,
  ChartBarIcon,
  UsersIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface TrafficData {
  period_start: string;
  period_end: string;
  total_clicks: number;
  total_page_views: number;
  average_ctr: number;
  traffic_data: any[];
  top_sources: any[];
}

export default function TrafficPage() {
  const [showRawData, setShowRawData] = useState(false);
  const [timeRange, setTimeRange] = useState(30);

  // Fetch traffic data
  const { data: trafficData, isLoading, error } = useSWR<TrafficData>(
    `/api/v1/analytics/traffic/website?days=${timeRange}`,
    () => apiClient.getWebsiteTraffic({ days: timeRange })
  );

  // Mock traffic data for demonstration
  const mockTrafficSources = [
    { source: 'YouTube Channel', clicks: 156, percentage: 45.2 },
    { source: 'YouTube Videos', clicks: 89, percentage: 25.8 },
    { source: 'Google Search', clicks: 67, percentage: 19.4 },
    { source: 'Direct', clicks: 23, percentage: 6.7 },
    { source: 'Social Media', clicks: 10, percentage: 2.9 }
  ];

  const mockWeeklyData = [
    { week: 'Week 1', clicks: 45, views: 123 },
    { week: 'Week 2', clicks: 67, views: 189 },
    { week: 'Week 3', clicks: 89, views: 234 },
    { week: 'Week 4', clicks: 134, views: 298 }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-500 text-lg">Failed to load traffic data</div>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Website Traffic - YouTube Analytics</title>
        <meta name="description" content="Track website traffic from YouTube videos and channel" />
      </Head>

      <Layout>
        <div className="container-app section-padding space-y-6">
          {/* Important Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">
              ⚠️ Demo Data Only - Not for Real Analysis
            </h2>
            <p className="text-yellow-800 mb-4">
              <strong>All traffic data shown below is mock/placeholder data for demonstration purposes only.</strong>
              This data cannot be used for real business analysis or decision making.
            </p>
            <div className="text-sm text-yellow-700">
              <p>To get real website traffic data, you need to implement proper analytics tracking such as:</p>
              <p>• Google Analytics 4 • PostHog • Mixpanel • Custom tracking with UTM parameters</p>
            </div>
          </div>

          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Website Traffic
              </h1>
              <p className="text-gray-600 mt-1">
                Demo dashboard - implement real analytics for actual data
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRawData(!showRawData)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showRawData 
                    ? 'bg-purple-50 border-purple-200 text-purple-700' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChartBarIcon className="h-4 w-4 inline mr-2" />
                Raw Data
              </button>
              
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>

          {/* Traffic Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {trafficData?.total_clicks || 345}
                  </p>
                </div>
                <ArrowUpIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  Last {timeRange} days (mock data)
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {trafficData?.total_page_views || 844}
                  </p>
                </div>
                <EyeIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  Last {timeRange} days (mock data)
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Click-through Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {trafficData?.average_ctr?.toFixed(1) || '2.4'}%
                  </p>
                </div>
                <ArrowUpIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  Average CTR
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Source</p>
                  <p className="text-2xl font-bold text-gray-900">
                    YouTube
                  </p>
                </div>
                <GlobeAltIcon className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  {mockTrafficSources[0].percentage}% of traffic
                </span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading traffic data...</p>
            </div>
          )}

          {/* Raw Data View */}
          {showRawData && !isLoading && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Data</h3>
              <div className="overflow-x-auto">
                <pre className="text-xs text-gray-600 bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify({
                    api_data: trafficData,
                    mock_sources: mockTrafficSources,
                    mock_weekly: mockWeeklyData,
                    api_endpoint: `/api/v1/analytics/traffic/website?days=${timeRange}`
                  }, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Traffic Sources */}
          {!isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
                <div className="space-y-4">
                  {mockTrafficSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{source.clicks} clicks</div>
                        <div className="text-xs text-gray-500">{source.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trends</h3>
                <div className="space-y-4">
                  {mockWeeklyData.map((week, index) => (
                    <div key={week.week} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{week.week}</span>
                      <div className="flex space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">{week.clicks} clicks</div>
                          <div className="text-xs text-gray-500">clicks</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">{week.views} views</div>
                          <div className="text-xs text-gray-500">page views</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Setup Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              <GlobeAltIcon className="h-5 w-5 inline mr-2" />
              Real Website Traffic Tracking Setup
            </h3>
            <p className="text-blue-800 mb-4">
              <strong>Note:</strong> The traffic data shown above is mock data for demonstration. To track real website traffic from your YouTube content, implement these solutions:
            </p>
            <div className="space-y-3 text-sm text-blue-700">
              <div>
                <p><strong>1. Analytics Platforms:</strong></p>
                <p className="ml-4">• PostHog - Track user behavior and conversions</p>
                <p className="ml-4">• Google Analytics 4 - Set up YouTube as a traffic source</p>
                <p className="ml-4">• Mixpanel, Amplitude - Advanced user tracking</p>
              </div>
              <div>
                <p><strong>2. UTM Parameter Tracking:</strong></p>
                <p className="ml-4">• Add ?utm_source=youtube&utm_medium=video&utm_campaign=video_title to all your links</p>
                <p className="ml-4">• Use different UTM campaigns for each video to track performance</p>
              </div>
              <div>
                <p><strong>3. Short Link Services:</strong></p>
                <p className="ml-4">• Bit.ly, TinyURL with click tracking enabled</p>
                <p className="ml-4">• Custom domain short links (yoursite.com/yt-video1)</p>
              </div>
              <div>
                <p><strong>4. YouTube Studio Integration:</strong></p>
                <p className="ml-4">• Check "Traffic sources" → "External" for click data</p>
                <p className="ml-4">• Monitor "Cards and end screens" performance</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
