import { HiOutlineChevronDown, HiOutlineBell } from "react-icons/hi2";
import BillfinityLogo from "./Logo";
import ConnectionStatus from "./ConnectionStatus";
import NotificationPanel from "./NotificationPanel";
import AISearchBox from "./AISearchBox";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { useNotifications } from "../context/NotificationContext";

export default function Topbar({ title = "Dashboard", searchContext = "general" }) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { unreadCount, togglePanel } = useNotifications();
  
  return (
    <div className="bg-white/80 backdrop-blur-sm px-6 py-4 shadow-sm border-b border-purple-100 flex justify-between items-center">
      
      <div className="flex items-center gap-4">
        <h3 className="text-xl font-bold text-gray-800">
          {title}
        </h3>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <BillfinityLogo size="sm" showText={false} />
            <span className="font-medium">{settings.businessInfo.businessName}</span>
          </div>
          <ConnectionStatus />
        </div>
      </div>

      <div className="flex items-center gap-4">
        
        {/* AI Search Bar */}
        <div className="hidden md:flex items-center relative">
          <AISearchBox 
            context={searchContext}
            placeholder={`Search ${title.toLowerCase()}...`}
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={togglePanel}
            className="relative p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <HiOutlineBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
            <p className="text-xs text-purple-600 capitalize">{user?.role || 'Welcome back!'}</p>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 p-2 rounded-lg transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 text-white
                            flex items-center justify-center text-sm font-semibold shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <HiOutlineChevronDown size={16} className="text-purple-500" />
          </div>
        </div>

      </div>

    </div>
  );
}
