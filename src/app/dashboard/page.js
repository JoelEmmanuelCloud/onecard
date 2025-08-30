'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Linkedin,
  Twitter,
  Instagram
} from 'lucide-react'
import { supabase, getCurrentUser, getProfile, updateProfile } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/activate')
        return
      }

      setUser(currentUser)
      const { data: profileData } = await getProfile(currentUser.id)
      if (profileData) {
        setProfile(profileData)
        setEditData(profileData)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
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
    } catch (error) {
      console.error('Error updating profile:', error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center section-padding">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">Please complete your card activation first.</p>
          <button
            onClick={() => router.push('/activate')}
            className="btn-primary"
          >
            Activate Card
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-max section-padding py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
              <p className="text-gray-600">Manage your smart contact card</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/profile/${profile.username}`)}
                className="btn-secondary flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              <button
                onClick={() => setEditMode(!editMode)}
                className="btn-primary flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max section-padding py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-primary mb-4">Profile Preview</h2>
              
              {/* Mock Phone */}
              <div className="mx-auto w-48 h-96 bg-black rounded-3xl p-2 shadow-xl">
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-br from-accent to-blue-600 text-white p-4 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <User className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-sm">{profile.full_name}</h3>
                    <p className="text-blue-100 text-xs">{profile.job_title}</p>
                    {profile.company && (
                      <p className="text-blue-200 text-xs">{profile.company}</p>
                    )}
                  </div>
                  
                  {/* Contact Buttons */}
                  <div className="p-3 space-y-2">
                    {profile.phone && (
                      <div className="bg-accent/10 text-accent text-xs py-2 px-3 rounded-lg text-center">
                        📞 Call
                      </div>
                    )}
                    {profile.email && (
                      <div className="bg-accent/10 text-accent text-xs py-2 px-3 rounded-lg text-center">
                        ✉️ Email
                      </div>
                    )}
                    <div className="bg-accent/10 text-accent text-xs py-2 px-3 rounded-lg text-center">
                      💾 Save Contact
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={generateVCF}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download VCF
                </button>
                
                <button className="w-full btn-secondary flex items-center justify-center">
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </button>
                
                <button className="w-full btn-secondary flex items-center justify-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Form */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-primary mb-6">Profile Information</h2>
              
              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editData.full_name || ''}
                        onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={editData.company || ''}
                        onChange={(e) => setEditData({...editData, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={editData.website_url || ''}
                        onChange={(e) => setEditData({...editData, website_url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
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
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{profile.full_name || 'Not set'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile.email || 'Not set'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{profile.phone || 'Not set'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <p className="font-medium">{profile.website_url || 'Not set'}</p>
                      </div>
                    </div>
                  </div>

                  {profile.bio && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Bio</p>
                      <p className="text-gray-700">{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <BarChart3 className="w-8 h-8 text-accent mx-auto mb-3" />
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Profile Views</p>
              </div>
              
              <div className="card p-6 text-center">
                <Share2 className="w-8 h-8 text-accent mx-auto mb-3" />
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Shares Today</p>
              </div>
              
              <div className="card p-6 text-center">
                <Download className="w-8 h-8 text-accent mx-auto mb-3" />
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Contact Saves</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}