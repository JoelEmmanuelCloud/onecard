'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Edit3, 
  Eye, 
  BarChart3, 
  Settings, 
  Share2, 
  QrCode,
  Download,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  LogOut,
  CreditCard,
  Bell
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getProfile, updateProfile } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import ImageUpload from '@/components/ImageUpload'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

function DashboardContent() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // profile, analytics, settings
  const [editData, setEditData] = useState({})

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data: profileData, error } = await getProfile(user.id)
      if (error) throw error
      
      if (profileData) {
        setProfile(profileData)
        setEditData(profileData)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await updateProfile(user.id, editData)
      if (error) throw error

      setProfile(editData)
      setEditMode(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const generateVCF = () => {
    if (!profile) return

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.full_name || ''}
ORG:${profile.company || ''}
TITLE:${profile.job_title || ''}
TEL:${profile.phone || ''}
EMAIL:${profile.email || ''}
URL:${profile.website_url || ''}
NOTE:${profile.bio || ''}
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${profile.full_name || 'contact'}.vcf`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="hidden sm:flex items-center space-x-1 text-sm text-gray-500">
                <span>Welcome back,</span>
                <span className="font-medium text-gray-900">
                  {profile?.full_name || user?.email}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {profile?.username && (
                <a
                  href={`/profile/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Preview Profile</span>
                </a>
              )}
              
              <button
                onClick={signOut}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Contact Saves</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Profile Complete</span>
                    <span className="font-medium text-green-600">
                      {profile ? Math.round(
                        Object.values({
                          name: profile.full_name,
                          email: profile.email,
                          phone: profile.phone,
                          company: profile.company,
                          bio: profile.bio
                        }).filter(Boolean).length / 5 * 100
                      ) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                      <p className="text-gray-600 mt-1">Manage your contact card details</p>
                    </div>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {editMode ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  {/* Profile Image Upload */}
                  <div className="mb-8">
                    <ImageUpload
                      currentImage={profile?.profile_image_url}
                      onImageUpdate={(imageUrl) => {
                        setProfile({ ...profile, profile_image_url: imageUrl })
                        setEditData({ ...editData, profile_image_url: imageUrl })
                      }}
                      userId={user?.id}
                      size="large"
                    />
                  </div>

                  {editMode ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={editData.full_name || ''}
                            onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={editData.job_title || ''}
                            onChange={(e) => setEditData({...editData, job_title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            value={editData.company || ''}
                            onChange={(e) => setEditData({...editData, company: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={editData.phone || ''}
                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          rows={3}
                          value={editData.bio || ''}
                          onChange={(e) => setEditData({...editData, bio: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            value={editData.website_url || ''}
                            onChange={(e) => setEditData({...editData, website_url: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            LinkedIn
                          </label>
                          <input
                            type="url"
                            value={editData.linkedin_url || ''}
                            onChange={(e) => setEditData({...editData, linkedin_url: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            setEditMode(false)
                            setEditData(profile)
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {[
                        { icon: User, label: 'Full Name', value: profile?.full_name },
                        { icon: Mail, label: 'Email', value: profile?.email },
                        { icon: Phone, label: 'Phone', value: profile?.phone },
                        { icon: Globe, label: 'Website', value: profile?.website_url },
                      ].map((item, index) => {
                        const IconComponent = item.icon
                        return (
                          <div key={index} className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-500">{item.label}</p>
                              <p className="font-medium">{item.value || 'Not set'}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={generateVCF}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <Download className="w-5 h-5 text-gray-600 mr-2" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Download VCF</p>
                        <p className="text-xs text-gray-500">Save contact card</p>
                      </div>
                    </button>

                    <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      <QrCode className="w-5 h-5 text-gray-600 mr-2" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">QR Code</p>
                        <p className="text-xs text-gray-500">Generate & share</p>
                      </div>
                    </button>

                    <a
                      href="/pricing"
                      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Upgrade</p>
                        <p className="text-xs text-gray-500">Get premium features</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && profile && (
              <AnalyticsDashboard
                profileId={profile.id}
                userId={user?.id}
              />
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Account Settings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Address</h3>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                      <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700">
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h3 className="font-medium text-gray-900">Password</h3>
                        <p className="text-sm text-gray-600">Last updated 30 days ago</p>
                      </div>
                      <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700">
                        Update
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="font-medium text-gray-900">Profile URL</h3>
                        <p className="text-sm text-gray-600">
                          {profile?.username ? `1necard.com/${profile.username}` : 'Not set'}
                        </p>
                      </div>
                      <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700">
                        Customize
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Profile Views', description: 'Get notified when someone views your profile' },
                      { name: 'Weekly Reports', description: 'Receive weekly analytics summaries' },
                      { name: 'Product Updates', description: 'Stay informed about new features' }
                    ].map((notification, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                        <div>
                          <h3 className="font-medium text-gray-900">{notification.name}</h3>
                          <p className="text-sm text-gray-600">{notification.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                  <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-red-200">
                      <div>
                        <h3 className="font-medium text-gray-900">Deactivate Account</h3>
                        <p className="text-sm text-gray-600">Temporarily disable your profile</p>
                      </div>
                      <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded">
                        Deactivate
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="font-medium text-gray-900">Delete Account</h3>
                        <p className="text-sm text-gray-600">Permanently delete your account and data</p>
                      </div>
                      <button className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}