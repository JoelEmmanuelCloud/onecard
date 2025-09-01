'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Check, Eye, ArrowRight, ArrowLeft } from 'lucide-react'

// Minimal Auth Header Component
function AuthHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="text-2xl font-semibold tracking-wide text-black">
            1necard
          </a>

          {/* Back to Home Link */}
          <a
            href="/"
            className="flex items-center space-x-2 text-black/80 hover:text-black transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    </header>
  )
}

export default function activatePage() {
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
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-medium text-black mb-2">Create Account</h1>
        <p className="text-gray-900 text-sm sm:text-base">Get started with your smart contact card</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-black mb-2 font-medium">First Name</label>
            <input
              type="text"
              required
              value={profileData.firstName}
              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
              className="w-full px-4 py-4 text-base border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
              placeholder="John"
            />
          </div>

          <div>
            <label className="block text-sm text-black mb-2 font-medium">Last Name</label>
            <input
              type="text"
              required
              value={profileData.lastName}
              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
              className="w-full px-4 py-4 text-base border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
              placeholder="Smith"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-black mb-2 font-medium">Email Address</label>
          <input
            type="email"
            required
            value={authData.email}
            onChange={(e) => setAuthData({...authData, email: e.target.value})}
            className="w-full px-4 py-4 text-base border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            placeholder="john@company.com"
          />
        </div>

        <div>
          <label className="block text-sm text-black mb-2 font-medium">Password</label>
          <input
            type="password"
            required
            value={authData.password}
            onChange={(e) => setAuthData({...authData, password: e.target.value})}
            className="w-full px-4 py-4 text-base border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            placeholder="Create a secure password"
          />
        </div>

        <div>
          <label className="block text-sm text-black mb-2 font-medium">Confirm Password</label>
          <input
            type="password"
            required
            value={authData.confirmPassword}
            onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
            className="w-full px-4 py-4 text-base border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            placeholder="Confirm your password"
          />
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSignUp}
          disabled={loading}
          className="w-full bg-black text-white px-6 py-4 text-base font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center min-h-[48px]"
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
      className="space-y-6"
    >
      <div className="text-center">
        <User className="w-10 h-10 sm:w-12 sm:h-12 text-black mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl font-medium text-black mb-2">Complete Profile</h1>
        <p className="text-gray-900 text-sm sm:text-base">Add your professional details</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-black mb-2 font-medium">Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="w-full px-4 py-4 text-base border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm text-black mb-2 font-medium">Job Title</label>
            <input
              type="text"
              value={profileData.jobTitle}
              onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
              className="w-full px-4 py-4 text-base border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
              placeholder="Marketing Director"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-black mb-2 font-medium">Company</label>
          <input
            type="text"
            value={profileData.company}
            onChange={(e) => setProfileData({...profileData, company: e.target.value})}
            className="w-full px-4 py-4 text-base border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            placeholder="Tech Solutions Inc."
          />
        </div>

        <div>
          <label className="block text-sm text-black mb-2 font-medium">Bio</label>
          <textarea
            rows={3}
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            className="w-full px-4 py-4 text-base border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white resize-none"
            placeholder="Brief description about yourself..."
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-black font-medium text-sm">Links</h3>
          
          <div className="space-y-3">
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => setProfileData({...profileData, website: e.target.value})}
              className="w-full px-4 py-4 text-base border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
              placeholder="Website URL"
            />
            
            <input
              type="url"
              value={profileData.linkedin}
              onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
              className="w-full px-4 py-4 text-base border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
              placeholder="LinkedIn URL"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-black mb-3 font-medium">Template</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setProfileData({...profileData, template: template.id})}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all bg-white min-h-[72px] flex flex-col justify-center ${
                  profileData.template === template.id
                    ? 'border-black ring-2 ring-black ring-opacity-20'
                    : 'border-gray-300 hover:border-black hover:bg-gray-50'
                }`}
              >
                <h4 className="font-medium text-black mb-1 text-sm">{template.name}</h4>
                <p className="text-xs text-gray-900">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="sm:flex-1 order-2 sm:order-1 border-2 border-black text-black px-6 py-4 text-base font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 bg-white min-h-[48px]"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleProfileCreation}
            disabled={loading}
            className="sm:flex-1 order-1 sm:order-2 bg-black text-white px-6 py-4 text-base font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 min-h-[48px]"
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
        className="text-center space-y-6"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-full flex items-center justify-center mx-auto">
          <Check className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-black mb-4">Card Activated</h1>
          <p className="text-gray-900 mb-6 text-sm sm:text-base">
            Your smart contact card is ready to share
          </p>
        </div>

        <div className="bg-white border-2 border-black rounded-lg p-4 sm:p-6">
          <h3 className="font-medium text-black mb-2 text-sm sm:text-base">Your Profile</h3>
          <p className="text-sm text-gray-900 break-all font-mono">
            1necard.com/{profileUrl}
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => console.log('Go to dashboard')}
            className="w-full bg-black text-white px-6 py-4 text-base font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center min-h-[48px]"
          >
            <Eye className="w-4 h-4 mr-2" />
            Go to Dashboard
          </button>
          <button
            onClick={() => console.log('Preview profile')}
            className="w-full border-2 border-black text-black px-6 py-4 text-base font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center bg-white min-h-[48px]"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Profile
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <AuthHeader />
      <div className="min-h-screen bg-white flex items-start sm:items-center justify-center px-4 py-24 sm:py-12">
        <div className="max-w-md w-full">
          <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8 sm:mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= i
                        ? 'bg-black text-white'
                        : 'bg-white border-2 border-black text-black'
                    }`}
                  >
                    {step > i ? <Check className="w-4 h-4" /> : i}
                  </div>
                  {i < 3 && (
                    <div
                      className={`w-6 sm:w-8 h-0.5 mx-2 sm:mx-3 rounded ${
                        step > i ? 'bg-black' : 'bg-gray-300'
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
    </>
  )
}