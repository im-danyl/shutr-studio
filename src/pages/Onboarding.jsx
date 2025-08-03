import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Camera } from 'lucide-react'

const INDUSTRIES = [
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒', avgCost: 150 },
  { id: 'fashion', name: 'Fashion', icon: '👗', avgCost: 200 },
  { id: 'food', name: 'Food & Beverage', icon: '🍕', avgCost: 120 },
  { id: 'beauty', name: 'Beauty & Cosmetics', icon: '💄', avgCost: 180 },
  { id: 'furniture', name: 'Furniture & Home', icon: '🪑', avgCost: 250 },
  { id: 'tech', name: 'Technology', icon: '📱', avgCost: 200 }
]

const MONTHLY_PHOTO_OPTIONS = [
  { id: '1-10', label: '1-10 photos', value: 5, typical: 'Small business' },
  { id: '11-30', label: '11-30 photos', value: 20, typical: 'Growing business' },
  { id: '31-50', label: '31-50 photos', value: 40, typical: 'Established brand' },
  { id: '51-100', label: '51-100 photos', value: 75, typical: 'Large catalog' },
  { id: '100+', label: '100+ photos', value: 150, typical: 'Enterprise' }
]

const COST_PER_PHOTO_OPTIONS = [
  { id: 'under-50', label: 'Under $50', value: 35, typical: 'DIY/Basic' },
  { id: '50-100', label: '$50-100', value: 75, typical: 'Freelancer' },
  { id: '100-200', label: '$100-200', value: 150, typical: 'Professional' },
  { id: '200-500', label: '$200-500', value: 350, typical: 'Studio/Agency' },
  { id: '500+', label: '$500+', value: 750, typical: 'Premium' }
]

const DELIVERY_TIME_OPTIONS = [
  { id: 'same-day', label: 'Same day', value: 0.5, typical: 'Rush service' },
  { id: '1-2-days', label: '1-2 days', value: 1.5, typical: 'Quick turnaround' },
  { id: '3-7-days', label: '3-7 days', value: 5, typical: 'Standard' },
  { id: '1-2-weeks', label: '1-2 weeks', value: 10, typical: 'Professional' },
  { id: '2-4-weeks', label: '2-4 weeks', value: 21, typical: 'High-end' }
]

const ROLES = [
  { id: 'founder', name: 'Founder/CEO', description: 'Running the business' },
  { id: 'marketing', name: 'Marketing Manager', description: 'Growing the brand' },
  { id: 'agency', name: 'Agency/Freelancer', description: 'Serving clients' },
  { id: 'photographer', name: 'Photographer', description: 'Creating content' }
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  const [monthlyPhotos, setMonthlyPhotos] = useState(0)
  const [costPerPhoto, setCostPerPhoto] = useState(0)
  const [deliveryTime, setDeliveryTime] = useState(0)
  const [selectedPhotoOption, setSelectedPhotoOption] = useState(null)
  const [selectedCostOption, setSelectedCostOption] = useState(null)
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null)
  const navigate = useNavigate()

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const skipOnboarding = () => {
    navigate('/dashboard')
  }

  const goToGenerate = () => {
    navigate('/generate')
  }

  const calculateSavings = () => {
    if (!selectedIndustry || !monthlyPhotos || !costPerPhoto) return { monthly: 0, yearly: 0, timeMonthly: 0, shutrCost: 0 }
    
    const currentMonthlyCost = monthlyPhotos * costPerPhoto
    const currentYearlyCost = currentMonthlyCost * 12
    
    const shutrBasePlans = Math.ceil(monthlyPhotos / 45)
    const shutrMonthlyCost = shutrBasePlans * 8.25
    const shutrYearlyCost = shutrMonthlyCost * 12
    
    const monthlySavings = Math.max(0, currentMonthlyCost - shutrMonthlyCost)
    const yearlySavings = Math.max(0, currentYearlyCost - shutrYearlyCost)
    const timeSavingsMonthly = monthlyPhotos * deliveryTime * 24
    
    return {
      monthly: monthlySavings,
      yearly: yearlySavings,
      timeMonthly: timeSavingsMonthly,
      shutrCost: shutrMonthlyCost,
      currentCost: currentMonthlyCost,
      costPerPhoto: shutrMonthlyCost / monthlyPhotos
    }
  }

  const handlePhotoSelection = (option) => {
    setSelectedPhotoOption(option)
    setMonthlyPhotos(option.value)
  }

  const handleCostSelection = (option) => {
    setSelectedCostOption(option)
    setCostPerPhoto(option.value)
  }

  const handleDeliverySelection = (option) => {
    setSelectedDeliveryOption(option)
    setDeliveryTime(option.value)
  }

  const savings = calculateSavings()

  return (
    <div style={{ height: '100vh', backgroundColor: 'var(--background)', overflow: 'hidden' }}>
      {currentStep === 4 ? (
        // Step 4: Full-screen ROI Calculator
        <div>
          <div style={{ textAlign: 'right', marginBottom: '32px' }}>
            <button 
              onClick={skipOnboarding}
              style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#64748b', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer'
              }}
            >
              Skip
            </button>
          </div>

          <div style={{ display: 'flex', height: '100%' }}>
            {/* Left Side - ONLY Visual Metaphor (40%) */}
            <div style={{ 
              width: '40%',
              backgroundColor: '#F8F9FA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px 32px'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '320px',
                position: 'relative'
              }}>
                {/* Logo */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '48px'
                }}>
                  <Camera size={28} style={{ color: '#3b82f6' }} />
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Shutr Studio</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-around', height: '200px', marginBottom: '24px' }}>
                  {/* Old Way: Heavy Cost */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                      <div style={{ width: '60px', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '4px' }}></div>
                      <div style={{ width: '60px', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '4px' }}></div>
                      <div style={{ width: '60px', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '4px' }}></div>
                      <div style={{ width: '60px', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '4px' }}></div>
                      <div style={{ width: '60px', height: '16px', backgroundColor: '#cbd5e1', borderRadius: '4px', marginBottom: '4px' }}></div>
                    </div>
                    <p style={{ marginTop: '16px', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>
                      $375
                    </p>
                  </div>

                  {/* Arrow */}
                  <div style={{ alignSelf: 'center', marginBottom: '64px', color: '#cbd5e1' }}>
                    <ArrowRight size={32} />
                  </div>

                  {/* New Way: Light Cost */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                      <div style={{ 
                        width: '48px', 
                        height: '16px', 
                        borderRadius: '4px',
                        background: '#00BFFF',
                        boxShadow: '0 4px 8px rgba(0, 191, 255, 0.3)'
                      }}></div>
                    </div>
                    <p style={{ marginTop: '16px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                      $8.25
                    </p>
                  </div>
                </div>
                
                <p style={{ 
                  textAlign: 'center', 
                  color: '#64748b', 
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}>
                  From a heavy monthly cost to a fraction of the price.
                </p>
              </div>
            </div>

            {/* Right Side - ALL Text Content (60%) */}
            <div style={{ 
              width: '60%',
              padding: '48px 64px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <p style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: '#00BFFF',
                marginBottom: '8px'
              }}>
                ROI Calculator
              </p>
              
              <h1 style={{ 
                fontSize: '42px', 
                fontWeight: '800', 
                color: '#1e293b', 
                marginBottom: '20px', 
                lineHeight: '1.1',
                letterSpacing: '-0.025em'
              }}>
                Save ${savings.yearly.toLocaleString()} Per Year
              </h1>
              
              <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px' }}>
                Switching to AI-powered photography doesn't just save money, it transforms your workflow. Here's how your monthly costs change.
              </p>

              <div style={{ marginBottom: '40px' }}>
                {/* Current Workflow */}
                <div style={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '16px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                        Your Current Workflow
                      </h3>
                      <p style={{ fontSize: '14px', color: '#64748b' }}>
                        60 hours waiting time
                      </p>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#374151' }}>
                      $175
                    </div>
                  </div>
                </div>
                
                {/* With Shutr AI */}
                <div style={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 0 0 2px rgba(0, 191, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                        With Shutr AI
                      </h3>
                      <p style={{ 
                        fontSize: '14px',
                        color: '#00BFFF',
                        fontWeight: '500'
                      }}>
                        Instant delivery (30 seconds)
                      </p>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                      $8.25
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div>
                <button 
                  onClick={nextStep}
                  className="button variant-default"
                  style={{
                    width: '100%',
                    fontSize: '18px',
                    fontWeight: '600',
                    padding: '14px 28px'
                  }}
                >
                  Start Saving Now
                </button>
                <p style={{ 
                  marginTop: '16px', 
                  textAlign: 'center', 
                  fontSize: '14px', 
                  color: '#64748b' 
                }}>
                  Try 2 photos free • No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', height: '100vh' }}>
          
          {/* Left Preview Panel - 35% */}
          <div style={{ 
            width: '35%', 
            backgroundColor: '#f8fafc',
            padding: '60px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius)',
              padding: '32px',
              width: '100%',
              maxWidth: '280px',
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
              {currentStep === 1 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
                    Before vs After
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius)' }} />
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                    <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--accent-soft)', borderRadius: 'var(--radius)' }} />
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
                    Industry Selection
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ padding: '8px', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius)', fontSize: '12px' }}>E-commerce</div>
                    <div style={{ padding: '8px', backgroundColor: 'var(--accent-solid)', color: 'white', borderRadius: 'var(--radius)', fontSize: '12px' }}>Fashion</div>
                    <div style={{ padding: '8px', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius)', fontSize: '12px' }}>Food</div>
                    <div style={{ padding: '8px', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius)', fontSize: '12px' }}>Beauty</div>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
                    Current Costs
                  </h3>
                  <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius)' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>$150</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>per photo</div>
                  </div>
                </div>
              )}
              {currentStep === 5 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
                    Get Started
                  </h3>
                  <div style={{ padding: '16px', backgroundColor: 'var(--accent-soft)', borderRadius: 'var(--radius)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--accent-solid)', fontWeight: '600' }}>2 free credits</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Content Panel - 65% */}
          <div style={{ 
            width: '65%', 
            backgroundColor: 'var(--surface)',
            padding: '60px 48px'
          }}>
          {/* Header */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                ROI Calculator
              </h1>
              <button 
                onClick={skipOnboarding}
                style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-muted)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer'
                }}
              >
                Skip
              </button>
            </div>
            
            {/* Progress Bar */}
            <div style={{ 
              width: '100%',
              height: '3px',
              backgroundColor: 'var(--border)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${(currentStep / 5) * 100}%`,
                backgroundColor: 'var(--accent-solid)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Step 1: Before/After Demo */}
          {currentStep === 1 && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'space-between'
            }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Transform Product Photos Instantly
                </h2>
                <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                  See the difference between traditional photography and AI enhancement
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: '1' }}>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Before</div>
                  <div style={{ 
                    width: '100%', 
                    aspectRatio: '1',
                    borderRadius: 'var(--radius)', 
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ 
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      <div style={{ marginBottom: '8px', fontSize: '24px', opacity: 0.5 }}>📷</div>
                      <div>Traditional Photo</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>$150+ per photo • 2-5 days</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--accent-solid)', marginBottom: '12px' }}>After</div>
                  <div style={{ 
                    width: '100%', 
                    aspectRatio: '1',
                    borderRadius: 'var(--radius)', 
                    border: '2px solid var(--accent-solid)',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, var(--accent-gradient))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ 
                      textAlign: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      <div style={{ marginBottom: '8px', fontSize: '24px' }}>✨</div>
                      <div>AI Enhanced</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--accent-soft)', borderRadius: 'var(--radius)' }}>
                    <div style={{ fontSize: '13px', color: 'var(--accent-solid)', fontWeight: '500' }}>$8.25 per photo • 30 seconds</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={nextStep}
                className="button variant-default"
                style={{ 
                  width: '100%',
                  padding: '14px 24px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Calculate Your Savings <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          )}

          {/* Step 2: Industry & Role Selection */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>
                About Your Business
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                Help us calculate accurate savings for your industry
              </p>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '12px', display: 'block' }}>
                  Industry
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  {INDUSTRIES.map((industry) => (
                    <button
                      key={industry.id}
                      onClick={() => setSelectedIndustry(industry)}
                      style={{
                        padding: '16px',
                        border: selectedIndustry?.id === industry.id ? '2px solid var(--accent-solid)' : '1px solid var(--border)',
                        background: selectedIndustry?.id === industry.id ? 'var(--accent-soft)' : 'var(--surface)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        borderRadius: 'var(--radius)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{industry.icon}</div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{industry.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '12px', display: 'block' }}>
                  Role
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role)}
                      style={{
                        padding: '16px',
                        border: selectedRole?.id === role.id ? '2px solid var(--accent-solid)' : '1px solid var(--border)',
                        background: selectedRole?.id === role.id ? 'var(--accent-soft)' : 'var(--surface)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: 'var(--radius)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-primary)' }}>{role.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{role.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={selectedIndustry && selectedRole ? nextStep : undefined}
                className="button variant-default"
                style={{ 
                  padding: '12px 24px',
                  opacity: selectedIndustry && selectedRole ? 1 : 0.4,
                  cursor: selectedIndustry && selectedRole ? 'pointer' : 'not-allowed'
                }}
                disabled={!selectedIndustry || !selectedRole}
              >
                Continue <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          )}

          {/* Step 3: Current Situation */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>
                Current Photography Costs
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                Help us understand your current workflow to calculate savings
              </p>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '12px', display: 'block' }}>
                  How many photos do you need per month?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {MONTHLY_PHOTO_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handlePhotoSelection(option)}
                      style={{
                        padding: '16px',
                        border: selectedPhotoOption?.id === option.id ? '2px solid var(--accent-solid)' : '1px solid var(--border)',
                        background: selectedPhotoOption?.id === option.id ? 'var(--accent-soft)' : 'var(--surface)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        borderRadius: 'var(--radius)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-primary)' }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {option.typical}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '12px', display: 'block' }}>
                  Current cost per photo?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  {COST_PER_PHOTO_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleCostSelection(option)}
                      style={{
                        padding: '16px',
                        border: selectedCostOption?.id === option.id ? '2px solid var(--accent-solid)' : '1px solid var(--border)',
                        background: selectedCostOption?.id === option.id ? 'var(--accent-soft)' : 'var(--surface)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        borderRadius: 'var(--radius)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-primary)' }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {option.typical}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '12px', display: 'block' }}>
                  Current delivery time?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  {DELIVERY_TIME_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleDeliverySelection(option)}
                      style={{
                        padding: '16px',
                        border: selectedDeliveryOption?.id === option.id ? '2px solid var(--accent-solid)' : '1px solid var(--border)',
                        background: selectedDeliveryOption?.id === option.id ? 'var(--accent-soft)' : 'var(--surface)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        borderRadius: 'var(--radius)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: 'var(--text-primary)' }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {option.typical}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={selectedPhotoOption && selectedCostOption && selectedDeliveryOption ? nextStep : undefined}
                className="button variant-default"
                style={{ 
                  padding: '12px 24px',
                  opacity: selectedPhotoOption && selectedCostOption && selectedDeliveryOption ? 1 : 0.4,
                  cursor: selectedPhotoOption && selectedCostOption && selectedDeliveryOption ? 'pointer' : 'not-allowed'
                }}
                disabled={!selectedPhotoOption || !selectedCostOption || !selectedDeliveryOption}
              >
                Calculate Savings <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          )}


          {/* Step 5: Try Free */}
          {currentStep === 5 && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>
                Ready to Save ${savings.yearly.toLocaleString()} Per Year?
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                Start with 2 free credits - no payment required
              </p>

              <div style={{ 
                padding: '32px', 
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                marginBottom: '32px',
                maxWidth: '400px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>
                  What you get:
                </h3>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Check size={16} style={{ color: 'var(--accent-solid)' }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>2 free AI transformations</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Check size={16} style={{ color: 'var(--accent-solid)' }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>50+ professional styles</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Check size={16} style={{ color: 'var(--accent-solid)' }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Instant results (30 seconds)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Check size={16} style={{ color: 'var(--accent-solid)' }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>High-resolution downloads</span>
                  </div>
                </div>

                <button 
                  onClick={goToGenerate}
                  className="button variant-default"
                  style={{ width: '100%', padding: '12px 24px', justifyContent: 'center' }}
                >
                  Generate My First Photo <Camera size={16} style={{ marginLeft: '8px' }} />
                </button>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Takes 30 seconds • No sign-up required for trial
              </p>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  )
}