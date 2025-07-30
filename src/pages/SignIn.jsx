import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Chrome, Eye, EyeOff, ArrowLeft, Camera } from 'lucide-react'
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
      {/* Left side - Sign in form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          
          <div className="lg:hidden flex items-center gap-2">
            <Camera size={24} className="text-orange-500" />
            <span className="text-lg font-bold text-gray-900">Shutr Studio</span>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-8 pb-8">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome to Shutr Studio
              </h1>
              <p className="text-gray-600 text-base">
                Transform your products into success!
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-gray-900 placeholder-gray-500"
                  placeholder="arianzesanj"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-gray-900 placeholder-gray-500"
                    placeholder="enter your password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 rounded" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-orange-500 hover:text-orange-600">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 focus:ring-4 focus:ring-orange-200 focus:outline-none hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Signing In...
                  </div>
                ) : (
                  'Log in'
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span className="font-medium text-gray-700">Login with Apple</span>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <Link to="/terms" className="hover:text-gray-700">Terms & Conditions</Link>
              <span className="mx-2">•</span>
              <Link to="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Brand showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500 relative overflow-hidden">
        {/* Brand logo */}
        <div className="absolute top-8 right-8 flex items-center gap-2 text-white">
          <Camera size={32} />
          <span className="text-xl font-bold">Shutr Studio</span>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center text-white max-w-md">
            {/* Large product showcase */}
            <div className="mb-8 relative">
              <div className="w-64 h-64 mx-auto bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
                <div className="w-48 h-48 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Camera size={64} className="text-white/80" />
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20"></div>
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Transform Your Products
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Create professional product photos with AI-powered technology that converts your ideas into successful business.
            </p>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}

export default SignIn