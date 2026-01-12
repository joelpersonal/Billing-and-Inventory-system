# 🏢 Billfinity - Complete Billing & Inventory Management System

A modern, full-stack billing and inventory management system built with React, Node.js, and MongoDB. Features voice-assisted billing, AI-powered search, automated reorders, and comprehensive reporting.

## ✨ Features

### 🎤 Voice-Assisted Billing
- Voice commands for adding/removing items
- Natural language processing
- Manual price setting for voice-added items
- Real-time voice feedback

### 📦 Inventory Management
- Real-time stock tracking
- Low stock alerts
- Automated reorder system
- Manual reorder creation
- Supplier management

### 🧾 Smart Invoicing
- PDF generation and email delivery
- Invoice timeline tracking
- Smart insights with AI analysis
- Customer management

### 🤖 AI Integration
- Free Hugging Face API integration
- Intelligent search suggestions
- Context-aware responses
- Fallback system for reliability

### 📊 Dashboard & Analytics
- Real-time business metrics
- Sales revenue tracking
- Product performance analytics
- Interactive charts and graphs

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (Admin/Staff)
- Secure password handling
- Session management

## 🚀 Live Demo

- **Frontend**: [https://billfinity.vercel.app](https://billfinity.vercel.app)
- **API**: [https://billfinity.vercel.app/api](https://billfinity.vercel.app/api)

### Demo Credentials
- **Admin**: admin@billfinity.com / Admin@2026
- **Staff**: staff@billfinity.com / Staff@2026

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management
- **React Icons** for UI icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Nodemailer** for email services
- **PDFKit** for PDF generation

### AI & Services
- **Hugging Face API** (Free tier)
- **Web Speech API** for voice recognition
- **MongoDB Atlas** for cloud database

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- MongoDB Atlas account (free tier available)
- Hugging Face account (free tier available)

## 🚀 Quick Start

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/joelpersonal/Billing-and-Inventory-system.git
cd Billing-and-Inventory-system
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm run install:all
\`\`\`

### 3. Environment Setup

Create \`backend/.env\`:
\`\`\`env
# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Email (Optional - for invoice emails)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# AI Service
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Server
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
\`\`\`

### 4. Database Setup
\`\`\`bash
# Test MongoDB connection
npm run test:connection

# Seed sample data
npm run seed
\`\`\`

### 5. Start Development
\`\`\`bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:backend  # Backend on :5001
npm run dev:frontend # Frontend on :5173
\`\`\`

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Fork this repository**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

3. **Set Environment Variables** in Vercel dashboard:
   \`\`\`
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   HUGGINGFACE_API_KEY=your_huggingface_key
   NODE_ENV=production
   \`\`\`

4. **Deploy**: Vercel will automatically build and deploy both frontend and backend

### Manual Deployment

\`\`\`bash
# Build frontend
npm run build

# Start production server
npm start
\`\`\`

## 📁 Project Structure

\`\`\`
billfinity/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── package.json
├── docs/                   # Documentation
├── vercel.json            # Vercel configuration
└── README.md
\`\`\`

## 🎯 Key Features Guide

### Voice-Assisted Billing
1. Navigate to Billing page
2. Enable voice in "Voice-Assisted Billing" section
3. Say commands like:
   - "add sugar" - adds 1 sugar
   - "add 2 rice" - adds 2 rice
   - "remove milk" - removes milk from cart
4. Set prices manually for voice-added items

### Inventory Management
1. Go to Inventory Management
2. Add/edit products with stock levels
3. Set up automated reorders with reorder points
4. Create manual reorders when needed

### AI Search
1. Use search boxes throughout the app
2. Get intelligent suggestions based on context
3. AI learns from your usage patterns

## 🔧 Configuration

### MongoDB Atlas Setup
1. Create free account at [mongodb.com](https://mongodb.com)
2. Create new cluster
3. Get connection string
4. Add to \`.env\` file

### Hugging Face API Setup
1. Create free account at [huggingface.co](https://huggingface.co)
2. Generate API token
3. Add to \`.env\` file

### Email Configuration (Optional)
1. Enable 2FA on Gmail
2. Generate app password
3. Add credentials to \`.env\`

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
\`\`\`bash
# Test connection
npm run test:connection

# Check MongoDB Atlas IP whitelist
# Ensure connection string is correct
\`\`\`

**Voice Commands Not Working**
- Use Chrome, Edge, or Safari (Firefox has limited support)
- Ensure microphone permissions are granted
- Check browser console for errors

**Build Errors**
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
\`\`\`

## 📚 API Documentation

### Authentication
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/register\` - User registration
- \`GET /api/auth/profile\` - Get user profile

### Products
- \`GET /api/products\` - Get all products
- \`POST /api/products\` - Create product
- \`PUT /api/products/:id\` - Update product
- \`DELETE /api/products/:id\` - Delete product

### Orders
- \`GET /api/orders\` - Get all orders
- \`POST /api/orders\` - Create order
- \`PATCH /api/orders/:id/status\` - Update order status

### Reorders
- \`GET /api/reorders\` - Get all reorders
- \`POST /api/reorders/manual\` - Create manual reorder
- \`PATCH /api/reorders/:id/status\` - Update reorder status

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co) for free AI API
- [MongoDB Atlas](https://mongodb.com) for cloud database
- [Vercel](https://vercel.com) for hosting platform
- [Tailwind CSS](https://tailwindcss.com) for styling framework

## 📞 Support

For support, email support@billfinity.com or create an issue on GitHub.

---

**Made with ❤️ by the Billfinity Team**