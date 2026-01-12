# 🚀 Billfinity Deployment Guide

## Quick Vercel Deployment

### 1. Prerequisites
- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free)
- Hugging Face account (free)

### 2. GitHub Setup
1. **Fork/Clone this repository**
2. **Push to your GitHub** (if cloned locally)

### 3. Vercel Deployment

#### Option A: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/joelpersonal/Billing-and-Inventory-system)

#### Option B: Manual Deploy
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

### 4. Environment Variables

In your Vercel dashboard, add these environment variables:

#### Required Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/billfinity
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NODE_ENV=production
```

#### Optional Variables (for full functionality)
```env
HUGGINGFACE_API_KEY=hf_your_hugging_face_api_key
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-gmail-app-password
```

### 5. Database Setup

#### MongoDB Atlas (Free Tier)
1. Go to [mongodb.com](https://mongodb.com)
2. Create free account
3. Create new cluster (M0 Sandbox - FREE)
4. Create database user
5. Whitelist IP addresses (0.0.0.0/0 for Vercel)
6. Get connection string
7. Replace `<password>` with your database user password

#### Sample Connection String
```
mongodb+srv://billfinity:yourpassword@cluster0.abc123.mongodb.net/billfinity?retryWrites=true&w=majority
```

### 6. AI Setup (Optional but Recommended)

#### Hugging Face API (Free)
1. Go to [huggingface.co](https://huggingface.co)
2. Create free account
3. Go to Settings → Access Tokens
4. Create new token
5. Copy token (starts with `hf_`)

### 7. Email Setup (Optional)

#### Gmail App Password
1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account Settings
3. Security → 2-Step Verification → App passwords
4. Generate app password for "Mail"
5. Use this password in `MAIL_PASS`

### 8. Post-Deployment

#### Seed Database
After deployment, seed your database with sample data:

1. Go to your deployed site: `https://your-app.vercel.app`
2. The app will automatically create default users on first run
3. Login with: `admin@billfinity.com` / `Admin@2026`

#### Test Functionality
- ✅ Login/Authentication
- ✅ Dashboard loads
- ✅ Inventory management
- ✅ Voice-assisted billing
- ✅ AI search (if API key provided)
- ✅ PDF generation
- ✅ Email functionality (if configured)

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Fails
```bash
# Check build logs in Vercel dashboard
# Common fixes:
- Ensure all dependencies are in package.json
- Check for TypeScript errors
- Verify environment variables
```

#### 2. Database Connection Error
```bash
# Check:
- MongoDB Atlas IP whitelist (add 0.0.0.0/0)
- Connection string format
- Database user permissions
- Network access settings
```

#### 3. API Routes Not Working
```bash
# Verify:
- vercel.json configuration
- API routes start with /api/
- Backend environment variables set
```

#### 4. Voice Commands Not Working
```bash
# Requirements:
- HTTPS (Vercel provides this automatically)
- Modern browser (Chrome, Edge, Safari)
- Microphone permissions granted
```

### Environment Variables Checklist

#### Minimum Required (Basic functionality)
- [ ] `MONGODB_URI` - Database connection
- [ ] `JWT_SECRET` - Authentication security
- [ ] `NODE_ENV=production` - Production mode

#### Recommended (Full functionality)
- [ ] `HUGGINGFACE_API_KEY` - AI search features
- [ ] `MAIL_HOST` - Email functionality
- [ ] `MAIL_PORT` - Email port
- [ ] `MAIL_USER` - Email username
- [ ] `MAIL_PASS` - Email password

### Performance Optimization

#### Vercel Settings
```json
{
  "functions": {
    "backend/app.js": {
      "maxDuration": 30
    }
  }
}
```

#### MongoDB Optimization
- Use connection pooling (already configured)
- Create indexes for frequently queried fields
- Use projection to limit returned fields

## 🌐 Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Domains" tab
3. Add your custom domain
4. Follow DNS configuration instructions
5. SSL certificate is automatically provided

## 📊 Monitoring

### Vercel Analytics
- Automatically enabled for all deployments
- View in Vercel dashboard
- Monitor performance and usage

### Error Tracking
- Check Vercel function logs
- Monitor API response times
- Set up alerts for failures

## 🔄 Updates and Maintenance

### Automatic Deployments
- Connected to GitHub repository
- Auto-deploys on push to main branch
- Preview deployments for pull requests

### Manual Updates
1. Push changes to GitHub
2. Vercel automatically rebuilds and deploys
3. Zero-downtime deployments

### Database Maintenance
- MongoDB Atlas handles backups automatically
- Monitor storage usage in Atlas dashboard
- Upgrade to paid tier if needed for production

## 🆘 Support

If you encounter issues:

1. **Check Vercel Logs**: Function logs in Vercel dashboard
2. **MongoDB Logs**: Atlas monitoring dashboard
3. **Browser Console**: For frontend issues
4. **GitHub Issues**: Report bugs or ask questions

### Quick Links
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Hugging Face API Docs](https://huggingface.co/docs/api-inference)

---

**Happy Deploying! 🚀**