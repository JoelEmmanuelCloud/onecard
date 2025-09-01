'use client'

import { motion } from 'framer-motion'
import { Smartphone, QrCode, RefreshCw, Palette, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Smartphone,
    title: 'NFC Technology',
    description: 'Simply tap your card against any smartphone to instantly share your contact information.'
  },
  {
    icon: QrCode,
    title: 'QR Code Backup',
    description: 'Every card includes a QR code for devices without NFC capability. Universal compatibility.'
  },
  {
    icon: RefreshCw,
    title: 'Instant Updates',
    description: 'Update your information anytime. Changes reflect immediately on your digital profile.'
  },
  {
    icon: Palette,
    title: 'Custom Design',
    description: 'Choose from clean templates or create your own professional design.'
  },
  {
    icon: Shield,
    title: 'Privacy Control',
    description: 'Control what information you share and with whom. Your data, your rules.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Share contacts in under 2 seconds. No apps required for recipients.'
  }
]

export default function MinimalFeatures() {
  return (
    <section id="features" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-3 sm:mb-4">
            Everything you need
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Professional networking made simple with smart technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            const colors = [
              'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
              'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600', 
              'bg-amber-50 text-amber-600 group-hover:bg-amber-600',
              'bg-purple-50 text-purple-600 group-hover:bg-purple-600',
              'bg-rose-50 text-rose-600 group-hover:bg-rose-600',
              'bg-slate-50 text-slate-600 group-hover:bg-slate-600'
            ]
            const colorClass = colors[index % colors.length]
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group hover:scale-105 transition-transform duration-200"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-6 rounded-xl ${colorClass} flex items-center justify-center group-hover:text-white transition-all duration-200 shadow-sm`}>
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-200" />
                </div>
                
                <h3 className="text-base sm:text-lg font-normal text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed font-light text-sm sm:text-base">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Simple Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 text-center"
        >
          <div className="max-w-sm mx-auto">
            <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-3 sm:mb-4">
              See it in action
            </h3>
            <p className="text-gray-600 mb-6 sm:mb-8 font-light text-sm sm:text-base">
              Experience how simple professional networking can be
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600" />
              </div>
              <h4 className="font-normal text-gray-900 mb-2 text-sm sm:text-base">Interactive Preview</h4>
              <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm font-light">Try a live demo of your digital profile</p>
              <button className="bg-gray-900 text-white px-6 py-2.5 sm:py-3 rounded-full hover:bg-gray-800 transition-colors duration-200 font-light text-sm sm:text-base w-full sm:w-auto">
                Try Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}