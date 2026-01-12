import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BillfinityLogo from "../components/Logo";
import ReorderManagement from "../components/ReorderManagement";
import apiService from "../services/api";
import { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { useNotifications } from "../context/NotificationContext";
import { useModal } from "../context/ModalContext";
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineAdjustmentsHorizontal,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineClipboardDocumentList
} from "react-icons/hi2";

export default function Inventory() {
  const { settings, formatCurrency } = useSettings();
  const { addNotification } = useNotifications();
  const { showSuccess, showError, showWarning, showConfirm } = useModal();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inventoryStats, setInventoryStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStock: 0,
    totalValue: 0
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    stockStatus: [],
    priceRange: { min: '', max: '' },
    stockRange: { min: '', max: '' }
  });
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    quantity: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchInventoryStats();
  }, [currentPage, searchTerm, filters]);

  const fetchInventoryStats = async () => {
    try {
      // Fetch all products to calculate real-time stats
      const response = await apiService.getProducts({ limit: 1000 }); // Get all products
      if (response.success) {
        const allProducts = response.data.products;
        const stats = {
          totalProducts: allProducts.length,
          lowStockItems: allProducts.filter(p => p.quantity < 10 && p.quantity > 0).length,
          outOfStock: allProducts.filter(p => p.quantity === 0).length,
          totalValue: allProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0)
        };
        setInventoryStats(stats);
      }
    } catch (err) {
      console.error('Error fetching inventory stats:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.categories.length > 0 && { categories: filters.categories.join(',') }),
        ...(filters.stockStatus.length > 0 && { stockStatus: filters.stockStatus.join(',') }),
        ...(filters.priceRange.min && { minPrice: filters.priceRange.min }),
        ...(filters.priceRange.max && { maxPrice: filters.priceRange.max }),
        ...(filters.stockRange.min && { minStock: filters.stockRange.min }),
        ...(filters.stockRange.max && { maxStock: filters.stockRange.max })
      };
      
      const response = await apiService.getProducts(params);
      if (response.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err) {
      setError(err.message);
      console.error('Products fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value, checked) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterType === 'categories' || filterType === 'stockStatus') {
        if (checked) {
          newFilters[filterType] = [...prev[filterType], value];
        } else {
          newFilters[filterType] = prev[filterType].filter(item => item !== value);
        }
      } else if (filterType === 'priceRange' || filterType === 'stockRange') {
        newFilters[filterType] = { ...prev[filterType], ...value };
      }
      
      return newFilters;
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const hadFilters = getActiveFiltersCount() > 0;
    setFilters({
      categories: [],
      stockStatus: [],
      priceRange: { min: '', max: '' },
      stockRange: { min: '', max: '' }
    });
    setCurrentPage(1);
    
    // Add notification when filters are cleared
    if (hadFilters) {
      addNotification({
        type: 'info',
        title: 'Filters Cleared',
        message: 'All filters have been removed from inventory',
        icon: '🧹',
        action: 'View All Products'
      });
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    count += filters.categories.length;
    count += filters.stockStatus.length;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.stockRange.min || filters.stockRange.max) count++;
    return count;
  };

  const handleAddProduct = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      price: '',
      quantity: '',
      description: ''
    });
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      description: product.description || ''
    });
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    const productToDelete = products.find(p => p._id === productId);
    
    showConfirm({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${productToDelete?.name || 'this product'}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await apiService.deleteProduct(productId);
          fetchProducts(); // Refresh the list
          fetchInventoryStats(); // Refresh the stats
          
          showSuccess(
            'Product Deleted',
            `${productToDelete?.name || 'Product'} has been successfully removed from inventory.`
          );
          
          // Add notification for product deletion
          addNotification({
            type: 'warning',
            title: 'Product Deleted',
            message: `${productToDelete?.name || 'Product'} has been removed from inventory`,
            icon: '🗑️',
            action: 'View Inventory'
          });
        } catch (error) {
          showError(
            'Delete Failed',
            `Unable to delete product: ${error.message}`
          );
          
          // Add error notification
          addNotification({
            type: 'error',
            title: 'Delete Failed',
            message: 'Unable to delete product. Please try again.',
            icon: '❌',
            action: 'Retry'
          });
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (editingProduct) {
        await apiService.updateProduct(editingProduct._id, productData);
        
        showSuccess(
          'Product Updated',
          `${productData.name} has been successfully updated in your inventory.`
        );
        
        // Add notification for product update
        addNotification({
          type: 'success',
          title: 'Product Updated',
          message: `${productData.name} has been updated successfully`,
          icon: '✏️',
          action: 'View Product'
        });
      } else {
        await apiService.createProduct(productData);
        
        showSuccess(
          'Product Added',
          `${productData.name} has been successfully added to your inventory.`
        );
        
        // Add notification for new product
        addNotification({
          type: 'success',
          title: 'New Product Added',
          message: `${productData.name} has been added to inventory`,
          icon: '📦',
          action: 'View Inventory'
        });
      }
      
      setShowAddModal(false);
      fetchProducts(); // Refresh the product list
      fetchInventoryStats(); // Refresh the stats
    } catch (error) {
      showError(
        'Save Failed',
        `Unable to save product: ${error.message}`
      );
      
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Product Save Failed',
        message: 'Unable to save product. Please try again.',
        icon: '❌',
        action: 'Retry'
      });
    }
  };

  const calculateStats = () => {
    return inventoryStats;
  };

  const stats = calculateStats();

  if (loading && products.length === 0) {
    return (
      <div className="flex bg-gradient-to-br from-purple-50 via-white to-violet-50 min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar title="Inventory Management" searchContext="inventory" />
          <div className="p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-600">Loading inventory...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex bg-gradient-to-br from-purple-50 via-white to-violet-50 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar title="Inventory Management" />

        <div className="p-6 space-y-6">

          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <HiOutlineMagnifyingGlass
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                />
                <input
                  type="text"
                  placeholder="Search products by name, SKU, or category..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 text-sm border-2 border-purple-100 rounded-xl
                           outline-none transition-all duration-200
                           focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                           bg-white/70 placeholder-purple-400"
                />
              </div>
              
              <button 
                onClick={() => setShowFilterModal(true)}
                className="relative flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <HiOutlineAdjustmentsHorizontal size={18} />
                <span className="hidden sm:inline">Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleAddProduct}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold hover:from-purple-600 hover:to-violet-600 transition-all duration-200 shadow-lg shadow-purple-200"
              >
                <HiOutlinePlus size={18} />
                Add New Product
              </button>
              
              <button 
                onClick={() => setShowReorderModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-blue-200"
              >
                <HiOutlineClipboardDocumentList size={18} />
                Manage Reorders
              </button>
              
              <button 
                onClick={async () => {
                  setLoading(true);
                  try {
                    await fetchProducts();
                    await fetchInventoryStats();
                    addNotification({
                      type: 'success',
                      title: 'Inventory Refreshed',
                      message: 'Product data has been updated with latest information',
                      icon: '🔄',
                      action: 'View Inventory'
                    });
                  } catch (err) {
                    addNotification({
                      type: 'error',
                      title: 'Refresh Failed',
                      message: 'Unable to refresh inventory data',
                      icon: '❌',
                      action: 'Try Again'
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-green-200 text-green-600 hover:bg-green-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-purple-600 font-medium">Active Filters:</span>
              
              {filters.categories.map(category => (
                <span key={category} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  {category}
                  <button 
                    onClick={() => handleFilterChange('categories', category, false)}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
              
              {filters.stockStatus.map(status => (
                <span key={status} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {status.replace('-', ' ')}
                  <button 
                    onClick={() => handleFilterChange('stockStatus', status, false)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
              
              {(filters.priceRange.min || filters.priceRange.max) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  Price: {filters.priceRange.min || '0'} - {filters.priceRange.max || '∞'}
                  <button 
                    onClick={() => handleFilterChange('priceRange', { min: '', max: '' })}
                    className="hover:bg-green-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {(filters.stockRange.min || filters.stockRange.max) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                  Stock: {filters.stockRange.min || '0'} - {filters.stockRange.max || '∞'}
                  <button 
                    onClick={() => handleFilterChange('stockRange', { min: '', max: '' })}
                    className="hover:bg-orange-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              
              <button 
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-800 underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100 shadow-lg">
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100 shadow-lg">
              <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-600">{stats.lowStockItems}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100 shadow-lg">
              <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100 shadow-lg">
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
            <div className="p-6 border-b border-purple-100">
              <h3 className="text-lg font-bold text-gray-800">Product Inventory</h3>
              <p className="text-sm text-purple-600">Manage your product catalog and stock levels</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Product Details</th>
                    <th className="px-6 py-4 text-left font-semibold">Category</th>
                    <th className="px-6 py-4 text-left font-semibold">Stock Level</th>
                    <th className="px-6 py-4 text-left font-semibold">Unit Price</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin mr-2"></div>
                          Loading products...
                        </div>
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <HiOutlinePlus className="w-8 h-8 text-purple-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
                          <p className="text-gray-500 mb-4">Start building your inventory by adding your first product</p>
                          <button 
                            onClick={handleAddProduct}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold hover:from-purple-600 hover:to-violet-600 transition-all duration-200 shadow-lg shadow-purple-200"
                          >
                            <HiOutlinePlus size={18} />
                            Add Your First Product
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((p, index) => (
                      <tr
                        key={p._id}
                        className={`border-b border-purple-50 hover:bg-purple-50/50 transition-colors ${
                          index % 2 === 0 ? 'bg-white/50' : 'bg-purple-25/25'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-800">{p.name}</p>
                            <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">{p.quantity}</span>
                            <span className="text-gray-500">units</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-800">{formatCurrency(p.price)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              p.quantity === 0
                                ? "bg-red-100 text-red-700"
                                : p.quantity < 10
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {p.quantity === 0
                              ? "Out of Stock"
                              : p.quantity < 10
                              ? "Low Stock"
                              : "In Stock"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEditProduct(p)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" 
                              title="Edit Product"
                            >
                              <HiOutlinePencilSquare size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" 
                              title="Delete Product"
                            >
                              <HiOutlineTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-purple-100 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {products.length} products
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm bg-purple-500 text-white rounded-lg">
                  {currentPage}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-purple-600">
                {editingProduct ? 'Update product information' : 'Enter product details to add to inventory'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="Enter SKU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home & Garden">Home & Garden</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none"
                    placeholder="Enter product description (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all shadow-lg shadow-purple-200"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Filter Products</h2>
                <p className="text-sm text-purple-600">Refine your product search</p>
              </div>
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-purple-600 hover:text-purple-800 underline"
                >
                  Clear All ({getActiveFiltersCount()})
                </button>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Electronics', 'Groceries', 'Clothing', 'Books', 'Home & Garden'].map(category => (
                    <label key={category} className="flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={(e) => handleFilterChange('categories', category, e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stock Status Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Stock Status</h3>
                <div className="space-y-2">
                  {[
                    { value: 'in-stock', label: 'In Stock', color: 'text-green-600' },
                    { value: 'low-stock', label: 'Low Stock', color: 'text-yellow-600' },
                    { value: 'out-of-stock', label: 'Out of Stock', color: 'text-red-600' }
                  ].map(status => (
                    <label key={status.value} className="flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.stockStatus.includes(status.value)}
                        onChange={(e) => handleFilterChange('stockStatus', status.value, e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                      />
                      <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={filters.priceRange.min}
                      onChange={(e) => handleFilterChange('priceRange', { min: e.target.value })}
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="999.99"
                      value={filters.priceRange.max}
                      onChange={(e) => handleFilterChange('priceRange', { max: e.target.value })}
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Quantity Range Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Stock Quantity Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Min Quantity</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={filters.stockRange.min}
                      onChange={(e) => handleFilterChange('stockRange', { min: e.target.value })}
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Max Quantity</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="1000"
                      value={filters.stockRange.max}
                      onChange={(e) => handleFilterChange('stockRange', { max: e.target.value })}
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowFilterModal(false);
                  fetchProducts();
                  
                  // Add notification for applied filters
                  if (getActiveFiltersCount() > 0) {
                    addNotification({
                      type: 'info',
                      title: 'Filters Applied',
                      message: `${getActiveFiltersCount()} filter(s) applied to inventory`,
                      icon: '🔍',
                      action: 'View Results'
                    });
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all shadow-lg shadow-purple-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reorder Management Modal */}
      <ReorderManagement 
        isVisible={showReorderModal}
        onClose={() => setShowReorderModal(false)}
      />
    </div>
  );
}
