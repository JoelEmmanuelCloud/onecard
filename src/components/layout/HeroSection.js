'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center gradient-bg overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container-max section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Share your world with
              <span className="block text-transparent bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text">
                one tap
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-blue-100 mb-8 max-w-xl"
            >
              Professional smart contact cards with NFC & QR technology. 
              Make networking seamless, instant, and completely paperless.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link href="#pricing" className="inline-flex items-center justify-center bg-white text-primary font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Buy Your Card
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link href="/activate" className="inline-flex items-center justify-center border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-primary transition-all duration-200">
                Activate Card
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center space-x-6 text-blue-200"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">NFC Enabled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">QR Compatible</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Instant Updates</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10">
              {/* Phone Mockup */}
              <div className="mx-auto w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Mock Profile */}
                  <div className="p-6 bg-gradient-to-br from-accent to-blue-600 text-white text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/30 rounded-full"></div>
                    </div>
                    <h3 className="font-bold text-lg">John Smith</h3>
                    <p className="text-blue-100">Marketing Director</p>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <span className="text-accent font-medium">📞 Call</span>
                    </div>
                    <div className="h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <span className="text-accent font-medium">✉️ Email</span>
                    </div>
                    <div className="h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <span className="text-accent font-medium">💾 Save Contact</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Card */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -left-8 top-32 w-32 h-20 bg-gradient-to-br from-primary to-accent rounded-lg shadow-2xl transform rotate-12"
              >
                <div className="p-3 text-white">
                  <div className="text-xs font-bold">1necard</div>
                  <div className="mt-1 w-6 h-1 bg-white/40 rounded"></div>
                  <div className="mt-1 w-4 h-1 bg-white/40 rounded"></div>
                </div>
                {/* NFC Indicator */}
                <div className="absolute bottom-2 right-2 w-4 h-4 border border-white/50 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white/70 rounded-full"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}