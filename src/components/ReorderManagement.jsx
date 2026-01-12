import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useNotifications } from '../context/NotificationContext';
import { useModal } from '../context/ModalContext';
import apiService from '../services/api';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTruck,
  HiOutlineExclamationTriangle,
  HiOutlinePlus,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineXMark
} from 'react-icons/hi2';

export default function ReorderManagement({ isVisible, onClose }) {
  const { formatCurrency, formatDate, formatTime } = useSettings();
  const { addNotification } = useNotifications();
  const { showSuccess, showError, showConfirm } = useModal();
  const [reorders, setReorders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [manualReorderForm, setManualReorderForm] = useState({
    productId: '',
    quantity: '',
    notes: '',
    estimatedDelivery: ''
  });

  useEffect(() => {
    if (isVisible) {
      fetchReorders();
      fetchStats();
    }
  }, [isVisible, selectedStatus]);

  useEffect(() => {
    if (showCreateModal) {
      fetchProducts();
    }
  }, [showCreateModal]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await apiService.getProducts({ limit: 1000 });
      if (response.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Error', 'Failed to fetch products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchReorders = async () => {
    try {
      setLoading(true);
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      const response = await apiService.getReorders(params);
      
      if (response.success) {
        setReorders(response.data.reorders);
      }
    } catch (error) {
      console.error('Error fetching reorders:', error);
      showError('Error', 'Failed to fetch reorders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.getReorderStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching reorder stats:', error);
    }
  };

  const updateReorderStatus = async (reorderId, newStatus) => {
    try {
      const response = await apiService.updateReorderStatus(reorderId, newStatus);
      
      if (response.success) {
        showSuccess('Success', `Reorder status updated to ${newStatus}`);
        
        addNotification({
          type: 'success',
          title: 'Reorder Updated',
          message: `Reorder status changed to ${newStatus}`,
          icon: '📦',
          action: 'View Reorders'
        });
        
        fetchReorders();
        fetchStats();
      }
    } catch (error) {
      showError('Error', `Failed to update reorder status: ${error.message}`);
    }
  };

  const handleCreateManualReorder = async (e) => {
    e.preventDefault();
    
    try {
      const response = await apiService.createManualReorder(
        manualReorderForm.productId,
        parseInt(manualReorderForm.quantity),
        manualReorderForm.notes
      );
      
      if (response.success) {
        const selectedProduct = products.find(p => p._id === manualReorderForm.productId);
        
        showSuccess('Success', `Manual reorder created for ${selectedProduct?.name || 'product'}`);
        
        addNotification({
          type: 'success',
          title: 'Manual Reorder Created',
          message: `Reorder for ${selectedProduct?.name || 'product'} has been created`,
          icon: '📦',
          action: 'View Reorders'
        });
        
        // Reset form and close modal
        setManualReorderForm({
          productId: '',
          quantity: '',
          notes: '',
          estimatedDelivery: ''
        });
        setShowCreateModal(false);
        
        // Refresh data
        fetchReorders();
        fetchStats();
      }
    } catch (error) {
      showError('Error', `Failed to create manual reorder: ${error.message}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <HiOutlineClock className="w-4 h-4 text-yellow-600" />;
      case 'ordered':
        return <HiOutlineTruck className="w-4 h-4 text-blue-600" />;
      case 'received':
        return <HiOutlineCheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <HiOutlineXCircle className="w-4 h-4 text-red-600" />;
      default:
        return <HiOutlineExclamationTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ordered':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'received':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <HiOutlineClipboardDocumentList className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Reorder Management</h2>
                <p className="text-purple-100 text-sm">Manage automatic and manual reorders</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-800">{stats.pendingReorders || 0}</p>
                </div>
                <HiOutlineClock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Ordered</p>
                  <p className="text-2xl font-bold text-blue-800">{stats.orderedReorders || 0}</p>
                </div>
                <HiOutlineTruck className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Received</p>
                  <p className="text-2xl font-bold text-green-800">{stats.receivedReorders || 0}</p>
                </div>
                <HiOutlineCheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total</p>
                  <p className="text-2xl font-bold text-purple-800">{stats.totalReorders || 0}</p>
                </div>
                <HiOutlineClipboardDocumentList className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Reorders</option>
                <option value="pending">Pending</option>
                <option value="ordered">Ordered</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-colors"
            >
              <HiOutlinePlus className="w-4 h-4" />
              <span>Manual Reorder</span>
            </button>
          </div>
        </div>

        {/* Reorders List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading reorders...</span>
            </div>
          ) : reorders.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineClipboardDocumentList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reorders found</p>
              <p className="text-gray-400 text-sm">Reorders will appear here when products reach their reorder point</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reorders.map((reorder) => (
                <div key={reorder._id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-800">{reorder.product.name}</h3>
                        <span className="text-sm text-gray-500">SKU: {reorder.product.sku}</span>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(reorder.status)}`}>
                          {getStatusIcon(reorder.status)}
                          <span className="capitalize">{reorder.status}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Quantity:</span> {reorder.quantity} units
                        </div>
                        <div>
                          <span className="font-medium">Trigger:</span> {reorder.triggerReason.replace('_', ' ')}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {formatDate(reorder.createdAt)}
                        </div>
                        <div>
                          <span className="font-medium">Est. Delivery:</span> {reorder.estimatedDelivery ? formatDate(reorder.estimatedDelivery) : 'TBD'}
                        </div>
                      </div>
                      
                      {reorder.supplierInfo?.name && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Supplier:</span> {reorder.supplierInfo.name}
                          {reorder.supplierInfo.email && (
                            <span className="ml-2">({reorder.supplierInfo.email})</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {reorder.status === 'pending' && (
                        <button
                          onClick={() => updateReorderStatus(reorder._id, 'ordered')}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          Mark Ordered
                        </button>
                      )}
                      
                      {reorder.status === 'ordered' && (
                        <button
                          onClick={() => updateReorderStatus(reorder._id, 'received')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          Mark Received
                        </button>
                      )}
                      
                      {(reorder.status === 'pending' || reorder.status === 'ordered') && (
                        <button
                          onClick={() => updateReorderStatus(reorder._id, 'cancelled')}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manual Reorder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Create Manual Reorder</h3>
                  <p className="text-sm text-purple-600">Add a manual reorder for any product</p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setManualReorderForm({
                      productId: '',
                      quantity: '',
                      notes: '',
                      estimatedDelivery: ''
                    });
                  }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <HiOutlineXMark className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateManualReorder} className="p-6 space-y-4">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product *
                </label>
                {loadingProducts ? (
                  <div className="flex items-center justify-center py-3 border border-gray-300 rounded-lg">
                    <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mr-2"></div>
                    <span className="text-sm text-gray-600">Loading products...</span>
                  </div>
                ) : (
                  <select
                    required
                    value={manualReorderForm.productId}
                    onChange={(e) => setManualReorderForm(prev => ({ ...prev, productId: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  >
                    <option value="">Select a product</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} (SKU: {product.sku}) - Stock: {product.quantity}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Reorder *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={manualReorderForm.quantity}
                  onChange={(e) => setManualReorderForm(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  placeholder="Enter quantity"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={manualReorderForm.notes}
                  onChange={(e) => setManualReorderForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none"
                  placeholder="Add any notes about this reorder..."
                />
              </div>

              {/* Selected Product Info */}
              {manualReorderForm.productId && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">Selected Product Info:</h4>
                  {(() => {
                    const selectedProduct = products.find(p => p._id === manualReorderForm.productId);
                    return selectedProduct ? (
                      <div className="space-y-1 text-sm text-purple-700">
                        <p><strong>Name:</strong> {selectedProduct.name}</p>
                        <p><strong>SKU:</strong> {selectedProduct.sku}</p>
                        <p><strong>Category:</strong> {selectedProduct.category}</p>
                        <p><strong>Current Stock:</strong> {selectedProduct.quantity} units</p>
                        <p><strong>Price:</strong> {formatCurrency(selectedProduct.price)}</p>
                        {selectedProduct.supplierInfo?.name && (
                          <p><strong>Supplier:</strong> {selectedProduct.supplierInfo.name}</p>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setManualReorderForm({
                      productId: '',
                      quantity: '',
                      notes: '',
                      estimatedDelivery: ''
                    });
                  }}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!manualReorderForm.productId || !manualReorderForm.quantity}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Reorder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}