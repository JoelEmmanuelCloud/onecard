'use client'

import { useState } from 'react'
import { Mail, Twitter, Linkedin, Instagram, ArrowRight, MapPin, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

export default function OptimizedMinimalFooter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Templates', href: '/templates' },
        { name: 'Enterprise', href: '/enterprise' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Activate Card', href: '/activate' },
        { name: 'Status', href: '/status' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'GDPR', href: '/gdpr' }
      ]
    }
  ]

  const socialLinks = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/Onecard',
      icon: Twitter,
      color: 'hover:bg-blue-500'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/Onecard',
      icon: Linkedin,
      color: 'hover:bg-blue-600'
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/Onecard',
      icon: Instagram,
      color: 'hover:bg-pink-500'
    }
  ]

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 text-white border-t border-white/10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-5 xl:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <a href="/" className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-white mb-4 sm:mb-6 block hover:text-blue-400 transition-colors duration-200">
                Onecard
              </a>
              
              <p className="text-white/80 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg max-w-md">
                Professional networking, simplified. Share contact information instantly with smart NFC technology that works across all devices.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-center space-x-3 text-white/90 group cursor-pointer">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-white/70">Email us</div>
                    <div className="text-sm sm:text-base font-medium">hello@1necard.co</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-white/90 group cursor-pointer">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-white/70">Location</div>
                    <div className="text-sm sm:text-base font-medium">Lagos, Nigeria</div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3 sm:space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-11 h-11 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 group ${social.color}`}
                    >
                      <IconComponent className="w-5 h-5 text-white group-hover:text-white" />
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
              {footerSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-semibold text-white mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
                    {section.title}
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a 
                          href={link.href}
                          className="text-white/70 hover:text-white transition-colors duration-200 text-xs sm:text-sm lg:text-base block py-1 hover:translate-x-1"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-white/10 bg-gradient-to-r from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8"
          >
            <div className="text-center lg:text-left max-w-lg">
              <h3 className="font-semibold text-white mb-2 text-lg sm:text-xl lg:text-2xl">
                Stay in the loop
              </h3>
              <p className="text-white/70 text-sm sm:text-base">
                Get the latest updates on new features, design templates, and networking tips delivered to your inbox.
              </p>
            </div>
            
            <div className="w-full lg:w-auto lg:min-w-96">
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="flex w-full max-w-md mx-auto lg:mx-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-l-full focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm sm:text-base backdrop-blur-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-r-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm sm:text-base font-medium shadow-lg hover:shadow-blue-500/25 flex items-center"
                  >
                    Subscribe
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </motion.button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center lg:text-left"
                >
                  <div className="inline-flex items-center px-6 py-4 bg-emerald-600/20 border border-emerald-500/30 rounded-full text-emerald-300">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Thanks for subscribing!
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="text-white/60 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} Onecard. All rights reserved. Made with ❤️ in Nigeria.
            </p>
            
            <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
              <a 
                href="/privacy" 
                className="text-white/60 hover:text-white transition-colors duration-200 hover:underline"
              >
                Privacy Policy
              </a>
              <span className="text-white/30">•</span>
              <a 
                href="/terms" 
                className="text-white/60 hover:text-white transition-colors duration-200 hover:underline"
              >
                Terms of Service
              </a>
              <span className="text-white/30">•</span>
              <a 
                href="/cookies" 
                className="text-white/60 hover:text-white transition-colors duration-200 hover:underline"
              >
                Cookies
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}