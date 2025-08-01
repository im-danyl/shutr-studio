# Shutr Studio

AI-powered product photography styling platform using GPT Image 1 model.

## 🚀 Live Demo
**Production:** https://shutr-studio.netlify.app  
**Status:** ⚠️ Build error (Session 5 - to be fixed next session)

## 📊 Current Progress
- ✅ **Storage Infrastructure** - Complete 4-bucket system with RLS policies
- ✅ **Database Schema** - All migrations applied (001-007)  
- ✅ **Authentication System** - Integrated but needs testing
- ✅ **Credit System** - Integrated but needs testing
- ✅ **Style Library** - 11 test images uploaded and working
- ⚠️ **Deployment** - Build error needs resolution

## 🛠️ Tech Stack
- **Frontend:** React + Vite + Tailwind + shadcn/ui
- **Backend:** Supabase (Database + Storage + Auth)
- **AI:** OpenAI GPT Image 1 + DALL-E 3
- **Deployment:** Netlify + GitHub Actions

## 📁 Project Structure
```
shutr-studio/
├── docs/                          # Documentation (organized Session 5)
│   ├── SESSION_LOG.md            # Development session history
│   ├── 4 Development Task List.md # Complete task tracking
│   └── SETUP_INSTRUCTIONS.md     # Setup and deployment guide
├── src/
│   ├── components/               # React components
│   ├── pages/                   # Application pages  
│   ├── lib/                     # Utilities (Supabase, OpenAI)
│   └── store/                   # Zustand stores (auth, credits)
├── supabase/
│   └── migrations/              # Database migrations (001-007)
└── scripts/                     # Development utilities
```

## 🗄️ Database Schema
- **user_profiles** - User data and credit balances
- **credit_transactions** - Credit usage tracking  
- **generations** - AI generation history
- **style_references** - Style library (11 test images)

## 💾 Storage Architecture
- **product-images** (private) - User uploaded photos
- **generated-images** (private) - AI generated results
- **style-references** (public) - Admin style gallery  
- **user-style-references** (private) - User custom styles

## 🔧 Development Setup
1. Clone repository: `git clone https://github.com/im-danyl/shutr-studio.git`
2. Install dependencies: `npm install`
3. Set up environment variables (see docs/SETUP_INSTRUCTIONS.md)
4. Run development server: `npm run dev`

## 📝 Recent Updates (Session 5)
- Applied storage migrations with enhanced security model
- Implemented senior developer testing approach with real test data
- Organized documentation in dedicated docs/ folder
- Enhanced Supabase client with storage helper functions
- Fixed privacy settings and added user style references bucket

## 🎯 Next Session Priorities
1. Fix Netlify build error
2. Test authentication end-to-end
3. Verify credit system in live environment
4. Plan real style library collection

## 📚 Documentation
See `docs/` folder for:
- Detailed session logs and development history
- Complete task list with progress tracking
- Setup and deployment instructions
- Technical architecture decisions

---
*Last Updated: Session 5 (2025-08-01)*