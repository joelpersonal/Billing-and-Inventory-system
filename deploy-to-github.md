# 🚀 GitHub Repository Update Commands

## Step 1: Initialize Git (if not already done)
```bash
git init
git remote add origin https://github.com/joelpersonal/Billing-and-Inventory-system.git
```

## Step 2: Remove all existing files from repository
```bash
# This will remove all files from the repository but keep them locally
git rm -r --cached .
git commit -m "Remove all existing files for fresh deployment"
git push origin main
```

## Step 3: Add all new project files
```bash
# Add all files to git
git add .

# Commit with descriptive message
git commit -m "Complete Billfinity project with voice-assisted billing, AI integration, and automated reorders

Features:
- Voice-assisted billing with manual pricing
- AI-powered search using Hugging Face API
- Automated and manual reorder management
- PDF invoice generation and email delivery
- Real-time inventory tracking
- Role-based authentication (Admin/Staff)
- MongoDB Atlas integration
- Vercel deployment ready
- Comprehensive documentation

Tech Stack:
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB
- AI: Hugging Face API (free tier)
- Deployment: Vercel (full-stack)
- Database: MongoDB Atlas (free tier)"

# Push to GitHub
git push origin main
```

## Step 4: Verify Upload
```bash
# Check repository status
git status

# View recent commits
git log --oneline -5
```

## Alternative: Force Push (if needed)
```bash
# If you encounter conflicts, you can force push (use with caution)
git push --force origin main
```

## Step 5: Create Release Tag (Optional)
```bash
# Create a release tag
git tag -a v1.0.0 -m "Billfinity v1.0.0 - Complete billing and inventory system"
git push origin v1.0.0
```

---

## 🌐 Vercel Deployment Commands

After updating GitHub, deploy to Vercel:

### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set up environment variables
# - Deploy
```

### Option 2: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import from GitHub: `joelpersonal/Billing-and-Inventory-system`
4. Configure environment variables
5. Deploy

---

## 📋 Environment Variables for Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

### Required
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/billfinity
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NODE_ENV=production
```

### Optional (for full functionality)
```
HUGGINGFACE_API_KEY=hf_your_hugging_face_api_key
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-gmail-app-password
```

---

## 🧪 Test Deployment

After deployment, test these URLs:

- **Frontend**: https://your-app.vercel.app
- **API Health**: https://your-app.vercel.app/api/health
- **Login**: Use admin@billfinity.com / Admin@2026

---

## 🎉 Success!

Your Billfinity project is now:
✅ **Uploaded to GitHub**
✅ **Deployed on Vercel**
✅ **Ready for production use**

Share your live demo: `https://your-app.vercel.app`