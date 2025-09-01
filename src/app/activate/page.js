'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Check, Eye, ArrowRight } from 'lucide-react'

export default function MinimalActivatePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    company: '',
    bio: '',
    website: '',
    linkedin: '',
    template: 'minimal'
  })

  const templates = [
    { id: 'minimal', name: 'Minimal', description: 'Clean and simple' },
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

    // Simulate API call
    setTimeout(() => {
      setStep(2)
      setLoading(false)
    }, 1500)
  }

  const handleProfileCreation = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setStep(3)
      setLoading(false)
    }, 1500)
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600 font-medium">Get started with your smart contact card</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-800 mb-2 font-semibold">First Name</label>
            <input
              type="text"
              required
              value={profileData.firstName}
              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-white/80"
              placeholder="John"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-800 mb-2 font-semibold">Last Name</label>
            <input
              type="text"
              required
              value={profileData.lastName}
              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-white/80"
              placeholder="Smith"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-800 mb-2 font-semibold">Email Address</label>
          <input
            type="email"
            required
            value={authData.email}
            onChange={(e) => setAuthData({...authData, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-white/80"
            placeholder="john@company.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-800 mb-2 font-semibold">Password</label>
          <input
            type="password"
            required
            value={authData.password}
            onChange={(e) => setAuthData({...authData, password: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-white/80"
            placeholder="Create a secure password"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-800 mb-2 font-semibold">Confirm Password</label>
          <input
            type="password"
            required
            value={authData.confirmPassword}
            onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-white/80"
            placeholder="Confirm your password"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg font-medium">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSignUp}
          disabled={loading}
          className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 font-semibold flex items-center justify-center shadow-lg"
        >
          {loading ? 'Creating Account...' : (
            <>
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Complete Profile</h1>
        <p className="text-gray-600 font-medium">Add your professional details</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-800 mb-2 font-semibold">Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-white/80"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-800 mb-2 font-semibold">Job Title</label>
            <input
              type="text"
              value={profileData.jobTitle}
              onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-white/80"
              placeholder="Marketing Director"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-800 mb-2 font-semibold">Company</label>
          <input
            type="text"
            value={profileData.company}
            onChange={(e) => setProfileData({...profileData, company: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-white/80"
            placeholder="Tech Solutions Inc."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-800 mb-2 font-semibold">Bio</label>
          <textarea
            rows={3}
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium resize-none bg-white/80"
            placeholder="Brief description about yourself..."
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-gray-900 font-semibold">Links</h3>
          
          <div className="space-y-3">
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => setProfileData({...profileData, website: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-white/80"
              placeholder="Website URL"
            />
            
            <input
              type="url"
              value={profileData.linkedin}
              onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-white/80"
              placeholder="LinkedIn URL"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-800 mb-4 font-semibold">Template</label>
          <div className="grid grid-cols-3 gap-3">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setProfileData({...profileData, template: template.id})}
                className={`p-4 border rounded-lg cursor-pointer transition-all bg-white/60 backdrop-blur-sm ${
                  profileData.template === template.id
                    ? 'border-gray-900 bg-white/90 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-white/80'
                }`}
              >
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{template.name}</h4>
                <p className="text-xs text-gray-600 font-medium">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 border border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold bg-white/60"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleProfileCreation}
            disabled={loading}
            className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 font-semibold shadow-lg"
          >
            {loading ? 'Creating Profile...' : 'Complete Setup'}
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderStep3 = () => {
    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim()
    const profileUrl = fullName.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8"
      >
        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-white" />
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">Card Activated</h1>
          <p className="text-gray-600 font-medium mb-8">
            Your smart contact card is ready to share
          </p>
        </div>

        <div className="bg-white/95 border border-gray-100/80 rounded-lg p-6 backdrop-blur-sm shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Your Profile</h3>
          <p className="text-sm text-gray-700 font-medium break-all">
            1necard.com/{profileUrl}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => console.log('Go to dashboard')}
            className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold flex items-center justify-center shadow-lg"
          >
            <Eye className="w-4 h-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => console.log('Preview profile')}
            className="flex-1 border border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold flex items-center justify-center bg-white/60"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Shiny white overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/80 via-transparent to-white/60 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gray-100/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-2xl p-8 shadow-2xl ring-1 ring-gray-100/50">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-light ${
                    step >= i
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > i ? <Check className="w-4 h-4" /> : i}
                </div>
                {i < 3 && (
                  <div
                    className={`w-8 h-0.5 mx-3 rounded ${
                      step > i ? 'bg-gray-900' : 'bg-gray-200'
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