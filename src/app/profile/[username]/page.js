'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  User, 
  Phone, 
  Mail, 
  Globe, 
  Download,
  MapPin,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  ExternalLink
} from 'lucide-react'
import { getProfileByUsername, supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const params = useParams()
  const { username } = params
  
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
    trackView()
  }, [username])

  const fetchProfile = async () => {
    try {
      const { data, error } = await getProfileByUsername(username)
      if (error) throw error
      
      if (!data) {
        setError('Profile not found')
        return
      }

      setProfile(data)
    } catch (err) {
      setError('Profile not found')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const trackView = async () => {
    // Track profile view for analytics
    try {
      await supabase
        .from('profile_views')
        .insert([{
          profile_id: profile?.id,
          viewer_ip: 'anonymous', // In production, get real IP
          device_type: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
        }])
    } catch (error) {
      // Silently fail for analytics
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

  const socialLinks = [
    { key: 'linkedin_url', icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-600' },
    { key: 'twitter_url', icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-500' },
    { key: 'instagram_url', icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-600' },
    { key: 'facebook_url', icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-700' },
    { key: 'youtube_url', icon: Youtube, label: 'YouTube', color: 'hover:bg-red-600' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center section-padding">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Profile Not Found</h1>
          <p className="text-gray-500">The profile you're looking for doesn't exist or has been deactivated.</p>
        </div>
      </div>
    )
  }

  const templateStyles = {
    minimal: 'from-white to-gray-50',
    modern: 'from-accent to-blue-600',
    classic: 'from-primary to-gray-800'
  }

  const isLightTemplate = profile.template_style === 'minimal'
  const textColor = isLightTemplate ? 'text-gray-900' : 'text-white'
  const subtextColor = isLightTemplate ? 'text-gray-600' : 'text-gray-200'

  return (
    <div className={`min-h-screen bg-gradient-to-br ${templateStyles[profile.template_style] || templateStyles.minimal}`}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
              isLightTemplate ? 'bg-gray-200' : 'bg-white/20'
            }`}>
              {profile.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt={profile.full_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className={`w-16 h-16 ${isLightTemplate ? 'text-gray-400' : 'text-white/60'}`} />
              )}
            </div>
          </motion.div>

          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-2"
          >
            <h1 className={`text-3xl font-bold ${textColor}`}>
              {profile.full_name}
            </h1>
            
            {profile.job_title && (
              <p className={`text-lg ${subtextColor}`}>
                {profile.job_title}
              </p>
            )}
            
            {profile.company && (
              <p className={`text-md ${subtextColor}`}>
                {profile.company}
              </p>
            )}

            {profile.bio && (
              <p className={`text-sm ${subtextColor} max-w-sm mx-auto leading-relaxed mt-4`}>
                {profile.bio}
              </p>
            )}
          </motion.div>

          {/* Contact Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-3 mt-8"
          >
            {/* Primary Actions */}
            <div className="grid grid-cols-1 gap-3">
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className={`flex items-center justify-center py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    isLightTemplate 
                      ? 'bg-accent text-white hover:bg-blue-600 shadow-lg hover:shadow-xl' 
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Call {profile.phone}
                </a>
              )}

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className={`flex items-center justify-center py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    isLightTemplate 
                      ? 'bg-gray-700 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl' 
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  <Mail className="w-5 h-5 mr-3" />
                  Email
                </a>
              )}

              <button
                onClick={generateVCF}
                className={`flex items-center justify-center py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                  isLightTemplate 
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl' 
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                <Download className="w-5 h-5 mr-3" />
                Save Contact
              </button>
            </div>
          </motion.div>

          {/* Website Link */}
          {profile.website_url && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center py-3 px-6 rounded-lg font-medium transition-colors ${
                  isLightTemplate 
                    ? 'text-accent hover:text-blue-600' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4 mr-2" />
                Visit Website
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </motion.div>
          )}

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="pt-6"
          >
            <div className="flex justify-center space-x-4">
              {socialLinks
                .filter(social => profile[social.key])
                .map((social) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.key}
                      href={profile[social.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                        isLightTemplate 
                          ? `bg-gray-100 text-gray-600 ${social.color.replace('hover:bg-', 'hover:bg-')} hover:text-white` 
                          : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                      }`}
                      title={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  )
                })}
            </div>
          </motion.div>

          {/* Powered By */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="pt-8"
          >
            <p className={`text-xs ${subtextColor}`}>
              Powered by{' '}
              <span className={isLightTemplate ? 'text-accent font-semibold' : 'text-white font-semibold'}>
                1necard
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}