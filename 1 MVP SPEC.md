# **Shutr Studio - AI Product Photography Platform - MVP Specification**

## **Executive Summary**

A streamlined AI-powered product photography platform that enables users to transform their product images using curated style references. The MVP focuses on core functionality validation with a simple, credit-based system for controlled user testing and feedback collection.

**Project Name:** Shutr Studio  
**Deployment:** Netlify  
**Storage:** Supabase Storage  
**Authentication:** Supabase Auth + Google OAuth  
**AI Engine:** OpenAI GPT Image 1 for image generation

## **MVP Core Features (6-Week Launch)**

### **1\. User Authentication & Basic Credit System**

**Goal:** Secure user management with simple credit validation for controlled testing

**MVP Scope:**

* Email and Google OAuth authentication  
* 2 free credits per new user (no purchases)  
* 1 credit \= 1 variation generated  
* Real-time credit balance display  
* Basic insufficient credits warning

**NOT in MVP:**

* Payment processing  
* Credit purchases  
* Upgrade prompts  
* Usage analytics dashboard

### **2\. Curated Style Library (50-100 References)**

**Goal:** Four-dimensional filtering system for aesthetic matching

**MVP Scope:**

* 50-100 manually curated style references  
* 4 filter categories: Product Category, Container Types, Background Styles, Mood/Aesthetic  
* Simple grid layout with basic responsive design  
* Instant client-side filtering  
* Basic image previews

**NOT in MVP:**

* 1000+ references (POST-MVP expansion)  
* Custom style uploads  
* Infinite scroll  
* Advanced CDN optimization  
* Masonry layout

### **3\. Product Upload & Variant Selection**

**Goal:** Simple file upload with credit cost transparency

**MVP Scope:**

* Drag-drop file upload (PNG, JPG only)  
* Basic file validation (format, size)  
* Variant selector (1-4 variations)  
* Real-time credit cost preview  
* Simple image preview

**NOT in MVP:**

* Advanced image editing tools  
* Multiple file upload  
* Image optimization  
* Camera integration

### **4\. AI Generation Engine (Simplified)**

**Goal:** Core style transfer functionality with basic error handling

**MVP Scope:**

* OpenAI GPT Image 1 API integration  
* Direct/synchronous processing (no queue)  
* Simple loading spinner (no progress bar)  
* Basic error handling with credit refunds  
* Product accuracy preservation  
* 1-4 variations per generation

**NOT in MVP:**

* Real-time progress tracking  
* Background processing queue  
* Advanced retry mechanisms  
* Cancellation functionality  
* Processing optimization

### **5\. Basic Download System**

**Goal:** Simple individual file downloads

**MVP Scope:**

* Individual variation downloads  
* Basic file naming convention  
* Direct download from storage  
* Simple download tracking (count only)

**NOT in MVP:**

* Bulk ZIP downloads  
* Format conversion  
* Download history interface  
* Cloud storage integration  
* Advanced file management

## **MVP User Flow**

### **1\. Landing & Registration**

Landing Page → Sign Up (Email/Google) → Receive 2 Credits → Dashboard

### **2\. Generation Process**

Dashboard → Browse Styles (50-100) → Select Style → Upload Product → Choose Variants (1-4) → See Credit Cost → Generate → Loading Spinner → View Results → Download Individual Files

### **3\. Credit Management**

Check Balance → Generate (Consume Credits) → Run Out → See "No Credits" Message

## **Key MVP Constraints**

* **Web-only:** No mobile app  
* **Manual curation:** 50-100 hand-picked style references  
* **No payments:** Free credits only for testing  
* **Direct processing:** No background jobs or queues  
* **Basic validation:** File format and size only  
* **Simple UI:** Loading spinners, not progress bars  
* **Individual downloads:** No bulk operations

## **6-Week Development Timeline**

### **Week 1-2: Foundation**

* \[ \] Project setup (Vite + React + Tailwind + shadcn/ui)  
* \[ \] Supabase project setup (database, auth, storage)  
* \[ \] Google OAuth configuration in Google Cloud Console  
* \[ \] Authentication flow (email + Google OAuth via Supabase)  
* \[ \] Credit system (2 free credits, consumption tracking)  
* \[ \] Basic dashboard with credit display  
* \[ \] Environment variables setup (.env.local)

### **Week 3-4: Core Features**

* \[ \] Database schema for style references (not static JSON)  
* \[ \] Style library with 4-filter system (database-driven)  
* \[ \] Product upload component with Supabase Storage  
* \[ \] Variant selector with credit cost preview  
* \[ \] OpenAI GPT Image 1 integration for image generation  
* \[ \] Simple generation processing workflow  
* \[ \] Style references upload system for admin use

### **Week 5-6: Polish & Launch**

* \[ \] Results display and individual downloads from Supabase Storage  
* \[ \] Error handling with credit refunds  
* \[ \] Responsive design optimization  
* \[ \] User testing and bug fixes  
* \[ \] Netlify deployment configuration  
* \[ \] Environment variables setup for production  
* \[ \] Launch preparation and domain setup

## **Success Metrics (MVP)**

* \[ \] User can register and receive 2 credits  
* \[ \] User can browse and filter 50-100 style references  
* \[ \] User can upload product image and select variants  
* \[ \] User can generate 1-4 styled variations  
* \[ \] User can download individual variations  
* \[ \] Credits are consumed and tracked correctly  
* \[ \] System handles errors gracefully with refunds

## **POST-MVP Roadmap (Future Phases)**

### **Phase 2 (Payment Integration)**

* Payment processing integration  
* Credit packages and purchasing  
* Upgrade prompts and pricing tiers  
* Account dashboard with analytics

### **Phase 3 (Enhanced Features)**

* Expand to 1000+ style references  
* Custom style upload capability  
* Real-time progress tracking  
* Background processing queue  
* Bulk download functionality

### **Phase 4 (Optimization)**

* CDN integration for faster loading  
* Advanced image processing  
* Mobile app development  
* Team collaboration features  
* Advanced analytics

## **Launch Checklist**

* \[ \] 50-100 curated style references in database  
* \[ \] Supabase authentication working (email + Google OAuth)  
* \[ \] Credit system functioning correctly  
* \[ \] GPT Image 1 generation pipeline stable  
* \[ \] Error handling with credit refunds implemented  
* \[ \] Basic responsive design complete  
* \[ \] Netlify deployment working  
* \[ \] Environment variables configured  
* \[ \] User testing completed  
* \[ \] Documentation written

---

**Note:** This MVP is designed for validation and user feedback collection. All advanced features (payments, real-time progress, bulk operations, rate limiting, etc.) are intentionally deferred to POST-MVP phases to ensure a focused, achievable 6-week launch timeline.

**Technology Stack:**
- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Database + Auth + Storage)
- **AI:** OpenAI GPT Image 1
- **Deployment:** Netlify
- **Domain:** TBD

