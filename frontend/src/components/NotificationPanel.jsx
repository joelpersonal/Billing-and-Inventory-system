import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNotifications } from '../context/NotificationContext';
import { useSettings } from '../context/SettingsContext';
import {
  HiOutlineXMark,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineXCircle
} from 'react-icons/hi2';

export default function NotificationPanel() {
  const { notifications, isOpen, markAsRead, markAllAsRead, clearAll, togglePanel } = useNotifications();
  const { formatTime, formatDate } = useSettings();
  const panelRef = useRef(null);

  console.log('NotificationPanel render - isOpen:', isOpen, 'notifications:', notifications.length);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && isOpen) {
        togglePanel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, togglePanel]);

  if (!isOpen) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <HiOutlineCheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <HiOutlineExclamationTriangle className="text-yellow-500" size={20} />;
      case 'error':
        return <HiOutlineXCircle className="text-red-500" size={20} />;
      default:
        return <HiOutlineInformationCircle className="text-blue-500" size={20} />;
    }
  };

  const getNotificationBg = (type, read) => {
    const baseClasses = read ? 'bg-gray-50' : 'bg-white';
    const borderClasses = {
      success: 'border-l-green-400',
      warning: 'border-l-yellow-400',
      error: 'border-l-red-400',
      info: 'border-l-blue-400'
    };
    return `${baseClasses} ${borderClasses[type] || borderClasses.info} border-l-4`;
  };

  const panelContent = (
    <div 
      ref={panelRef}
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: 2147483647,
        width: '384px',
        maxHeight: '400px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}
    >
      
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-violet-50">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-800">Notifications</h3>
          <button
            onClick={togglePanel}
            className="p-1 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <HiOutlineXMark size={20} className="text-gray-500" />
          </button>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={markAllAsRead}
              className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-64 sm:max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-xl sm:text-2xl">🔔</span>
            </div>
            <p className="text-gray-500 text-sm">No notifications yet</p>
            <p className="text-gray-400 text-xs mt-1">We'll notify you when something important happens</p>
            <button 
              onClick={() => console.log('Test notification clicked')}
              className="mt-3 text-xs text-purple-600 hover:text-purple-800"
            >
              Test Notification System
            </button>
          </div>
        ) : (
          <div className="divide-y divide-purple-50">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-purple-25 transition-colors cursor-pointer ${getNotificationBg(notification.type, notification.read)}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {notification.icon ? (
                      <span className="text-lg">{notification.icon}</span>
                    ) : (
                      getNotificationIcon(notification.type)
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-semibold ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    
                    <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {formatTime(notification.timestamp)}
                      </span>
                      
                      {notification.action && (
                        <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                          {notification.action}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-purple-100 bg-purple-25">
          <p className="text-xs text-center text-gray-500">
            Last updated: {formatTime(new Date())}
          </p>
        </div>
      )}

    </div>
  );

  // Use createPortal to render at document root level
  return createPortal(panelContent, document.body);
}