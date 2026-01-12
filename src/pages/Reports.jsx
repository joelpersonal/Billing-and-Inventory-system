import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BillfinityLogo from "../components/Logo";
import apiService from "../services/api";
import { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { useNotifications } from "../context/NotificationContext";
import { useModal } from "../context/ModalContext";
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
import {
  HiOutlineDocumentChartBar,
  HiOutlineCalendarDays,
  HiOutlineArrowDownTray,
  HiOutlinePrinter
} from "react-icons/hi2";

const colors = ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#F3E8FF'];

export default function Reports() {
  const { settings, formatCurrency, formatDate, formatTime } = useSettings();
  const { addNotification } = useNotifications();
  const { showSuccess, showError } = useModal();
  const [reportData, setReportData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard data for charts
      const dashboardData = await apiService.getDashboardData();
      
      // Fetch recent orders for the table
      const ordersResponse = await apiService.getOrders({ limit: 10 });
      
      setReportData(dashboardData);
      setOrders(ordersResponse.success ? ordersResponse.data.orders : []);
    } catch (err) {
      setError(err.message);
      console.error('Report data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = async () => {
    try {
      setLoading(true);
      
      // Use backend PDF service
      const pdfBlob = await apiService.generateBusinessReport(settings.businessInfo);
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${settings.businessInfo.businessName}-Report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSuccess(
        'Report Downloaded',
        'Your business report has been successfully downloaded as a PDF.'
      );
      
      // Add notification for report generation
      addNotification({
        type: 'success',
        title: 'Business Report Generated',
        message: `${settings.businessInfo.businessName} report downloaded successfully`,
        icon: '📊',
        action: 'View Downloads'
      });
      
    } catch (error) {
      console.error('PDF generation error:', error);
      showError(
        'PDF Generation Failed',
        `Unable to generate PDF report: ${error.message}`
      );
      
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Report Generation Failed',
        message: 'Unable to generate business report. Please try again.',
        icon: '❌',
        action: 'Retry'
      });
    } finally {
      setLoading(false);
    }
  };

  const printReport = async () => {
    try {
      setLoading(true);
      
      // Use backend PDF service for preview
      const pdfBlob = await apiService.previewBusinessReport(settings.businessInfo);
      
      // Create blob URL and open in new window for printing
      const url = window.URL.createObjectURL(pdfBlob);
      const printWindow = window.open(url, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
        
        // Add notification for print
        addNotification({
          type: 'info',
          title: 'Report Opened for Printing',
          message: 'Business report opened in new window for printing',
          icon: '🖨️',
          action: 'Close Window'
        });
      } else {
        // Fallback: download if popup blocked
        const link = document.createElement('a');
        link.href = url;
        link.download = `${settings.businessInfo.businessName}-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add notification for download fallback
        addNotification({
          type: 'warning',
          title: 'Popup Blocked - Report Downloaded',
          message: 'Report downloaded instead due to popup blocker',
          icon: '📥',
          action: 'Enable Popups'
        });
      }
      
      // Clean up URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (error) {
      console.error('PDF print error:', error);
      showError(
        'Print Preparation Failed',
        `Unable to prepare report for printing: ${error.message}`
      );
      
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Print Preparation Failed',
        message: 'Unable to prepare report for printing. Please try again.',
        icon: '❌',
        action: 'Retry'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-gradient-to-br from-purple-50 via-white to-violet-50 min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar title="Analytics & Reports" />
          <div className="p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-600">Loading report data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-gradient-to-br from-purple-50 via-white to-violet-50 min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar title="Analytics & Reports" />
          <div className="p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading report data: {error}</p>
              <button 
                onClick={fetchReportData} 
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
  const salesData = reportData?.salesRevenue?.labels?.map((label, index) => ({
    day: label,
    sales: reportData.salesRevenue.sales[index] || 0,
    revenue: reportData.salesRevenue.revenue[index] || 0
  })) || [];

  const categoryRevenue = reportData?.productCategories?.categories?.map((category, index) => ({
    name: category.name,
    value: category.stockValue || 0, // Use actual stock value
    color: colors[index % colors.length]
  })) || [];
  return (
    <div className="flex bg-gradient-to-br from-purple-50 via-white to-violet-50 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar title="Analytics & Reports" searchContext="reports" />

        <div className="p-6 space-y-8">

          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Business Analytics</h2>
              <p className="text-purple-600">Track your business performance and insights</p>
              {loading && (
                <div className="flex items-center gap-2 text-purple-600 mt-2">
                  <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                  <span className="text-sm">Updating data...</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setDateRange(dateRange === '7days' ? '30days' : '7days')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <HiOutlineCalendarDays size={18} />
                {dateRange === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
              <button 
                onClick={fetchReportData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors"
                disabled={loading}
              >
                <div className={loading ? "w-4 h-4 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin" : ""}>
                  {!loading && "🔄"}
                </div>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button 
                onClick={generatePDFReport}
                disabled={loading || !reportData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiOutlineArrowDownTray size={18} />
                Export PDF
              </button>
              <button 
                onClick={printReport}
                disabled={loading || !reportData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600 transition-all duration-200 shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiOutlinePrinter size={18} />
                Print Report
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                  <HiOutlineDocumentChartBar className="text-white" size={20} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  reportData?.stockValue?.growthPercentage >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {reportData?.stockValue?.growthPercentage >= 0 ? '+' : ''}{reportData?.stockValue?.growthPercentage?.toFixed(1) || 0}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Stock Value</p>
              <h3 className="text-3xl font-bold text-gray-800">{formatCurrency(reportData?.stockValue?.stockValue || 0)}</h3>
              <p className="text-xs text-purple-600 mt-1">inventory value</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                  <HiOutlineDocumentChartBar className="text-white" size={20} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  reportData?.todaysSales?.growthPercentage >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {reportData?.todaysSales?.growthPercentage >= 0 ? '+' : ''}{reportData?.todaysSales?.growthPercentage?.toFixed(1) || 0}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Today's Sales</p>
              <h3 className="text-3xl font-bold text-gray-800">{formatCurrency(reportData?.todaysSales?.todaySales || 0)}</h3>
              <p className="text-xs text-purple-600 mt-1">vs yesterday</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <HiOutlineDocumentChartBar className="text-white" size={20} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  reportData?.totalProducts?.growthPercentage >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {reportData?.totalProducts?.growthPercentage >= 0 ? '+' : ''}{reportData?.totalProducts?.growthPercentage?.toFixed(1) || 0}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <h3 className="text-3xl font-bold text-gray-800">{reportData?.totalProducts?.total || 0}</h3>
              <p className="text-xs text-purple-600 mt-1">in inventory</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <HiOutlineDocumentChartBar className="text-white" size={20} />
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {orders.length} recent
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
              <h3 className="text-3xl font-bold text-gray-800">{reportData?.lowStock?.lowStockCount || 0}</h3>
              <p className="text-xs text-purple-600 mt-1">need attention</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Revenue & Orders Chart */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Revenue & Orders Trend</h3>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-gray-600">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-violet-400"></div>
                    <span className="text-gray-600">Orders</span>
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
                      dataKey="revenue"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#A855F7"
                      strokeWidth={3}
                      dot={{ fill: '#A855F7', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Revenue */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Stock Value by Category</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryRevenue}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Stock Value']}
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
                {categoryRevenue.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">${item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Daily Reports Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
            <div className="p-6 border-b border-purple-100">
              <h3 className="text-lg font-bold text-gray-800">Recent Orders Report</h3>
              <p className="text-sm text-purple-600">Latest orders and transactions</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Order Number</th>
                    <th className="px-6 py-4 text-left font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left font-semibold">Total Amount</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin mr-2"></div>
                          Loading orders...
                        </div>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr key={order._id} className={`border-b border-purple-50 hover:bg-purple-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white/50' : 'bg-purple-25/25'
                      }`}>
                        <td className="px-6 py-4 font-semibold text-gray-800">{order.orderNumber}</td>
                        <td className="px-6 py-4 text-gray-700">{order.customerName || 'N/A'}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800">{formatCurrency(order.totalAmount || 0)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
