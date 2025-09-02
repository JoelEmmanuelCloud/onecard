'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader, CreditCard, Check, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createPaymentRecord } from '@/lib/supabase'

// Payment plans configuration
export const paymentPlans = {
  basic: {
    name: 'Basic Card',
    price: 40000, // in kobo (₦400)
    currency: 'NGN',
    features: [
      'Physical NFC card',
      'Digital profile page', 
      'Basic templates',
      'Contact export',
      'Unlimited updates',
      'Email support'
    ]
  },
  premium: {
    name: 'Premium Card',
    price: 75000, // in kobo (₦750)
    currency: 'NGN',
    monthly: 8000, // ₦80 monthly for premium features
    features: [
      'Everything in Basic',
      'Premium templates',
      'Custom branding',
      'Advanced analytics',
      'Social integrations',
      'Priority support'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: null, // Custom pricing
    currency: 'NGN',
    features: [
      'Everything in Premium',
      'Bulk ordering',
      'Team dashboard',
      'Custom domain',
      'API integration',
      'Account manager'
    ]
  }
}

// Initialize Paystack
const initializePaystack = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.onload = () => resolve(window.PaystackPop)
      script.onerror = reject
      document.head.appendChild(script)
    } else {
      reject(new Error('Window not available'))
    }
  })
}

// Main Payment Component
export default function PaystackPayment({ 
  plan, 
  onSuccess, 
  onError, 
  onCancel,
  isSubscription = false,
  buttonText,
  buttonClassName = '',
  disabled = false
}) {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handlePayment = async () => {
    if (!user) {
      onError?.('Please sign in to continue')
      return
    }

    if (!plan || (!plan.price && plan.name !== 'Enterprise')) {
      onError?.('Invalid payment plan')
      return
    }

    setLoading(true)

    try {
      // Initialize Paystack
      const PaystackPop = await initializePaystack()
      
      // Generate payment reference
      const reference = `${isSubscription ? 'sub' : 'card'}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create payment record
      await createPaymentRecord({
        userId: user.id,
        reference: reference,
        amount: plan.price / 100, // Convert from kobo to naira
        currency: plan.currency,
        status: 'pending',
        planType: plan.name.toLowerCase(),
        paymentType: isSubscription ? 'subscription' : 'card',
        metadata: {
          plan_type: plan.name,
          user_id: user.id,
          subscription: isSubscription,
          card_purchase: !isSubscription
        }
      })

      // Configure Paystack payment
      const paymentConfig = {
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: plan.price, // Amount in kobo
        currency: plan.currency,
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Plan Type",
              variable_name: "plan_type",
              value: plan.name
            },
            {
              display_name: "User ID", 
              variable_name: "user_id",
              value: user.id
            }
          ]
        },
        callback: function(response) {
          console.log('Payment successful:', response)
          handlePaymentSuccess(response)
        },
        onClose: function() {
          console.log('Payment cancelled')
          setLoading(false)
          onCancel?.()
        }
      }

      // Add subscription-specific config
      if (isSubscription && plan.monthly) {
        paymentConfig.plan = `premium_monthly_${plan.monthly}`
      }

      // Open Paystack modal
      const handler = PaystackPop.setup(paymentConfig)
      handler.openIframe()

    } catch (error) {
      console.error('Payment initialization error:', error)
      setLoading(false)
      onError?.(error.message || 'Payment initialization failed')
    }
  }

  const handlePaymentSuccess = async (response) => {
    try {
      // Verify payment with backend
      const verificationResponse = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reference: response.reference 
        })
      })

      const verificationResult = await verificationResponse.json()

      if (!verificationResponse.ok) {
        throw new Error(verificationResult.error || 'Payment verification failed')
      }

      console.log('Payment verified:', verificationResult)
      onSuccess?.(verificationResult)

    } catch (error) {
      console.error('Payment verification error:', error)
      onError?.(error.message || 'Payment verification failed')
    } finally {
      setLoading(false)
    }
  }

  if (plan.name === 'Enterprise') {
    return (
      <button
        onClick={() => window.open('mailto:sales@1necard.com', '_blank')}
        className={`w-full py-3 px-6 rounded-full font-medium transition-all duration-200 border-2 border-black text-black hover:bg-black hover:text-white ${buttonClassName}`}
        disabled={disabled}
      >
        Contact Sales
      </button>
    )
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading || disabled}
      className={`w-full py-3 px-6 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${buttonClassName}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader className="w-4 h-4 animate-spin mr-2" />
          Processing...
        </div>
      ) : (
        buttonText || `Get ${plan.name} - ₦${(plan.price / 100).toLocaleString()}`
      )}
    </button>
  )
}

// Payment Success Modal
export function PaymentSuccessModal({ isOpen, onClose, paymentData }) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your {paymentData?.planType || 'card'} is being processed.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">₦{paymentData?.amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Reference:</span>
              <span className="font-medium">{paymentData?.reference}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue to Dashboard
        </button>
      </motion.div>
    </motion.div>
  )
}

// Payment Error Modal
export function PaymentErrorModal({ isOpen, onClose, error, onRetry }) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Failed
        </h2>
        
        <p className="text-gray-600 mb-6">
          {error || 'Something went wrong with your payment. Please try again.'}
        </p>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Payment Plan Card Component
export function PaymentPlanCard({ plan, isPopular, onSelect, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
        isPopular 
          ? 'border-blue-500 shadow-lg scale-105' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 text-sm font-semibold">
          MOST POPULAR
        </div>
      )}

      <div className={`p-8 ${isPopular ? 'pt-12' : ''}`}>
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          
          {plan.price ? (
            <div>
              <div className="text-3xl font-bold text-gray-900">
                ₦{(plan.price / 100).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">One-time payment</div>
              {plan.monthly && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    + ₦{plan.monthly}/month for premium features
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-3xl font-bold text-gray-900">Custom</div>
          )}
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <PaystackPayment
          plan={plan}
          onSuccess={(data) => onSelect?.(plan, data)}
          onError={(error) => console.error('Payment error:', error)}
          buttonClassName={`${
            isPopular
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
          disabled={loading}
        />
      </div>
    </motion.div>
  )
}