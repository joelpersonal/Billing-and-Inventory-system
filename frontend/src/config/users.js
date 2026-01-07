// 🔧 USER CONFIGURATION
// Edit this file to set your own login credentials

export const users = [
  //  ADMIN USER - Full access to all features
  {
    id: 1,
    email: 'admin@billfinity.com',     
    password: 'Admin@2026',   
    role: 'admin',
    name: 'System Administrator',                 
    permissions: ['dashboard', 'inventory', 'billing', 'reports', 'settings', 'user_management'],
    avatar: 'A'                        
  },

  //  STAFF USER - Limited access to operational features
  {
    id: 2,
    email: 'staff@billfinity.com',     
    password: 'Staff@2026',   
    role: 'staff',
    name: 'Staff Member',              
    permissions: ['dashboard', 'inventory', 'billing'],
    avatar: 'S'                        
  }

  // 💡 You can add more users here if needed:
  // {
  //   id: 3,
  //   email: 'manager@billfinity.com',
  //   password: 'Manager@2026',
  //   role: 'admin',
  //   name: 'Manager Name',
  //   permissions: ['dashboard', 'inventory', 'billing', 'reports', 'settings'],
  //   avatar: 'M'
  // }
];

// 🔒 SECURITY NOTES:
// 1. Change the default passwords above before using in production
// 2. In production, passwords should be hashed on the backend
// 3. This is a frontend-only demo - real apps need a secure backend
// 4. Never store real passwords in frontend code in production
// 5. Consider using environment variables for sensitive