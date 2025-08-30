'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, User, Briefcase, Link, Camera, Eye } from 'lucide-react'
import { signUp, createProfile, supabase } from '@/lib/supabase'

export default function ActivatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cardId = searchParams.get('card') // Get card ID from URL
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
    company: '',
    bio: '',
    website: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    template: 'minimal'
  })

  const templates = [
    { id: 'minimal', name: 'Minimal', description: 'Clean and simple design' },
    { id: 'modern', name: 'Modern', description: 'Bold and contemporary' },
    { id: 'classic', name: 'Classic', description: 'Professional and timeless' }
  ]

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (authData.password !== authData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const { data, error } = await signUp(authData.email, authData.password, {
      full_name: profileData.fullName
    })

    if (error) {
      setError(error.message)
    } else {
      setStep(2)
    }
    setLoading(false)
  }

  const handleProfileCreation = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not found')
      }

      // Generate username from name
      const username = profileData.fullName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20)

      const profile = {
        user_id: user.id,
        username: username,
        full_name: profileData.fullName,
        email: profileData.email || authData.email,
        phone: profileData.phone,
        job_title: profileData.jobTitle,
        company: profileData.company,
        bio: profileData.bio,
        website_url: profileData.website,
        linkedin_url: profileData.linkedin,
        twitter_url: profileData.twitter,
        instagram_url: profileData.instagram,
        template_style: profileData.template
      }

      const { data, error } = await createProfile(profile)
      
      if (error) {
        throw error
      }

      // Activate card if card ID is provided
      if (cardId) {
        await supabase
          .from('cards')
          .update({ 
            user_id: user.id, 
            is_activated: true, 
            activated_at: new Date().toISOString() 
          })
          .eq('card_id', cardId)
      }

      setStep(3)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <CreditCard className="w-16 h-16 text-accent mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">Create Your Account</h2>
        <p className="text-gray-600">Let's get started with your smart contact card</p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            required
            value={profileData.fullName}
            onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            value={authData.email}
            onChange={(e) => setAuthData({...authData, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="john@company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            required
            value={authData.password}
            onChange={(e) => setAuthData({...authData, password: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Create a secure password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={authData.confirmPassword}
            onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Confirm your password"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create Account & Continue'}
        </button>
      </form>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <User className="w-16 h-16 text-accent mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">Add your professional details and social links</p>
      </div>

      <form onSubmit={handleProfileCreation} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={profileData.jobTitle}
              onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Marketing Director"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          <input
            type="text"
            value={profileData.company}
            onChange={(e) => setProfileData({...profileData, company: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Tech Solutions Inc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            rows={3}
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Brief description about yourself..."
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Social Links</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => setProfileData({...profileData, website: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Website URL"
            />
            
            <input
              type="url"
              value={profileData.linkedin}
              onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="LinkedIn URL"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Choose Template
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setProfileData({...profileData, template: template.id})}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  profileData.template === template.id
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
              >
                <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 btn-secondary"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary disabled:opacity-50"
          >
            {loading ? 'Creating Profile...' : 'Complete Setup'}
          </button>
        </div>
      </form>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-primary mb-4">🎉 Card Activated!</h2>
        <p className="text-xl text-gray-600 mb-6">
          Your smart contact card is now ready to share
        </p>
      </div>

      <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
        <h3 className="font-semibold text-accent mb-2">Your Profile URL</h3>
        <p className="text-sm text-gray-600 break-all">
          1necard.com/{profileData.fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex-1 btn-primary"
        >
          <Eye className="w-5 h-5 mr-2" />
          Go to Dashboard
        </button>
        <button
          onClick={() => router.push(`/profile/${profileData.fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}`)}
          className="flex-1 btn-secondary"
        >
          <Eye className="w-5 h-5 mr-2" />
          Preview Profile
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-accent/5 flex items-center justify-center section-padding">
      <div className="max-w-md w-full">
        <div className="card p-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= i
                      ? 'bg-accent text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i}
                </div>
                {i < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 rounded ${
                      step > i ? 'bg-accent' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  )
}