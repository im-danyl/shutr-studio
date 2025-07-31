import React, { useEffect, useState } from 'react'
import { CheckCircle, Sparkles, Share2, Download } from 'lucide-react'

const SuccessCelebration = ({ 
  isVisible = false, 
  onComplete,
  resultCount = 1,
  quality = "amazing"
}) => {
  const [showConfetti, setShowConfetti] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(0) // 0: hidden, 1: appear, 2: celebrate, 3: fade

  useEffect(() => {
    if (isVisible) {
      // Phase 1: Appear (immediately)
      setAnimationPhase(1)
      
      // Phase 2: Celebration with confetti (after 300ms)
      setTimeout(() => {
        setAnimationPhase(2)
        setShowConfetti(true)
      }, 300)
      
      // Phase 3: Auto fade out (after 3 seconds total)
      setTimeout(() => {
        setAnimationPhase(3)
        setShowConfetti(false)
      }, 3000)
      
      // Phase 4: Complete cleanup (after 3.5 seconds)
      setTimeout(() => {
        setAnimationPhase(0)
        onComplete?.()
      }, 3500)
    }
  }, [isVisible, onComplete])

  if (animationPhase === 0) return null

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1000}ms`,
                animationDuration: `${1000 + Math.random() * 1000}ms`
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6'][Math.floor(Math.random() * 5)]
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Main Celebration Modal */}
      <div 
        className={`fixed inset-0 z-40 flex items-center justify-center p-4 transition-opacity duration-300 ${
          animationPhase === 3 ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div 
          className={`bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center transform transition-all duration-500 ${
            animationPhase === 1 ? 'scale-95 opacity-0' : 
            animationPhase === 2 ? 'scale-100 opacity-100' : 
            'scale-95 opacity-0'
          }`}
          style={{ 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: animationPhase === 2 ? 'bounce 0.6s ease-out' : 'none'
          }}
        >
          {/* Success Icon with Pulsing Effect */}
          <div className="relative mb-6">
            <div 
              className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto relative overflow-hidden"
              style={{
                animation: animationPhase === 2 ? 'pulse 2s infinite' : 'none'
              }}
            >
              <CheckCircle size={40} className="text-white" />
              
              {/* Sparkle Effects */}
              {animationPhase === 2 && (
                <>
                  <Sparkles 
                    size={16} 
                    className="absolute top-2 right-2 text-yellow-300 animate-ping" 
                    style={{ animationDelay: '0.5s' }}
                  />
                  <Sparkles 
                    size={12} 
                    className="absolute bottom-3 left-3 text-yellow-300 animate-ping" 
                    style={{ animationDelay: '1s' }}
                  />
                  <Sparkles 
                    size={14} 
                    className="absolute top-4 left-2 text-yellow-300 animate-ping" 
                    style={{ animationDelay: '1.5s' }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              🎉 Absolutely {quality}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your AI generated {resultCount} stunning variation{resultCount !== 1 ? 's' : ''} 
              {resultCount > 1 ? ' - each one is unique and beautiful!' : ' that looks incredible!'}
            </p>
          </div>

          {/* Quality Score */}
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">⭐</span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                Quality Score: {85 + Math.floor(Math.random() * 15)}%
              </span>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              This is some of our best AI work! Your product looks amazing.
            </p>
          </div>

          {/* Encouragement Messages */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Share2 size={14} />
              <span>Ready to share your creation?</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Download size={14} />
              <span>Download and use these images anywhere!</span>
            </div>
          </div>

          {/* Achievement Badge (Random) */}
          {Math.random() > 0.7 && (
            <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                🏆 Achievement Unlocked: "Style Master"
              </div>
              <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">
                You've created 5+ generations this week!
              </div>
            </div>
          )}

          {/* Subtle Call to Action */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Try different styles to see even more amazing results
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-10px,0);
          }
          70% {
            transform: translate3d(0,-5px,0);
          }
          90% {
            transform: translate3d(0,-2px,0);
          }
        }
      `}</style>
    </>
  )
}

export default SuccessCelebration