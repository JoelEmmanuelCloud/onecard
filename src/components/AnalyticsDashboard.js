'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Eye, 
  Users, 
  MapPin, 
  Smartphone, 
  Monitor, 
  TrendingUp,
  Download,
  Calendar,
  Clock,
  Share2,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  Linkedin,
  Twitter,
  Instagram
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts'
import { supabase } from '@/lib/supabase'

export default function AnalyticsDashboard({ profileId, userId }) {
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    contactSaves: 0,
    socialClicks: 0
  })
  const [viewsData, setViewsData] = useState([])
  const [deviceData, setDeviceData] = useState([])
  const [locationData, setLocationData] = useState([])
  const [timeRange, setTimeRange] = useState('7d') // 24h, 7d, 30d, 90d
  const [loading, setLoading] = useState(true)
  const [comparisonData, setComparisonData] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [profileId, timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      
      switch (timeRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24)
          break
        case '7d':
          startDate.setDate(startDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(startDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(startDate.getDate() - 90)
          break
      }

      // Fetch profile views
      const { data: views, error: viewsError } = await supabase
        .from('profile_views')
        .select('*')
        .eq('profile_id', profileId)
        .gte('viewed_at', startDate.toISOString())
        .lte('viewed_at', endDate.toISOString())
        .order('viewed_at', { ascending: true })

      if (viewsError) throw viewsError

      // Fetch comparison data (previous period)
      const comparisonStartDate = new Date(startDate)
      comparisonStartDate.setTime(comparisonStartDate.getTime() - (endDate.getTime() - startDate.getTime()))
      
      const { data: comparisonViews } = await supabase
        .from('profile_views')
        .select('*')
        .eq('profile_id', profileId)
        .gte('viewed_at', comparisonStartDate.toISOString())
        .lt('viewed_at', startDate.toISOString())

      // Process analytics data
      const processedData = processAnalyticsData(views || [])
      const comparisonProcessed = processAnalyticsData(comparisonViews || [])
      
      setAnalytics(processedData.summary)
      setViewsData(processedData.viewsOverTime)
      setDeviceData(processedData.deviceBreakdown)
      setLocationData(processedData.locationBreakdown)
      setComparisonData(comparisonProcessed.summary)

    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const processAnalyticsData = (views) => {
    // Calculate summary metrics
    const totalViews = views.length
    const uniqueVisitors = new Set(views.map(v => v.viewer_ip)).size
    const contactSaves = views.filter(v => v.action_type === 'contact_save').length
    const socialClicks = views.filter(v => v.action_type === 'social_click').length

    // Process views over time
    const viewsByDate = views.reduce((acc, view) => {
      const date = new Date(view.viewed_at)
      const dateKey = timeRange === '24h' 
        ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, views: 0, uniqueViews: new Set() }
      }
      acc[dateKey].views += 1
      acc[dateKey].uniqueViews.add(view.viewer_ip)
      return acc
    }, {})

    const viewsOverTime = Object.values(viewsByDate).map(item => ({
      date: item.date,
      views: item.views,
      uniqueViews: item.uniqueViews.size
    }))

    // Process device breakdown
    const deviceBreakdown = views.reduce((acc, view) => {
      const deviceType = view.device_type || 'Unknown'
      const existing = acc.find(d => d.name === deviceType)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: deviceType, value: 1, color: getDeviceColor(deviceType) })
      }
      return acc
    }, [])

    // Process location breakdown
    const locationBreakdown = views.reduce((acc, view) => {
      const location = view.viewer_location || 'Unknown'
      const existing = acc.find(l => l.name === location)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: location, value: 1 })
      }
      return acc
    }, []).slice(0, 10) // Top 10 locations

    return {
      summary: { totalViews, uniqueVisitors, contactSaves, socialClicks },
      viewsOverTime,
      deviceBreakdown,
      locationBreakdown
    }
  }

  const getDeviceColor = (deviceType) => {
    const colors = {
      'mobile': '#1E90FF',
      'desktop': '#32CD32',
      'tablet': '#FF6347',
      'unknown': '#9CA3AF'
    }
    return colors[deviceType.toLowerCase()] || colors.unknown
  }

  const calculateGrowthPercentage = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const exportAnalytics = () => {
    const data = {
      summary: analytics,
      timeRange,
      exportedAt: new Date().toISOString(),
      views: viewsData,
      devices: deviceData,
      locations: locationData,
      comparison: comparisonData
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics_${timeRange}_${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const COLORS = ['#1E90FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">Profile Analytics</h2>
          <p className="text-gray-600">Track how people interact with your profile</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* Time Range Selector */}
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            {[
              { key: '24h', label: '24h' },
              { key: '7d', label: '7d' },
              { key: '30d', label: '30d' },
              { key: '90d', label: '90d' }
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeRange === range.key
                    ? 'bg-accent text-white'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={exportAnalytics}
            className="btn-secondary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Views</p>
              <p className="text-2xl font-bold text-primary">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-accent" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            {comparisonData && (
              <>
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  calculateGrowthPercentage(analytics.totalViews, comparisonData.totalViews) >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`} />
                <span className={`font-medium ${
                  calculateGrowthPercentage(analytics.totalViews, comparisonData.totalViews) >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {calculateGrowthPercentage(analytics.totalViews, comparisonData.totalViews) >= 0 ? '+' : ''}
                  {calculateGrowthPercentage(analytics.totalViews, comparisonData.totalViews)}%
                </span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Unique Visitors</p>
              <p className="text-2xl font-bold text-primary">{analytics.uniqueVisitors.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            {comparisonData && (
              <>
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  calculateGrowthPercentage(analytics.uniqueVisitors, comparisonData.uniqueVisitors) >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`} />
                <span className={`font-medium ${
                  calculateGrowthPercentage(analytics.uniqueVisitors, comparisonData.uniqueVisitors) >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {calculateGrowthPercentage(analytics.uniqueVisitors, comparisonData.uniqueVisitors) >= 0 ? '+' : ''}
                  {calculateGrowthPercentage(analytics.uniqueVisitors, comparisonData.uniqueVisitors)}%
                </span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Contact Saves</p>
              <p className="text-2xl font-bold text-primary">{analytics.contactSaves.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            {comparisonData && (
              <>
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  calculateGrowthPercentage(analytics.contactSaves, comparisonData.contactSaves) >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`} />
                <span className={`font-medium ${
                  calculateGrowthPercentage(analytics.contactSaves, comparisonData.contactSaves) >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {calculateGrowthPercentage(analytics.contactSaves, comparisonData.contactSaves) >= 0 ? '+' : ''}
                  {calculateGrowthPercentage(analytics.contactSaves, comparisonData.contactSaves)}%
                </span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Social Clicks</p>
              <p className="text-2xl font-bold text-primary">{analytics.socialClicks.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Share2 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            {comparisonData && (
              <>
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  calculateGrowthPercentage(analytics.socialClicks, comparisonData.socialClicks) >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`} />
                <span className={`font-medium ${
                  calculateGrowthPercentage(analytics.socialClicks, comparisonData.socialClicks) >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {calculateGrowthPercentage(analytics.socialClicks, comparisonData.socialClicks) >= 0 ? '+' : ''}
                  {calculateGrowthPercentage(analytics.socialClicks, comparisonData.socialClicks)}%
                </span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">Views Over Time</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Last {timeRange}</span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1E90FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#1E90FF" 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="uniqueViews" 
                  stroke="#32CD32" 
                  fillOpacity={0.1} 
                  fill="#32CD32" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
              <span>Total Views</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Unique Views</span>
            </div>
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">Device Types</h3>
            <Smartphone className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            {deviceData.map((device, index) => (
              <div key={device.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: device.color || COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="capitalize">{device.name.toLowerCase()}</span>
                </div>
                <span className="font-medium">{device.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Location and Actions Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">Top Locations</h3>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {locationData.map((location, index) => (
              <div key={location.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-accent/10 rounded text-accent text-xs flex items-center justify-center font-medium mr-3">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{location.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 h-2 bg-gray-200 rounded-full mr-3">
                    <div 
                      className="h-full bg-accent rounded-full"
                      style={{ 
                        width: `${(location.value / Math.max(...locationData.map(l => l.value))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8">
                    {location.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">User Actions</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium">Profile Views</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{analytics.totalViews}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Download className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium">Contact Saves</span>
              </div>
              <span className="text-lg font-bold text-green-600">{analytics.contactSaves}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <Share2 className="w-5 h-5 text-purple-600 mr-3" />
                <span className="font-medium">Social Clicks</span>
              </div>
              <span className="text-lg font-bold text-purple-600">{analytics.socialClicks}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-orange-600 mr-3" />
                <span className="font-medium">Unique Visitors</span>
              </div>
              <span className="text-lg font-bold text-orange-600">{analytics.uniqueVisitors}</span>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Contact Save Rate</p>
              <p className="text-2xl font-bold text-primary">
                {analytics.totalViews > 0 
                  ? Math.round((analytics.contactSaves / analytics.totalViews) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-gray-500">of visitors save your contact</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-primary mb-6">Recent Activity</h3>
        
        <div className="space-y-4">
          {/* This would be populated with real recent activity data */}
          {[
            { action: 'Profile viewed', location: 'San Francisco, CA', time: '2 minutes ago', device: 'Mobile', icon: Eye },
            { action: 'Contact saved', location: 'New York, NY', time: '15 minutes ago', device: 'Desktop', icon: Download },
            { action: 'LinkedIn clicked', location: 'London, UK', time: '1 hour ago', device: 'Mobile', icon: Linkedin },
            { action: 'Profile viewed', location: 'Toronto, CA', time: '2 hours ago', device: 'Tablet', icon: Eye },
            { action: 'Website clicked', location: 'Berlin, DE', time: '3 hours ago', device: 'Desktop', icon: Globe }
          ].map((activity, index) => {
            const IconComponent = activity.icon
            return (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.location} • {activity.device}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            )
          })}
        </div>

        {viewsData.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No data yet</h4>
            <p className="text-gray-500">Share your profile to start seeing analytics data here.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}