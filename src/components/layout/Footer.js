'use client'

import { Mail, Twitter, Linkedin } from 'lucide-react'

export default function MinimalFooter() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Enterprise', href: '/enterprise' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact', href: '/contact' },
        { name: 'Activate Card', href: '/activate' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' }
      ]
    }
  ]

  return (
    <footer className="bg-black text-white border-t border-white/20">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <a href="/" className="text-2xl font-medium tracking-wide text-white mb-6 block">
              1necard
            </a>
            
            <p className="text-white/80 mb-8 leading-relaxed max-w-sm">
              Professional networking, simplified. Share contact information instantly with smart NFC technology.
            </p>
            
            {/* Contact */}
            <div className="flex items-center space-x-3 text-white/90 mb-6">
              <Mail className="w-4 h-4" />
              <span className="text-sm">hello@1necard.com</span>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/1necard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
              >
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a 
                href="https://linkedin.com/company/1necard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8 lg:col-span-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-medium text-white mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href}
                        className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-white/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-medium text-white mb-1">Stay updated</h3>
              <p className="text-white/80 text-sm">Get product updates and news</p>
            </div>
            <div className="flex w-full md:w-auto max-w-sm">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 px-4 py-2 border border-white/30 bg-white/10 text-white placeholder-white/60 rounded-l-full focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm backdrop-blur-sm"
              />
              <button className="px-6 py-2 bg-white text-black rounded-r-full hover:bg-white/90 transition-colors duration-200 text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm">
              © {currentYear} 1necard. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="/privacy" className="text-white/70 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/terms" className="text-white/70 hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}