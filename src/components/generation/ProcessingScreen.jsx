import React from 'react'
import { RefreshCw, Sparkles, Clock, Zap } from 'lucide-react'

const ProcessingScreen = ({ 
  progress = 0, 
  currentStep = '', 
  variantCount = 1,
  onCancel,
  canCancel = false,
  estimatedTime = 45,
  isRecovering = false
}) => {
  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-orange-500'
    if (progress < 70) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStepIcon = (step) => {
    if (step.includes('credit')) return <Zap size={16} className="text-orange-500" />
    if (step.includes('analy')) return <RefreshCw size={16} className="text-blue-500 animate-spin" />
    if (step.includes('generat')) return <Sparkles size={16} className="text-purple-500 animate-pulse" />
    return <RefreshCw size={16} className="text-gray-500 animate-spin" />
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Processing Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} className="text-white animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isRecovering ? 'Resuming Your Generation' : 'AI is Creating Your Photos'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400">
            {isRecovering 
              ? `Continuing with ${variantCount} variant${variantCount !== 1 ? 's' : ''} of your product`
              : `Generating ${variantCount} high-quality variant${variantCount !== 1 ? 's' : ''} of your product`
            }
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {progress}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        {currentStep && (
          <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            {getStepIcon(currentStep)}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentStep}
            </span>
          </div>
        )}

        {/* Time Estimate */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Clock size={14} />
          <span>
            Estimated time: {Math.ceil((estimatedTime * (100 - progress)) / 100)} seconds remaining
          </span>
        </div>

        {/* Cancel Button */}
        {canCancel && onCancel && (
          <div className="text-center">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel Generation
            </button>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          💡 While you wait:
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• AI is analyzing your product image for optimal composition</li>
          <li>• Style elements are being carefully applied to maintain product integrity</li>
          <li>• Multiple variations ensure you get the perfect shot</li>
        </ul>
      </div>

      {/* Recovery/Warning Section */}
      {isRecovering ? (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
            ✅ Generation Recovered:
          </h3>
          <p className="text-sm text-green-700 dark:text-green-400">
            Your generation is continuing from where it left off. Your credits are safe!
          </p>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-2">
            ⚠️ Important:
          </h3>
          <p className="text-sm text-orange-700 dark:text-orange-400">
            Your generation is now persistent! You can safely refresh or navigate away - it will continue in the background.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProcessingScreen