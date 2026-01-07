# 🚀 Vercel Deployment Guide for Billfinity

This guide will help you deploy your Billfinity application to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a cloud database at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **GitHub Repository**: Your code should be pushed to GitHub
4. **Environment Variables**: Prepare your production environment variables

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string

### 2. Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/billfinity?retryWrites=true&w=majority
```

## 🔧 Vercel Configuration

### 1. Environment Variables
In your Vercel dashboard, add these environment variables:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/billfinity?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Email (Gmail)
MAIL_SERVICE=Gmail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Node Environment
NODE_ENV=production
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project root
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: billfinity
# - Directory: ./
# - Override settings? No
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
5. Add environment variables
6. Deploy

## 🔄 Post-Deployment Setup

### 1. Seed Database
After deployment, you'll need to seed your database:

```bash
# Option 1: Run locally pointing to production DB
# Update your local .env to use production MONGODB_URI temporarily
cd backend
npm run seed

# Option 2: Use Vercel CLI
vercel env pull .env.local
npm run seed
```

### 2. Test Deployment
1. Visit your Vercel URL
2. Test login with default credentials:
   - Admin: `admin@billfinity.com` / `Admin@2026`
   - Staff: `staff@billfinity.com` / `Staff@2026`
3. Test all features:
   - Dashboard data loading
   - Inventory management
   - PDF generation
   - Email functionality

## 🚨 Important Notes

### Limitations on Vercel
1. **AI Features**: Ollama won't work on Vercel (serverless environment)
   - AI search will fall back to predefined suggestions
   - Consider using OpenAI API or similar cloud AI service

2. **File Storage**: Temporary files only
   - PDFs are generated in memory and sent directly
   - No persistent file storage

3. **Function Timeout**: 30 seconds max execution time
   - Large PDF generation might timeout
   - Consider optimizing or using background jobs

### Performance Optimization
1. **Database Indexing**: Add indexes to frequently queried fields
2. **Caching**: Consider adding Redis for caching
3. **CDN**: Vercel automatically provides CDN for static assets

## 🔧 Troubleshooting

### Common Issues

**Database Connection Failed**
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user has proper permissions

**Environment Variables Not Working**
- Redeploy after adding environment variables
- Check variable names match exactly
- Use Vercel CLI: `vercel env ls`

**Build Failures**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

**API Routes Not Working**
- Check vercel.json configuration
- Ensure backend routes start with /api
- Verify function deployment in Vercel dashboard

### Debug Commands
```bash
# Check deployment logs
vercel logs

# Pull environment variables
vercel env pull

# Check project settings
vercel inspect
```

## 📊 Monitoring

### Vercel Analytics
1. Enable Analytics in Vercel dashboard
2. Monitor performance and usage
3. Set up alerts for errors

### Database Monitoring
1. Use MongoDB Atlas monitoring
2. Set up alerts for connection issues
3. Monitor query performance

## 🔄 Updates and Maintenance

### Automatic Deployments
- Connected to GitHub: Auto-deploy on push to main branch
- Manual deployments: Use `vercel` command

### Database Backups
- MongoDB Atlas provides automatic backups
- Consider setting up additional backup strategies

## 🎯 Production Checklist

Before going live:
- [ ] Database properly configured and seeded
- [ ] All environment variables set
- [ ] Email functionality tested
- [ ] PDF generation working
- [ ] All features tested on production URL
- [ ] Performance optimized
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Custom domain configured (optional)

## 📞 Support

If you encounter issues:
1. Check Vercel documentation
2. Review deployment logs
3. Test locally with production environment variables
4. Check MongoDB Atlas connection and logs

---

**🚀 Your Billfinity application will be live at: `https://your-project-name.vercel.app`**

*Happy deploying!*