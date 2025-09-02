'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  useEffect(() => {
    // Check if user is coming from email verification link
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      handleEmailVerification()
    }
  }, [])

  const handleEmailVerification = async () => {
    try {
      setLoading(true)
      
      // Get the session from the URL hash
      const { data, error } = await supabase.auth.getSession()
      
      if (error) throw error
      
      if (data.session) {
        setVerified(true)
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error) {
      console.error('Email verification error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async () => {
    if (!email) {
      setError('Email address not found')
      return
    }

    try {
      setLoading(true)
      setError('')

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) throw error

      // Show success message
      alert('Verification email sent! Please check your inbox.')
    } catch (error) {
      console.error('Resend error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Email Verified!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your email has been successfully verified. Redirecting to your dashboard...
          </p>

          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="text-2xl font-semibold tracking-wide text-black">
              1necard
            </a>
            <a href="/auth" className="text-black/80 hover:text-black transition-colors font-medium">
              Back to Sign In
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Check your email
          </h1>

          <p className="text-gray-600 mb-8">
            {email ? (
              <>
                We've sent a verification link to{' '}
                <span className="font-medium text-gray-900">{email}</span>
              </>
            ) : (
              'We\'ve sent you a verification link'
            )}
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm text-blue-700 mt-2 space-y-1 text-left">
                <li>1. Check your email inbox</li>
                <li>2. Click the verification link</li>
                <li>3. Return to this page</li>
              </ol>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={resendVerification}
                disabled={loading || !email}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Resend verification email
              </button>

              <button
                onClick={() => router.push('/auth')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Didn't receive an email? Check your spam folder or try a different email address.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}