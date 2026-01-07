# 🔐 Login System Guide

## Overview
The Billfinity system now uses a secure, role-based authentication system with customizable credentials and proper access control.

## User Roles

### 👑 Admin
- **Full Access**: All features and pages
- **Permissions**: Dashboard, Inventory, Billing, Reports, Settings
- **Default Credentials**: 
  - Email: `admin@billfinity.com`
  - Password: `Admin@2026`

### 👤 Staff
- **Limited Access**: Operational features only
- **Permissions**: Dashboard, Inventory, Billing
- **Restricted**: Cannot access Reports or Settings
- **Default Credentials**:
  - Email: `staff@billfinity.com`
  - Password: `Staff@2026`

## Security Features

### ✅ What's Implemented
- **No Test Credentials**: Login page is clean and secure
- **Role-Based Access Control**: Pages restricted based on user role
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Passwords are hashed using bcrypt
- **Protected Routes**: Unauthorized access redirects to access denied page
- **Customizable Users**: Easy to modify credentials in config file

### 🔒 Security Notes
- Passwords are hashed on the backend using bcrypt
- JWT tokens are used for session management
- Role-based permissions prevent unauthorized access
- Clean login interface without exposed credentials

## Customizing Users

### 📝 Edit User Credentials
1. Open `Billing-and-Inventory-system/src/config/users.js`
2. Modify the user objects:
   ```javascript
   {
     email: 'your-admin@company.com',
     password: 'YourSecurePassword123',
     role: 'admin',
     name: 'Your Admin Name'
   }
   ```
3. Run the seed script to update the database:
   ```bash
   cd backend
   npm run seed-users
   ```

### 🚀 Available Commands
```bash
# Seed all data (users, products, orders)
npm run seed

# Seed only users
npm run seed-users

# Start backend server
npm start
```

## Access Control

### Admin Access
- ✅ Dashboard
- ✅ Inventory Management
- ✅ Billing & Invoices
- ✅ Analytics & Reports
- ✅ System Settings

### Staff Access
- ✅ Dashboard
- ✅ Inventory Management
- ✅ Billing & Invoices
- ❌ Analytics & Reports (Admin Only)
- ❌ System Settings (Admin Only)

## Login Process

1. **Clean Login Page**: No test credentials shown
2. **Manual Authentication**: Users must enter credentials manually
3. **Role Detection**: System automatically detects user role
4. **Permission Check**: Each page checks user permissions
5. **Access Control**: Unauthorized users see access denied page

## Database Setup

The system automatically creates users in MongoDB with:
- Hashed passwords (bcrypt)
- Role assignments
- User profiles

Run `npm run seed` in the backend folder to initialize the database with the configured users.

## Production Notes

⚠️ **Important for Production:**
1. Change default passwords in `users.js`
2. Use environment variables for sensitive data
3. Enable HTTPS for secure token transmission
4. Implement password complexity requirements
5. Add password reset functionality
6. Consider implementing 2FA for admin accounts

---

**System Status**: ✅ Secure login system implemented with role-based access control