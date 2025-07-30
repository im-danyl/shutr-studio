import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Chrome, Eye, EyeOff, ArrowLeft, Camera } from 'lucide-react'
import { supabase } from '../lib/supabase'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already signed in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/generate')
      }
    }
    checkAuth()
  }, [navigate])

  const handleGoogleAuth = async () => {
    try {
      setLoading(true)
      setError('')

      const { error } = await supabase.auth.signInWithOAuth({
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

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    try {
      setLoading(true)
      setError('')

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            credits: 2 // Give new users 2 free credits
          }
        }
      })

      if (error) throw error

      if (data?.user && !data?.session) {
        setError('Please check your email for a confirmation link')
        return
      }

      // Success - redirect to generate page
      navigate('/generate')
    } catch (error) {
      console.error('Email auth error:', error)
      setError(error.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header with back button */}
      <div className="flex justify-between items-center p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
        
        {/* Brand logo on top right */}
        <div className="flex items-center gap-2">
          <Camera size={24} className="text-orange-500" />
          <span className="text-lg font-bold text-gray-900 dark:text-white">Shutr Studio</span>
        </div>
      </div>

      {/* Main content - Single centered column */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">✨</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Get Started
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Welcome to Shutr Studio — Let's get started
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:ring-2 focus:ring-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
            ) : (
              <Chrome size={20} className="text-gray-700 dark:text-gray-300" />
            )}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">or</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                Your email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base"
                placeholder="you@shutrstudio.com"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                Create new password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base"
                  placeholder="Minimum 6 characters"
                  disabled={loading}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Free Credits Notice - More prominent */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
              <p className="text-base font-medium text-green-700 dark:text-green-400">
                🎉 Get 2 free credits when you sign up!
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus:ring-4 focus:ring-orange-200 focus:outline-none hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Creating Account...
                </>
              ) : (
                'Create new account'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="text-center mt-8">
            <span className="text-base text-gray-600 dark:text-gray-400">
              Already have an account?
            </span>
            {' '}
            <Link
              to="/signin"
              className="text-base font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp