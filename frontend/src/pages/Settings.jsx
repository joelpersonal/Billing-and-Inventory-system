import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BillfinityLogo from "../components/Logo";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { useNotifications } from "../context/NotificationContext";
import {
  HiOutlineBuildingStorefront,
  HiOutlineIdentification,
  HiOutlinePhone,
  HiOutlineCog6Tooth,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineGlobeAlt,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineUser,
  HiOutlinePaintBrush,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle
} from "react-icons/hi2";

export default function Settings() {
  const { user, logout } = useAuth();
  const { 
    settings, 
    loading: settingsLoading, 
    updateSettings, 
    resetSettings, 
    exportSettings, 
    importSettings 
  } = useSettings();
  const { addNotification } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('business');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Local state for form inputs
  const [businessInfo, setBusinessInfo] = useState(settings.businessInfo);
  const [preferences, setPreferences] = useState(settings.preferences);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [security, setSecurity] = useState(settings.security);
  const [appearance, setAppearance] = useState(settings.appearance);

  // Update local state when global settings change
  useEffect(() => {
    setBusinessInfo(settings.businessInfo);
    setPreferences(settings.preferences);
    setNotifications(settings.notifications);
    setSecurity(settings.security);
    setAppearance(settings.appearance);
  }, [settings]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSaveSettings = async () => {
    const result = await updateSettings({
      businessInfo,
      preferences,
      notifications,
      security,
      appearance
    });
    
    showMessage(result.success ? 'success' : 'error', result.message);
    
    // Add notification for settings save
    if (result.success) {
      addNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your settings have been updated successfully',
        icon: '⚙️',
        action: 'View Settings'
      });
    } else {
      addNotification({
        type: 'error',
        title: 'Settings Save Failed',
        message: 'Unable to save settings. Please try again.',
        icon: '❌',
        action: 'Retry'
      });
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      const result = resetSettings();
      
      // Reset local state
      setBusinessInfo(settings.businessInfo);
      setPreferences(settings.preferences);
      setNotifications(settings.notifications);
      setSecurity(settings.security);
      
      // Add notification for settings reset
      addNotification({
        type: 'warning',
        title: 'Settings Reset',
        message: 'All settings have been reset to default values',
        icon: '🔄',
        action: 'Review Settings'
      });
      setAppearance(settings.appearance);
      
      showMessage(result.success ? 'success' : 'error', result.message);
    }
  };

  const handleExportSettings = () => {
    const result = exportSettings();
    showMessage(result.success ? 'success' : 'error', result.message);
  };

  const handleImportSettings = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const result = await importSettings(file);
      showMessage(result.success ? 'success' : 'error', result.message);
      
      // Reset file input
      event.target.value = '';
    }
  };

  const tabs = [
    { id: 'business', label: 'Business Info', icon: HiOutlineBuildingStorefront },
    { id: 'preferences', label: 'Preferences', icon: HiOutlineCog6Tooth },
    { id: 'notifications', label: 'Notifications', icon: HiOutlineBell },
    { id: 'security', label: 'Security', icon: HiOutlineShieldCheck },
    { id: 'appearance', label: 'Appearance', icon: HiOutlinePaintBrush },
  ];

  return (
    <div className="flex bg-gradient-to-br from-purple-50 via-white to-violet-50 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar title="System Settings" searchContext="settings" />

        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Billfinity Settings</h2>
              <p className="text-purple-600">Configure your business settings and preferences</p>
              
              {/* Message Display */}
              {message.text && (
                <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message.type === 'success' ? (
                    <HiOutlineCheckCircle size={20} />
                  ) : (
                    <HiOutlineExclamationTriangle size={20} />
                  )}
                  <span>{message.text}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Settings Navigation */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-200'
                              : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                          }`}
                        >
                          <Icon size={18} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-8">
                  
                  {/* Business Information */}
                  {activeTab === 'business' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                          <HiOutlineBuildingStorefront className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Business Information</h3>
                          <p className="text-sm text-purple-600">Update your business details and contact information</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                            <div className="relative">
                              <HiOutlineBuildingStorefront className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                              <input
                                type="text"
                                value={businessInfo.businessName}
                                onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 text-sm border-2 border-purple-100 rounded-xl
                                         outline-none transition-all duration-200
                                         focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                                         bg-white/70"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                            <div className="relative">
                              <HiOutlineIdentification className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                              <input
                                type="text"
                                value={businessInfo.gstNumber}
                                onChange={(e) => setBusinessInfo({...businessInfo, gstNumber: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 text-sm border-2 border-purple-100 rounded-xl
                                         outline-none transition-all duration-200
                                         focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                                         bg-white/70"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                              <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                              <input
                                type="text"
                                value={businessInfo.phone}
                                onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 text-sm border-2 border-purple-100 rounded-xl
                                         outline-none transition-all duration-200
                                         focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                                         bg-white/70"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                              <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                              <input
                                type="email"
                                value={businessInfo.email}
                                onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 text-sm border-2 border-purple-100 rounded-xl
                                         outline-none transition-all duration-200
                                         focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                                         bg-white/70"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                            <div className="relative">
                              <HiOutlineGlobeAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                              <input
                                type="url"
                                value={businessInfo.website}
                                onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 text-sm border-2 border-purple-100 rounded-xl
                                         outline-none transition-all duration-200
                                         focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                                         bg-white/70"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <div className="relative">
                              <HiOutlineMapPin className="absolute left-4 top-4 text-purple-400" size={18} />
                              <textarea
                                rows={3}
                                value={businessInfo.address}
                                onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 text-sm border-2 border-purple-100 rounded-xl
                                         outline-none transition-all duration-200
                                         focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                                         bg-white/70 resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences */}
                  {activeTab === 'preferences' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                          <HiOutlineCog6Tooth className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">System Preferences</h3>
                          <p className="text-sm text-purple-600">Configure system behavior and default settings</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-800">Tax Settings</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                                <div>
                                  <p className="font-medium text-gray-800">Enable GST</p>
                                  <p className="text-sm text-gray-600">Apply GST to all transactions</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={preferences.enableGST}
                                    onChange={(e) => setPreferences({...preferences, enableGST: e.target.checked})}
                                    className="sr-only peer" 
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                                <div>
                                  <p className="font-medium text-gray-800">Auto-calculate Tax</p>
                                  <p className="text-sm text-gray-600">Automatically calculate tax amounts</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={preferences.autoCalculateTax}
                                    onChange={(e) => setPreferences({...preferences, autoCalculateTax: e.target.checked})}
                                    className="sr-only peer" 
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-800">Inventory Settings</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                                <div>
                                  <p className="font-medium text-gray-800">Low Stock Alerts</p>
                                  <p className="text-sm text-gray-600">Get notified when stock is low</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={preferences.lowStockAlerts}
                                    onChange={(e) => setPreferences({...preferences, lowStockAlerts: e.target.checked})}
                                    className="sr-only peer" 
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-800">Auto-reorder</p>
                                    {preferences.autoReorder && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {preferences.autoReorder 
                                      ? 'Real-time monitoring enabled - products will be automatically reordered when stock is low'
                                      : 'Automatically reorder products when stock reaches reorder point'
                                    }
                                  </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={preferences.autoReorder}
                                    onChange={(e) => setPreferences({...preferences, autoReorder: e.target.checked})}
                                    className="sr-only peer" 
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Preferences */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-purple-100">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-800">Regional Settings</h4>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                <select
                                  value={preferences.currency}
                                  onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white/70"
                                >
                                  <option value="USD">USD - US Dollar</option>
                                  <option value="EUR">EUR - Euro</option>
                                  <option value="GBP">GBP - British Pound</option>
                                  <option value="INR">INR - Indian Rupee</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                                <select
                                  value={preferences.dateFormat}
                                  onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
                                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white/70"
                                >
                                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-800">Display Settings</h4>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                                <select
                                  value={preferences.timeFormat}
                                  onChange={(e) => setPreferences({...preferences, timeFormat: e.target.value})}
                                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white/70"
                                >
                                  <option value="12h">12 Hour</option>
                                  <option value="24h">24 Hour</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                <select
                                  value={preferences.language}
                                  onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white/70"
                                >
                                  <option value="en">English</option>
                                  <option value="es">Spanish</option>
                                  <option value="fr">French</option>
                                  <option value="de">German</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                          <HiOutlineBell className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Notification Settings</h3>
                          <p className="text-sm text-purple-600">Configure how you receive notifications</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800">Communication Preferences</h4>
                          <div className="space-y-3">
                            {[
                              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                              { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                              { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' }
                            ].map((item) => (
                              <div key={item.key} className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                                <div>
                                  <p className="font-medium text-gray-800">{item.label}</p>
                                  <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={notifications[item.key]}
                                    onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                                    className="sr-only peer" 
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800">Alert Types</h4>
                          <div className="space-y-3">
                            {[
                              { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'When inventory is running low' },
                              { key: 'orderUpdates', label: 'Order Updates', desc: 'New orders and status changes' },
                              { key: 'systemUpdates', label: 'System Updates', desc: 'Software updates and maintenance' },
                              { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Promotional content and tips' }
                            ].map((item) => (
                              <div key={item.key} className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                                <div>
                                  <p className="font-medium text-gray-800">{item.label}</p>
                                  <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={notifications[item.key]}
                                    onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                                    className="sr-only peer" 
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                          <HiOutlineShieldCheck className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Security Settings</h3>
                          <p className="text-sm text-purple-600">Manage your account security and access controls</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800">Authentication</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                              <div>
                                <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-600">Add extra security to your account</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={security.twoFactorAuth}
                                  onChange={(e) => setSecurity({...security, twoFactorAuth: e.target.checked})}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                              </label>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                              <select
                                value={security.sessionTimeout}
                                onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white/70"
                              >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="120">2 hours</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800">Password Policy</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                              <select
                                value={security.passwordExpiry}
                                onChange={(e) => setSecurity({...security, passwordExpiry: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white/70"
                              >
                                <option value="30">30 days</option>
                                <option value="60">60 days</option>
                                <option value="90">90 days</option>
                                <option value="never">Never expire</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                              <select
                                value={security.loginAttempts}
                                onChange={(e) => setSecurity({...security, loginAttempts: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white/70"
                              >
                                <option value="3">3 attempts</option>
                                <option value="5">5 attempts</option>
                                <option value="10">10 attempts</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <HiOutlineExclamationTriangle className="text-yellow-600" size={20} />
                          <div>
                            <p className="font-medium text-yellow-800">Security Recommendation</p>
                            <p className="text-sm text-yellow-700">Enable two-factor authentication for enhanced security.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Appearance */}
                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                          <HiOutlinePaintBrush className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Appearance Settings</h3>
                          <p className="text-sm text-purple-600">Customize the look and feel of your Billfinity interface</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800">Theme Settings</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                              <div className="grid grid-cols-2 gap-3">
                                {['light', 'dark'].map((theme) => (
                                  <button
                                    key={theme}
                                    onClick={() => setAppearance({...appearance, theme})}
                                    className={`p-4 rounded-xl border-2 transition-all ${
                                      appearance.theme === theme
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}
                                  >
                                    <div className={`w-full h-8 rounded mb-2 ${
                                      theme === 'light' ? 'bg-white border' : 'bg-gray-800'
                                    }`}></div>
                                    <p className="text-sm font-medium capitalize">{theme}</p>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                              <div className="grid grid-cols-4 gap-2">
                                {[
                                  { name: 'purple', color: 'bg-purple-500' },
                                  { name: 'blue', color: 'bg-blue-500' },
                                  { name: 'green', color: 'bg-green-500' },
                                  { name: 'red', color: 'bg-red-500' }
                                ].map((color) => (
                                  <button
                                    key={color.name}
                                    onClick={() => setAppearance({...appearance, primaryColor: color.name})}
                                    className={`w-12 h-12 rounded-xl ${color.color} border-4 transition-all ${
                                      appearance.primaryColor === color.name
                                        ? 'border-gray-800 scale-110'
                                        : 'border-gray-200 hover:scale-105'
                                    }`}
                                  ></button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800">Display Settings</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                              <select
                                value={appearance.fontSize}
                                onChange={(e) => setAppearance({...appearance, fontSize: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white/70"
                              >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                              </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                              <div>
                                <p className="font-medium text-gray-800">Compact Mode</p>
                                <p className="text-sm text-gray-600">Reduce spacing for more content</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={appearance.compactMode}
                                  onChange={(e) => setAppearance({...appearance, compactMode: e.target.checked})}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-purple-100 mt-8 gap-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={handleExportSettings}
                        className="px-4 py-2 text-sm border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors"
                      >
                        Export Settings
                      </button>
                      <label className="px-4 py-2 text-sm border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer">
                        Import Settings
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportSettings}
                          className="hidden"
                        />
                      </label>
                      <button 
                        onClick={handleResetSettings}
                        className="px-4 py-2 text-sm border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        Reset to Default
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => logout()}
                        className="px-6 py-3 text-sm border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Logout
                      </button>
                      <button
                        onClick={handleSaveSettings}
                        disabled={settingsLoading}
                        className="px-8 py-3 rounded-xl text-sm font-semibold text-white
                                 bg-gradient-to-r from-purple-500 to-violet-500
                                 hover:from-purple-600 hover:to-violet-600
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-200 shadow-lg shadow-purple-200
                                 flex items-center gap-2"
                      >
                        {settingsLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
