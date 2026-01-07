# Billfinity Backend API

Complete backend API for the Billfinity Inventory & Billing System built with Node.js, Express, and MongoDB.

## 🚀 Features

- **JWT Authentication** - Secure user authentication and authorization
- **Dashboard Analytics** - Real-time statistics and charts data
- **Product Management** - CRUD operations for inventory
- **Order Management** - Complete billing and sales tracking
- **Role-based Access** - Admin, Manager, and Employee roles
- **RESTful APIs** - Clean and consistent API design

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   - Copy `.env` file and update with your values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/billfinity
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

3. **Start MongoDB:**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas cloud database

4. **Seed Database (Optional):**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🔐 Test Credentials

After running the seed script, use these credentials:

- **Admin:** admin@billfinity.com / admin123
- **Manager:** manager@billfinity.com / manager123  
- **Employee:** employee@billfinity.com / employee123

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Dashboard (All Protected)
- `GET /api/dashboard/total-products` - Total products with growth
- `GET /api/dashboard/stock-value` - Stock value with growth
- `GET /api/dashboard/todays-sales` - Today's sales with growth
- `GET /api/dashboard/low-stock` - Low stock alerts
- `GET /api/dashboard/sales-revenue` - 7-day sales & revenue chart
- `GET /api/dashboard/product-categories` - Product categories distribution

### Products (Protected)
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin/Manager only)
- `PUT /api/products/:id` - Update product (Admin/Manager only)
- `DELETE /api/products/:id` - Delete product (Admin/Manager only)

### Orders (Protected)
- `GET /api/orders` - Get all orders (with pagination)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status (Admin/Manager only)

## 📝 API Response Format

All APIs return JSON responses in this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error info"
}
```

## 🔒 Authentication

Include JWT token in request headers:
```
Authorization: Bearer <your_jwt_token>
```

## 🏗️ Project Structure

```
backend/
├── models/          # Database models
├── controllers/     # Route controllers
├── routes/          # API routes
├── services/        # Business logic
├── middleware/      # Custom middleware
├── utils/           # Utility functions
└── app.js          # Main application file
```

## 🧪 Testing the API

1. **Health Check:**
   ```bash
   GET http://localhost:5000/api/health
   ```

2. **Login:**
   ```bash
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json

   {
     "email": "admin@billfinity.com",
     "password": "admin123"
   }
   ```

3. **Dashboard Data:**
   ```bash
   GET http://localhost:5000/api/dashboard/total-products
   Authorization: Bearer <your_token>
   ```

## 🚀 Deployment

1. Set environment variables for production
2. Use PM2 or similar process manager
3. Set up reverse proxy with Nginx
4. Use MongoDB Atlas for cloud database

## 📈 Dashboard Data Structure

The dashboard endpoints return data in the exact format expected by your frontend:

- **Total Products:** `{ total: 1234, growthPercentage: 12 }`
- **Stock Value:** `{ stockValue: 48942, growthPercentage: 8.2 }`
- **Today's Sales:** `{ todaySales: 3249, growthPercentage: 15 }`
- **Low Stock:** `{ lowStockCount: 4, differenceFromLastWeek: -2 }`
- **Sales Revenue:** `{ labels: [...], sales: [...], revenue: [...] }`
- **Categories:** `{ categories: [{ name: "Electronics", count: 320 }] }`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request