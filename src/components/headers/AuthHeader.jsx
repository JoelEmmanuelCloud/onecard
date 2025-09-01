'use client'

import { ArrowLeft } from 'lucide-react'

export default function AuthHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="text-2xl font-semibold tracking-wide text-black">
            1necard
          </a>

          {/* Back to Home Link */}
          <a
            href="/"
            className="flex items-center space-x-2 text-black/80 hover:text-black transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    </header>
  )
}