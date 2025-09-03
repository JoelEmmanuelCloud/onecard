'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  AlertCircle,
  CheckCircle,
  Loader,
  ArrowRight
} from 'lucide-react'
import { signUp, signIn, resetPassword } from '@/lib/supabase'
import SocialAuth from '@/components/SocialAuth'

// Sign In Form Component
export function SignInForm({ onSuccess, switchToSignUp, switchToReset }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await signIn(formData.email, formData.password)
      
      if (error) {
        throw error
      }

      if (data.user) {
        onSuccess?.()
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Sign in to your account</p>
      </div>

      <SocialAuth 
        onSuccess={onSuccess} 
        onError={setError}
        redirectUrl="/dashboard" 
      />

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-red-700 break-words">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </>
          )}
        </button>

        {/* Links */}
        <div className="text-center space-y-3 sm:space-y-4">
          <button
            type="button"
            onClick={switchToReset}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            Forgot your password?
          </button>
          
          <div className="text-xs sm:text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={switchToSignUp}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Sign up
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

// Sign Up Form Component
export function SignUpForm({ onSuccess, switchToSignIn }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { generateUsername } = await import('@/lib/supabase')
      
      // Generate username
      const username = await generateUsername(formData.firstName, formData.lastName)
      
      const userData = {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: username
      }

      const { data, error } = await signUp(formData.email, formData.password, userData)
      
      if (error) {
        throw error
      }

      if (data.user) {
        onSuccess?.()
        // Check if email confirmation is required
        if (!data.session) {
          router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email))
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      console.error('Sign up error:', error)
      setError(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create account</h2>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Get started with your smart contact card</p>
      </div>

      <SocialAuth 
        onSuccess={onSuccess} 
        onError={setError}
        redirectUrl="/dashboard" 
      />

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              First name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
                placeholder="John"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Last name
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              placeholder="john@company.com"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              placeholder="Create a secure password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Confirm password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors duration-200"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-red-700 break-words">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </>
          )}
        </button>

        {/* Sign In Link */}
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={switchToSignIn}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Sign in
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

// Password Reset Form Component
export function PasswordResetForm({ onSuccess, switchToSignIn }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        throw error
      }

      setSuccess(true)
      onSuccess?.()
    } catch (error) {
      console.error('Password reset error:', error)
      setError(error.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md text-center mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Check your email</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base break-words px-2">
            We've sent a password reset link to <span className="font-medium">{email}</span>
          </p>
        </div>

        <button
          onClick={switchToSignIn}
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Reset password</h2>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
          Enter your email to receive a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-red-700 break-words">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            'Send reset link'
          )}
        </button>

        {/* Back to Sign In */}
        <div className="text-center">
          <button
            type="button"
            onClick={switchToSignIn}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            Back to sign in
          </button>
        </div>
      </form>
    </div>
  )
}