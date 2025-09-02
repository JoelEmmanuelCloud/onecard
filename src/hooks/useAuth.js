'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser, signOut as supabaseSignOut } from '@/lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
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

        if (event === 'SIGNED_IN' && session) {
          await handleSignIn(session.user)
        }
        
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setSession(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const getInitialSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
    } catch (error) {
      console.error('Error getting initial session:', error)
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
        await createUserProfile(user)
      }
    } catch (error) {
      console.error('Error handling sign in:', error)
    }
  }

  const createUserProfile = async (user) => {
    try {
      const { generateUsername } = await import('@/lib/supabase')
      
      // Extract name from user metadata or email
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
      const firstName = user.user_metadata?.given_name || user.user_metadata?.first_name || fullName.split(' ')[0] || ''
      const lastName = user.user_metadata?.family_name || user.user_metadata?.last_name || fullName.split(' ').slice(1).join(' ') || ''
      
      // Generate unique username
      const username = await generateUsername(firstName || 'user', lastName || Math.random().toString(36).substring(7))

      const profileData = {
        user_id: user.id,
        email: user.email,
        full_name: fullName || `${firstName} ${lastName}`.trim(),
        first_name: firstName,
        last_name: lastName,
        username: username,
        profile_image_url: user.user_metadata?.avatar_url || null,
        is_active: true,
        template_style: 'minimal',
        created_at: new Date().toISOString()
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profileData])

      if (profileError) {
        console.error('Error creating profile:', profileError)
      } else {
        console.log('Profile created successfully for:', user.email)
      }
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await supabaseSignOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user
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

export default useAuth