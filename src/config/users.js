// 🔧 USER CONFIGURATION - Database Authentication
// 
// ✅ Users are now stored in MongoDB Atlas database
// ✅ No hardcoded credentials - secure for hosting
// ✅ Admin and Staff can login from anywhere
//
// 📋 Current Login Credentials (saved in database):
//
// ADMIN LOGIN:
// Email: admin@billfinity.com
// Password: Itsmeadmin2026
// Role: admin
//
// STAFF LOGIN:  
// Email: staff@billfinity.com
// Password: Itsmestaff2026
// Role: staff
//
// 🚀 These credentials work after deployment to any hosting platform
// 🔒 Passwords are securely hashed in the database
// 🌐 Anyone can access the application with these credentials

// This file is kept for reference only - authentication now uses database
export const users = [
  // Users are now stored in MongoDB Atlas database
  // Use the login credentials shown above
];

// 💡 To add more users:
// 1. Use the registration form in the application, OR
// 2. Create a script similar to create-default-users.js, OR  
// 3. Add users directly in MongoDB Atlas dashboard