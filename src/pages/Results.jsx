import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download, ArrowLeft } from 'lucide-react'

const Results = () => {
  const { id } = useParams()

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Generation Results
        </h1>
        <p className="text-muted-foreground">
          Your AI-styled product variations are ready
        </p>
      </div>

      {/* Generation Info */}
      <div className="mb-8 p-4 border border-border rounded-lg bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Generation #{id}</h3>
            <p className="text-sm text-muted-foreground">
              Created 2 variations • Used 2 credits
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            Completed
          </span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Original Image */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="aspect-square bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Original Image</span>
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-2">Original Product</h3>
            <p className="text-sm text-muted-foreground">Your uploaded image</p>
          </div>
        </div>

        {/* Generated Variations */}
        {[1, 2].map((variant) => (
          <div key={variant} className="border border-border rounded-lg overflow-hidden bg-card">
            <div className="aspect-square bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Variation {variant}</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Variation {variant}</h3>
                <button className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors">
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Generated_{variant}_20240130.png
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      <div className="text-center">
        <button className="inline-flex items-center px-6 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors mr-4">
          <Download className="mr-2 h-4 w-4" />
          Download All
        </button>
        <Link 
          to="/generate"
          className="inline-flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Generate More
        </Link>
      </div>
    </div>
  )
}

export default Results