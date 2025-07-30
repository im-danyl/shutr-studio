import React, { useState } from 'react'
import { X, Mail, Chrome } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const AuthModal = ({ isOpen, onClose, mode: initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode) // 'signin' or 'signup'
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

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
      setError(error.message || 'Failed to sign in with Google')
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
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {mode === 'signup' 
              ? 'Start creating amazing product photos with AI' 
              : 'Sign in to continue your creative journey'
            }
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
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 mb-6 hover:shadow-md"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)'
          }}
        >
          <Chrome size={20} />
          <span className="font-medium">
            {mode === 'signup' ? 'Sign up' : 'Continue'} with Google
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }}></div>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }}></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
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
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>
          </div>

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
              placeholder="Enter your password"
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-medium transition-all duration-200"
            style={{
              background: loading ? 'var(--text-muted)' : 'var(--accent-gradient)',
              color: 'white'
            }}
          >
            {loading 
              ? 'Please wait...' 
              : mode === 'signup' ? 'Create Account' : 'Sign In'
            }
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="text-center mt-6">
          <span style={{ color: 'var(--text-muted)' }}>
            {mode === 'signup' ? 'Already have an account?' : 'New to Shutr Studio?'}
          </span>
          {' '}
          <button
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup')
              setError('')
              setEmail('')
              setPassword('')
            }}
            className="font-medium transition-colors"
            style={{ color: 'var(--accent-solid)' }}
            disabled={loading}
          >
            {mode === 'signup' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

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
      </div>
    </div>
  )
}

export default AuthModal