import React from 'react'
import { Link } from 'react-router-dom'
import { Upload, Palette, Download, Plus } from 'lucide-react'
import CreditBalance from '../components/credits/CreditBalance'

const Dashboard = () => {
  return (
    <div className="main-container">
      <div className="content-container">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <h2 style={{ marginBottom: '8px' }}>
                Welcome to Shutr Studio
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                Transform your product photos with AI-powered styling
              </p>
            </div>
            <CreditBalance />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/generate"
            className="card p-6"
            style={{ textDecoration: 'none', transition: 'all 0.2s ease' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(0, 194, 255, 0.1)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus style={{ width: '24px', height: '24px', color: 'var(--accent-solid)' }} />
              </div>
              <span className="caption" style={{ color: 'var(--text-muted)' }}>Start here</span>
            </div>
            <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px' }}>Generate Image</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Upload your product and create styled variations
            </p>
          </Link>

          <Link 
            to="/styles"
            className="card p-6"
            style={{ textDecoration: 'none', transition: 'all 0.2s ease' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(0, 194, 255, 0.1)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Palette style={{ width: '24px', height: '24px', color: 'var(--accent-solid)' }} />
              </div>
              <span className="caption" style={{ color: 'var(--text-muted)' }}>50+ styles</span>
            </div>
            <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px' }}>Browse Styles</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Explore our curated collection of style references
            </p>
          </Link>

          <div className="card p-6" style={{ backgroundColor: 'var(--border)', opacity: '0.7' }}>
            <div className="flex items-center justify-between mb-4">
              <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Download style={{ width: '24px', height: '24px', color: 'var(--text-muted)' }} />
              </div>
              <span className="caption" style={{ color: 'var(--text-muted)' }}>Coming soon</span>
            </div>
            <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px', color: 'var(--text-muted)' }}>My Generations</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              View and download your previous generations
            </p>
          </div>
        </div>

        {/* Account Status */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontWeight: '600', fontSize: '20px' }}>Account Status</h3>
            <span style={{ padding: '4px 12px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '14px', borderRadius: '20px' }}>
              Active
            </span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="caption" style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Available Credits</h3>
              <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>2</p>
              <p className="caption" style={{ color: 'var(--text-muted)' }}>1 credit = 1 variation</p>
            </div>
            
            <div>
              <h3 className="caption" style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Generations Created</h3>
              <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>0</p>
              <p className="caption" style={{ color: 'var(--text-muted)' }}>Total generations</p>
            </div>
            
            <div>
              <h3 className="caption" style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Account Type</h3>
              <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Free</p>
              <p className="caption" style={{ color: 'var(--text-muted)' }}>MVP testing account</p>
            </div>
          </div>
        </div>

        {/* Recent Activity - Empty State */}
        <div>
          <h3 style={{ fontWeight: '600', fontSize: '20px', marginBottom: '16px' }}>Recent Activity</h3>
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <Upload style={{ width: '48px', height: '48px', color: 'var(--text-muted)', margin: '0 auto 16px auto' }} />
            <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px' }}>No generations yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
              Start by uploading a product image and selecting a style
            </p>
            <Link 
              to="/generate"
              className="button variant-default"
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              Create Your First Generation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard