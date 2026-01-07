# 📧 Gmail Setup Guide for Real Email Sending

## 🚨 IMPORTANT: Gmail App Password Required

To send real emails from **kit27.csbs26@gmail.com**, you need to set up a Gmail App Password.

### 📋 Step-by-Step Setup:

#### 1. Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the steps to enable 2FA (if not already enabled)

#### 2. Generate App Password
1. Still in **Security** settings
2. Under "Signing in to Google", click **App passwords**
3. Select app: **Mail**
4. Select device: **Other (Custom name)**
5. Enter name: **Billfinity Invoice System**
6. Click **Generate**
7. **Copy the 16-character password** (example: `abcd efgh ijkl mnop`)

#### 3. Update Backend Configuration
1. Open `backend/.env` file
2. Replace `REPLACE_WITH_GMAIL_APP_PASSWORD` with your 16-character app password:
   ```
   EMAIL_USER=kit27.csbs26@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop
   EMAIL_SERVICE=gmail
   ```
   (Remove spaces from the app password)

#### 4. Restart Backend
```bash
cd backend
npm start
```

### ✅ After Setup:

**Email Configuration:**
- ✅ **From Address**: kit27.csbs26@gmail.com
- ✅ **Service**: Gmail SMTP
- ✅ **Authentication**: App Password
- ✅ **Real Email Delivery**: Enabled

**How It Works:**
1. Customer receives email from: **kit27.csbs26@gmail.com**
2. Email appears in their inbox (not spam/test)
3. Professional HTML email with PDF invoice attached
4. Real delivery confirmation in backend logs

### 🔧 Current Status:

**Backend Configuration:**
- ✅ Gmail service configured
- ✅ From address set to kit27.csbs26@gmail.com
- ⚠️ **App password needed** in .env file

**Frontend:**
- ✅ Email functionality ready
- ✅ Will show "sent via Gmail" message
- ✅ No preview URLs (real emails)

### 🚀 Testing After Setup:

1. **Complete Gmail App Password setup above**
2. **Restart backend server**
3. **Go to Billing & Invoices page**
4. **Add products to cart**
5. **Enter real customer email**
6. **Click Email button**
7. **Check customer's inbox** - they should receive the invoice!

### 🔍 Troubleshooting:

**If emails don't send:**
1. Check backend logs for errors
2. Verify 2FA is enabled on Gmail account
3. Ensure app password is correct (16 characters, no spaces)
4. Check Gmail account isn't locked/suspended

**Common Issues:**
- **"Invalid credentials"** → Wrong app password
- **"Less secure app"** → Need to use App Password, not regular password
- **"Authentication failed"** → 2FA not enabled

---

## 📧 What Customers Will Receive:

**Email From:** kit27.csbs26@gmail.com  
**Subject:** Invoice [INV-123456] from [Business Name]  
**Content:** Professional HTML email with business branding  
**Attachment:** PDF invoice with itemized products and totals  

**Status: ⚠️ GMAIL APP PASSWORD REQUIRED TO COMPLETE SETUP**