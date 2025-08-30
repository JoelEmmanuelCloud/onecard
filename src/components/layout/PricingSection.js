'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Crown, Building2 } from 'lucide-react'

const plans = [
  {
    name: 'Basic Card',
    icon: Zap,
    price: 25,
    description: 'Perfect for individuals getting started',
    features: [
      'Physical NFC smart card',
      'QR code backup',
      'Digital profile page',
      'Basic templates (3 designs)',
      'Unlimited profile updates',
      'Contact export (VCF)',
      'Basic analytics',
      '24/7 support'
    ],
    popular: false,
    buttonText: 'Get Basic Card',
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Premium Card',
    icon: Crown,
    price: 45,
    monthly: 5,
    description: 'Enhanced features for professionals',
    features: [
      'Everything in Basic',
      'Premium templates (10+ designs)',
      'Custom branding & colors',
      'Advanced analytics',
      'Social media integration',
      'Appointment booking links',
      'Lead capture forms',
      'Priority support'
    ],
    popular: true,
    buttonText: 'Get Premium Card',
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: 'Custom',
    description: 'Scalable solution for teams',
    features: [
      'Everything in Premium',
      'Bulk card ordering',
      'Team management dashboard',
      'Custom domain & branding',
      'API integration',
      'Advanced security features',
      'Dedicated account manager',
      'Custom integrations'
    ],
    popular: false,
    buttonText: 'Contact Sales',
    color: 'from-gray-700 to-gray-800'
  }
]

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('annual')

  const handlePurchase = (plan) => {
    // In a real app, this would integrate with Paystack
    console.log(`Purchasing ${plan.name}`)
    
    // Example Paystack integration
    if (typeof window !== 'undefined' && window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: 'customer@email.com', // Get from user
        amount: plan.price === 'Custom' ? 0 : plan.price * 100, // Amount in kobo
        currency: 'NGN',
        ref: `1necard_${Date.now()}`,
        callback: function(response) {
          // Handle successful payment
          console.log('Payment successful:', response.reference)
          // Redirect to activation or success page
        },
        onClose: function() {
          console.log('Payment cancelled')
        }
      })
      handler.openIframe()
    }
  }

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            Choose Your
            <span className="text-gradient"> Smart Card</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get your professional smart contact card and start networking like never before.
            One-time card purchase with optional premium features.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 bg-white rounded-full p-1 w-fit mx-auto shadow-sm">
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                billingCycle === 'annual'
                  ? 'bg-accent text-white shadow-md'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Annual
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-accent text-white shadow-md'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Monthly
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${
                  plan.popular 
                    ? 'border-accent shadow-accent/20 transform scale-105' 
                    : 'border-gray-100 hover:border-accent/30'
                } transition-all duration-300 hover:shadow-xl`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-accent text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    {/* Pricing */}
                    <div className="mb-6">
                      {plan.price === 'Custom' ? (
                        <div className="text-4xl font-bold text-primary">Custom</div>
                      ) : (
                        <div>
                          <div className="flex items-baseline justify-center">
                            <span className="text-4xl font-bold text-primary">${plan.price}</span>
                            <span className="text-gray-600 ml-1">USD</span>
                          </div>
                          <div className="text-sm text-gray-500">One-time card purchase</div>
                          {plan.monthly && (
                            <div className="mt-2">
                              <div className="text-accent font-semibold">
                                + ${billingCycle === 'annual' ? plan.monthly * 10 : plan.monthly}/{billingCycle === 'annual' ? 'year' : 'month'}
                              </div>
                              <div className="text-xs text-gray-500">for premium features</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePurchase(plan)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                      plan.popular
                        ? 'bg-accent hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 hover:bg-gray-200 text-primary hover:text-accent'
                    }`}
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
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 items-center">
              <div>
                <div className="text-2xl font-bold text-primary">30-Day</div>
                <div className="text-sm text-gray-600">Money Back Guarantee</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">Free</div>
                <div className="text-sm text-gray-600">Worldwide Shipping</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-gray-600">Customer Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-gray-600">Secure Payments</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">Have Questions?</h3>
          <p className="text-gray-600 mb-6">
            Check out our FAQ or get in touch with our support team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-secondary">
              View FAQ
            </button>
            <button className="btn-primary">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}