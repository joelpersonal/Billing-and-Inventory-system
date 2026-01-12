import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import autoReorderMonitor from '../services/autoReorderMonitor';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const dashboardData = await apiService.getDashboardData();
      const newNotifications = [];

      // Low Stock Notifications (Critical)
      if (dashboardData.lowStock?.lowStockCount > 0) {
        newNotifications.push({
          id: 'low-stock',
          type: 'warning',
          title: 'Low Stock Alert',
          message: `${dashboardData.lowStock.lowStockCount} products are running low on stock`,
          timestamp: new Date(),
          read: false,
          icon: '📦',
          action: 'View Inventory',
          priority: 'high'
        });
      }

      // High Sales Growth (Success)
      if (dashboardData.todaysSales?.growthPercentage > 20) {
        newNotifications.push({
          id: 'high-sales',
          type: 'success',
          title: 'Sales Surge!',
          message: `Today's sales are up ${dashboardData.todaysSales.growthPercentage.toFixed(1)}% from yesterday`,
          timestamp: new Date(),
          read: false,
          icon: '📈',
          action: 'View Reports',
          priority: 'medium'
        });
      }

      // Stock Value Changes
      if (dashboardData.stockValue?.growthPercentage > 15) {
        newNotifications.push({
          id: 'stock-value-up',
          type: 'success',
          title: 'Inventory Value Up',
          message: `Your inventory value increased by ${dashboardData.stockValue.growthPercentage.toFixed(1)}%`,
          timestamp: new Date(),
          read: false,
          icon: '💰',
          action: 'View Dashboard',
          priority: 'medium'
        });
      } else if (dashboardData.stockValue?.growthPercentage < -10) {
        newNotifications.push({
          id: 'stock-value-down',
          type: 'warning',
          title: 'Inventory Value Down',
          message: `Your inventory value decreased by ${Math.abs(dashboardData.stockValue.growthPercentage).toFixed(1)}%`,
          timestamp: new Date(),
          read: false,
          icon: '📉',
          action: 'Review Inventory',
          priority: 'high'
        });
      }

      // Invoice/Billing Notifications
      if (dashboardData.todaysSales?.todaySales > 1000) {
        newNotifications.push({
          id: 'billing-milestone',
          type: 'success',
          title: 'Daily Sales Milestone',
          message: `You've reached $${dashboardData.todaysSales.todaySales.toFixed(2)} in sales today!`,
          timestamp: new Date(),
          read: false,
          icon: '🎯',
          action: 'Generate Reports',
          priority: 'low'
        });
      }

      // Product Categories Growth
      if (dashboardData.productCategories?.categories?.length > 5) {
        newNotifications.push({
          id: 'categories-growth',
          type: 'info',
          title: 'Product Diversity',
          message: `You now manage ${dashboardData.productCategories.categories.length} different product categories`,
          timestamp: new Date(),
          read: false,
          icon: '🏷️',
          action: 'Manage Categories',
          priority: 'low'
        });
      }

      // System Performance
      newNotifications.push({
        id: 'system-performance',
        type: 'success',
        title: 'System Running Smoothly',
        message: 'All systems operational. Email service connected.',
        timestamp: new Date(),
        read: false,
        icon: '✅',
        action: 'View Settings',
        priority: 'low'
      });

      // Recent Activity Notification
      newNotifications.push({
        id: 'recent-activity',
        type: 'info',
        title: 'Recent Activity',
        message: 'Dashboard data updated successfully',
        timestamp: new Date(),
        read: false,
        icon: '🔄',
        action: 'Refresh Data',
        priority: 'low'
      });

      // Sort by priority (high -> medium -> low)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      newNotifications.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);

    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Fallback notification for connection issues
      setNotifications([{
        id: 'connection-error',
        type: 'error',
        title: 'Connection Issue',
        message: 'Unable to fetch latest updates. Please check your connection.',
        timestamp: new Date(),
        read: false,
        icon: '⚠️',
        action: 'Retry',
        priority: 'high'
      }]);
      setUnreadCount(1);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Toggle notification panel
  const togglePanel = () => {
    console.log('Toggling notification panel. Current state:', isOpen);
    setIsOpen(!isOpen);
  };

  // Add custom notification
  const addNotification = (notification) => {
    const newNotification = {
      id: `custom-${Date.now()}`,
      timestamp: new Date(),
      read: false,
      priority: 'medium',
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    
    // Set up auto reorder monitor listener
    const handleAutoReorderEvent = (event) => {
      if (event.type === 'reorders_created') {
        addNotification({
          type: 'info',
          title: 'Auto Reorders Created',
          message: `${event.count} automatic reorder${event.count > 1 ? 's' : ''} created for low stock items`,
          icon: '🔄',
          action: 'View Reorders',
          priority: 'high'
        });
      }
    };
    
    autoReorderMonitor.addListener(handleAutoReorderEvent);
    
    // Add a test notification on mount
    setTimeout(() => {
      addNotification({
        type: 'info',
        title: 'System Ready',
        message: 'Notification system is now active and monitoring your business',
        icon: '🚀',
        action: 'Get Started'
      });
    }, 2000);
    
    return () => {
      clearInterval(interval);
      autoReorderMonitor.removeListener(handleAutoReorderEvent);
    };
  }, []);

  const value = {
    notifications,
    unreadCount,
    isOpen,
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    togglePanel
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};