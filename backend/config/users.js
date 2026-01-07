// 🔧 BACKEND USER CONFIGURATION
// This mirrors the frontend user config for database seeding

export const users = [
  // 👤 ADMIN USER - Full access to all features
  {
    id: 1,
    email: 'admin@billfinity.com',     
    password: 'Admin@2026',   
    role: 'admin',
    name: 'System Administrator',                 
    permissions: ['dashboard', 'inventory', 'billing', 'reports', 'settings', 'user_management'],
    avatar: 'A'                        
  },

  // 👤 STAFF USER - Limited access to operational features
  {
    id: 2,
    email: 'staff@billfinity.com',     
    password: 'Staff@2026',   
    role: 'staff',
    name: 'Staff Member',              
    permissions: ['dashboard', 'inventory', 'billing'],
    avatar: 'S'                        
  }
];

// 🔒 SECURITY NOTES:
// 1. Change the default passwords above before using in production
// 2. In production, passwords should be hashed on the backend
// 3. Never store real passwords in frontend code in production
// 4. Consider using environment variables for sensitive data