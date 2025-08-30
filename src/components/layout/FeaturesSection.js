'use client'

import { motion } from 'framer-motion'
import { Smartphone, QrCode, RefreshCw, Palette, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Smartphone,
    title: 'NFC Technology',
    description: 'Simply tap your card against any smartphone to instantly share your contact information.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: QrCode,
    title: 'QR Code Backup',
    description: 'Every card includes a QR code for devices without NFC capability. Universal compatibility.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: RefreshCw,
    title: 'Instant Updates',
    description: 'Update your information anytime. Changes reflect immediately on your digital profile.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Palette,
    title: 'Custom Templates',
    description: 'Choose from professional templates or create your own unique design and branding.',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: Shield,
    title: 'Privacy Control',
    description: 'Control what information you share and with whom. Your data, your rules.',
    color: 'from-red-500 to-red-600'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Share contacts in under 2 seconds. No apps required for recipients.',
    color: 'from-yellow-500 to-yellow-600'
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            Why Choose
            <span className="text-gradient"> 1necard?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of networking with our smart contact cards. 
            Professional, convenient, and environmentally friendly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 text-center hover:-translate-y-2 group"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-primary mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12">
            <h3 className="text-3xl font-bold text-primary mb-6">
              See It In Action
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Watch how easy it is to share your professional information with just one tap. 
              No apps, no typing, no hassle.
            </p>
            
            <div className="relative max-w-md mx-auto">
              {/* Interactive Demo Placeholder */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">📱</div>
                <h4 className="font-bold text-lg text-primary mb-2">Interactive Demo</h4>
                <p className="text-gray-600 mb-4">Experience a live preview of your digital profile</p>
                <button className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Try Demo
                </button>
              </div>
              
              {/* Animated Tap Indicator */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center"
              >
                <div className="w-6 h-6 bg-accent rounded-full"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}