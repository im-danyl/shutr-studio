import React, { useEffect, useState } from 'react'
import { Coins, RefreshCw } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const CreditBalance = ({ className = "" }) => {
  const [credits, setCredits] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user, getUserProfile } = useAuthStore()

  const fetchCredits = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const profile = await getUserProfile()
      setCredits(profile?.credits || 0)
    } catch (error) {
      console.error('Error fetching credits:', error)
      setCredits(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCredits()
  }, [user])

  if (!user) return null

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full">
            <Coins size={14} className="text-white" />
          </div>
          
          {loading ? (
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin text-gray-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Loading...
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Credits:
              </span>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                {credits}
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={fetchCredits}
          disabled={loading}
          className="p-1 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded transition-colors disabled:opacity-50"
          title="Refresh credit balance"
        >
          <RefreshCw size={12} className={`text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  )
}

export default CreditBalance