# **Shutr Studio - AI Product Photography Platform - Design Brief (MVP)**

## **Executive Summary**

This design brief outlines the UX/UI specifications for the MVP version of Shutr Studio, an AI-powered product photography platform. The MVP focuses on core functionality validation with 50-100 curated style references stored in database, basic credit management (no payments), and simplified user interfaces optimized for 6-week development timeline.

**Project:** Shutr Studio  
**Tech Stack:** React + Vite + Tailwind CSS + shadcn/ui  
**Deployment:** Netlify  
**Authentication:** Supabase Auth + Google OAuth

## **Core Design Principles**

* **MVP Simplicity**: Clean, functional interfaces prioritizing core user tasks over advanced features  
* **Validation-Focused**: Designs optimized for user testing and feedback collection  
* **Development-Friendly**: Simple components that can be built quickly and reliably  
* **Scalable Foundation**: Basic design system that can evolve with POST-MVP features  
* **Accessibility-First**: Universal usability through proper contrast and semantic markup

---

## **MVP User Interface Specifications**

### **1\. User Authentication & Credit System (MVP)**

#### **Landing Screen**

**Initial State (MVP)**

* Hero section with simple before/after product transformation example  
* Clear value proposition: "Transform your product photos with AI"  
* Prominent "Get Started Free" CTA with "2 free generations" badge  
* Simple navigation: Logo (left), "Sign In" (right)  
* Trust indicators: "50+ Style References", "AI-Powered", "No Credit Card Required"  
* **Removed from MVP**: Complex animations, multiple examples, pricing information

**Authentication Modal (MVP)**

* Clean overlay modal with simple backdrop  
* Dual authentication: Google OAuth (primary) \+ email form (secondary)  
* Basic form validation with inline error messages  
* Simple loading state during authentication  
* Success checkmark before redirect  
* **Removed from MVP**: Advanced animations, complex validation flows

#### **Dashboard Screen (MVP)**

**Authenticated State**

* Simple header with: Logo (left), Credit balance (center), User avatar (right)  
* Credit display: "Credits: 2" with simple icon  
* Three main action cards: "Generate Image", "Browse Styles", "My Generations"  
* Recent generations grid (if any) with basic thumbnails  
* Empty state for new users with simple onboarding text  
* **Removed from MVP**: Complex analytics, upgrade prompts, usage charts

**Low Credits State**

* Credit counter shows "Credits: 0" with neutral styling  
* "Generate Image" card shows "No credits remaining" message  
* Simple informational text: "You've used your free generations"  
* **Removed from MVP**: Upgrade prompts, payment flows, purchase options

---

### **2\. Style Library (50-100 References MVP)**

#### **Browse Screen**

**Default Grid State (MVP)**

* Simple CSS grid layout (3-4 columns on desktop, 1-2 on mobile)  
* Fixed filter bar with 4 dropdowns: Product Category, Container, Background, Mood  
* Basic style cards with image and simple hover effect  
* Selected style shows blue border and checkmark  
* "Use This Style" button appears when style selected  
* **Removed from MVP**: Masonry layout, infinite scroll, search functionality

**Filter Categories (MVP)**

Product Category: Electronics, Fashion, Home Decor, Beauty, Food

Container Types: No Container, Box, Bottle, Bag, Tube

Background Styles: Solid White, Gradient, Textured, Lifestyle, Natural

Mood/Aesthetic: Minimalist, Luxury, Playful, Vintage, Modern

**Filtered State (MVP)**

* Active filters show as simple chips below filter bar  
* Grid updates immediately with basic fade transition  
* "Clear Filters" link appears when filters active  
* Result count: "Showing X of 50-100 styles"  
* No results state: "No styles match your filters. Try different options."  
* **Removed from MVP**: Advanced animations, filter combinations, style analytics

**Selection State (MVP)**

* Selected style highlighted with blue border  
* "Use This Style" button slides up from bottom  
* Simple modal preview on click with larger image  
* Basic breadcrumb: "Home \> Style Library \> Selected"  
* **Removed from MVP**: Style metadata, usage statistics, related styles

---

### **3\. Product Upload & Generation**

#### **Upload Screen (MVP)**

**Drop Zone State**

* Large, centered drop zone (dashed border)  
* Upload icon and text: "Drag & drop your product photo or click to browse"  
* Supported formats: "PNG, JPG up to 10MB"  
* Alternative "Browse Files" button below  
* **Removed from MVP**: Advanced editing tools, multiple uploads, camera integration

**Image Preview State (MVP)**

* Uploaded image displayed at reasonable size  
* Basic info: filename, file size  
* Variant selector: Radio buttons for 1, 2, 3, or 4 variations  
* Credit cost display: "Cost: X credits" (updates with variant selection)  
* "Generate" button (disabled if insufficient credits)  
* **Removed from MVP**: Image editing, cropping tools, advanced preview

**Variant Selector (MVP)**

○ 1 variation (1 credit)

○ 2 variations (2 credits)  

○ 3 variations (3 credits)

○ 4 variations (4 credits) \[Disabled if insufficient credits\]

**Insufficient Credits State**

* Variant options grayed out when exceeding available credits  
* Warning message: "You need X credits but only have Y available"  
* Simple suggestion: "Try selecting fewer variations"  
* **Removed from MVP**: Upgrade prompts, payment options

---

### **4\. AI Processing (MVP Simplified)**

#### **Processing Screen (MVP)**

**Loading State**

* Full-screen processing interface with simple spinner  
* Basic status text: "Generating your X variations..."  
* Estimated time: "This usually takes 30-60 seconds"  
* Simple progress indicator (spinner, not percentage bar)  
* Branded loading animation (subtle)  
* **Removed from MVP**: Real-time progress bars, cancel option, detailed status updates

**Error State (MVP)**

* Clear error message: "Generation failed. Your X credits have been refunded."  
* "Try Again" button returning to upload screen  
* Support contact information  
* Simple error illustration  
* **Removed from MVP**: Detailed error codes, advanced retry mechanisms

---

### **5\. Results & Download (MVP)**

#### **Results Screen (MVP)**

**Variations Display**

* Simple grid showing all generated variations  
* Each variation shows: thumbnail, "Download" button  
* Basic labels: "Variation 1", "Variation 2", etc.  
* Zoom on click with simple modal overlay  
* Generation summary: "Generated X variations using Y credits"  
* **Removed from MVP**: Bulk download, rating system, sharing options

**Individual Download (MVP)**

* Click "Download" triggers immediate browser download  
* File naming: `Generated_Variant1_20240130.png`  
* Simple download confirmation: "Downloaded successfully"  
* Basic download tracking (count only)  
* **Removed from MVP**: Format selection, bulk ZIP, cloud storage

**Download Management (MVP)**

* Simple "Download All" link that triggers individual downloads  
* Basic file naming convention shown  
* **Removed from MVP**: Download history interface, progress tracking, cloud integration

---

## **Responsive Design (MVP)**

### **Mobile Adaptations**

* Single-column layouts throughout  
* Touch-friendly button sizes (44px minimum)  
* Simplified navigation with basic hamburger menu  
* Upload optimized for mobile file selection  
* Style grid becomes single column with larger images

### **Tablet Optimization**

* Two-column layouts where space permits  
* Maintained touch targets and gesture support  
* Style grid shows 2-3 columns  
* Landscape orientation considerations

---

## **Component Specifications (MVP)**

### **Basic UI Components**

// Simple button variants

\<Button variant="primary"\>Generate\</Button\>

\<Button variant="secondary"\>Cancel\</Button\>

\<Button variant="ghost"\>Clear Filters\</Button\>

// Basic modal

\<Modal title="Authentication" onClose={handleClose}\>

  {children}

\</Modal\>

// Simple loading states

\<LoadingSpinner size="large" text="Processing..." /\>

\<LoadingCard /\> // Skeleton placeholder

// Basic form elements

\<Input type="email" placeholder="Enter email" error={errorMessage} /\>

\<Select options={filterOptions} placeholder="Select category" /\>

### **Layout Components**

// Page wrapper

\<Layout header={\<Header /\>}\>

  \<main\>{children}\</main\>

\</Layout\>

// Grid layouts

\<StyleGrid columns={3} gap="md"\>

  {styleCards}

\</StyleGrid\>

// Card container

\<Card padding="lg" shadow="sm"\>

  {content}

\</Card\>

---

## **Animation Guidelines (MVP)**

### **Micro-Interactions (Simplified)**

* Button hover: subtle scale (1.02x) and shadow change  
* Card hover: slight elevation increase  
* Loading: simple rotation spinner  
* Success states: basic checkmark appearance  
* Form validation: simple color transitions

### **Page Transitions (Basic)**

* Route changes: simple fade transition (300ms)  
* Modal appearance: backdrop fade \+ content scale  
* No complex animations to maintain development speed

---

## **Accessibility Standards (MVP)**

### **Visual Accessibility**

* Minimum 4.5:1 contrast ratio maintained  
* Color never the only means of communication  
* Focus indicators clearly visible  
* Text scaling support maintained

### **Interaction Accessibility**

* Full keyboard navigation  
* Screen reader compatibility  
* Semantic HTML structure  
* Form labels properly associated  
* Skip links for main content

---

## **POST-MVP Design Enhancements (Future)**

### **Advanced Features (Phase 2+)**

* Real-time progress bars with percentage  
* Payment integration interfaces  
* Bulk download functionality  
* Custom style upload flows  
* Advanced filtering with search  
* Usage analytics dashboards  
* Team collaboration interfaces

### **Enhanced Animations (Phase 2+)**

* Sophisticated micro-interactions  
* Complex page transitions  
* Advanced loading states  
* Interactive data visualizations

### **Advanced Responsive (Phase 2+)**

* Native mobile app interfaces  
* Advanced gesture support  
* Complex grid layouts (masonry)  
* Performance optimizations

---

## **Design System (MVP Foundation)**

### **Colors (Basic Palette)**

/\* Primary \*/

\--primary: \#3B82F6;

\--primary-hover: \#2563EB;

/\* Neutral \*/

\--gray-50: \#F9FAFB;

\--gray-100: \#F3F4F6;

\--gray-500: \#6B7280;

\--gray-900: \#111827;

/\* Status \*/

\--success: \#10B981;

\--error: \#EF4444;

\--warning: \#F59E0B;

### **Typography (Simple Scale)**

/\* Headings \*/

.text-3xl { font-size: 1.875rem; } /\* Page titles \*/

.text-xl { font-size: 1.25rem; }   /\* Section headers \*/

.text-lg { font-size: 1.125rem; }  /\* Card titles \*/

/\* Body \*/

.text-base { font-size: 1rem; }    /\* Primary text \*/

.text-sm { font-size: 0.875rem; }  /\* Secondary text \*/

### **Spacing (Consistent Scale)**

.p-4 { padding: 1rem; }     /\* Standard card padding \*/

.p-6 { padding: 1.5rem; }   /\* Large card padding \*/

.gap-4 { gap: 1rem; }       /\* Standard grid gap \*/

.gap-6 { gap: 1.5rem; }     /\* Large grid gap \*/

---

## **Development Handoff Notes**

### **MVP Priority Components**

1. **Authentication Modal** \- Simple, functional auth flow  
2. **Style Grid** \- Basic filtering and selection  
3. **Upload Component** \- Drag-drop with preview  
4. **Processing Screen** \- Simple loading state  
5. **Results Grid** \- Basic download functionality

### **Technical Considerations**

* Use Tailwind CSS utility classes for rapid development  
* Implement with shadcn/ui components where possible  
* Focus on functionality over visual complexity  
* Ensure mobile responsiveness from start  
* Plan component structure for future enhancement  
* Use Supabase for backend services (auth, database, storage)  
* Deploy to Netlify for easy CI/CD
* Store style references in database, not static files

This MVP design brief provides a focused, achievable interface specification that can be built within the 6-week timeline while establishing a solid foundation for future enhancements.

**Updated Technology Decisions:**
- **Frontend Framework:** React + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Database + Auth + Storage)
- **AI Service:** OpenAI GPT Image 1
- **Deployment:** Netlify
- **Style Storage:** Database-driven (not static JSON)

