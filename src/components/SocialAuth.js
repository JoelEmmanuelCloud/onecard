'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Chrome, Apple, Github, Loader } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SocialAuth({ onSuccess, onError, redirectUrl = '/dashboard' }) {
  const [loading, setLoading] = useState({
    google: false,
    apple: false,
    github: false
  })

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(prev => ({ ...prev, [provider]: true }))

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}${redirectUrl}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) throw error

      // Success callback
      onSuccess?.(data)

    } catch (error) {
      console.error(`${provider} login error:`, error)
      onError?.(error.message)
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }))
    }
  }

  const socialProviders = [
    {
      name: 'google',
      label: 'Continue with Google',
      icon: Chrome,
      color: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
      textColor: 'text-white'
    },
    {
      name: 'apple',
      label: 'Continue with Apple',
      icon: Apple,
      color: 'bg-black hover:bg-gray-800 focus:ring-gray-800',
      textColor: 'text-white'
    },
    {
      name: 'github',
      label: 'Continue with GitHub',
      icon: Github,
      color: 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-800',
      textColor: 'text-white'
    }
  ]

  return (
    <div className="space-y-2 sm:space-y-3">
      {socialProviders.map((provider, index) => {
        const IconComponent = provider.icon
        const isLoading = loading[provider.name]
        const isAnyLoading = Object.values(loading).some(Boolean)
        
        return (
          <motion.button
            key={provider.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            onClick={() => handleSocialLogin(provider.name)}
            disabled={isAnyLoading}
            className={`w-full flex items-center justify-center py-2.5 sm:py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${provider.color} ${provider.textColor} disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base`}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2 sm:mr-3" />
            ) : (
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            )}
            <span className="truncate">
              {isLoading ? 'Connecting...' : provider.label}
            </span>
          </motion.button>
        )
      })}
      
      <div className="relative my-4 sm:my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs sm:text-sm">
          <span className="px-2 bg-white text-gray-500">or continue with email</span>
        </div>
      </div>
    </div>
  )
}

// Social Login Button Component (for individual use)
export function SocialLoginButton({ 
  provider, 
  label, 
  icon: Icon, 
  className = '',
  onSuccess,
  onError 
}) {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      })

      if (error) throw error
      onSuccess?.(data)

    } catch (error) {
      console.error(`${provider} login error:`, error)
      onError?.(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className={`flex items-center justify-center py-2.5 sm:py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm sm:text-base ${className}`}
    >
      {loading ? (
        <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
      ) : (
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
      )}
      <span className="truncate">
        {loading ? 'Connecting...' : label}
      </span>
    </button>
  )
}

// Social Account Linking Component (for settings)
export function SocialAccountLinking({ userId }) {
  const [linkedAccounts, setLinkedAccounts] = useState({})
  const [loading, setLoading] = useState({})

  const handleLinkAccount = async (provider) => {
    try {
      setLoading(prev => ({ ...prev, [provider]: true }))

      const { data, error } = await supabase.auth.linkIdentity({
        provider: provider
      })

      if (error) throw error

      setLinkedAccounts(prev => ({ ...prev, [provider]: true }))

    } catch (error) {
      console.error(`Error linking ${provider}:`, error)
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }))
    }
  }

  const handleUnlinkAccount = async (provider) => {
    try {
      setLoading(prev => ({ ...prev, [provider]: true }))

      const { data, error } = await supabase.auth.unlinkIdentity({
        provider: provider
      })

      if (error) throw error

      setLinkedAccounts(prev => ({ ...prev, [provider]: false }))

    } catch (error) {
      console.error(`Error unlinking ${provider}:`, error)
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }))
    }
  }

  const socialProviders = [
    { name: 'google', label: 'Google', icon: Chrome },
    { name: 'apple', label: 'Apple', icon: Apple },
    { name: 'github', label: 'GitHub', icon: Github }
  ]

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4">Connected Accounts</h3>
      <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Link your social accounts for easier sign-in</p>
      
      <div className="space-y-3 sm:space-y-4">
        {socialProviders.map((provider) => {
          const IconComponent = provider.icon
          const isLinked = linkedAccounts[provider.name]
          const isLoading = loading[provider.name]
          
          return (
            <div 
              key={provider.name} 
              className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
            >
              <div className="flex items-center min-w-0 flex-1">
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-gray-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{provider.label}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {isLinked ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => isLinked ? handleUnlinkAccount(provider.name) : handleLinkAccount(provider.name)}
                disabled={isLoading}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm flex-shrink-0 ml-3 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isLinked
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'
                    : 'bg-accent text-white hover:bg-blue-600 focus:ring-blue-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : isLinked ? (
                  'Disconnect'
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}