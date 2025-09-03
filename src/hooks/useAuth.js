'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser, signOut as supabaseSignOut } from '@/lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)

        if (event === 'SIGNED_IN' && session) {
          await handleSignIn(session.user)
        }
        
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setSession(null)
          setError(null)
        }

        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully')
        }

        if (event === 'USER_UPDATED') {
          console.log('User updated')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const getInitialSession = async () => {
    try {
      setLoading(true)
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting initial session:', error)
        setError(error.message)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
        
        // If user exists but profile might not, handle it
        if (session?.user) {
          await handleSignIn(session.user)
        }
      }
    } catch (error) {
      console.error('Error getting initial session:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (user) => {
    try {
      // Check if profile exists
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        console.log('Creating profile for new user:', user.email)
        await createUserProfile(user)
      } else if (error) {
        console.error('Error checking profile:', error)
      } else {
        console.log('Profile exists for user:', user.email)
      }
    } catch (error) {
      console.error('Error handling sign in:', error)
      setError(error.message)
    }
  }

// Update the createUserProfile function in your AuthProvider.jsx
const createUserProfile = async (user) => {
  try {
    // Extract name from user metadata or email with better fallbacks
    const fullName = user.user_metadata?.full_name || 
                    user.user_metadata?.name || 
                    user.user_metadata?.display_name || 
                    ''
    
    const firstName = user.user_metadata?.given_name || 
                     user.user_metadata?.first_name || 
                     fullName.split(' ')[0] || 
                     user.email?.split('@')[0] || 
                     'User'
    
    const lastName = user.user_metadata?.family_name || 
                    user.user_metadata?.last_name || 
                    fullName.split(' ').slice(1).join(' ') || 
                    ''
    
    // Generate unique username with better error handling
    let username
    try {
      const { generateUsername } = await import('@/lib/supabase')
      username = await generateUsername(firstName, lastName || `user${Date.now()}`)
    } catch (usernameError) {
      console.error('Error generating username:', usernameError)
      // Fallback username generation
      const timestamp = Date.now().toString().slice(-6)
      const cleanEmail = user.email?.split('@')[0]?.replace(/[^a-z0-9]/gi, '') || 'user'
      username = `${cleanEmail}${timestamp}`.toLowerCase().slice(0, 20)
    }

    const profileData = {
      user_id: user.id,
      email: user.email,
      full_name: fullName || `${firstName} ${lastName}`.trim() || firstName,
      first_name: firstName,
      last_name: lastName,
      username: username,
      profile_image_url: user.user_metadata?.avatar_url || 
                        user.user_metadata?.picture || 
                        null,
      is_active: true,
      template_style: 'minimal',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('Creating profile with data:', profileData)

    const { data, error: profileError } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single()

    if (profileError) {
      console.error('Error creating profile:', profileError)
      setError('Failed to create user profile: ' + profileError.message)
    } else {
      console.log('Profile created successfully:', data)
    }
  } catch (error) {
    console.error('Error creating user profile:', error)
    setError('Failed to create user profile: ' + error.message)
  }
}

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabaseSignOut()
      if (error) {
        console.error('Error signing out:', error)
        setError(error.message)
      } else {
        // Clear local state
        setUser(null)
        setSession(null)
        // Redirect to home
        router.push('/')
      }
    } catch (error) {
      console.error('Error signing out:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const refreshSession = async () => {
    try {
      setLoading(true)
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        setError(error.message)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    session,
    loading,
    error,
    signOut,
    refreshSession,
    clearError,
    isAuthenticated: !!user,
    isLoading: loading,
    hasError: !!error
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Additional hook for checking auth state
export const useAuthState = () => {
  const { user, loading, isAuthenticated } = useAuth()
  return {
    user,
    loading,
    isAuthenticated,
    isAnonymous: !isAuthenticated
  }
}

// Hook for protected routes
export const useRequireAuth = (redirectTo = '/auth') => {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, loading, router, redirectTo])

  return { isAuthenticated, loading }
}

// Hook for guest-only routes (redirect authenticated users)
export const useRequireGuest = (redirectTo = '/dashboard') => {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, loading, router, redirectTo])

  return { isAuthenticated, loading }
}

export default useAuth