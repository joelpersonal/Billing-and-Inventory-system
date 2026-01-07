# 🔐 How to Set Your Own Login Credentials

## Quick Setup Guide

### Step 1: Open the Configuration File
Navigate to: `src/config/users.js`

### Step 2: Edit Your Credentials
Replace the placeholder values with your own:

```javascript
{
  id: 1,
  email: 'your-email@domain.com',    // 👈 Your email address
  password: 'your-secure-password',  // 👈 Your password
  role: 'admin',
  name: 'Your Full Name',            // 👈 Your name
  permissions: ['dashboard', 'inventory', 'billing', 'reports', 'settings', 'user_management'],
  avatar: 'Y'                        // 👈 Your initial
}
```

### Step 3: Save and Test
1. Save the file
2. Refresh your browser
3. Use your new credentials to login

## Example Configuration

```javascript
export const users = [
  // Admin User
  {
    id: 1,
    email: 'john.doe@mycompany.com',
    password: 'MySecurePass123',
    role: 'admin',
    name: 'John Doe',
    permissions: ['dashboard', 'inventory', 'billing', 'reports', 'settings', 'user_management'],
    avatar: 'J'
  },

  // Staff User (Optional)
  {
    id: 2,
    email: 'jane.smith@mycompany.com',
    password: 'StaffPass456',
    role: 'staff',
    name: 'Jane Smith',
    permissions: ['dashboard', 'inventory', 'billing'],
    avatar: 'J'
  }
];
```

## User Roles & Permissions

### Admin Role
- **Full Access**: All features including Settings and Reports
- **Permissions**: `dashboard`, `inventory`, `billing`, `reports`, `settings`, `user_management`

### Staff Role
- **Limited Access**: Basic operations only
- **Permissions**: `dashboard`, `inventory`, `billing`

## Adding More Users

You can add as many users as needed:

```javascript
{
  id: 3,
  email: 'manager@company.com',
  password: 'ManagerPass789',
  role: 'admin',
  name: 'Manager Name',
  permissions: ['dashboard', 'inventory', 'billing', 'reports', 'settings'],
  avatar: 'M'
}
```

## Security Notes

⚠️ **Important**: This is a frontend-only demo setup. In production:
- Passwords should be hashed on the backend
- Use a secure authentication server
- Never store real passwords in frontend code
- Consider using environment variables

## Need Help?

If you need to customize permissions or add new roles, you can modify the `permissions` array and update the route protection logic in `components/ProtectedRoute.jsx`.