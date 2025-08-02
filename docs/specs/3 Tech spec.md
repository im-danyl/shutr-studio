# **Shutr Studio - AI Product Photography Platform - Technical Specifications (UPDATED)**

## **File System Structure**

**Project Name:** shutr-studio  
**Updated Structure with Critical Fixes:**

shutr-studio/

├── src/

│   ├── components/

│   │   ├── auth/

│   │   │   ├── AuthModal.jsx

│   │   │   └── ProtectedRoute.jsx    # REMOVED CreditDisplay - moved to credits/

│   │   ├── credits/

│   │   │   ├── CreditBalance.jsx

│   │   │   ├── CreditCostPreview.jsx

│   │   │   ├── InsufficientCreditsModal.jsx

│   │   │   └── CreditHistory.jsx (POST-MVP)

│   │   ├── styles/                   # RENAMED from style-library

│   │   │   ├── StyleGrid.jsx

│   │   │   ├── FilterBar.jsx

│   │   │   ├── StyleCard.jsx

│   │   │   └── StyleUploader.jsx     # For admin use

│   │   ├── upload/                   # RENAMED from product-upload

│   │   │   ├── DropZone.jsx

│   │   │   ├── ImagePreview.jsx

│   │   │   └── VariantSelector.jsx

│   │   ├── generation/

│   │   │   ├── ProcessingScreen.jsx

│   │   │   ├── ResultsGrid.jsx

│   │   │   └── DownloadButton.jsx        # SIMPLIFIED

│   │   ├── ui/                       # shadcn/ui components

│   │   │   ├── button.jsx

│   │   │   ├── modal.jsx

│   │   │   ├── toast.jsx

│   │   │   ├── input.jsx

│   │   │   └── loading-spinner.jsx

│   │   └── layout/

│   │       ├── Header.jsx

│   │       ├── Navigation.jsx

│   │       └── Layout.jsx

│   ├── hooks/

│   │   ├── useAuth.js

│   │   ├── useCredits.js

│   │   ├── useFileUpload.js

│   │   ├── useGeneration.js

│   │   └── useStyles.js               # NEW: Database-driven styles

│   ├── lib/                      # RENAMED from services + utils

│   │   ├── supabase.js               # Supabase client config

│   │   ├── openai.js                 # DALL-E integration

│   │   ├── auth.js                   # Auth utilities

│   │   ├── storage.js                # File upload/download

│   │   ├── database.js               # Database queries

│   │   └── utils.js                  # General utilities

│   ├── store/                    # NEW: State management

│   │   ├── authStore.js              # Zustand auth store

│   │   ├── creditStore.js            # Zustand credit store

│   │   └── appStore.js               # General app state

│   ├── pages/

│   │   ├── Landing.jsx

│   │   ├── Dashboard.jsx

│   │   ├── StyleLibrary.jsx

│   │   ├── Generate.jsx

│   │   ├── Account.jsx (POST-MVP)

│   │   └── Results.jsx               # NEW: Separate results page

│   └── types/                    # NEW: TypeScript types

│       ├── auth.ts

│       ├── credits.ts

│       ├── styles.ts

│       └── generation.ts

├── supabase/

│   ├── migrations/

│   │   ├── 001_initial_schema.sql

│   │   ├── 002_add_credits_system.sql

│   │   ├── 003_add_generations_table.sql

│   │   └── 004_add_style_references_table.sql  # NEW: Database storage

│   ├── functions/                        # Edge Functions

│   │   └── generate-image/               # DALL-E processing

│   └── config.toml                       # Supabase config

├── public/

│   └── assets/                       # Static assets only

├── .env.local                        # Environment variables

├── .env.example                      # Environment template

├── netlify.toml                      # Netlify config

├── vite.config.js                    # Vite configuration

├── tailwind.config.js                # Tailwind config

├── components.json                   # shadcn/ui config

└── package.json

---

## **Feature Specifications**

## **Feature 1: User Authentication & Credit System (MVP CORE)**

**Goal:** Secure user management with per-variation credit model providing free tier testing.

**API Relationships:**

* Supabase Auth for authentication  
* Supabase Database for credit tracking  
* \~\~Lemon Squeezy webhooks for payment processing\~\~ (POST-MVP)

**Detailed Requirements:**

* Email and Google OAuth authentication flows  
* Automatic 2 free credits for new users (can generate 2 variations total)  
* **1 credit \= 1 variation generated** (linear scaling: 4 variations \= 4 credits)  
* Real-time credit balance tracking and cost preview  
* \~\~Non-intrusive upgrade prompts when credits exhausted\~\~ (POST-MVP)  
* Secure session management with automatic token refresh  
* \~\~Account dashboard with usage analytics\~\~ (POST-MVP)

**Implementation Guide:**

**Database Schema (MVP):**

\-- Users table (managed by Supabase Auth)

\-- Additional profile table

CREATE TABLE user\_profiles (

  id UUID PRIMARY KEY REFERENCES auth.users(id),

  email TEXT NOT NULL,

  full\_name TEXT,

  credits INTEGER DEFAULT 2,

  created\_at TIMESTAMP DEFAULT NOW(),

  updated\_at TIMESTAMP DEFAULT NOW()

);

\-- Credits transactions table

CREATE TABLE credit\_transactions (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  user\_id UUID REFERENCES user\_profiles(id),

  amount INTEGER NOT NULL, \-- positive for additions, negative for usage (per variation)

  variant\_count INTEGER, \-- number of variations generated (for generation\_usage type)

  transaction\_type TEXT CHECK (transaction\_type IN ('signup\_bonus', 'generation\_usage')),

  reference\_id TEXT, \-- generation\_id

  created\_at TIMESTAMP DEFAULT NOW()

);

\-- Indexes

CREATE INDEX idx\_user\_profiles\_email ON user\_profiles(email);

CREATE INDEX idx\_credit\_transactions\_user\_id ON credit\_transactions(user\_id);

\-- NEW: Style references table (DATABASE instead of JSON)
CREATE TABLE style\_references (
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),
  name TEXT NOT NULL,
  image\_url TEXT NOT NULL,
  thumbnail\_url TEXT,
  product\_category TEXT CHECK (product\_category IN ('electronics', 'fashion', 'home\_decor', 'beauty', 'food')),
  container\_type TEXT CHECK (container\_type IN ('no\_container', 'box', 'bottle', 'bag', 'tube')),
  background\_style TEXT CHECK (background\_style IN ('solid\_white', 'gradient', 'textured', 'lifestyle', 'natural')),
  mood\_aesthetic TEXT CHECK (mood\_aesthetic IN ('minimalist', 'luxury', 'playful', 'vintage', 'modern')),
  tags JSONB DEFAULT '\[\]'::jsonb,
  usage\_count INTEGER DEFAULT 0,
  is\_active BOOLEAN DEFAULT true,
  created\_at TIMESTAMP DEFAULT NOW(),
  updated\_at TIMESTAMP DEFAULT NOW()
);

\-- Indexes for style references
CREATE INDEX idx\_style\_references\_category ON style\_references(product\_category);
CREATE INDEX idx\_style\_references\_container ON style\_references(container\_type);
CREATE INDEX idx\_style\_references\_background ON style\_references(background\_style);
CREATE INDEX idx\_style\_references\_mood ON style\_references(mood\_aesthetic);
CREATE INDEX idx\_style\_references\_active ON style\_references(is\_active);

**POST-MVP Database Extensions:**

\-- Add payment tracking

ALTER TABLE user\_profiles ADD COLUMN total\_credits\_purchased INTEGER DEFAULT 0;

ALTER TABLE credit\_transactions ADD CONSTRAINT check\_transaction\_type 

  CHECK (transaction\_type IN ('signup\_bonus', 'generation\_usage', 'purchase'));

**Authentication Flow (MVP):**

FUNCTION handleAuthSignup(email, password):

  1\. Call supabase.auth.signUp(email, password)

  2\. ON SUCCESS:

     \- Create user\_profile record with 2 credits

     \- Insert credit\_transaction record (signup\_bonus, \+2, variant\_count: null)

     \- Redirect to dashboard

  3\. ON ERROR:

     \- Display validation errors

     \- Maintain form state

FUNCTION handleGoogleOAuth():

  1\. Call supabase.auth.signInWithOAuth(google)

  2\. Handle redirect callback

  3\. Check if new user (no profile exists)

  4\. IF new user: Initialize with 2 credits

  5\. Redirect to dashboard

**Credit Management (MVP \- CORRECTED):**

FUNCTION consumeCredits(userId, variantCount, generationId):

  1\. BEGIN TRANSACTION

  2\. SELECT credits FROM user\_profiles WHERE id \= userId FOR UPDATE

  3\. IF credits \< variantCount: ROLLBACK, return insufficient\_credits

  4\. UPDATE user\_profiles SET credits \= credits \- variantCount

  5\. INSERT credit\_transaction (generation\_usage, \-variantCount, variantCount, generationId)

  6\. COMMIT TRANSACTION

// POST-MVP

FUNCTION addCredits(userId, amount, paymentId):

  1\. Similar pattern but with positive amount and purchase type

**Frontend Credit Hook (NEW):**

// hooks/useCredits.js

HOOK useCredits():

  STATE: credits, loading


  FUNCTION canGenerate(variantCount):

    RETURN credits \>= variantCount


  FUNCTION calculateCost(variantCount):

    RETURN variantCount // 1 credit per variation


  FUNCTION getInsufficientMessage(required, available):

    RETURN "You need {required} credits but only have {available}. Each variation costs 1 credit."


  FUNCTION consumeCredits(variantCount, generationId):

    // Implementation matches corrected backend logic


  RETURN { credits, canGenerate, calculateCost, getInsufficientMessage, consumeCredits }

**Credit Display Components (NEW):**

COMPONENT CreditBalance:

  FUNCTION render():

    DISPLAY current credit count with icon

    IF credits \=== 0: SHOW "No credits remaining" warning

    IF credits \=== 1: SHOW "1 credit remaining" caution

COMPONENT CreditCostPreview:

  PROPS: variantCount

  FUNCTION render():

    cost \= calculateCost(variantCount)

    DISPLAY "Cost: {cost} credits"

    IF cost \=== 1: SHOW "1 variant \= 1 credit"

    IF cost \> 1: SHOW "{variantCount} variants \= {cost} credits"

COMPONENT InsufficientCreditsModal:

  PROPS: required, available

  FUNCTION render():

    SHOW modal with specific error message

    DISPLAY "Select fewer variations" option

    POST-MVP: SHOW "Upgrade account" option

**Key Edge Cases:**

* Concurrent credit consumption (handled by database locks)  
* Session expiry during generation process  
* \~\~Payment webhook failures and retry logic\~\~ (POST-MVP)  
* User deletes account mid-generation  
* Generation failure requiring credit refund

---

## **Feature 2: Curated Style Library (MVP CORE \- CORRECTED)**

**Goal:** Four-dimensional filtering system for 50-100 curated style references enabling aesthetic matching for product photography.

**API Relationships:**

* Supabase Storage for style reference images  
* Static JSON metadata for filtering  
* \~\~CDN for fast image delivery\~\~ (POST-MVP optimization)

**Detailed Requirements:**

* **50-100 curated style references** organized by 4 filter categories (MVP)  
* **POST-MVP: Expand to 1000+ references with user uploads**  
* Real-time filtering with multiple simultaneous filters  
* \~\~Sub-second image preview loading\~\~ (POST-MVP optimization)  
* Mobile-responsive grid layout  
* \~\~Custom reference image upload capability\~\~ (POST-MVP)  
* \~\~Infinite scroll with lazy loading\~\~ (POST-MVP \- start with simple pagination)

**Implementation Guide:**

**Data Structure (MVP \- DATABASE DRIVEN):**

// NEW: Database table instead of static JSON
// style_references table in Supabase (50-100 references for MVP)

{

  "styles": \[

    {

      "id": "style\_001",

      "name": "Minimalist White Background",

      "image\_url": "/style-references/minimalist-white-001.jpg",

      "thumbnail\_url": "/style-references/thumbs/minimalist-white-001.jpg",

      "categories": {

        "product\_category": "electronics",

        "container\_type": "no\_container",

        "background\_style": "solid\_white",

        "mood\_aesthetic": "minimalist"

      },

      "tags": \["clean", "professional", "ecommerce"\]

    }

    // ... 49-99 more styles for MVP

  \],

  "filters": {

    "product\_category": \["electronics", "fashion", "home\_decor", "beauty", "food"\],

    "container\_type": \["no\_container", "box", "bottle", "bag", "tube"\],

    "background\_style": \["solid\_white", "gradient", "textured", "lifestyle", "natural"\],

    "mood\_aesthetic": \["minimalist", "luxury", "playful", "vintage", "modern"\]

  }

}

**POST-MVP Data Extensions:**

{

  "usage\_count": 1247,

  "created\_at": "2024-01-15",

  "user\_uploaded": false

}

**MVP Timeline Correction:**

* **Week 1-2: Set up 50-100 curated style references**  
* **POST-MVP: Expand to 1000+ references with advanced filtering**

**Filtering Logic (MVP):**

FUNCTION applyFilters(styles, activeFilters):

  1\. START with full styles array (50-100 items)

  2\. FOR each filterCategory in activeFilters:

     IF filterCategory has selected values:

       styles \= styles.filter(style \=\> 

         activeFilters\[filterCategory\].includes(style.categories\[filterCategory\])

       )

  3\. RETURN filtered styles

FUNCTION handleFilterChange(category, value, isChecked):

  1\. UPDATE activeFilters state

  2\. APPLY filters to style collection immediately (no debouncing for MVP)

  3\. TRIGGER grid re-render

  4\. \~\~UPDATE URL params for bookmarkable state\~\~ (POST-MVP)

**Grid Layout System (MVP):**

COMPONENT StyleGrid:

  STATE: styles, loading


  // POST-MVP: infinite scroll, masonry layout

  // FUNCTION setupInfiniteScroll()

  // FUNCTION loadMoreStyles()

  FUNCTION renderGrid():

    1\. USE CSS Grid with dynamic columns based on viewport

    2\. APPLY simple grid layout (no masonry for MVP)

    3\. \~\~ADD skeleton placeholders during loading\~\~ (POST-MVP)

    4\. IMPLEMENT basic hover effects and selection states

    5\. HANDLE empty state when filters return no results

**POST-MVP: Custom Upload Flow:**

FUNCTION handleCustomUpload(file):

  1\. VALIDATE file (type, size, dimensions)

  2\. GENERATE thumbnail using canvas API

  3\. UPLOAD to Supabase Storage with user-specific folder

  4\. CREATE temporary style object for current session

  5\. ADD to available styles for this generation only

  6\. HIGHLIGHT as "Your Custom Style" in UI

**Key Edge Cases:**

* Image loading failures with fallback placeholders  
* \~\~Network interruption during infinite scroll\~\~ (POST-MVP)  
* Filter combinations with zero results (show friendly message)  
* \~\~Large image files impacting performance\~\~ (POST-MVP)  
* \~\~Browser storage limits for cached thumbnails\~\~ (POST-MVP)

---

## **Feature 3: AI Image Generation Engine (MVP CORE \- CORRECTED)**

**Goal:** Core style transfer functionality maintaining product accuracy while applying reference aesthetics, with per-variation credit consumption.

**API Relationships:**

* OpenAI GPT Image 1 API for image generation  
* Supabase Storage for image management  
* \~\~Background processing queue for concurrent requests\~\~ (POST-MVP \- start with direct processing)

**Detailed Requirements:**

* DALL-E generation based on product and style reference images  
* 1-4 variations per generation (user selectable, 1 credit per variation)  
* Product accuracy preservation during style transfer  
* \~\~Real-time progress feedback during processing\~\~ (POST-MVP \- start with simple loading spinner)  
* Comprehensive error handling with user-friendly messaging and credit refunds  
* \~\~Processing queue to handle concurrent requests\~\~ (POST-MVP \- start with synchronous processing)

**Implementation Guide:**

**Database Schema (MVP \- CORRECTED):**

CREATE TABLE generations (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  user\_id UUID REFERENCES user\_profiles(id),

  product\_image\_url TEXT NOT NULL,

  style\_reference\_url TEXT NOT NULL,

  variant\_count INTEGER CHECK (variant\_count BETWEEN 1 AND 4),

  credits\_consumed INTEGER NOT NULL, \-- This should equal variant\_count for MVP

  status TEXT CHECK (status IN ('processing', 'completed', 'failed')) DEFAULT 'processing',

  generated\_images JSONB, \-- Array of generated image URLs

  error\_message TEXT,

  completed\_at TIMESTAMP,

  created\_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx\_generations\_user\_id ON generations(user\_id);

**POST-MVP Database Extensions:**

\-- Add queue management

ALTER TABLE generations ADD COLUMN progress\_percentage INTEGER DEFAULT 0;

ALTER TABLE generations ADD COLUMN processing\_started\_at TIMESTAMP;

ALTER TABLE generations ADD CONSTRAINT check\_status 

  CHECK (status IN ('queued', 'processing', 'completed', 'failed'));

CREATE TABLE processing\_queue (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  generation\_id UUID REFERENCES generations(id),

  priority INTEGER DEFAULT 1,

  retry\_count INTEGER DEFAULT 0,

  max\_retries INTEGER DEFAULT 3,

  created\_at TIMESTAMP DEFAULT NOW()

);

**Generation Flow (MVP \- CORRECTED):**

FUNCTION startGeneration(userId, productImage, styleReference, variantCount):

  1\. VALIDATE user has sufficient credits (\>= variantCount)

  2\. VALIDATE image files (format, size, content)

  3\. BEGIN TRANSACTION:

     \- CREATE generation record with 'processing' status

     \- SET credits\_consumed \= variantCount

     \- CONSUME variantCount credits from user account

  4\. COMMIT TRANSACTION

  5\. TRY:

       PROCESS variantCount variations (synchronous for MVP)

       UPDATE generation status to 'completed'

     CATCH error:

       UPDATE generation status to 'failed'

       REFUND variantCount credits to user

       LOG error details

  6\. RETURN generation results

// POST-MVP: Background processing

FUNCTION startGenerationAsync(userId, productImage, styleReference, variantCount):

  // Add to queue and return generation\_id for progress tracking

**Variant Selector Component (CORRECTED):**

COMPONENT VariantSelector:

  PROPS: onVariantChange, maxCredits

  STATE: selectedCount


  FUNCTION calculateCreditCost(variantCount):

    RETURN variantCount // 1 credit per variant


  FUNCTION displayCostPreview():

    cost \= calculateCreditCost(selectedCount)

    IF cost \=== 1: RETURN "1 variant \= 1 credit"

    RETURN "{selectedCount} variants \= {cost} credits"


  FUNCTION handleVariantChange(count):

    IF count \> maxCredits:

      SHOW insufficient credits modal

      RETURN

    SET selectedCount \= count

    CALL onVariantChange(count)


  FUNCTION render():

    SHOW slider/buttons for 1-4 variants

    DISPLAY real-time cost preview

    DISABLE options when user has insufficient credits

    SHOW warning: "You have {maxCredits} credits remaining"

**Processing Screen (MVP \- CORRECTED):**

COMPONENT ProcessingScreen:

  STATE: generationId, status


  FUNCTION render():

    SHOW simple loading spinner (no progress bar for MVP)

    DISPLAY basic status text: "Generating your {variantCount} variations..."

    SHOW estimated time: "This usually takes 30-60 seconds"

    NO cancel functionality for MVP

    NO real-time progress updates for MVP


  // POST-MVP: Add progress bar, real-time updates, cancel option

**OpenAI GPT Image 1 Integration (MVP):**

FUNCTION analyzeProductImage(imageUrl):

  PROMPT \= "Analyze this product image and return JSON with:

  \- product\_type: category of the product

  \- key\_features: list of important product features to preserve"


  RESPONSE \= await openai.chat.completions.create({

    model: "gpt-4-vision-preview",

    messages: \[

      {

        role: "user", 

        content: \[

          {type: "text", text: PROMPT},

          {type: "image\_url", image\_url: {url: imageUrl}}

        \]

      }

    \]

  })


  RETURN parseJSON(RESPONSE.choices\[0\].message.content)

FUNCTION generateStyledProduct(productAnalysis, styleReference, variantIndex):

  PROMPT \= "Generate a product image that:

  \- Preserves the exact product from the analysis: ${productAnalysis}

  \- Applies the aesthetic style from this reference image

  \- Maintains product accuracy and proportions

  \- Variation ${variantIndex}: Apply slight compositional differences"


  // OpenAI API call with image generation

**Error Handling with Credit Refunds (NEW):**

FUNCTION handleGenerationError(generationId, error):

  1\. UPDATE generation status to 'failed'

  2\. SET error\_message with user-friendly text

  3\. GET credits\_consumed from generation record

  4\. REFUND credits to user account

  5\. INSERT credit\_transaction (refund, \+credits\_consumed)

  6\. NOTIFY user: "Generation failed \- {credits\_consumed} credits have been refunded"

FUNCTION getErrorMessage(errorType):

  SWITCH errorType:

    CASE 'api\_limit': RETURN "Service temporarily unavailable. Credits refunded."

    CASE 'invalid\_image': RETURN "Unable to process image. Please try a different photo."

    CASE 'processing\_timeout': RETURN "Generation took too long. Credits refunded."

    DEFAULT: RETURN "Generation failed. Credits refunded. Please try again."

**POST-MVP: Real-time Progress System:**

// Backend: Supabase Edge Function

FUNCTION updateGenerationProgress(generationId, progress, status):

  1\. UPDATE generations SET progress\_percentage \= progress, status \= status

  2\. BROADCAST to real-time channel "generation:${generationId}"

// Frontend: Progress Tracking

FUNCTION subscribeToProgress(generationId):

  1\. CONNECT to Supabase real-time channel

  2\. LISTEN for progress updates

  3\. UPDATE UI with progress bar and status messages

  4\. HANDLE completion by redirecting to results

**Key Edge Cases:**

* OpenAI API rate limits and timeout handling  
* Partial generation failures (some variants succeed) \- MVP: all-or-nothing, POST-MVP: partial success  
* \~\~User cancellation mid-generation\~\~ (POST-MVP)  
* Storage quota exceeded during upload  
* Invalid or corrupted input images  
* Credit refund on any failure  
* \~\~Network interruptions during processing\~\~ (POST-MVP)

---

## **Feature 4: Download & Management System (MVP CORE)**

**Goal:** Basic download functionality for generated images with simple organization.

**API Relationships:**

* Supabase Storage for file serving  
* Browser download APIs for file delivery  
* \~\~Optional cloud storage integrations\~\~ (POST-MVP)

**Detailed Requirements:**

* Individual download for generated variations  
* \~\~Bulk download functionality\~\~ (POST-MVP)  
* Standard web formats (PNG, JPG)  
* Simple file naming conventions  
* \~\~Download history and re-download capability\~\~ (POST-MVP)  
* \~\~Progress tracking for large file downloads\~\~ (POST-MVP)  
* \~\~Basic usage analytics for business insights\~\~ (POST-MVP)

**Implementation Guide:**

**Database Schema (MVP):**

\-- Basic download tracking in generations table

ALTER TABLE generations ADD COLUMN download\_count INTEGER DEFAULT 0;

ALTER TABLE generations ADD COLUMN last\_downloaded\_at TIMESTAMP;

**POST-MVP Database Extensions:**

CREATE TABLE downloads (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  user\_id UUID REFERENCES user\_profiles(id),

  generation\_id UUID REFERENCES generations(id),

  file\_urls JSONB NOT NULL, \-- Array of downloaded file URLs

  download\_format TEXT CHECK (download\_format IN ('png', 'jpg', 'bulk\_zip')),

  file\_size\_bytes BIGINT,

  download\_completed\_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx\_downloads\_user\_id ON downloads(user\_id);

CREATE INDEX idx\_downloads\_generation\_id ON downloads(generation\_id);

**File Organization System (MVP \- CORRECTED):**

FUNCTION generateFileName(generation, variantIndex, format):

  1\. GET generation metadata (timestamp)

  2\. CONSTRUCT simple name pattern:

     "Generated\_Variant{index}\_{timestamp}.{format}"

     Example: "Generated\_Variant1\_20240130.png"

  3\. RETURN filename

// POST-MVP: Enhanced naming

FUNCTION generateEnhancedFileName(generation, variantIndex, format):

  // "ProductPhoto\_StyleName\_Variant{index}\_{timestamp}.{format}"

**Download Flow (MVP):**

FUNCTION handleIndividualDownload(generationId, variantIndex):

  1\. VERIFY user owns generation

  2\. GET image URL from generation record

  3\. GENERATE direct download link from Supabase Storage

  4\. TRIGGER browser download

  5\. UPDATE generation download count

  6\. UPDATE last\_downloaded\_at timestamp

// POST-MVP: Format conversion and bulk download

FUNCTION handleBulkDownload(generationId, formats):

  // Create ZIP archives, format conversion, etc.

**Results Display (CORRECTED):**

COMPONENT ResultsGrid:

  PROPS: generationId

  STATE: generation, loading


  FUNCTION loadGeneration():

    FETCH generation by ID

    VERIFY user ownership

    DISPLAY generated\_images array


  FUNCTION renderVariation(imageUrl, index):

    SHOW image thumbnail with zoom option

    DISPLAY download button for individual variation

    SHOW "Variation {index+1}" label

    TRACK downloads per variation


  FUNCTION renderSummary():

    SHOW total variations generated

    DISPLAY total credits consumed

    SHOW generation timestamp

    POST-MVP: Add bulk download option

**Key Edge Cases:**

* Storage service downtime affecting downloads  
* \~\~Large ZIP file generation timeout\~\~ (POST-MVP)  
* Browser download interruption (basic retry for MVP)  
* \~\~File expiration and cleanup policies\~\~ (POST-MVP)  
* \~\~Concurrent download limits per user\~\~ (POST-MVP)  
* Mobile device storage constraints

---

## **Feature 5: Payment Integration & Credit Management (POST-MVP)**

**Goal:** Seamless credit purchase system with Lemon Squeezy integration for monetization.

**API Relationships:**

* Lemon Squeezy API for payment processing (POST-MVP)  
* Lemon Squeezy webhooks for payment confirmation (POST-MVP)  
* Supabase for credit balance updates

**MVP Note:** Credit system exists but no payment processing. Users get 2 free credits and that's it for MVP testing.

**POST-MVP Database Schema:**

CREATE TABLE credit\_packages (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  name TEXT NOT NULL,

  credit\_amount INTEGER NOT NULL,

  price\_cents INTEGER NOT NULL,

  lemon\_squeezy\_variant\_id TEXT NOT NULL,

  discount\_percentage INTEGER DEFAULT 0,

  is\_active BOOLEAN DEFAULT true,

  sort\_order INTEGER DEFAULT 0,

  created\_at TIMESTAMP DEFAULT NOW()

);

CREATE TABLE payments (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  user\_id UUID REFERENCES user\_profiles(id),

  lemon\_squeezy\_order\_id TEXT UNIQUE NOT NULL,

  lemon\_squeezy\_customer\_id TEXT,

  package\_id UUID REFERENCES credit\_packages(id),

  amount\_cents INTEGER NOT NULL,

  credits\_purchased INTEGER NOT NULL,

  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',

  webhook\_data JSONB,

  processed\_at TIMESTAMP,

  created\_at TIMESTAMP DEFAULT NOW()

);

**POST-MVP Implementation:** All payment-related functionality will be implemented after MVP validation.

---

## **Security & Performance Considerations**

**MVP Security:**

* JWT token rotation every 24 hours  
* Basic rate limiting on auth endpoints (5 attempts per minute)  
* Row Level Security (RLS) policies in Supabase  
* File upload validation (type, size only for MVP)  
* Credit consumption atomic transactions to prevent race conditions

**POST-MVP Security Enhancements:**

* CSRF protection on all state-changing operations  
* SQL injection prevention through parameterized queries  
* Malware scanning for uploaded files  
* Advanced rate limiting per user

**MVP Performance:**

* Basic image loading from Supabase Storage  
* Simple client-side filtering for style library (50-100 items)  
* Synchronous generation processing  
* Basic error handling with credit refunds

**POST-MVP Performance Optimizations:**

* Image CDN with global edge locations  
* Progressive image loading with blur-up technique  
* Database connection pooling  
* Generation queue processing with worker scaling  
* Client-side caching for style library metadata

**Error Handling:**

* Specific credit-related error messages for MVP  
* Automatic credit refunds on generation failures  
* \~\~Structured logging with correlation IDs\~\~ (POST-MVP)  
* \~\~Automatic retry mechanisms for transient failures\~\~ (POST-MVP)  
* \~\~Circuit breaker pattern for external API calls\~\~ (POST-MVP)  
* \~\~Dead letter queue for failed generation jobs\~\~ (POST-MVP)

## **MVP Development Timeline (CORRECTED)**

**Week 1-2: Foundation**

* Set up Supabase project with auth, database schema, and storage buckets  
* Create React app with Vite \+ Tailwind \+ shadcn setup  
* Implement basic authentication flow (email \+ Google OAuth)  
* Build credit system with per-variation consumption model  
* **Set up 50-100 curated style references** (not 1000+)

**Week 3-4: Core Features**

* Database-driven style library with 4-filter system  
* Style uploader component for admin use (populate database)  
* File upload component with Supabase Storage integration  
* OpenAI GPT Image 1 integration for image generation  
* Variant selector with real-time credit cost preview  
* Basic processing screen with simple loading spinner  
* Basic download functionality from Supabase Storage

**Week 5-6: Polish & Launch**

* Error handling with credit refunds and user feedback  
* Credit balance display and insufficient credit warnings  
* Responsive design optimization  
* Netlify deployment configuration and environment setup  
* User testing and bug fixes  
* Domain setup (when chosen)

## **UPDATED TECHNOLOGY STACK**

**Frontend:**
- React + Vite (fast development)
- Tailwind CSS (utility-first styling)
- shadcn/ui (component library)
- Zustand (state management)

**Backend:**
- Supabase Database (PostgreSQL)
- Supabase Auth (with Google OAuth)
- Supabase Storage (file uploads)
- Supabase Edge Functions (optional)

**AI & External Services:**
- OpenAI GPT Image 1 (image generation)
- Google OAuth (authentication)

**Deployment & Hosting:**
- Netlify (frontend hosting)
- Supabase (backend services)
- Custom domain (TBD)

**Key Architecture Changes:**
- ✅ Database-driven style references (not static JSON)
- ✅ Improved file structure with lib/ instead of services/utils
- ✅ Added TypeScript types structure
- ✅ Zustand for state management
- ✅ shadcn/ui for consistent components
- ✅ Netlify deployment instead of undefined hosting
- ✅ GPT Image 1 instead of GPT-4 Vision for generation

This updated technical specification addresses all critical architectural issues and incorporates the technology decisions made during planning.

