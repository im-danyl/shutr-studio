import React, { useEffect } from 'react'
import { Coins, RefreshCw } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useCreditStore from '../../store/creditStore'

const CreditBalance = ({ className = "" }) => {
  const { user } = useAuthStore()
  const { credits, loading, fetchCredits } = useCreditStore()

  useEffect(() => {
    if (user) {
      fetchCredits(user.id)
    }
  }, [user, fetchCredits])

  const handleRefresh = () => {
    if (user) {
      fetchCredits(user.id)
    }
  }

  if (!user) return null

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-700 dark:bg-gray-600 rounded-full">
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
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {credits}
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-0.5 hover:bg-white/30 dark:hover:bg-gray-700/30 rounded transition-colors disabled:opacity-50 opacity-60 hover:opacity-100"
          title="Refresh credit balance"
        >
          <RefreshCw size={10} className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  )
}

export default CreditBalance