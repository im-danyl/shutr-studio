import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check current session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Session check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div 
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--accent-solid)', borderTopColor: 'transparent' }}
          ></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Authentication Required
          </h2>
          <p 
            className="mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            Please sign in to access this page and start creating amazing product photos.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 rounded-xl font-medium transition-all duration-200"
            style={{
              background: 'var(--accent-gradient)',
              color: 'white'
            }}
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute