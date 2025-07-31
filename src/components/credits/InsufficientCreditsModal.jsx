import React from 'react'
import { X, AlertTriangle, Coins, CreditCard, Gift } from 'lucide-react'

const InsufficientCreditsModal = ({ 
  isOpen, 
  onClose, 
  currentCredits = 0, 
  requiredCredits = 1,
  variantCount = 1 
}) => {
  const creditsNeeded = requiredCredits - currentCredits

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Insufficient Credits
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current situation */}
          <div className="text-center space-y-3">
            <p className="text-gray-600 dark:text-gray-400">
              You need <span className="font-semibold text-red-600 dark:text-red-400">{creditsNeeded} more credit{creditsNeeded !== 1 ? 's' : ''}</span> to generate {variantCount} variant{variantCount !== 1 ? 's' : ''}
            </p>
            
            <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                  {currentCredits}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Current
                </div>
              </div>
              <div className="text-gray-400 dark:text-gray-500">→</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {requiredCredits}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Required
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              What would you like to do?
            </h3>
            
            {/* Reduce variants option */}
            <button 
              onClick={() => {
                // This would be handled by parent component
                onClose()
              }}
              className="w-full p-3 text-left bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50">
                  <Coins size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Reduce variants to {currentCredits}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Generate fewer images with your current credits
                  </div>
                </div>
              </div>
            </button>

            {/* Get more credits option */}
            <button className="w-full p-3 text-left bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-900/50">
                  <CreditCard size={14} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-green-700 dark:text-green-300">
                    Get more credits
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    Purchase credit packages to continue
                  </div>
                </div>
              </div>
            </button>

            {/* Invite friends option */}
            <button className="w-full p-3 text-left bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/30 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50">
                  <Gift size={14} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Invite friends for free credits
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    Get 1 credit for each friend who joins
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}

export default InsufficientCreditsModal