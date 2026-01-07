# 🚀 Billfinity - Smart Inventory Control & Billing System

A comprehensive business management system built with React, Node.js, Express, and MongoDB. Features real-time inventory management, automated billing, AI-powered search, and professional reporting.

![Billfinity Logo](https://img.shields.io/badge/Billfinity-Smart%20Control%20%26%20Billing-8B5CF6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIwIDEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI1OCIgZmlsbD0iIzhCNUNGNiIvPgogIDx0ZXh0IHg9IjYwIiB5PSI3MCIgZm9udC1zaXplPSI0MCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkI8L3RleHQ+Cjwvc3ZnPg==)

## ✨ Features

### 🏪 **Inventory Management**
- Real-time stock tracking and monitoring
- Product CRUD operations with advanced filtering
- Low stock alerts and notifications
- Category-based organization
- Stock value calculations

### 💰 **Billing & Invoicing**
- Professional invoice generation
- PDF export with PDFKit
- Email delivery via Gmail SMTP
- Customer information management
- Tax calculations and discounts

### 📊 **Analytics & Reports**
- Real-time business dashboard
- Sales and revenue analytics
- Interactive charts and graphs
- PDF report generation
- Category-wise performance tracking

### 🤖 **AI-Powered Search**
- Ollama integration with Llama models
- Context-aware search suggestions
- Page-specific AI recommendations
- Offline fallback support

### 🔐 **Authentication & Security**
- JWT-based authentication
- Role-based access control (Admin/Staff)
- Secure password hashing
- Protected API endpoints

### 🎨 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Custom React components
- Real-time notifications
- Professional modal dialogs
- Dark/light theme support

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **PDFKit** - PDF generation

### AI Integration
- **Ollama** - Local LLM server
- **Llama 3.2** - Language model
- **Context-aware prompts** - Smart suggestions

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/joelpersonal/Billing-and-Inventory-system.git
   cd Billing-and-Inventory-system
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `backend/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/billfinity
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   
   # Email Configuration
   MAIL_SERVICE=Gmail
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=465
   MAIL_SECURE=true
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_app_password
   
   # AI Configuration (Optional)
   OLLAMA_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.2
   ```

5. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

6. **Seed the Database**
   ```bash
   cd backend
   npm run seed
   ```

7. **Start the Application**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm start
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

8. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 👤 Default Login Credentials

### Admin Account
- **Email**: `admin@billfinity.com`
- **Password**: `Admin@2026`
- **Access**: Full system access

### Staff Account
- **Email**: `staff@billfinity.com`
- **Password**: `Staff@2026`
- **Access**: Limited to operations (no reports/settings)

## 📁 Project Structure

```
Billing-and-Inventory-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API services
│   │   └── config/         # Configuration files
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Custom middleware
│   └── utils/             # Utility functions
├── docs/                   # Documentation files
└── README.md
```

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication
2. Generate App Password
3. Update `.env` with credentials

### AI Setup (Optional)
1. Install Ollama: https://ollama.ai/download
2. Download model: `ollama pull llama3.2`
3. Start service: `ollama serve`

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order

### Dashboard
- `GET /api/dashboard/total-products` - Get product count
- `GET /api/dashboard/stock-value` - Get stock value
- `GET /api/dashboard/sales-revenue` - Get sales data

### AI (Optional)
- `GET /api/ai/search-suggestions` - Get AI suggestions
- `GET /api/ai/status` - Check AI status

## 🎯 Key Features Explained

### Real-time Inventory
- Automatic stock level updates
- Low stock alerts
- Category-based filtering
- Advanced search capabilities

### Professional Billing
- PDF invoice generation
- Email delivery system
- Customer management
- Tax and discount calculations

### Business Analytics
- Interactive dashboards
- Sales performance tracking
- Revenue analytics
- Exportable reports

### AI Integration
- Context-aware search suggestions
- Page-specific recommendations
- Natural language queries
- Offline fallback support

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API endpoints
- Input validation and sanitization

## 🎨 UI/UX Features

- Responsive design for all devices
- Modern gradient-based styling
- Custom modal dialogs
- Real-time notifications
- Professional animations

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation files in `/docs`
- Review the setup guides

## 🚀 Deployment

### Production Deployment
1. Set `NODE_ENV=production`
2. Use environment variables for secrets
3. Set up MongoDB Atlas for cloud database
4. Configure email service
5. Deploy to your preferred platform

### Environment Variables
Ensure all environment variables are properly set in production:
- Database connection strings
- JWT secrets
- Email credentials
- API keys

---

**Built with ❤️ by Joel Personal**

*Billfinity - Empowering businesses with smart inventory control and automated billing solutions.*