import React from 'react'
import { Link } from 'react-router-dom'
import { Camera, User } from 'lucide-react'

const Header = () => {
  // TODO: Replace with real auth state from Zustand store
  const isAuthenticated = false // This will be replaced with useAuthStore()
  const user = null // This will be replaced with user data
  const credits = 2 // This will be replaced with real credits

  return (
    <header style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="container" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center" style={{ gap: '8px' }}>
            <Camera style={{ width: '32px', height: '32px', color: 'var(--accent-solid)' }} />
            <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Shutr Studio</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center" style={{ gap: '24px' }}>
            {!isAuthenticated ? (
              // Public Navigation (for visitors)
              <>
                <Link 
                  to="/" 
                  style={{ color: 'var(--text-muted)', transition: 'color 0.2s ease' }}
                >
                  Home
                </Link>
                <Link 
                  to="/styles" 
                  style={{ color: 'var(--text-muted)', transition: 'color 0.2s ease' }}
                >
                  Browse Styles
                </Link>
                <button className="button variant-default size-default">
                  Sign In
                </button>
              </>
            ) : (
              // App Navigation (for authenticated users)
              <>
                <Link 
                  to="/generate" 
                  style={{ color: 'var(--text-muted)', transition: 'color 0.2s ease' }}
                >
                  Generate
                </Link>
                <Link 
                  to="/styles" 
                  style={{ color: 'var(--text-muted)', transition: 'color 0.2s ease' }}
                >
                  Styles
                </Link>
                <Link 
                  to="/dashboard" 
                  style={{ color: 'var(--text-muted)', transition: 'color 0.2s ease' }}
                >
                  Dashboard
                </Link>
                
                {/* User Section */}
                <div className="flex items-center" style={{ gap: '16px' }}>
                  {/* Credits Display */}
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Credits: {credits}
                  </span>
                  
                  {/* User Menu */}
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: 'var(--accent-solid)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <User style={{ width: '16px', height: '16px', color: 'white' }} />
                    </div>
                    <button 
                      className="button variant-outline size-sm"
                      style={{ fontSize: '14px' }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header