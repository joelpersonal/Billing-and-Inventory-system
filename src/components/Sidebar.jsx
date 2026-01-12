import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BillfinityLogo from "./Logo";
import {
  HiOutlineSquares2X2,
  HiOutlineArchiveBox,
  HiOutlineCreditCard,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShieldCheck
} from "react-icons/hi2";

export default function Sidebar() {
  const { user, logout, hasPermission, isAdmin, isStaff } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  return (
    <div className="w-72 bg-white min-h-screen border-r border-purple-100 flex flex-col shadow-lg">

      {/* Logo Section */}
      <div className="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-violet-50">
        <BillfinityLogo size="md" showText={true} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {hasPermission('dashboard') && (
          <SidebarLink
            to="/dashboard"
            label="Dashboard"
            icon={<HiOutlineSquares2X2 size={20} />}
          />
        )}
        
        {hasPermission('inventory') && (
          <SidebarLink
            to="/inventory"
            label="Inventory Management"
            icon={<HiOutlineArchiveBox size={20} />}
          />
        )}
        
        {hasPermission('billing') && (
          <SidebarLink
            to="/billing"
            label="Billing & Invoices"
            icon={<HiOutlineCreditCard size={20} />}
          />
        )}
        
        {hasPermission('reports') && (
          <SidebarLink
            to="/reports"
            label="Analytics & Reports"
            icon={<HiOutlineChartBar size={20} />}
          />
        )}
        
        {hasPermission('settings') && (
          <SidebarLink
            to="/settings"
            label="System Settings"
            icon={<HiOutlineCog6Tooth size={20} />}
          />
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-purple-100 bg-gradient-to-r from-purple-50 to-violet-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 text-white flex items-center justify-center text-sm font-semibold">
            {user?.avatar || user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <div className="flex items-center gap-1">
              {isAdmin() && <HiOutlineShieldCheck className="text-purple-600" size={12} />}
              {isStaff() && <HiOutlineShieldCheck className="text-blue-600" size={12} />}
              <p className="text-xs text-purple-600 capitalize font-medium">{user?.role}</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
        >
          <HiOutlineArrowRightOnRectangle size={16} />
          Sign Out
        </button>
      </div>

    </div>
  );
}

function SidebarLink({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 slide-in
         ${
           isActive
             ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-200"
             : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
         }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
