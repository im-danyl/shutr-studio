import React from 'react'
import { Link } from 'react-router-dom'
import { Camera } from 'lucide-react'

const LandingHeader = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="container" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center" style={{ gap: '8px' }}>
            <Camera style={{ width: '32px', height: '32px', color: 'var(--accent-solid)' }} />
            <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Shutr Studio</span>
          </Link>

          {/* Centered Navigation */}
          <nav className="flex items-center justify-center flex-1" style={{ gap: '32px' }}>
            <button 
              onClick={() => scrollToSection('features')}
              style={{ 
                color: 'var(--text-muted)', 
                transition: 'color 0.2s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Features
            </button>
            <Link 
              to="/styles" 
              style={{ color: 'var(--text-muted)', transition: 'color 0.2s ease' }}
            >
              Gallery
            </Link>
            <button 
              onClick={() => scrollToSection('pricing')}
              style={{ 
                color: 'var(--text-muted)', 
                transition: 'color 0.2s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              style={{ 
                color: 'var(--text-muted)', 
                transition: 'color 0.2s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              How It Works
            </button>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center" style={{ gap: '12px' }}>
            <button className="button variant-outline size-default">
              Sign In
            </button>
            <Link to="/generate" className="button variant-default size-default">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default LandingHeader