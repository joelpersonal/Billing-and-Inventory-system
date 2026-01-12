import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check for existing valid token on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');

      if (storedToken) {
        try {
          // Verify token with backend
          const response = await apiService.getProfile();
          if (response.success) {
            setUser(response.data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    try {
      const response = await apiService.login(email, password);

      if (response.success) {
        const { user, token } = response.data;
        
        // Store token
        localStorage.setItem('authToken', token);
        
        setUser(user);
        setToken(token);
        setLoading(false);

        return { 
          success: true, 
          user,
          token 
        };
      } else {
        setLoading(false);
        return { 
          success: false, 
          error: response.message || 'Login failed'
        };
      }
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred. Please try again.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    
    // Admin has access to all features
    if (user.role === 'admin') {
      return true;
    }
    
    // Staff has limited access
    if (user.role === 'staff') {
      const staffPermissions = ['dashboard', 'inventory', 'billing'];
      return staffPermissions.includes(permission);
    }
    
    return false;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isStaff = () => {
    return user?.role === 'staff';
  };

  const getCurrentUser = () => {
    return user;
  };

  const getAuthToken = () => {
    return token;
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    hasPermission,
    isAdmin,
    isStaff,
    getCurrentUser,
    getAuthToken,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};