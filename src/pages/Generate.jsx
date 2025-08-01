import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useCreditStore from '../store/creditStore';
import CreditCostPreview from '../components/credits/CreditCostPreview';
import InsufficientCreditsModal from '../components/credits/InsufficientCreditsModal';
import SuccessCelebration from '../components/ui/SuccessCelebration';
import { useStyleReferences } from '../hooks/useStyleReferences';
import FilterBar from '../components/styles/FilterBar';
import StyleGrid from '../components/styles/StyleGrid';


// Utility function for className merging
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// SVG Icons as inline components
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    <circle cx="9" cy="9" r="2"/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const RefreshCwIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v6h6"/>
    <path d="M21 12A9 9 0 0 0 6 5.3L3 8"/>
    <path d="M21 22v-6h-6"/>
    <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/>
  </svg>
);


// Reusable Card component
const Card = ({ children, className, ...props }) => (
  <div 
    className={cn("card", className)}
    {...props}
  >
    {children}
  </div>
);

// Button component
const Button = ({ children, variant = "default", size = "default", className, disabled, onClick, ...props }) => {
  return (
    <button
      className={cn('button', `variant-${variant}`, `size-${size}`, className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Select components
const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const selectRef = React.useRef(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="select-container" ref={selectRef}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          isOpen, 
          setIsOpen, 
          value: internalValue, 
          setValue: (newValue) => {
            setInternalValue(newValue);
            onValueChange?.(newValue);
          }
        })
      )}
    </div>
  );
};

const SelectTrigger = ({ children, className, isOpen, setIsOpen }) => (
  <button
    className={cn("select-trigger", className)}
    onClick={() => setIsOpen(!isOpen)}
  >
    {children}
    <ChevronDownIcon style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
  </button>
);

const SelectValue = ({ placeholder, value }) => <span>{value || placeholder}</span>;

const SelectContent = ({ children, isOpen }) => (
  isOpen && (
    <div className="select-content">
      {children}
    </div>
  )
);

const SelectItem = ({ children, value, setIsOpen, setValue }) => (
  <div
    className="select-item"
    onClick={() => {
      setValue(value);
      setIsOpen(false);
    }}
  >
    {children}
  </div>
);


// Slider component
const Slider = ({ value, onValueChange, min, max, step, className }) => {
  const handleChange = (e) => {
    onValueChange([parseInt(e.target.value)]);
  };
  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          className={cn("slider", className)}
          style={{'--percentage': `${percentage}%`}}
        />
    </div>
  );
};

// Step Wizard Component
const StepWizard = ({ steps, currentStep }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Card style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
                            <div
                                className="step-circle"
                                style={{
                                    borderColor: step.number <= currentStep ? 'var(--accent-solid)' : 'var(--border)',
                                    backgroundColor: step.number < currentStep ? 'var(--accent-solid)' : 'var(--surface)',
                                    color: step.number < currentStep ? '#FFFFFF' : 'var(--text-primary)',
                                }}
                            >
                                {step.number < currentStep ? <CheckIcon /> : <span style={{ fontSize: '14px', fontWeight: '500' }}>{step.number}</span>}
                            </div>
                            
                            <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                                <h3 className="h3-step" style={{ color: step.number <= currentStep ? 'var(--text-primary)' : 'var(--text-muted)'}}>
                                    {step.title}
                                </h3>
                                {!isMobile && <p className="caption" style={{ color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>
                                    {step.description}
                                </p>}
                            </div>
                        </div>
                        
                        {index < steps.length - 1 && (
                            <div
                                className="step-connector"
                                style={{
                                    backgroundColor: step.number < currentStep ? 'var(--accent-solid)' : 'var(--border)',
                                    display: isMobile ? 'none' : 'block'
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </Card>
    );
};


// Upload Dropzone Component
const UploadDropzone = ({ onFileUploaded, accept = 'image/*', className, maxSize = 10 * 1024 * 1024 }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.size <= maxSize && file.type.startsWith('image/')) {
        setIsUploading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate upload
        onFileUploaded(file);
        setIsUploading(false);
      } else {
        console.error("File is too large or not an image.");
      }
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate upload
      onFileUploaded(file);
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  return (
    <Card
      className={cn("upload-zone", isDragActive && "drag-active", isUploading && "uploading", className)}
      style={{ padding: '32px' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current.click()}
    >
      <input 
        type="file" 
        accept={accept} 
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div className="upload-icon-wrapper">
          {isUploading ? (
            <div className="spinner" />
          ) : (
            <UploadIcon />
          )}
        </div>
        
        <div>
          <h3 className="h3" style={{ marginBottom: '8px' }}>
            {isUploading ? 'Processing...' : 'Upload your image'}
          </h3>
          
          {!isUploading && (
            <>
              <p className="body" style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
                {isDragActive ? 'Drop your image here...' : 'Drag & drop, or click to browse'}
              </p>
              <p className="caption" style={{ color: 'var(--text-muted)' }}>
                Max file size: {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};



// Settings Accordion Component
const SettingsAccordion = ({ settings, onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  const updateSetting = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <Card>
      <div>
        <button className="accordion-trigger" onClick={() => setIsOpen(!isOpen)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '500' }}>Generation Settings</span>
            <span className="caption" style={{ color: 'var(--text-muted)' }}>(Optional)</span>
          </div>
          <ChevronDownIcon style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>
        
        {isOpen && (
          <div style={{ padding: '0 24px 24px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-group">
                <label className="form-label">Aspect Ratio</label>
                <Select value={settings.aspectRatio} onValueChange={(value) => updateSetting('aspectRatio', value)}>
                  <SelectTrigger><SelectValue value={settings.aspectRatio} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                    <SelectItem value="4:3">Landscape (4:3)</SelectItem>
                    <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                    <SelectItem value="16:9">Wide (16:9)</SelectItem>
                    <SelectItem value="9:16">Tall (9:16)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label className="form-label">Quality</label>
                  <span className="caption" style={{ color: 'var(--text-muted)' }}>{settings.quality}%</span>
                </div>
                <Slider value={[settings.quality]} onValueChange={(value) => updateSetting('quality', value[0])} min={50} max={100} step={10} />
              </div>
              <div className="form-group">
                <label className="form-label">Number of Variants</label>
                <Select value={settings.variants.toString()} onValueChange={(value) => updateSetting('variants', parseInt(value))}>
                  <SelectTrigger><SelectValue value={`${settings.variants} variant${settings.variants > 1 ? 's' : ''}`} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 variant</SelectItem>
                    <SelectItem value="2">2 variants</SelectItem>
                    <SelectItem value="3">3 variants</SelectItem>
                    <SelectItem value="4">4 variants</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Generated Gallery Component
const GeneratedGallery = ({ images, isLoading, productImage, referenceImage, settings }) => {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Card style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="spinner-wrapper"><div className="spinner" /></div>
            <div>
              <h3 className="h3" style={{ margin: 0 }}>Generating your photos...</h3>
              <p className="body" style={{ color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>
                This usually takes 30-60 seconds
              </p>
            </div>
          </div>
        </Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {Array.from({ length: settings.variants }).map((_, i) => (
            <Card key={i} className="skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Card style={{ padding: '24px' }}>
          <h3 className="h3-card" style={{ marginBottom: '16px' }}>Source Images</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {referenceImage && (
              <div style={{ textAlign: 'center' }}>
                <img src={referenceImage} alt="Reference style" className="source-image"/>
                <p className="caption" style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Reference Style</p>
              </div>
            )}
            {productImage && (
              <div style={{ textAlign: 'center' }}>
                <img src={productImage} alt="Product" className="source-image"/>
                <p className="caption" style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Your Product</p>
              </div>
            )}
          </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        {images.map((image, index) => (
          <Card key={index} className="generated-card group">
            <div className="image-wrapper">
              <img src={image} alt={`Generated ${index + 1}`} />
              <div className="hover-overlay">
                <Button size="sm" variant="secondary"><DownloadIcon style={{ marginRight: '8px' }} />Download</Button>
                <Button size="sm" variant="secondary"><HeartIcon /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Main Generate Page Component
const Generate = () => {
  const [selectedReference, setSelectedReference] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [productImage, setProductImage] = useState(null);
  const [customReference, setCustomReference] = useState(null);
  const [settings, setSettings] = useState({
    aspectRatio: '1:1',
    quality: 80,
    variants: 4
  });
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);
  const [showSuccessCelebration, setShowSuccessCelebration] = useState(false);
  
  // Auth and Credit stores
  const { user } = useAuthStore();
  const { credits, fetchCredits, consumeCredits, checkCreditsAvailable } = useCreditStore();

  // Filter states for style library
  const [styleFilters, setStyleFilters] = useState({})
  
  // Use the same style references hook as StyleLibrary
  const { styles, loading: stylesLoading, error: stylesError, filterStyles } = useStyleReferences();

  // Fetch credits when user changes
  useEffect(() => {
    if (user) {
      fetchCredits(user.id);
    }
  }, [user, fetchCredits]);

  const handleGenerate = async () => {
    if (!productImage || !user) return;
    
    // Check if user has enough credits
    if (!checkCreditsAvailable(settings.variants)) {
      setShowInsufficientCreditsModal(true);
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratedImages([]);
      setCurrentStep(3);

      // Generate a unique ID for this generation
      const generationId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Consume credits first
      await consumeCredits(user.id, settings.variants, generationId);

      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2500));

      const mockGenerated = [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=512&h=512&fit=crop',
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=512&h=512&fit=crop',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=512&h=512&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=512&h=512&fit=crop'
      ].slice(0, settings.variants);
      
      setGeneratedImages(mockGenerated);
      
      // Show success celebration
      setTimeout(() => {
        setShowSuccessCelebration(true);
      }, 500);
    } catch (error) {
      console.error('Generation failed:', error);
      // Credits would be refunded automatically by the backend in a real scenario
    } finally {
      setIsGenerating(false);
    }
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setProductImage(null);
    setCustomReference(null);
    setGeneratedImages([]);
    setSelectedReference(null);
    setIsGenerating(false);
  };

  const clearFilters = () => {
    setStyleFilters({});
  };
  
  const clearSelection = () => {
    setSelectedReference(null);
    setCustomReference(null);
  };

  const hasActiveFilters = Object.values(styleFilters).some(value => value && value !== 'All');
  
  // Filter styles based on current filters
  const filteredStyles = filterStyles(styles, styleFilters);
  
  const handleStyleSelect = (style) => {
    setSelectedReference(selectedReference?.id === style.id ? null : style);
    setCustomReference(null);
  };
  
  const handleStylePreview = (style) => {
    console.log('Preview style:', style);
  };

  const steps = [
    { number: 1, title: 'Reference Style', description: 'Choose or upload a style' },
    { number: 2, title: 'Product Image', description: 'Upload your product' },
    { number: 3, title: 'Generate', description: 'AI creates your photos' }
  ];

  const handleCustomUpload = (file) => {
    setCustomReference(URL.createObjectURL(file));
    setSelectedReference(null);
  };


  const handleProductUpload = (file) => {
    setProductImage(URL.createObjectURL(file));
  }

  return (
    <div>

      <div className="main-container">
        <div className="content-container">
          <StepWizard steps={steps} currentStep={currentStep} />

          <div style={{ marginTop: '48px' }}>
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ marginBottom: '8px' }}>Choose Your Reference Style</h2>
                  <p className="body" style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Select a style from our library or upload your own image to guide the AI.</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  <UploadDropzone onFileUploaded={handleCustomUpload} />
                  <Card style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
                    <h3 className="h3-card" style={{ marginBottom: '16px' }}>Your Selection</h3>
                    <div style={{ position: 'relative' }}>
                        {customReference ? (
                          <img src={customReference} alt="Custom reference" style={{ width: '128px', height: '128px', borderRadius: 'var(--radius)', objectFit: 'cover' }} />
                        ) : selectedReference ? (
                          <img src={selectedReference.url} alt={selectedReference.title} style={{ width: '128px', height: '128px', borderRadius: 'var(--radius)', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '128px', height: '128px', borderRadius: 'var(--radius)', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <ImageIcon />
                          </div>
                        )}
                        {(customReference || selectedReference) && (
                            <Button variant="secondary" onClick={clearSelection} style={{ position: 'absolute', top: '8px', right: '8px', borderRadius: '50%', width: '28px', height: '28px', padding: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} aria-label="Clear selection">
                                <XIcon />
                            </Button>
                        )}
                    </div>
                    <Button style={{ marginTop: '24px', width: '100%' }} disabled={!customReference && !selectedReference} onClick={() => setCurrentStep(2)}>
                      Next: Upload Product
                    </Button>
                  </Card>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h3 className="h3-card" style={{ margin: 0, marginBottom: '16px' }}>Style Library</h3>
                  <FilterBar
                    filters={styleFilters}
                    onFiltersChange={setStyleFilters}
                    showSearch={true}
                    showAdvanced={true}
                    compact={false}
                  />
                </div>
                
                <StyleGrid
                  styles={filteredStyles}
                  selectedStyleId={selectedReference?.id}
                  onStyleSelect={handleStyleSelect}
                  onStylePreview={handleStylePreview}
                  size="medium"
                  showDetails={false}
                  emptyMessage="No styles match your current filters. Try adjusting your search criteria."
                />
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ marginBottom: '8px' }}>Upload Your Product Image</h2>
                  <p className="body" style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>This is the image that will be placed into the new scene.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  {productImage ? (
                     <Card style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                        <h3 className="h3-card" style={{ margin: 0 }}>Your Product Image</h3>
                        <img src={productImage} alt="Uploaded product" style={{ maxWidth: '80%', maxHeight: '250px', borderRadius: 'var(--radius)', objectFit: 'contain' }} />
                        <Button variant="outline" onClick={() => setProductImage(null)}>Choose a different image</Button>
                     </Card>
                  ) : (
                    <UploadDropzone onFileUploaded={handleProductUpload} />
                  )}
                  <SettingsAccordion settings={settings} onSettingsChange={setSettings} />
                  
                  {/* Credit Cost Preview */}
                  {user && credits !== null && (
                    <CreditCostPreview 
                      variantCount={settings.variants}
                      userCredits={credits}
                      className="mt-4"
                    />
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>Back to Style</Button>
                  <Button 
                    onClick={handleGenerate} 
                    disabled={!productImage || !user || (credits !== null && credits < settings.variants)}
                  >
                    Generate Images {user && credits !== null && `(${settings.variants} credit${settings.variants !== 1 ? 's' : ''})`}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                 <div style={{ textAlign: 'center' }}>
                  <h2 style={{ marginBottom: '8px' }}>Your AI Generated Photos</h2>
                  <p className="body" style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Here are the results. Download your favorites or regenerate.</p>
                </div>

                {!isGenerating && generatedImages.length > 0 && (
                    <Card style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <Button onClick={handleGenerate}><RefreshCwIcon style={{ marginRight: '8px' }} />Regenerate</Button>
                            <Button variant="outline" onClick={() => console.log('Download All clicked')}><DownloadIcon style={{ marginRight: '8px' }} />Download All</Button>
                            <Button variant="outline" onClick={() => console.log('Share clicked')}><ShareIcon style={{ marginRight: '8px' }} />Share Results</Button>
                        </div>
                    </Card>
                )}

                <GeneratedGallery isLoading={isGenerating} images={generatedImages} productImage={productImage} referenceImage={customReference || selectedReference?.url} settings={settings} />

                {!isGenerating && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                    <Button size="lg" variant="outline" onClick={resetFlow}>Start Over</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <InsufficientCreditsModal
        isOpen={showInsufficientCreditsModal}
        onClose={() => setShowInsufficientCreditsModal(false)}
        currentCredits={credits || 0}
        requiredCredits={settings.variants}
        variantCount={settings.variants}
      />
      
      <SuccessCelebration
        isVisible={showSuccessCelebration}
        onComplete={() => setShowSuccessCelebration(false)}
        resultCount={settings.variants}
        quality={settings.variants > 2 ? "incredible" : "amazing"}
      />
    </div>
  );
};

export default Generate;