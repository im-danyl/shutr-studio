import React from 'react'
import { Coins, AlertTriangle, CheckCircle } from 'lucide-react'

const CreditCostPreview = ({ 
  variantCount = 1, 
  userCredits = 0, 
  className = "",
  showDetails = true 
}) => {
  const totalCost = variantCount
  const hasEnoughCredits = userCredits >= totalCost
  const remainingCredits = userCredits - totalCost

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Cost Breakdown */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Generation Cost
          </h3>
          <div className="flex items-center gap-1">
            <Coins size={14} className="text-orange-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {totalCost} credit{totalCost !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Variants selected:</span>
              <span>{variantCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Cost per variant:</span>
              <span>1 credit</span>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-600 my-2"></div>
            <div className="flex justify-between font-medium text-gray-700 dark:text-gray-300">
              <span>Total cost:</span>
              <span>{totalCost} credit{totalCost !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </div>

      {/* Credit Status */}
      <div className={`p-4 rounded-lg border ${
        hasEnoughCredits 
          ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
          : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
      }`}>
        <div className="flex items-center gap-3">
          {hasEnoughCredits ? (
            <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
          ) : (
            <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
          )}
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Credits
              </span>
              <span className={`text-sm font-bold ${
                hasEnoughCredits 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {userCredits}
              </span>
            </div>
            
            {hasEnoughCredits ? (
              <p className="text-xs text-green-600 dark:text-green-400">
                You'll have {remainingCredits} credit{remainingCredits !== 1 ? 's' : ''} remaining after generation
              </p>
            ) : (
              <p className="text-xs text-red-600 dark:text-red-400">
                You need {totalCost - userCredits} more credit{(totalCost - userCredits) !== 1 ? 's' : ''} to generate {variantCount} variant{variantCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Credit Info */}
      {!hasEnoughCredits && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
            💡 Reduce the number of variants or get more credits to continue
          </p>
        </div>
      )}
    </div>
  )
}

export default CreditCostPreview