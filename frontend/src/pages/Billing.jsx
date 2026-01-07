import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BillfinityLogo from "../components/Logo";
import apiService from "../services/api";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { useNotifications } from "../context/NotificationContext";
import { useModal } from "../context/ModalContext";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineQrCode,
  HiOutlineClipboardDocument,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineTrash,
  HiOutlinePrinter,
  HiOutlineEnvelope
} from "react-icons/hi2";

export default function Billing() {
  const { user } = useAuth();
  const { settings, formatCurrency, calculateTax } = useSettings();
  const { addNotification } = useNotifications();
  const { showSuccess, showError, showWarning } = useModal();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(''); // 'print', 'email', or 'generate'

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5)); // Show top 5 results
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await apiService.getProducts({ limit: 100 });
      if (response.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    
    if (existingItem) {
      setCartItems(items =>
        items.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = settings.preferences.enableGST ? calculateTax(subtotal) : 0;
  const total = subtotal + tax;

  const updateQuantity = (id, change) => {
    setCartItems(items => 
      items.map(item => 
        item._id === id 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item._id !== id));
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const generateInvoice = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    setActionType('generate');
    try {
      const orderData = {
        products: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        customerName: customerInfo.name,
        customerEmail: customerInfo.email
      };

      const response = await apiService.createOrder(orderData);
      
      if (response.success) {
        showSuccess(
          'Invoice Generated',
          'Your invoice has been successfully generated and is ready for download or email.'
        );
        
        // Add notification for invoice generation
        addNotification({
          type: 'success',
          title: 'Invoice Generated',
          message: `Invoice created for ${customerInfo.name || 'customer'} - ${formatCurrency(total)}`,
          icon: '🧾',
          action: 'View Invoices'
        });
        
        setCartItems([]);
        setCustomerInfo({ name: '', phone: '', email: '' });
      }
    } catch (error) {
      showError(
        'Invoice Generation Failed',
        `Unable to generate invoice: ${error.message}`
      );
      
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Invoice Generation Failed',
        message: 'Unable to generate invoice. Please try again.',
        icon: '❌',
        action: 'Retry'
      });
    } finally {
      setLoading(false);
      setActionType('');
    }
  };

  const printInvoice = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    setActionType('print');
    try {
      const totals = { subtotal, tax, total };
      
      // Generate PDF using backend
      const pdfBlob = await apiService.generateInvoicePDF(
        cartItems, 
        customerInfo, 
        settings.businessInfo, 
        totals
      );
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSuccess(
        'PDF Downloaded',
        'Your invoice PDF has been successfully downloaded to your device.'
      );
      
      // Add notification for PDF download
      addNotification({
        type: 'success',
        title: 'Invoice Downloaded',
        message: `PDF invoice downloaded for ${customerInfo.name || 'customer'}`,
        icon: '📄',
        action: 'View Downloads'
      });
      
    } catch (error) {
      showError(
        'PDF Generation Failed',
        `Unable to generate PDF: ${error.message}`
      );
      
      // Add error notification
      addNotification({
        type: 'error',
        title: 'PDF Generation Failed',
        message: 'Unable to generate PDF. Please try again.',
        icon: '❌',
        action: 'Retry'
      });
    } finally {
      setLoading(false);
      setActionType('');
    }
  };

  const emailInvoice = async () => {
    if (cartItems.length === 0) return;
    
    if (!customerInfo.email) {
      showWarning(
        'Email Required',
        'Please enter a customer email address to send the invoice.'
      );
      return;
    }

    setLoading(true);
    setActionType('email');
    try {
      const totals = { subtotal, tax, total };
      
      // Send email with PDF attachment
      const response = await apiService.emailInvoice(
        cartItems, 
        customerInfo, 
        settings.businessInfo, 
        totals
      );
      
      if (response.success) {
        let message = `Invoice sent successfully to ${customerInfo.email}!`;
        
        // If it's a test email, show preview URL
        if (response.previewUrl) {
          message += `\n\nTest Email Preview: ${response.previewUrl}`;
          console.log('📧 Test Email Preview URL:', response.previewUrl);
        }
        
        showSuccess(
          'Email Sent Successfully',
          message
        );
        
        // Add notification for email sent
        addNotification({
          type: 'success',
          title: 'Invoice Emailed',
          message: `Invoice sent to ${customerInfo.email} - ${formatCurrency(total)}`,
          icon: '📧',
          action: 'View Sent Emails'
        });
        
        setCartItems([]);
        setCustomerInfo({ name: '', phone: '', email: '' });
      }
      
    } catch (error) {
      showError(
        'Email Send Failed',
        `Unable to send invoice email: ${error.message}`
      );
      
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Email Send Failed',
        message: 'Unable to send invoice email. Please check email settings.',
        icon: '❌',
        action: 'Check Settings'
      });
    } finally {
      setLoading(false);
      setActionType('');
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-purple-50 via-white to-violet-50 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar title="Billing & Invoices" searchContext="billing" />

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Product Search & Cart */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                  <HiOutlineMagnifyingGlass className="text-white" size={16} />
                </div>
                Product Search
              </h3>

              <div className="space-y-4">
                <div className="relative">
                  <HiOutlineMagnifyingGlass
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                  />
                  <input
                    type="text"
                    placeholder="Search products by name, SKU, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-sm border-2 border-purple-100 rounded-xl
                             outline-none transition-all duration-200
                             focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                             bg-white/70 placeholder-purple-400"
                  />
                  
                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-purple-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                      {searchResults.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => addToCart(product)}
                          className="p-3 hover:bg-purple-50 cursor-pointer border-b border-purple-100 last:border-b-0"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-gray-800">{product.name}</p>
                              <p className="text-xs text-gray-500">SKU: {product.sku} | {product.category}</p>
                              <p className="text-sm text-purple-600">{formatCurrency(product.price)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Stock: {product.quantity}</p>
                              <button className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <HiOutlineQrCode
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                  />
                  <input
                    type="text"
                    placeholder="Scan barcode or enter product code..."
                    className="w-full pl-12 pr-4 py-3 text-sm border-2 border-purple-100 rounded-xl
                             outline-none transition-all duration-200
                             focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                             bg-white/70 placeholder-purple-400"
                  />
                </div>
              </div>
            </div>

            {/* Shopping Cart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                  <HiOutlineClipboardDocument className="text-white" size={16} />
                </div>
                Shopping Cart
                <span className="ml-auto text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {cartItems.length} items
                </span>
              </h3>

              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <HiOutlineClipboardDocument className="text-purple-400" size={24} />
                  </div>
                  <p className="text-gray-500 mb-2">No items in cart</p>
                  <p className="text-sm text-purple-600">Search and add products to start billing</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-purple-600">{item.category}</p>
                        <p className="text-sm font-semibold text-gray-700">{formatCurrency(item.price)} each</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item._id, -1)}
                          className="w-8 h-8 rounded-lg bg-purple-200 text-purple-700 hover:bg-purple-300 transition-colors flex items-center justify-center"
                        >
                          <HiOutlineMinus size={14} />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, 1)}
                          className="w-8 h-8 rounded-lg bg-purple-200 text-purple-700 hover:bg-purple-300 transition-colors flex items-center justify-center"
                        >
                          <HiOutlinePlus size={14} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                        <button 
                          onClick={() => removeItem(item._id)}
                          className="text-red-500 hover:text-red-700 transition-colors mt-1"
                        >
                          <HiOutlineTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Billing Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-6 flex flex-col h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                <HiOutlineClipboardDocument className="text-white" size={16} />
              </div>
              Invoice Summary
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
              </div>

              {settings.preferences.enableGST && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(tax)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-green-600">-{formatCurrency(0)}</span>
              </div>

              <hr className="border-purple-200" />

              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-800">Total Amount</span>
                <span className="text-purple-600">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-6 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
              <h4 className="font-semibold text-gray-800 mb-2">Customer Information</h4>
              <input 
                type="text" 
                placeholder="Customer Name" 
                value={customerInfo.name}
                onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                className="w-full mb-2 px-3 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <input 
                type="text" 
                placeholder="Phone Number" 
                value={customerInfo.phone}
                onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                className="w-full mb-2 px-3 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={customerInfo.email}
                onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={generateInvoice}
                disabled={cartItems.length === 0 || loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white
                         bg-gradient-to-r from-purple-500 to-violet-500
                         hover:from-purple-600 hover:to-violet-600
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-lg shadow-purple-200"
              >
                {loading && actionType === 'generate' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <HiOutlineClipboardDocument size={18} />
                    Generate Invoice
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={printInvoice}
                  disabled={cartItems.length === 0 || loading}
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm font-medium
                           border-2 border-purple-200 text-purple-600 hover:bg-purple-50
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading && actionType === 'print' ? (
                    <>
                      <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-1">Print</span>
                    </>
                  ) : (
                    <>
                      <HiOutlinePrinter size={16} />
                      Print
                    </>
                  )}
                </button>
                
                <button
                  onClick={emailInvoice}
                  disabled={cartItems.length === 0 || loading}
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm font-medium
                           border-2 border-purple-200 text-purple-600 hover:bg-purple-50
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading && actionType === 'email' ? (
                    <>
                      <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-1">Email</span>
                    </>
                  ) : (
                    <>
                      <HiOutlineEnvelope size={16} />
                      Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
