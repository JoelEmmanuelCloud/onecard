'use client'

import { useState } from 'react'
import { Menu, X, User, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import AuthModal from '@/components/AuthModal'

export default function OptimizedMinimalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  
  const { isAuthenticated, user, signOut } = useAuth()
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Support', href: '#support' },
  ]

  const handleAuthClick = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
    setIsMenuOpen(false)
    setShowUserDropdown(false)
  }

  const handleGetCardClick = () => {
    if (isAuthenticated) {
      router.push('/pricing')
    } else {
      handleAuthClick('signup')
    }
    setIsMenuOpen(false)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    if (authMode === 'signup') {
      router.push('/pricing')
    }
  }

  const handleUserAction = (action) => {
    setShowUserDropdown(false)
    if (action === 'dashboard') {
      router.push('/dashboard')
    } else if (action === 'signout') {
      signOut()
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18 xl:h-20">
            {/* Logo */}
            <a 
              href="/" 
              className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wide text-black hover:text-blue-600 transition-colors duration-200 flex-shrink-0"
            >
              Onecard
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-black/80 hover:text-black transition-colors duration-200 font-medium text-sm xl:text-base relative group whitespace-nowrap"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 flex-shrink-0">
              {isAuthenticated ? (
                // Authenticated user menu
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-1.5 xl:space-x-2 text-black/80 hover:text-black transition-colors duration-200 font-medium px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg hover:bg-black/5"
                  >
                    <div className="w-6 h-6 xl:w-7 xl:h-7 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                      {user?.user_metadata?.avatar_url ? (
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-white" />
                      )}
                    </div>
                    <span className="text-sm xl:text-base max-w-16 xl:max-w-20 truncate">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-44 xl:w-48 bg-white rounded-lg shadow-lg border border-black/10 py-2 z-50"
                      >
                        <button
                          onClick={() => handleUserAction('dashboard')}
                          className="w-full text-left px-3 xl:px-4 py-2 text-sm text-black/80 hover:text-black hover:bg-black/5 transition-colors duration-150"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => handleUserAction('signout')}
                          className="w-full text-left px-3 xl:px-4 py-2 text-sm text-black/60 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Unauthenticated user options
                <>
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="text-black/80 hover:text-black transition-colors duration-200 font-medium text-sm xl:text-base px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg hover:bg-black/5 whitespace-nowrap"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleGetCardClick}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 xl:px-5 xl:py-2 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-sm xl:text-base shadow-sm hover:shadow-md whitespace-nowrap"
                  >
                    Get Card
                  </button>
                </>
              )}
            </div>

            {/* Mobile/Tablet Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-black/5 transition-colors duration-200 touch-manipulation flex-shrink-0"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5 text-black" />}
            </button>
          </div>

          {/* Mobile/Tablet Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="lg:hidden border-t border-black/10 py-3 sm:py-4 bg-white/95 backdrop-blur-md overflow-hidden"
              >
                <nav className="flex flex-col space-y-1">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-black/80 hover:text-black hover:bg-black/5 transition-all duration-200 font-medium py-2.5 sm:py-3 px-2 rounded-lg touch-manipulation text-sm sm:text-base"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  
                  <div className="flex flex-col space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-black/10 mt-2">
                    {isAuthenticated ? (
                      // Mobile authenticated menu
                      <>
                        <button
                          onClick={() => {
                            router.push('/dashboard')
                            setIsMenuOpen(false)
                          }}
                          className="flex items-center space-x-3 text-black/80 hover:text-black hover:bg-black/5 transition-all duration-200 font-medium py-2.5 sm:py-3 px-2 rounded-lg touch-manipulation text-sm sm:text-base"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                            {user?.user_metadata?.avatar_url ? (
                              <img 
                                src={user.user_metadata.avatar_url} 
                                alt="Profile" 
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="truncate">
                            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Dashboard'}
                          </span>
                        </button>
                        
                        <button
                          onClick={() => {
                            signOut()
                            setIsMenuOpen(false)
                          }}
                          className="text-left text-black/60 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium py-2.5 sm:py-3 px-2 rounded-lg touch-manipulation text-sm sm:text-base"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      // Mobile unauthenticated menu
                      <>
                        <button
                          onClick={() => handleAuthClick('signin')}
                          className="text-left text-black/80 hover:text-black hover:bg-black/5 transition-all duration-200 font-medium py-2.5 sm:py-3 px-2 rounded-lg touch-manipulation text-sm sm:text-base"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={handleGetCardClick}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-center shadow-sm hover:shadow-md touch-manipulation mx-2 text-sm sm:text-base"
                        >
                          Get Card
                        </button>
                      </>
                    )}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </>
  )
}