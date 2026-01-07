import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  // Default settings
  const defaultSettings = {
    businessInfo: {
      businessName: 'Billfinity Store',
      gstNumber: '33ABCDE1234F1Z5',
      phone: '+91 98765 43210',
      email: 'admin@billfinity.com',
      website: 'https://billfinity.com',
      address: '123 Business Street, Commercial Area, City - 400001'
    },
    preferences: {
      enableGST: true,
      autoCalculateTax: true,
      lowStockAlerts: true,
      autoReorder: false,
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      language: 'en'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      lowStockAlerts: true,
      orderUpdates: true,
      systemUpdates: false,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90',
      loginAttempts: '5'
    },
    appearance: {
      theme: 'light',
      primaryColor: 'purple',
      fontSize: 'medium',
      compactMode: false
    }
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('billfinitySettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    if (settings.appearance.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply primary color
    const colorMap = {
      purple: { primary: '139, 92, 246', secondary: '168, 85, 247' },
      blue: { primary: '59, 130, 246', secondary: '37, 99, 235' },
      green: { primary: '34, 197, 94', secondary: '22, 163, 74' },
      red: { primary: '239, 68, 68', secondary: '220, 38, 38' }
    };

    const colors = colorMap[settings.appearance.primaryColor] || colorMap.purple;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);

    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--base-font-size', fontSizeMap[settings.appearance.fontSize]);

    // Apply compact mode
    if (settings.appearance.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  }, [settings.appearance]);

  const updateSettings = async (newSettings) => {
    setLoading(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      
      // Save to localStorage
      localStorage.setItem('billfinitySettings', JSON.stringify(updatedSettings));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, message: 'Settings updated successfully!' };
    } catch (error) {
      console.error('Error updating settings:', error);
      return { success: false, message: 'Failed to update settings.' };
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('billfinitySettings');
    return { success: true, message: 'Settings reset to default values!' };
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `billfinity-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    return { success: true, message: 'Settings exported successfully!' };
  };

  const importSettings = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          const mergedSettings = { ...defaultSettings, ...importedSettings };
          setSettings(mergedSettings);
          localStorage.setItem('billfinitySettings', JSON.stringify(mergedSettings));
          resolve({ success: true, message: 'Settings imported successfully!' });
        } catch (error) {
          resolve({ success: false, message: 'Invalid settings file format.' });
        }
      };
      reader.readAsText(file);
    });
  };

  // Utility functions for formatting
  const formatCurrency = (amount) => {
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹'
    };
    const symbol = currencySymbols[settings.preferences.currency] || '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const format = settings.preferences.dateFormat;
    
    switch (format) {
      case 'DD/MM/YYYY':
        return dateObj.toLocaleDateString('en-GB');
      case 'YYYY-MM-DD':
        return dateObj.toISOString().split('T')[0];
      default: // MM/DD/YYYY
        return dateObj.toLocaleDateString('en-US');
    }
  };

  const formatTime = (date) => {
    const dateObj = new Date(date);
    const format = settings.preferences.timeFormat;
    
    return dateObj.toLocaleTimeString('en-US', {
      hour12: format === '12h',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTax = (amount) => {
    if (!settings.preferences.enableGST || !settings.preferences.autoCalculateTax) {
      return 0;
    }
    return amount * 0.18; // 18% GST
  };

  const value = {
    settings,
    loading,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
    formatCurrency,
    formatDate,
    formatTime,
    calculateTax
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};