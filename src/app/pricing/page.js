'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PaymentPlanCard, PaymentSuccessModal, PaymentErrorModal, paymentPlans } from '@/components/PaystackPayment'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from '@/components/AuthModal'

export default function PricingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const handlePlanSelect = async (plan, paymentResult) => {
    if (!isAuthenticated) {
      setSelectedPlan(plan)
      setShowAuthModal(true)
      return
    }

    try {
      setLoading(true)
      setPaymentData(paymentResult)
      setShowSuccessModal(true)
      
      // Redirect to dashboard after showing success
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
      
    } catch (error) {
      console.error('Payment selection error:', error)
      setError(error.message || 'Payment processing failed')
      setShowErrorModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage)
    setShowErrorModal(true)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    if (selectedPlan) {
      // User is now authenticated, retry payment
      handlePlanSelect(selectedPlan, null)
    }
  }

  const retryPayment = () => {
    setShowErrorModal(false)
    if (selectedPlan) {
      handlePlanSelect(selectedPlan, null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="text-2xl font-semibold tracking-wide text-black">
              1necard
            </a>
            
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <a
                  href="/dashboard"
                  className="text-black/80 hover:text-black transition-colors font-medium"
                >
                  Dashboard
                </a>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-black/80 hover:text-black transition-colors font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your networking needs. One-time card purchase with optional premium features.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(paymentPlans).map((plan, index) => (
              <PaymentPlanCard
                key={plan.name}
                plan={plan}
                isPopular={plan.name === 'Premium'}
                onSelect={handlePlanSelect}
                loading={loading}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare features
            </h2>
            <p className="text-gray-600">
              See what's included in each plan
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Basic
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Premium
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { feature: 'Physical NFC card', basic: true, premium: true, enterprise: true },
                    { feature: 'Digital profile page', basic: true, premium: true, enterprise: true },
                    { feature: 'Basic templates', basic: true, premium: true, enterprise: true },
                    { feature: 'Contact export', basic: true, premium: true, enterprise: true },
                    { feature: 'Premium templates', basic: false, premium: true, enterprise: true },
                    { feature: 'Custom branding', basic: false, premium: true, enterprise: true },
                    { feature: 'Advanced analytics', basic: false, premium: true, enterprise: true },
                    { feature: 'Team dashboard', basic: false, premium: false, enterprise: true },
                    { feature: 'Bulk ordering', basic: false, premium: false, enterprise: true },
                    { feature: 'API integration', basic: false, premium: false, enterprise: true },
                  ].map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.feature}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.basic ? (
                          <div className="w-5 h-5 text-green-500 mx-auto">✓</div>
                        ) : (
                          <div className="w-5 h-5 text-gray-300 mx-auto">—</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.premium ? (
                          <div className="w-5 h-5 text-green-500 mx-auto">✓</div>
                        ) : (
                          <div className="w-5 h-5 text-gray-300 mx-auto">—</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.enterprise ? (
                          <div className="w-5 h-5 text-green-500 mx-auto">✓</div>
                        ) : (
                          <div className="w-5 h-5 text-gray-300 mx-auto">—</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                question: "How does the payment work?",
                answer: "We use Paystack for secure payments. You pay once for the physical card, and optionally subscribe monthly for premium features."
              },
              {
                question: "Can I upgrade my plan later?",
                answer: "Yes, you can upgrade from Basic to Premium at any time from your dashboard."
              },
              {
                question: "How long does shipping take?",
                answer: "Physical cards are shipped within 5-7 business days within Nigeria."
              },
              {
                question: "What if I'm not satisfied?",
                answer: "We offer a 30-day money-back guarantee for all plans."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode="signup"
      />

      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          router.push('/dashboard')
        }}
        paymentData={paymentData}
      />

      <PaymentErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
        onRetry={retryPayment}
      />
    </div>
  )
}