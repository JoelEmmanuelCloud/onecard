'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShieldAlert, Home, Loader2 } from 'lucide-react'
import AdminPanel from '@/components/AdminPanel'
import { supabase, getCurrentUser } from '@/lib/supabase'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        router.push('/activate')
        return
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (profileError) {
        throw profileError
      }

      if (profile?.role !== 'admin') {
        setError('Access denied. Admin privileges required.')
        return
      }

      setIsAdmin(true)
    } catch (error) {
      console.error('Error checking admin access:', error)
      setError('Failed to verify admin access')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-4 md:mb-6">
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            Verifying admin access...
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Please wait while we check your permissions
          </p>
        </motion.div>
      </div>
    )
  }

  if (error || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          {/* Error Icon */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
            </div>
          </div>

          {/* Error Content */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                Access Denied
              </h1>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed px-4 md:px-0">
                {error || 'You do not have permission to access the admin panel.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-blue-600 text-white px-6 py-3 md:py-4 text-base font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center min-h-[48px] md:min-h-[52px]"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </button>
              
              <button
                onClick={() => router.back()}
                className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 md:py-4 text-base font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center bg-white min-h-[48px] md:min-h-[52px]"
              >
                Go Back
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs md:text-sm text-gray-500">
              If you believe this is an error, please contact support at{' '}
              <a 
                href="mailto:support@1necard.co" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                support@1necard.co
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return <AdminPanel />
}