'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { SignInForm, SignUpForm, PasswordResetForm } from '@/components/AuthForms'

export default function AuthPage() {
  const [mode, setMode] = useState('signin') // 'signin', 'signup', 'reset'
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check URL parameters for initial mode
    const modeParam = searchParams.get('mode')
    if (modeParam && ['signin', 'signup', 'reset'].includes(modeParam)) {
      setMode(modeParam)
    }
  }, [searchParams])

  const handleSuccess = () => {
    router.push('/dashboard')
  }

  const switchToSignIn = () => setMode('signin')
  const switchToSignUp = () => setMode('signup')
  const switchToReset = () => setMode('reset')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10">
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
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-md w-full">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {mode === 'signin' && (
              <SignInForm
                onSuccess={handleSuccess}
                switchToSignUp={switchToSignUp}
                switchToReset={switchToReset}
              />
            )}

            {mode === 'signup' && (
              <SignUpForm
                onSuccess={handleSuccess}
                switchToSignIn={switchToSignIn}
              />
            )}

            {mode === 'reset' && (
              <PasswordResetForm
                onSuccess={handleSuccess}
                switchToSignIn={switchToSignIn}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}