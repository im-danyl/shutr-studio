import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  loading: true,
  initialized: false,

  // Actions
  initialize: async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error

      set({ 
        user: session?.user ?? null, 
        loading: false, 
        initialized: true 
      })

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        const user = session?.user ?? null
        
        set({ 
          user, 
          loading: false 
        })

        // Handle user profile creation/update
        if (user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await get().ensureUserProfile(user)
        }
      })

    } catch (error) {
      console.error('Auth initialization error:', error)
      set({ 
        user: null, 
        loading: false, 
        initialized: true 
      })
    }
  },

  // Ensure user profile exists in database
  ensureUserProfile: async (user) => {
    try {
      // Check if profile exists (database trigger should have created it automatically)
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', fetchError)
        // Profile should be created by database trigger, no manual creation needed
        return
      }

      if (!existingProfile) {
        console.warn('User profile not found - database trigger may have failed')
        // Let database trigger handle profile creation instead of manual insertion
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error)
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/generate`
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  },

  // Sign in with email/password
  signInWithEmail: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Email sign in error:', error)
      throw error
    }
  },

  // Sign up with email/password
  signUpWithEmail: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            credits: 2
          }
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Email sign up error:', error)
      throw error
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      set({ user: null })
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  // Get user profile with credits
  getUserProfile: async () => {
    const { user } = get()
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  },

  // Update user profile
  updateUserProfile: async (updates) => {
    const { user } = get()
    if (!user) throw new Error('No authenticated user')

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }
}))

export default useAuthStore