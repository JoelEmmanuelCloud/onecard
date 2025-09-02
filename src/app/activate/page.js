'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, Check, AlertCircle, ArrowLeft, Loader, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { activateCard, getCardByCardId } from '@/lib/supabase'
import AuthModal from '@/components/AuthModal'

export default function ActivatePage() {
  const [step, setStep] = useState(1) // 1: Enter Card ID, 2: Success/Instructions
  const [cardId, setCardId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cardData, setCardData] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if card ID is provided in URL
    const urlCardId = searchParams.get('card')
    if (urlCardId) {
      setCardId(urlCardId)
    }
  }, [searchParams])

  const handleCardActivation = async (e) => {
    e.preventDefault()
    
    if (!cardId.trim()) {
      setError('Please enter your card ID')
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    setLoading(true)
    setError('')

    try {
      // First, check if card exists and is valid
      const { data: card, error: cardError } = await getCardByCardId(cardId.trim())
      
      if (cardError) {
        throw new Error('Invalid card ID')
      }

      if (!card) {
        throw new Error('Card not found. Please check your card ID.')
      }

      if (card.is_activated) {
        if (card.user_id === user.id) {
          // User's own card is already activated
          setError('This card is already activated in your account')
          return
        } else {
          // Card is activated by someone else
          setError('This card is already activated by another user')
          return
        }
      }

      // Activate the card
      const { data: activatedCard, error: activateError } = await activateCard(cardId.trim(), user.id)
      
      if (activateError) {
        throw new Error(activateError.message || 'Failed to activate card')
      }

      setCardData(activatedCard[0])
      setStep(2)

    } catch (error) {
      console.error('Card activation error:', error)
      setError(error.message || 'Failed to activate card')
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // Retry activation after successful auth
    handleCardActivation({ preventDefault: () => {} })
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-2">
          Activate Your Card
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Enter the card ID found on the back of your 1necard
        </p>
      </div>

      <form onSubmit={handleCardActivation} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card ID
          </label>
          <input
            type="text"
            required
            value={cardId}
            onChange={(e) => setCardId(e.target.value.toUpperCase())}
            className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-mono"
            placeholder="1NC123456789"
            maxLength={12}
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: 1NC followed by numbers (e.g., 1NC123456789)
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </motion.div>
        )}

        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              You need to sign in or create an account to activate your card.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !cardId.trim()}
          className="w-full bg-blue-600 text-white px-6 py-4 text-base font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Activate Card
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have a card yet?{' '}
            <a href="/pricing" className="text-blue-600 hover:text-blue-700 font-medium">
              Get one here
            </a>
          </p>
        </div>
      </form>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600" />
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-4">
          Card Activated!
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Your 1necard is now linked to your account and ready to use.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-medium text-black mb-4">Next Steps:</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium text-black">Complete your profile</p>
              <p className="text-sm text-gray-600">Add your contact information and customize your card</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium text-black">Start sharing</p>
              <p className="text-sm text-gray-600">Tap your card on any smartphone to share your details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-blue-600 text-white px-6 py-4 text-base font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center min-h-[48px]"
        >
          Complete Profile Setup
          <ArrowRight className="ml-2 w-4 h-4" />
        </button>
        
        <button
          onClick={() => router.push('/dashboard?tab=analytics')}
          className="w-full border-2 border-gray-300 text-gray-700 px-6 py-4 text-base font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center bg-white min-h-[48px]"
        >
          View Analytics
        </button>
      </div>
    </motion.div>
  )

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="text-2xl font-semibold tracking-wide text-black">
              1necard
            </a>

            <a
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 flex items-start sm:items-center justify-center px-4 py-24 sm:py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
            {/* Progress Indicator */}
            {step === 1 && (
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300 mx-3"></div>
                  <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                </div>
              </div>
            )}

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact{' '}
              <a href="mailto:support@1necard.com" className="text-blue-600 hover:text-blue-700">
                support@1necard.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode="signin"
      />
    </>
  )
}