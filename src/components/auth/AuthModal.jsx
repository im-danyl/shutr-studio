import React, { useState, useEffect } from 'react'
import { X, Mail, Chrome, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const AuthModal = ({ isOpen, onClose, mode: initialMode = 'getstarted' }) => {
  const [mode, setMode] = useState(initialMode) // 'getstarted', 'signin', 'signup' - v2
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailCheckLoading, setEmailCheckLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setMode(initialMode)
      setEmail('')
      setPassword('')
      setError('')
      setShowPassword(false)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Main container */}
      <div className="relative w-full max-w-5xl h-full max-h-[85vh] flex bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
        {/* Left side - Hero section */}
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
          
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
        <div className="w-full md:w-1/2 flex flex-col">
          {/* Close button */}
          <div className="flex justify-end p-6">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              disabled={loading || emailCheckLoading}
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Mobile gradient header - only show on small screens */}
          <div className="md:hidden w-full h-24 bg-gradient-to-r from-gray-800 to-gray-900 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-white text-xl font-bold">Shutr Studio</h1>
            </div>
          </div>

          {/* Form content */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-8 pb-8">
            <div className="max-w-sm mx-auto w-full">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">✨</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {mode === 'getstarted' && 'Get Started'}
                  {mode === 'signin' && 'Welcome Back'}
                  {mode === 'signup' && 'Create Account'}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {mode === 'getstarted' && 'Welcome to HextaStudio — Let\'s get started'}
                  {mode === 'signin' && 'Sign in to continue your creative journey'}
                  {mode === 'signup' && 'Join creators making professional content'}
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
                disabled={loading || emailCheckLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:ring-1 focus:ring-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading || emailCheckLoading ? (
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
              <form onSubmit={handleEmailContinue} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Your email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="hi@hextastudio.in"
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Password field - only show for signin/signup */}
                {(mode === 'signin' || mode === 'signup') && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      {mode === 'signup' ? 'Create new password' : 'Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder={mode === 'signup' ? '••••••••••' : 'Enter your password'}
                        disabled={loading}
                        required
                        minLength={6}
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
                )}

                <button
                  type="submit"
                  disabled={loading || emailCheckLoading}
                  className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:ring-1 focus:ring-gray-400 focus:outline-none hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {emailCheckLoading && (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Checking...
                    </>
                  )}
                  {loading && (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Please wait...
                    </>
                  )}
                  {!loading && !emailCheckLoading && mode === 'getstarted' && (
                    <>
                      Create new account
                    </>
                  )}
                  {!loading && !emailCheckLoading && mode === 'signin' && 'Sign In'}
                  {!loading && !emailCheckLoading && mode === 'signup' && 'Create Account'}
                </button>
              </form>

              {/* Mode Toggle - only show for signin/signup modes */}
              {(mode === 'signin' || mode === 'signup') && (
                <div className="text-center mt-6">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {mode === 'signup' ? 'Already have account?' : 'New to Shutr Studio?'}
                  </span>
                  {' '}
                  <button
                    onClick={() => {
                      setMode(mode === 'signup' ? 'signin' : 'signup')
                      setError('')
                      setPassword('')
                    }}
                    className="text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors underline"
                    disabled={loading || emailCheckLoading}
                  >
                    {mode === 'signup' ? 'Login' : 'Sign Up'}
                  </button>
                </div>
              )}

              {/* Free Credits Notice for Signup */}
              {mode === 'signup' && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    🎉 Get 2 free credits when you sign up!
                  </p>
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
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    disabled={loading || emailCheckLoading}
                  >
                    ← Use a different email
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal