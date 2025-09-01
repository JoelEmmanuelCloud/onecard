'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Crown, Building2 } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    icon: Zap,
    price: 40000,
    description: 'Perfect for individuals',
    features: [
      'Physical NFC card',
      'QR code backup',
      'Digital profile page',
      'Basic templates',
      'Unlimited updates',
      'Contact export',
      'Basic analytics',
      'Email support'
    ],
    popular: false,
    buttonText: 'Get Basic'
  },
  {
    name: 'Premium',
    icon: Crown,
    price: 75000,
    monthly: 8000,
    description: 'Enhanced for professionals',
    features: [
      'Everything in Basic',
      'Premium templates',
      'Custom branding',
      'Advanced analytics',
      'Social integrations',
      'Booking links',
      'Lead capture',
      'Priority support'
    ],
    popular: true,
    buttonText: 'Get Premium'
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: 'Custom',
    description: 'Scalable for teams',
    features: [
      'Everything in Premium',
      'Bulk ordering',
      'Team dashboard',
      'Custom domain',
      'API integration',
      'Advanced security',
      'Account manager',
      'Custom features'
    ],
    popular: false,
    buttonText: 'Contact Sales'
  }
]

export default function MinimalPricing() {
  const [billingCycle, setBillingCycle] = useState('annual')

  const handlePurchase = (plan) => {
    console.log(`Purchasing ${plan.name}`)
  }

  return (
    <section id="pricing" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-3 sm:mb-4">
            Simple pricing
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-light mb-6 sm:mb-8">
            Choose the plan that fits your networking needs. One-time card purchase with optional premium features.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-1 bg-white rounded-full p-1 w-fit mx-auto border border-gray-200">
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-light transition-all duration-200 ${
                billingCycle === 'annual'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-light transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            const cardStyles = {
              0: 'border-blue-200 bg-gradient-to-br from-white to-blue-50/30 hover:border-blue-300',
              1: 'border-purple-200 bg-gradient-to-br from-white to-purple-50/30 hover:border-purple-300 shadow-lg md:scale-105',
              2: 'border-slate-200 bg-gradient-to-br from-white to-slate-50/30 hover:border-slate-300'
            }
            const iconStyles = {
              0: 'bg-blue-50 text-blue-600',
              1: 'bg-purple-50 text-purple-600', 
              2: 'bg-slate-50 text-slate-600'
            }
            const buttonStyles = {
              0: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm',
              1: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md',
              2: 'border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50'
            }
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl border overflow-hidden transition-all duration-200 ${cardStyles[index]}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center py-2 text-xs font-light tracking-wide">
                    MOST POPULAR
                  </div>
                )}

                <div className={`p-6 sm:p-8 ${plan.popular ? 'pt-12 sm:pt-14' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-2xl ${iconStyles[index]} flex items-center justify-center shadow-sm`}>
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-normal text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm font-light mb-4 sm:mb-6">{plan.description}</p>
                    
                    {/* Pricing */}
                    <div className="mb-6 sm:mb-8">
                      {plan.price === 'Custom' ? (
                        <div className="text-2xl sm:text-3xl font-light text-gray-900">Custom</div>
                      ) : (
                        <div>
                          <div className="flex items-baseline justify-center">
                            <span className="text-2xl sm:text-3xl font-light text-gray-900">₦{plan.price.toLocaleString()}</span>
                            <span className="text-gray-500 ml-1 text-sm">NGN</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">One-time card purchase</div>
                          {plan.monthly && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="text-gray-900 font-light text-sm">
                                + ₦{billingCycle === 'annual' ? (plan.monthly * 10).toLocaleString() : plan.monthly.toLocaleString()}/{billingCycle === 'annual' ? 'year' : 'month'}
                              </div>
                              <div className="text-xs text-gray-500">for premium features</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                          index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-purple-600' : 'bg-slate-600'
                        }`}>
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm font-light leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePurchase(plan)}
                    className={`w-full py-3 sm:py-3.5 px-6 rounded-full font-light transition-all duration-200 text-sm sm:text-base ${buttonStyles[index]}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-2xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div className="group">
                <div className="text-lg sm:text-xl font-light text-emerald-700 group-hover:text-emerald-800 transition-colors">30-Day</div>
                <div className="text-xs sm:text-sm text-gray-600 font-light">Money Back Guarantee</div>
              </div>
              <div className="group">
                <div className="text-lg sm:text-xl font-light text-emerald-700 group-hover:text-emerald-800 transition-colors">Free</div>
                <div className="text-xs sm:text-sm text-gray-600 font-light">Worldwide Shipping</div>
              </div>
              <div className="group">
                <div className="text-lg sm:text-xl font-light text-emerald-700 group-hover:text-emerald-800 transition-colors">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600 font-light">Customer Support</div>
              </div>
              <div className="group">
                <div className="text-lg sm:text-xl font-light text-emerald-700 group-hover:text-emerald-800 transition-colors">100%</div>
                <div className="text-xs sm:text-sm text-gray-600 font-light">Secure Payments</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simple FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16"
        >
          <h3 className="text-lg sm:text-xl font-light text-gray-900 mb-2 sm:mb-3">Questions?</h3>
          <p className="text-gray-600 mb-4 sm:mb-6 font-light text-sm sm:text-base">
            Get in touch with our support team
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto sm:max-w-none">
            <button className="border border-gray-300 text-gray-700 px-6 py-2.5 sm:py-2 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-light text-sm sm:text-base shadow-sm">
              View FAQ
            </button>
            <button className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-2.5 sm:py-2 rounded-full hover:from-gray-800 hover:to-gray-700 transition-all duration-200 font-light text-sm sm:text-base shadow-sm">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}