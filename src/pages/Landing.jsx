import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Camera } from 'lucide-react'
import AuthModal from '../components/auth/AuthModal'

const Landing = () => {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'getstarted' })

  const openAuthModal = (mode = 'getstarted') => {
    setAuthModal({ isOpen: true, mode })
  }

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'getstarted' })
  }
  return (
    <div className="main-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 style={{ marginBottom: '24px' }}>
            Transform Your Product Photos with 
            <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> AI</span>
          </h1>
          <p style={{ fontSize: '20px', color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto' }}>
            Upload your product image, choose from curated style references, and get professional-quality styled photos in seconds.
          </p>
        </div>

        {/* CTA Buttons */}
        <style>{`
          @media (min-width: 640px) {
            .cta-buttons { flex-direction: row !important; }
          }
        `}</style>
        <div className="cta-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
          <button 
            onClick={() => openAuthModal('getstarted')}
            className="button variant-default size-lg"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Sparkles style={{ marginRight: '8px', width: '20px', height: '20px' }} />
            Get Started Free
          </button>
          <button 
            onClick={() => openAuthModal('getstarted')}
            className="button variant-outline size-lg"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Browse Styles
            <ArrowRight style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Features */}
        <style>{`
          .features-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: left;
          }
          @media (min-width: 768px) {
            .features-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        `}</style>
        <div className="features-grid">
          <div className="card p-6">
            <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(0, 194, 255, 0.1)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Sparkles style={{ width: '24px', height: '24px', color: 'var(--accent-solid)' }} />
            </div>
            <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px' }}>AI-Powered Styling</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Advanced AI transforms your products with professional styling techniques.
            </p>
          </div>
          
          <div className="card p-6">
            <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(0, 194, 255, 0.1)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Camera style={{ width: '24px', height: '24px', color: 'var(--accent-solid)' }} />
            </div>
            <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px' }}>Curated Styles</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Choose from 50+ professionally curated style references.
            </p>
          </div>
          
          <div className="card p-6">
            <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(0, 194, 255, 0.1)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ArrowRight style={{ width: '24px', height: '24px', color: 'var(--accent-solid)' }} />
            </div>
            <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px' }}>Instant Results</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Get 1-4 styled variations of your product in under a minute.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', flexWrap: 'wrap', fontSize: '14px', color: 'var(--text-muted)' }}>
            <span>✓ 2 Free Credits</span>
            <span>✓ No Credit Card Required</span>
            <span>✓ AI-Powered</span>
            <span>✓ Instant Download</span>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        mode={authModal.mode}
      />
    </div>
  )
}

export default Landing