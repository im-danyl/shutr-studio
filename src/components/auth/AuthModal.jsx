import React, { useState, useEffect } from 'react'
import { X, Mail, Chrome, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const AuthModal = ({ isOpen, onClose, mode: initialMode = 'getstarted' }) => {
  const [mode, setMode] = useState(initialMode) // 'getstarted', 'signin', 'signup'
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailCheckLoading, setEmailCheckLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setMode(initialMode)
      setEmail('')
      setPassword('')
      setError('')
    }
  }, [isOpen, initialMode])

  if (!isOpen) return null

  // Check if email exists in system
  const checkEmailExists = async (email) => {
    try {
      // Attempt to sign in with a dummy password to check if email exists
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-check'
      })
      
      // If error is "Invalid login credentials", email doesn't exist
      // If error is different, email likely exists
      return error?.message !== 'Invalid login credentials'
    } catch (error) {
      return false
    }
  }

  const handleEmailContinue = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (mode === 'getstarted') {
      try {
        setEmailCheckLoading(true)
        setError('')
        
        const emailExists = await checkEmailExists(email)
        
        if (emailExists) {
          // Email exists - switch to sign in mode
          setMode('signin')
        } else {
          // Email doesn't exist - switch to sign up mode
          setMode('signup')
        }
      } catch (error) {
        console.error('Email check error:', error)
        setError('Unable to check email. Please try again.')
      } finally {
        setEmailCheckLoading(false)
      }
      return
    }

    // Handle actual sign in/up
    handleEmailAuth(e)
  }

  const handleGoogleAuth = async () => {
    try {
      setLoading(true)
      setError('')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/generate`
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Google auth error:', error)
      setError(error.message || 'Failed to continue with Google')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      setError('')

      let authResult
      if (mode === 'signup') {
        authResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              credits: 2 // Give new users 2 free credits
            }
          }
        })
      } else {
        authResult = await supabase.auth.signInWithPassword({
          email,
          password
        })
      }

      const { data, error } = authResult

      if (error) throw error

      if (mode === 'signup' && data?.user && !data?.session) {
        setError('Please check your email for a confirmation link')
        return
      }

      // Success - close modal
      onClose()
    } catch (error) {
      console.error('Email auth error:', error)
      setError(error.message || `Failed to ${mode === 'signup' ? 'sign up' : 'sign in'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-8 relative"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={loading}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {mode === 'getstarted' && 'Get Started'}
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {mode === 'getstarted' && 'Start creating amazing product photos with AI'}
            {mode === 'signin' && 'Sign in to continue your creative journey'}
            {mode === 'signup' && 'Join thousands creating professional product photos'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 p-3 rounded-lg text-sm"
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: 'rgb(239, 68, 68)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            {error}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading || emailCheckLoading}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 mb-6 hover:shadow-md"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)',
            opacity: loading || emailCheckLoading ? 0.6 : 1
          }}
        >
          <Chrome size={20} />
          <span className="font-medium">
            Continue with Google
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }}></div>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }}></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailContinue} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Email
            </label>
            <div className="relative">
              <Mail 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)'
                }}
                placeholder="Enter your email address"
                disabled={loading || emailCheckLoading || (mode !== 'getstarted')}
                required
              />
              {(mode === 'signin' || mode === 'signup') && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('getstarted')
                    setPassword('')
                    setError('')
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm"
                  style={{ color: 'var(--accent-solid)' }}
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Password field - only show for signin/signup */}
          {(mode === 'signin' || mode === 'signup') && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)'
                }}
                placeholder={mode === 'signup' ? 'Create a password (min 6 characters)' : 'Enter your password'}
                disabled={loading}
                required
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || emailCheckLoading}
            className="w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: (loading || emailCheckLoading) ? 'var(--text-muted)' : 'var(--accent-gradient)',
              color: 'white'
            }}
          >
            {emailCheckLoading && 'Checking...'}
            {loading && 'Please wait...'}
            {!loading && !emailCheckLoading && mode === 'getstarted' && (
              <>
                Continue <ArrowRight size={16} />
              </>
            )}
            {!loading && !emailCheckLoading && mode === 'signin' && 'Sign In'}
            {!loading && !emailCheckLoading && mode === 'signup' && 'Create Account'}
          </button>
        </form>

        {/* Mode Toggle - only show for signin/signup modes */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="text-center mt-6">
            <span style={{ color: 'var(--text-muted)' }}>
              {mode === 'signup' ? 'Already have an account?' : 'New to Shutr Studio?'}
            </span>
            {' '}
            <button
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup')
                setError('')
                setPassword('')
              }}
              className="font-medium transition-colors"
              style={{ color: 'var(--accent-solid)' }}
              disabled={loading || emailCheckLoading}
            >
              {mode === 'signup' ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        )}

        {/* Free Credits Notice for Signup */}
        {mode === 'signup' && (
          <div 
            className="mt-4 p-3 rounded-lg text-sm text-center"
            style={{ 
              backgroundColor: 'rgba(0, 245, 160, 0.1)',
              border: '1px solid rgba(0, 245, 160, 0.2)',
              color: 'var(--text-primary)'
            }}
          >
            🎉 Get 2 free credits when you sign up!
          </div>
        )}

        {/* Back button for signin/signup modes */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="text-center mt-4">
            <button
              onClick={() => {
                setMode('getstarted')
                setPassword('')
                setError('')
              }}
              className="text-sm transition-colors"
              style={{ color: 'var(--text-muted)' }}
              disabled={loading || emailCheckLoading}
            >
              ← Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthModal