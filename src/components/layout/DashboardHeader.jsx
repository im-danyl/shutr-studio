import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Camera, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import CreditBalance from '../credits/CreditBalance'

const DashboardHeader = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, signOut, initialize } = useAuthStore()
  
  const isActive = (path) => location.pathname === path

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleSignOut = async () => {
    try {
      await signOut()
      setUserMenuOpen(false)
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="container" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/generate" className="flex items-center" style={{ gap: '8px' }}>
            <Camera style={{ width: '28px', height: '28px', color: 'var(--accent-solid)' }} />
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>Shutr Studio</span>
          </Link>

          {/* Main Navigation */}
          <nav className="flex items-center" style={{ gap: '24px' }}>
            <Link 
              to="/generate" 
              style={{ 
                color: isActive('/generate') ? 'var(--accent-solid)' : 'var(--text-muted)',
                fontWeight: isActive('/generate') ? '600' : '400',
                transition: 'color 0.2s ease'
              }}
            >
              Generate
            </Link>
            <Link 
              to="/history" 
              style={{ 
                color: isActive('/history') ? 'var(--accent-solid)' : 'var(--text-muted)',
                fontWeight: isActive('/history') ? '600' : '400',
                transition: 'color 0.2s ease'
              }}
            >
              History
            </Link>
            <Link 
              to="/styles" 
              style={{ 
                color: isActive('/styles') ? 'var(--accent-solid)' : 'var(--text-muted)',
                fontWeight: isActive('/styles') ? '600' : '400',
                transition: 'color 0.2s ease'
              }}
            >
              Styles
            </Link>
          </nav>

          {/* Credit Balance */}
          <CreditBalance />

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center"
              style={{
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <User style={{ width: '20px', height: '20px' }} />
              <span style={{ fontSize: '14px' }}>
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account'}
              </span>
              <ChevronDown 
                style={{ 
                  width: '16px', 
                  height: '16px',
                  transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} 
              />
            </button>

            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  marginTop: '8px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '8px 0',
                  minWidth: '180px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  zIndex: 50
                }}
              >
                <Link
                  to="/settings"
                  className="flex items-center"
                  style={{
                    gap: '12px',
                    padding: '12px 16px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s ease'
                  }}
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '14px' }}>Settings</span>
                </Link>
                <button
                  className="flex items-center w-full"
                  style={{
                    gap: '12px',
                    padding: '12px 16px',
                    color: 'var(--text-danger)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onClick={handleSignOut}
                >
                  <LogOut style={{ width: '16px', height: '16px' }} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader