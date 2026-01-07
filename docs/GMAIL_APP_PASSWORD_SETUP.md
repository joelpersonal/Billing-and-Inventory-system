# 🔐 Gmail App Password Setup Guide

## ✅ Email System Configured

The email system is now configured exactly as requested:

**Configuration:**
- ✅ **Service**: Gmail SMTP
- ✅ **Host**: smtp.gmail.com
- ✅ **Port**: 465 (secure)
- ✅ **Email**: kit27.csbs26@gmail.com
- ✅ **Authentication**: App Password (required)

## 🚨 REQUIRED: Gmail App Password Setup

To make the email functionality work, you need to generate a Gmail App Password:

### Step 1: Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Sign in with **kit27.csbs26@gmail.com**
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the prompts to enable 2FA (if not already enabled)

### Step 2: Generate App Password
1. Still in Security settings
2. Under "Signing in to Google", click **App passwords**
3. You may need to sign in again
4. Select app: **Mail**
5. Select device: **Other (Custom name)**
6. Enter name: **Billfinity Invoice System**
7. Click **Generate**
8. **Copy the 16-character password** (example: `abcd efgh ijkl mnop`)

### Step 3: Update Backend Configuration
1. Open `backend/.env` file
2. Replace `your_app_password` with your actual app password:
   ```
   MAIL_PASS=abcdefghijklmnop
   ```
   **Important**: Remove all spaces from the app password

### Step 4: Restart Backend
```bash
cd backend
npm start
```

## 🧪 Test the Email Functionality

After setting up the app password:

1. **Go to**: http://localhost:5173
2. **Navigate to**: Billing & Invoices page
3. **Add products** to cart
4. **Enter customer email** (use a real email you can check)
5. **Click Email button**
6. **Check the customer's inbox** - they should receive the invoice!

## 🔍 Troubleshooting

### If you see "Invalid credentials" error:
- ✅ Verify 2-Step Verification is enabled
- ✅ Make sure you're using App Password, not regular password
- ✅ Remove all spaces from the app password
- ✅ Restart the backend after updating .env

### If emails don't arrive:
- ✅ Check spam/junk folder
- ✅ Verify the recipient email address is correct
- ✅ Check backend logs for error messages

### Common Issues:
- **"Username and Password not accepted"** → Wrong app password
- **"Less secure app access"** → Use App Password instead
- **"Authentication failed"** → 2FA not enabled

## 📧 What Happens After Setup:

**Email Sending:**
- ✅ **From**: kit27.csbs26@gmail.com
- ✅ **To**: Customer's real email address
- ✅ **Subject**: Invoice [number] from [Business Name]
- ✅ **Content**: Professional HTML email
- ✅ **Attachment**: PDF invoice

**Backend Logs:**
- ✅ "Gmail SMTP connection verified successfully"
- ✅ "Email sent successfully via Gmail!"
- ✅ Message ID and response details

---

## 🎯 Current Status:

- ✅ **Email service**: Configured for Gmail SMTP
- ✅ **Authentication**: App Password method
- ✅ **Security**: Port 465 with SSL
- ⚠️ **App Password**: Needs to be set in .env file

**Once you complete the App Password setup, the email functionality will send real emails to customers immediately!**