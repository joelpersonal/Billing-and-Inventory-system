# 🏢 Billfinity - Smart Inventory Control & Billing System

A comprehensive inventory management and billing system built with React, featuring JWT authentication, role-based access control, and a beautiful purple-themed UI.

![Billfinity Logo](https://img.shields.io/badge/Billfinity-Smart%20Inventory%20System-8B5CF6?style=for-the-badge&logo=react)

## ✨ Features

### 🔐 Authentication & Security
- **JWT Authentication** with token refresh
- **Role-based Access Control** (Admin & Staff)
- **Secure Login System** with manual credential entry
- **Session Management** with auto-logout

### 📊 Dashboard & Analytics
- **Real-time Analytics** with interactive charts
- **Business Insights** with trend analysis
- **Performance Metrics** with visual indicators
- **Recent Activity** tracking

### 📦 Inventory Management
- **Product Catalog** with categories
- **Stock Level Tracking** with alerts
- **Low Stock Notifications** 
- **Product Search & Filtering**
- **Bulk Operations** support

### 💰 Billing & Invoicing
- **Interactive Shopping Cart**
- **Automated Tax Calculations** (GST support)
- **Professional Invoice Generation**
- **Customer Information Management**
- **Payment Tracking**

### 📈 Reports & Analytics
- **Sales Reports** with charts
- **Revenue Analysis** 
- **Category Performance** metrics
- **Export Functionality**
- **Print Support**

### ⚙️ System Settings
- **User Management** (Admin only)
- **Business Configuration**
- **Tax Settings**
- **Notification Preferences**

## 🎨 Design Features

- **Professional Purple Theme** matching brand identity
- **Responsive Design** for all devices
- **Modern UI Components** with smooth animations
- **Glassmorphism Effects** with backdrop blur
- **Professional Typography** and spacing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/joelpersonal/Billing-and-Inventory-system.git
   cd Billing-and-Inventory-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure user credentials**
   Edit `src/config/users.js` to set your login credentials:
   ```javascript
   export const users = [
     {
       id: 1,
       email: 'your-email@domain.com',
       password: 'your-secure-password',
       role: 'admin',
       name: 'Your Name',
       permissions: ['dashboard', 'inventory', 'billing', 'reports', 'settings', 'user_management'],
       avatar: 'Y'
     }
   ];
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Default Access Levels

### Administrator
- **Full Access** to all features
- **User Management** capabilities
- **System Settings** access
- **All Reports** and analytics

### Staff Member
- **Limited Access** to core operations
- **Dashboard** viewing
- **Inventory Management**
- **Billing Operations**

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Logo.jsx        # Billfinity logo component
│   ├── ProtectedRoute.jsx  # Route protection
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── StatCard.jsx    # Dashboard stat cards
│   └── Topbar.jsx      # Top navigation bar
├── config/             # Configuration files
│   └── users.js        # User credentials config
├── context/            # React context providers
│   └── AuthContext.jsx # Authentication context
├── data/               # Sample data
│   ├── dashboard.js    # Dashboard sample data
│   └── products.js     # Product sample data
├── pages/              # Page components
│   ├── Billing.jsx     # Billing & invoicing
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Inventory.jsx   # Inventory management
│   ├── LandingPage.jsx # Landing page
│   ├── Login.jsx       # Authentication page
│   ├── Reports.jsx     # Analytics & reports
│   └── Settings.jsx    # System settings
├── utils/              # Utility functions
│   └── auth.js         # JWT authentication utilities
├── App.jsx             # Main app component
├── index.css           # Global styles
└── main.jsx            # App entry point
```

## 🛠️ Technologies Used

- **Frontend Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Heroicons
- **Authentication**: JWT (JSON Web Tokens)
- **Build Tool**: Vite
- **Package Manager**: npm

## 🔧 Configuration

### Adding New Users
Edit `src/config/users.js`:
```javascript
{
  id: 3,
  email: 'newuser@domain.com',
  password: 'secure-password',
  role: 'admin', // or 'staff'
  name: 'New User Name',
  permissions: ['dashboard', 'inventory', 'billing'],
  avatar: 'N'
}
```

### Customizing Permissions
Available permissions:
- `dashboard` - Dashboard access
- `inventory` - Inventory management
- `billing` - Billing operations
- `reports` - Reports and analytics
- `settings` - System settings
- `user_management` - User management (admin only)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or need help:

1. **Check the documentation** above
2. **Clear browser cache** and localStorage
3. **Use the "Clear Session" button** on login page if stuck
4. **Create an issue** on GitHub

## 🎯 Roadmap

- [ ] Backend API integration
- [ ] Database connectivity
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Multi-language support

## 👥 Team

- **Project Lead**: Joel Personal
- **Contributors**: Welcome!

---

**Built with ❤️ for modern businesses worldwide**

© 2024 Billfinity. All rights reserved.
