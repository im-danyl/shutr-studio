import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Camera } from 'lucide-react'

const Landing = () => {
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
        <div className="cta-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', marginBottom: '24px' }}>
          <Link 
            to="/signup"
            className="button variant-default size-lg"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Sparkles style={{ marginRight: '8px', width: '20px', height: '20px' }} />
            Start Creating For Free
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              padding: '2px 6px',
              borderRadius: '8px',
              transform: 'rotate(12deg)'
            }}>
              FREE
            </div>
          </Link>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
            🎁 <strong style={{ color: 'var(--accent-solid)' }}>First generation completely free</strong> - No credit card required
          </div>
          <Link 
            to="/styles"
            className="button variant-outline size-lg"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Browse Styles
            <ArrowRight style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
          </Link>
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

        {/* Before/After Examples */}
        <div style={{ marginTop: '64px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '32px' }}>
            See the <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI Magic</span> in Action
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '32px' }}>
            {/* Example 1 */}
            <div className="card p-6">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>BEFORE</p>
                  <img 
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop&crop=center" 
                    alt="Product before styling" 
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', filter: 'grayscale(20%) brightness(0.9)' }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>AFTER AI</p>
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=center" 
                    alt="Product after AI styling" 
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 194, 255, 0.3)' }}
                  />
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500', textAlign: 'center' }}>
                Watch → Modern Minimalist Style
              </p>
            </div>
            
            {/* Example 2 */}
            <div className="card p-6">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>BEFORE</p>
                  <img 
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop&crop=center" 
                    alt="Product before styling" 
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', filter: 'grayscale(20%) brightness(0.9)' }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>AFTER AI</p>
                  <img 
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&h=150&fit=crop&crop=center" 
                    alt="Product after AI styling" 
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 194, 255, 0.3)' }}
                  />
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500', textAlign: 'center' }}>
                Sneakers → Natural Light Beauty
              </p>
            </div>
            
            {/* Example 3 */}
            <div className="card p-6">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>BEFORE</p>
                  <img 
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop&crop=center" 
                    alt="Product before styling" 
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', filter: 'grayscale(20%) brightness(0.9)' }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>AFTER AI</p>
                  <img 
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&h=150&fit=crop&crop=center" 
                    alt="Product after AI styling" 
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 194, 255, 0.3)' }}
                  />
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500', textAlign: 'center' }}>
                Food → Artistic Product Style
              </p>
            </div>
          </div>
          
          {/* Stats & Social Proof */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginTop: '48px', padding: '32px', backgroundColor: 'rgba(0, 194, 255, 0.05)', borderRadius: '16px', border: '1px solid rgba(0, 194, 255, 0.1)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-solid)', marginBottom: '4px' }}>1,247+</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Images Generated</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-solid)', marginBottom: '4px' }}>98%</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Satisfaction Rate</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-solid)', marginBottom: '4px' }}>30s</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Average Generation</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent-solid)', marginBottom: '4px' }}>350+</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Happy Creators</div>
            </div>
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

    </div>
  )
}

export default Landing