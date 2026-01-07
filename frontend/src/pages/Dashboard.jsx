import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import BillfinityLogo from "../components/Logo";
import apiService from "../services/api";
import { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { useNotifications } from "../context/NotificationContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const colors = ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#F3E8FF'];

export default function Dashboard() {
  const { settings, formatCurrency, formatDate, formatTime } = useSettings();
  const { addNotification } = useNotifications();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Test connection first
        const isConnected = await apiService.testConnection();
        if (!isConnected) {
          throw new Error('Backend server is not running. Please start the backend server on port 5000.');
        }
        
        const data = await apiService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !dashboardData) {
    return (
      <div className="flex bg-gradient-to-br from-purple-50 via-white to-violet-50 min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar title="Dashboard Overview" />
          <div className="p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-600">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex bg-gradient-to-br from-purple-50 via-white to-violet-50 min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar title="Dashboard Overview" />
          <div className="p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading dashboard data: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const salesData = dashboardData?.salesRevenue?.labels?.map((label, index) => ({
    day: label,
    sales: dashboardData.salesRevenue.sales[index] || 0,
    revenue: dashboardData.salesRevenue.revenue[index] || 0
  })) || [];

  const categoryData = dashboardData?.productCategories?.categories?.map((category, index) => ({
    name: category.name,
    value: category.count,
    color: colors[index % colors.length]
  })) || [];
  return (
    <div className="flex bg-gradient-to-br from-purple-50 via-white to-violet-50 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b border-purple-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-purple-600">Real-time business insights and analytics</p>
          </div>
          <div className="flex items-center gap-4">
            {loading && (
              <div className="flex items-center gap-2 text-purple-600">
                <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                <span className="text-sm">Updating...</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Live Data</span>
            </div>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const data = await apiService.getDashboardData();
                  setDashboardData(data);
                  addNotification({
                    type: 'success',
                    title: 'Data Refreshed',
                    message: 'Dashboard data has been updated with latest information',
                    icon: '🔄',
                    action: 'View Dashboard'
                  });
                } catch (err) {
                  setError(err.message);
                  addNotification({
                    type: 'error',
                    title: 'Refresh Failed',
                    message: 'Unable to refresh dashboard data',
                    icon: '❌',
                    action: 'Try Again'
                  });
                } finally {
                  setLoading(false);
                }
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
            >
              Refresh Data
            </button>
            <button
              onClick={() => addNotification({
                type: 'success',
                title: 'Test Notification',
                message: 'This is a test notification to verify the system is working!',
                icon: '🧪',
                action: 'Test Action'
              })}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              Test Notification
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Products" 
              value={dashboardData?.totalProducts?.total?.toLocaleString() || "0"} 
              color="purple" 
              icon="products"
              trend={{ 
                type: dashboardData?.totalProducts?.growthPercentage >= 0 ? 'up' : 'down', 
                value: `${dashboardData?.totalProducts?.growthPercentage >= 0 ? '+' : ''}${dashboardData?.totalProducts?.growthPercentage?.toFixed(1) || 0}%`, 
                period: 'vs last month' 
              }}
            />
            <StatCard 
              title="Stock Value" 
              value={formatCurrency(dashboardData?.stockValue?.stockValue || 0)} 
              color="green" 
              icon="revenue"
              trend={{ 
                type: dashboardData?.stockValue?.growthPercentage >= 0 ? 'up' : 'down', 
                value: `${dashboardData?.stockValue?.growthPercentage >= 0 ? '+' : ''}${dashboardData?.stockValue?.growthPercentage?.toFixed(1) || 0}%`, 
                period: 'vs last month' 
              }}
            />
            <StatCard 
              title="Today's Sales" 
              value={formatCurrency(dashboardData?.todaysSales?.todaySales || 0)} 
              color="blue" 
              icon="sales"
              trend={{ 
                type: dashboardData?.todaysSales?.growthPercentage >= 0 ? 'up' : 'down', 
                value: `${dashboardData?.todaysSales?.growthPercentage >= 0 ? '+' : ''}${dashboardData?.todaysSales?.growthPercentage?.toFixed(1) || 0}%`, 
                period: 'vs yesterday' 
              }}
            />
            <StatCard 
              title="Low Stock Alerts" 
              value={dashboardData?.lowStock?.lowStockCount?.toString() || "0"} 
              color="red" 
              icon="alerts"
              trend={{ 
                type: dashboardData?.lowStock?.differenceFromLastWeek >= 0 ? 'up' : 'down', 
                value: `${dashboardData?.lowStock?.differenceFromLastWeek >= 0 ? '+' : ''}${dashboardData?.lowStock?.differenceFromLastWeek || 0}`, 
                period: 'vs last week' 
              }}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Sales & Revenue Chart */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  Sales & Revenue Overview
                </h3>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-gray-600">Sales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-violet-400"></div>
                    <span className="text-gray-600">Revenue</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#8B5CF6' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#A855F7"
                      strokeWidth={3}
                      dot={{ fill: '#A855F7', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#A855F7' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                Product Categories
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Live System Status</h3>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Connected</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <p className="text-sm text-gray-600 mb-1">Database Status</p>
                <p className="font-semibold text-green-600">✓ Connected</p>
              </div>
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <p className="text-sm text-gray-600 mb-1">API Status</p>
                <p className="font-semibold text-green-600">✓ Online</p>
              </div>
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="font-semibold text-gray-800">{formatTime(new Date())}</p>
              </div>
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <p className="text-sm text-gray-600 mb-1">Data Refresh</p>
                <p className="font-semibold text-purple-600">Auto (30s)</p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-purple-100">
              <h4 className="font-semibold text-gray-800 mb-4">Quick Actions</h4>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                  Add Product
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                  Create Order
                </button>
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                  Generate Report
                </button>
                <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm">
                  View Analytics
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
