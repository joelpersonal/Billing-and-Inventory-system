# 🔍 Billfinity Setup Verification Guide

This guide helps you verify that your Billfinity installation is working correctly.

## ✅ Pre-Installation Checklist

### System Requirements
- [ ] Node.js v18+ installed (`node --version`)
- [ ] MongoDB v5+ installed and running
- [ ] Git installed
- [ ] 4GB+ RAM available
- [ ] 2GB+ disk space available

### Optional Requirements
- [ ] Ollama installed for AI features
- [ ] Gmail account with App Password for email features

## 🚀 Installation Verification Steps

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/joelpersonal/Billing-and-Inventory-system.git
cd Billing-and-Inventory-system

# Verify project structure
ls -la
# Should show: backend/, frontend/, docs/, README.md, LICENSE, .gitignore
```

### 2. Backend Setup Verification
```bash
cd backend

# Install dependencies
npm install

# Check if all dependencies installed correctly
npm list --depth=0

# Create .env file (copy from README.md)
# Verify MongoDB connection
npm run test-db

# Seed database
npm run seed

# Start backend
npm start
# Should show: "Server running on port 5000" and "MongoDB connected"
```

### 3. Frontend Setup Verification
```bash
cd ../frontend

# Install dependencies
npm install

# Check if all dependencies installed correctly
npm list --depth=0

# Start frontend
npm run dev
# Should show: "Local: http://localhost:5173"
```

### 4. Application Testing

#### Backend API Testing
Visit these URLs in your browser or use curl:

- [ ] `http://localhost:5000/api/health` - Should return `{"status": "OK"}`
- [ ] `http://localhost:5000/api/dashboard/total-products` - Should return product count
- [ ] `http://localhost:5000/api/products` - Should return products list

#### Frontend Testing
Visit `http://localhost:5173` and verify:

- [ ] Landing page loads correctly
- [ ] Login page accessible
- [ ] Can login with default credentials:
  - Admin: `admin@billfinity.com` / `Admin@2026`
  - Staff: `staff@billfinity.com` / `Staff@2026`

#### Dashboard Testing
After login, verify:

- [ ] Dashboard shows real-time data
- [ ] All stat cards display numbers
- [ ] Charts render correctly
- [ ] No console errors

#### Feature Testing
Test each major feature:

- [ ] **Inventory Management**
  - Add new product
  - Edit existing product
  - Delete product
  - Search and filter products
  - Stats update in real-time

- [ ] **Billing & Invoices**
  - Create new invoice
  - Generate PDF
  - Send email (if configured)
  - View invoice history

- [ ] **Analytics & Reports**
  - View charts and graphs
  - Export PDF reports
  - Data reflects real inventory

- [ ] **System Settings**
  - Change business information
  - Update preferences
  - Settings apply globally

- [ ] **AI Search** (if Ollama configured)
  - Search suggestions appear
  - Context-aware recommendations
  - Fallback works when AI unavailable

## 🔧 Troubleshooting Common Issues

### Backend Issues

**MongoDB Connection Failed**
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS
net start MongoDB  # Windows

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/billfinity
```

**Port 5000 Already in Use**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change PORT in .env
PORT=5001
```

**JWT Secret Missing**
```bash
# Add to .env file
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### Frontend Issues

**Port 5173 Already in Use**
```bash
# Vite will automatically try next available port
# Or specify custom port in vite.config.js
```

**API Connection Failed**
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure API_BASE_URL in frontend matches backend port

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Email Issues

**Gmail Authentication Failed**
- Verify 2FA is enabled on Gmail account
- Generate new App Password
- Use App Password, not regular password
- Check MAIL_USER and MAIL_PASS in .env

### AI Features Issues

**Ollama Connection Failed**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download model
ollama pull llama3.2

# Start Ollama service
ollama serve

# Verify in .env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

## 📊 Performance Verification

### Expected Performance Metrics
- [ ] Frontend loads in < 3 seconds
- [ ] API responses in < 500ms
- [ ] Database queries in < 100ms
- [ ] PDF generation in < 2 seconds
- [ ] Email sending in < 5 seconds

### Memory Usage
- [ ] Backend: ~100-200MB RAM
- [ ] Frontend dev server: ~50-100MB RAM
- [ ] MongoDB: ~100-500MB RAM

## 🎯 Production Readiness Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Use environment variables for all secrets
- [ ] Set NODE_ENV=production
- [ ] Configure proper MongoDB connection
- [ ] Set up SSL/HTTPS
- [ ] Configure email service
- [ ] Test all features thoroughly
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

## 📞 Support

If you encounter issues:

1. Check this verification guide
2. Review the main README.md
3. Check the `/docs` folder for specific guides
4. Create an issue on GitHub with:
   - Error messages
   - System information
   - Steps to reproduce
   - Screenshots if applicable

---

**✅ Verification Complete!**

If all checks pass, your Billfinity installation is ready for use!

*Last updated: January 2026*