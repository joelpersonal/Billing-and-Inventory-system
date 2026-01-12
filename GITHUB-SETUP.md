# 🚀 GitHub Setup Guide for Billfinity

## Step 1: Restart Your Terminal/Computer
Since Git was just installed, you need to restart your terminal or computer for the PATH to be updated.

## Step 2: Initialize Git Repository

Open a new terminal/command prompt and navigate to your project folder:

```bash
cd "C:\Users\acer\Desktop\inventery System\smart-inventory-frontend"
```

Initialize Git:
```bash
git init
```

## Step 3: Configure Git (First Time Setup)

Set your Git username and email:
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

## Step 4: Add Files to Git

Add all files to staging:
```bash
git add .
```

Create initial commit:
```bash
git commit -m "Initial commit: Billfinity Smart Inventory System

- Complete React application with JWT authentication
- Role-based access control (Admin/Staff)
- Professional purple-themed UI
- Landing page, login, dashboard, inventory, billing, reports, settings
- Responsive design with modern components
- Ready for production deployment"
```

## Step 5: Create GitHub Repository

1. **Go to GitHub.com** and sign in
2. **Click "New Repository"** (green button)
3. **Repository name**: `billfinity` or `smart-inventory-system`
4. **Description**: `Smart Inventory Control & Billing System with React and JWT Authentication`
5. **Set to Public** (so collaborators can access)
6. **Don't initialize** with README (we already have one)
7. **Click "Create Repository"**

## Step 6: Connect Local Repository to GitHub

Copy the commands from GitHub (they'll look like this):

```bash
git remote add origin https://github.com/yourusername/billfinity.git
git branch -M main
git push -u origin main
```

## Step 7: Add Collaborators

1. **Go to your repository** on GitHub
2. **Click "Settings"** tab
3. **Click "Collaborators"** in the left sidebar
4. **Click "Add people"**
5. **Enter collaborator's GitHub username or email**
6. **Select permission level**:
   - **Write**: Can push to repository
   - **Admin**: Full access including settings
7. **Click "Add [username] to this repository"**

## Step 8: Share Repository with Team

Send your collaborators:
- **Repository URL**: `https://github.com/yourusername/billfinity`
- **Clone command**: `git clone https://github.com/yourusername/billfinity.git`

## Step 9: Collaborator Setup Instructions

Share these instructions with your team:

### For Collaborators:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/billfinity.git
   cd billfinity
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure credentials** (edit `src/config/users.js`):
   ```javascript
   export const users = [
     {
       id: 1,
       email: 'your-email@domain.com',
       password: 'your-password',
       role: 'admin',
       name: 'Your Name',
       permissions: ['dashboard', 'inventory', 'billing', 'reports', 'settings', 'user_management'],
       avatar: 'Y'
     }
   ];
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**: `http://localhost:5173`

## Step 10: Development Workflow

### For Team Collaboration:

1. **Create feature branch**:
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "Add new feature: description"
   ```

3. **Push branch**:
   ```bash
   git push origin feature/new-feature-name
   ```

4. **Create Pull Request** on GitHub

5. **Review and merge** after approval

## 🔧 Project Structure for Collaborators

```
billfinity/
├── src/
│   ├── components/     # Reusable UI components
│   ├── config/        # User credentials & settings
│   ├── context/       # React context (Auth)
│   ├── data/          # Sample data
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   └── ...
├── public/            # Static assets
├── README.md          # Project documentation
├── package.json       # Dependencies
└── ...
```

## 🎯 Key Features for Collaborators

- **JWT Authentication** with role-based access
- **Admin Panel** with full system access
- **Staff Interface** with limited permissions
- **Inventory Management** with real-time tracking
- **Billing System** with invoice generation
- **Analytics Dashboard** with charts
- **Responsive Design** for all devices

## 🆘 Troubleshooting

### Common Issues:

1. **Git not recognized**: Restart terminal after Git installation
2. **Permission denied**: Check GitHub collaborator permissions
3. **Login issues**: Edit `src/config/users.js` with correct credentials
4. **Port conflicts**: Change port in `vite.config.js` if needed

### Getting Help:

- **Check README.md** for detailed documentation
- **Create GitHub Issues** for bugs or questions
- **Use "Clear Session"** button on login page if stuck

---

**Ready to collaborate on Billfinity! 🚀**