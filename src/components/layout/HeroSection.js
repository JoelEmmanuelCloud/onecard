'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Phone, Mail, Globe } from 'lucide-react'

export default function MinimalHero() {
  const [isCardTouched, setIsCardTouched] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsCardTouched(true)
      setTimeout(() => setShowContactInfo(true), 600)
      setTimeout(() => {
        setShowContactInfo(false)
        setIsCardTouched(false)
      }, 3500)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  const cardVariants = {
    initial: { x: -30, y: 15, rotate: -10, scale: 0.85 },
    touching: {
      x: 0, y: -8, rotate: 0, scale: 0.95,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const phoneVariants = {
    initial: { scale: 1 },
    touched: { scale: 1.01, transition: { duration: 0.3 } }
  }

  return (
    <section className="min-h-screen flex items-center bg-white pt-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left order-1 lg:order-1"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 leading-tight mb-6"
            >
              Professional networking,
              <span className="block font-normal">simplified</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed"
            >
              Share your contact details instantly with a simple tap. 
              No apps required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all duration-200 font-light flex items-center justify-center"
              >
                Get Your Card
                <ArrowRight className="ml-2 w-4 h-4" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-light"
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Simple indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500"
            >
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                NFC Enabled
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Instant Updates
              </span>
            </motion.div>
          </motion.div>

          {/* Animation - Minimalist */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center order-2 lg:order-2"
          >
            <div className="relative scale-75 sm:scale-85 lg:scale-100">
              
              {/* Phone - Clean Design */}
              <motion.div
                variants={phoneVariants}
                animate={isCardTouched ? "touched" : "initial"}
                className="relative z-20 w-48 h-96 sm:w-56 sm:h-[450px] lg:w-64 lg:h-[520px] bg-gray-900 rounded-3xl p-2 shadow-xl mx-auto border border-gray-200"
              >
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                  
                  <AnimatePresence mode="wait">
                    {!showContactInfo ? (
                      <motion.div
                        key="homescreen"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 p-6"
                      >
                        {/* Status Bar */}
                        <div className="flex justify-between items-center mb-8 text-xs text-gray-800">
                          <span>9:41</span>
                          <div className="w-6 h-3 border border-gray-800 rounded-sm">
                            <div className="w-4 h-1 bg-gray-800 rounded-sm m-0.5"></div>
                          </div>
                        </div>
                        
                        {/* Clean App Grid */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="w-12 h-12 bg-gray-100 rounded-2xl shadow-sm"></div>
                          ))}
                        </div>

                        {/* Dock */}
                        <div className="absolute bottom-8 left-6 right-6">
                          <div className="flex justify-center space-x-4 p-3 bg-gray-50 rounded-2xl">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      /* Contact Information - Clean */
                      <motion.div
                        key="contact"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 p-6"
                      >
                        {/* Profile */}
                        <div className="text-center mb-8 pt-8">
                          <div className="w-20 h-20 bg-gray-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white font-light text-lg">JS</span>
                          </div>
                          <h3 className="text-xl font-light text-gray-900 mb-1">James Smith</h3>
                          <p className="text-gray-600 text-sm">Product Designer</p>
                          <p className="text-gray-500 text-xs">TechCorp</p>
                        </div>
                        
                        {/* Contact Actions */}
                        <div className="space-y-3 mb-6">
                          {[
                            { icon: Phone, label: 'Call' },
                            { icon: Mail, label: 'Email' },
                            { icon: Globe, label: 'Website' }
                          ].map((item, index) => (
                            <div
                              key={item.label}
                              className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100"
                            >
                              <item.icon className="w-5 h-5 text-gray-600 mr-3" />
                              <span className="text-gray-700 font-light">{item.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* Save Button */}
                        <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-light">
                          Save Contact
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Minimal NFC indicator */}
                <AnimatePresence>
                  {isCardTouched && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                    >
                      <motion.div
                        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-8 h-8 border-2 border-gray-400 rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* NFC Card - Minimal */}
              <motion.div
                variants={cardVariants}
                animate={isCardTouched ? "touching" : "initial"}
                className="absolute top-16 -left-8 z-30"
              >
                <div className="w-32 h-20 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 h-full flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-light text-gray-600 mb-2">1NECARD</div>
                      <div className="space-y-1">
                        <div className="w-8 h-0.5 bg-gray-300 rounded"></div>
                        <div className="w-6 h-0.5 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    
                    {/* NFC Chip */}
                    <div className="absolute bottom-3 right-3 w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center">
                      <motion.div 
                        animate={isCardTouched ? {
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.6, 1]
                        } : {}}
                        transition={{
                          duration: 0.8,
                          repeat: isCardTouched ? Infinity : 0
                        }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}