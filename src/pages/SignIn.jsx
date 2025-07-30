import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Chrome, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

const SignIn = () => {
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

    try {
      setLoading(true)
      setError('')

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Success - redirect to generate page
      navigate('/generate')
    } catch (error) {
      console.error('Email auth error:', error)
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Convert your ideas into successful business.
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Create professional product photos with AI-powered technology. 
              Transform your products into stunning visuals that sell.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-gray-900">
        {/* Back button */}
        <div className="p-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Mobile gradient header - only show on small screens */}
        <div className="lg:hidden w-full h-24 bg-gradient-to-r from-orange-400 to-pink-500 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-xl font-bold">Shutr Studio</h1>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 pb-8">
          <div className="max-w-sm mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">✨</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Sign in to continue your creative journey
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
              className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="hi@hextastudio.in"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter your password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:ring-2 focus:ring-orange-500 focus:outline-none hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Sign up link */}
            <div className="text-center mt-6">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                New to Shutr Studio?
              </span>
              {' '}
              <Link
                to="/signup"
                className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn