# 🔑 How to Change Admin and Staff Passwords

## 📋 Multiple Ways to Change Passwords

### Method 1: Using Update Script (Easiest)

#### Step 1: Edit the Script
1. **Open**: `backend/scripts/update-passwords.js`
2. **Find these lines**:
   ```javascript
   const NEW_ADMIN_PASSWORD = 'newadmin123';  // ← Change this
   const NEW_STAFF_PASSWORD = 'newstaff123';  // ← Change this
   ```
3. **Change to your desired passwords**:
   ```javascript
   const NEW_ADMIN_PASSWORD = 'MySecureAdmin2024';
   const NEW_STAFF_PASSWORD = 'MySecureStaff2024';
   ```

#### Step 2: Run the Script
```bash
cd backend
npm run update-passwords
```

#### Step 3: Use New Passwords
- **Admin**: admin@billfinity.com / MySecureAdmin2024
- **Staff**: staff@billfinity.com / MySecureStaff2024

---

### Method 2: MongoDB Atlas Dashboard

#### Step 1: Access Your Database
1. **Go to**: https://cloud.mongodb.com/
2. **Sign in** with your Atlas account
3. **Select your project** and cluster

#### Step 2: Browse Collections
1. **Click "Browse Collections"** on your cluster
2. **Find "billfinity" database**
3. **Click "users" collection**

#### Step 3: Edit User Documents
1. **Find admin user** (email: admin@billfinity.com)
2. **Click "Edit"** (pencil icon)
3. **Replace password field** with new hashed password
4. **Repeat for staff user**

**Note**: You need to hash the password using bcrypt before saving.

---

### Method 3: Create Custom Users

#### Create New Admin User:
```bash
cd backend
node -e "
import('./models/User.js').then(({default: User}) => {
  import('mongoose').then(mongoose => {
    import('dotenv').then(dotenv => {
      dotenv.config();
      mongoose.connect(process.env.MONGODB_URI).then(() => {
        User.create({
          name: 'New Admin',
          email: 'newadmin@billfinity.com',
          password: 'yournewpassword',
          role: 'admin'
        }).then(() => {
          console.log('New admin created!');
          process.exit(0);
        });
      });
    });
  });
});
"
```

---

### Method 4: Using the Application (Future Feature)

You could add a "Change Password" feature in the application:

#### In User Profile/Settings:
- **Current Password** field
- **New Password** field  
- **Confirm Password** field
- **Update Password** button

This would require adding a password change endpoint to your backend.

---

## 🔧 Quick Password Change Instructions

### For Immediate Change:

1. **Open**: `backend/scripts/update-passwords.js`
2. **Edit lines 15-16**:
   ```javascript
   const NEW_ADMIN_PASSWORD = 'YourNewAdminPassword';
   const NEW_STAFF_PASSWORD = 'YourNewStaffPassword';
   ```
3. **Save the file**
4. **Run**: `npm run update-passwords` (in backend folder)
5. **Use new passwords** to login

### Password Requirements:
- ✅ **Minimum 6 characters** (enforced by User model)
- ✅ **Any characters allowed** (letters, numbers, symbols)
- ✅ **Automatically hashed** when saved
- ✅ **Case sensitive**

### Security Tips:
- 🔒 **Use strong passwords** (mix of letters, numbers, symbols)
- 🔄 **Change regularly** for security
- 📝 **Don't share** admin credentials
- 🚫 **Avoid common passwords** (password123, admin, etc.)

---

## 🎯 Recommended Approach

**Use Method 1 (Update Script)** because:
- ✅ **Easiest**: Just edit and run
- ✅ **Safe**: Automatically hashes passwords
- ✅ **Quick**: Takes 30 seconds
- ✅ **Reliable**: No manual database editing needed

**Steps:**
1. Edit `backend/scripts/update-passwords.js`
2. Change the password values
3. Run `npm run update-passwords`
4. Done! Use new passwords to login

---

## 🚀 After Changing Passwords

### Test New Passwords:
1. **Logout** from application
2. **Login with new admin credentials**
3. **Login with new staff credentials**
4. **Verify everything works**

### Update Documentation:
- Update any password documentation
- Inform team members of new credentials
- Update deployment environment variables if needed

**Status: ✅ MULTIPLE PASSWORD CHANGE OPTIONS AVAILABLE**