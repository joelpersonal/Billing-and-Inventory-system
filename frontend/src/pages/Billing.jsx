import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BillfinityLogo from "../components/Logo";
import SmartInvoiceInsights from "../components/SmartInvoiceInsights";
import InvoiceTimeline from "../components/InvoiceTimeline";
import VoiceAssistedBilling from "../components/VoiceAssistedBilling";
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
  HiOutlineEnvelope,
  HiOutlineClock
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
  const [showInsights, setShowInsights] = useState(false);
  const [invoiceInsights, setInvoiceInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [currentOrderNumber, setCurrentOrderNumber] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);

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

  // Voice Assistant Functions
  const handleVoiceAddItem = (item) => {
    console.log('🛒 Billing received voice item:', item);
    
    // Validate that we have a proper item
    if (!item || !item._id || !item.name) {
      console.error('❌ Invalid item received:', item);
      return;
    }
    
    // Check if item already exists in cart (by name for voice items)
    const existingItem = cartItems.find(cartItem => 
      cartItem.name.toLowerCase() === item.name.toLowerCase()
    );
    
    if (existingItem) {
      // Update quantity of existing item
      console.log('📈 Updating existing item quantity');
      setCartItems(items =>
        items.map(cartItem =>
          cartItem.name.toLowerCase() === item.name.toLowerCase()
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      );
      
      addNotification({
        type: 'success',
        title: 'Voice Command Executed',
        message: `Updated ${item.name} quantity to ${existingItem.quantity + item.quantity}`,
        icon: '🎤'
      });
    } else {
      // Add new voice item to cart
      console.log('✅ Adding NEW voice item to cart:', item);
      
      setCartItems(prevItems => {
        const newItems = [...prevItems, item];
        console.log('🛒 Updated cart items:', newItems);
        return newItems;
      });
      
      addNotification({
        type: 'info',
        title: 'Voice Item Added',
        message: `Added ${item.quantity} ${item.unit} of ${item.name}. Please set the price manually.`,
        icon: '🎤'
      });
    }
  };

  const handleVoiceRemoveItem = (id) => {
    console.log('🗑️ Billing: Removing item with ID:', id);
    
    const itemToRemove = cartItems.find(item => item._id === id);
    if (itemToRemove) {
      console.log('✅ Found item to remove:', itemToRemove.name);
      removeItem(id);
      
      addNotification({
        type: 'info',
        title: 'Voice Command Executed',
        message: `Removed ${itemToRemove.name} via voice command`,
        icon: '🎤'
      });
    } else {
      console.log('❌ Item not found for removal');
    }
  };

  const handleVoiceUpdateQuantity = (id, quantity, unit) => {
    console.log('📝 Billing: Updating quantity for ID:', id, 'to:', quantity);
    
    setCartItems(items =>
      items.map(item =>
        item._id === id
          ? { ...item, quantity: Number(quantity), unit: unit || item.unit }
          : item
      )
    );
    
    const item = cartItems.find(item => item._id === id);
    addNotification({
      type: 'info',
      title: 'Voice Command Executed',
      message: `Updated ${item?.name || 'item'} quantity to ${quantity} ${unit || 'pieces'}`,
      icon: '🎤'
    });
  };

  const handleVoiceClearAll = () => {
    setCartItems([]);
    addNotification({
      type: 'warning',
      title: 'Voice Command Executed',
      message: 'All items cleared via voice command',
      icon: '🎤'
    });
  };

  const handleVoiceShowTotal = () => {
    addNotification({
      type: 'info',
      title: 'Current Total',
      message: `Subtotal: ${formatCurrency(subtotal)}, Tax: ${formatCurrency(tax)}, Total: ${formatCurrency(total)}`,
      icon: '💰'
    });
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const fetchInvoiceInsights = async (orderId) => {
    try {
      setLoadingInsights(true);
      const response = await apiService.getInvoiceInsights(orderId, cartItems);
      if (response.success) {
        setInvoiceInsights(response.data.insights);
        // Small delay to make the insights feel more "intelligent"
        setTimeout(() => {
          setShowInsights(true);
          setLoadingInsights(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error fetching invoice insights:', error);
      setLoadingInsights(false);
      // Don't show error to user, insights are optional
    }
  };

  const showInvoiceTimeline = (orderNumber, orderId) => {
    setCurrentOrderNumber(orderNumber);
    setCurrentOrderId(orderId);
    setShowTimeline(true);
  };

  // Demo function to add sample timeline events for demonstration
  const addSampleTimelineEvents = async (orderId) => {
    if (!orderId) return;
    
    try {
      // Add discount event (10% discount)
      await apiService.addTimelineEvent(
        orderId,
        'discount_applied',
        'Discount applied (10%)',
        { discountAmount: (total * 0.1).toFixed(2), discountType: '10% off' }
      );

      // Add payment event (UPI payment)
      setTimeout(async () => {
        await apiService.addTimelineEvent(
          orderId,
          'payment_received',
          'Payment received via UPI',
          { paymentMethod: 'UPI', amount: total.toFixed(2) }
        );
      }, 1000);
    } catch (error) {
      console.error('Error adding sample timeline events:', error);
    }
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
        const order = response.data.order;
        
        showSuccess(
          'Invoice Generated',
          'Your invoice has been successfully generated and is ready for download or email.'
        );
        
        // Add notification for invoice generation with timeline button
        addNotification({
          type: 'success',
          title: 'Invoice Generated',
          message: `Invoice ${order.orderNumber} created for ${customerInfo.name || 'customer'} - ${formatCurrency(total)}`,
          icon: '🧾',
          action: 'View Timeline',
          onClick: () => showInvoiceTimeline(order.orderNumber, order._id)
        });

        // Add notification for insights generation
        addNotification({
          type: 'info',
          title: 'Generating Smart Insights',
          message: 'AI is analyzing your sale data to provide intelligent insights...',
          icon: '🤖',
          action: 'View Insights'
        });

        // Store order details for timeline access
        setCurrentOrderNumber(order.orderNumber);
        setCurrentOrderId(order._id);

        // Add sample timeline events for demo
        setTimeout(() => {
          addSampleTimelineEvents(order._id);
        }, 2000);

        // Fetch and show smart insights
        await fetchInvoiceInsights(order._id);
        
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
      
      // Generate PDF using backend with orderId for timeline tracking
      const pdfBlob = await apiService.generateInvoicePDF(
        cartItems, 
        customerInfo, 
        settings.businessInfo, 
        totals,
        currentOrderId // Pass orderId for timeline tracking
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
        totals,
        currentOrderId // Pass orderId for timeline tracking
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
          
          {/* Voice-Assisted Billing */}
          <div className="lg:col-span-3 mb-6">
            <VoiceAssistedBilling
              cartItems={cartItems}
              onAddItem={handleVoiceAddItem}
              onRemoveItem={handleVoiceRemoveItem}
              onUpdateQuantity={handleVoiceUpdateQuantity}
              onClearAll={handleVoiceClearAll}
              onShowTotal={handleVoiceShowTotal}
              products={products}
            />
          </div>

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
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          {item.isVoiceAdded && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              🎤 Voice
                            </span>
                          )}
                          {item.price === 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                              ⚠️ Set Price
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-purple-600">{item.category}</p>
                        
                        {/* Price Input for Voice Items */}
                        {item.isVoiceAdded ? (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">Price:</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => {
                                const newPrice = parseFloat(e.target.value) || 0;
                                setCartItems(items =>
                                  items.map(cartItem =>
                                    cartItem._id === item._id
                                      ? { ...cartItem, price: newPrice }
                                      : cartItem
                                  )
                                );
                              }}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
                              placeholder="0.00"
                            />
                            <span className="text-sm text-gray-600">each</span>
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-gray-700">{formatCurrency(item.price)} each</p>
                        )}
                        
                        {item.sku && (
                          <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                        )}
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

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={printInvoice}
                  disabled={cartItems.length === 0 || loading}
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-sm font-medium
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
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-sm font-medium
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

                <button
                  onClick={() => showInvoiceTimeline(currentOrderNumber, currentOrderId)}
                  disabled={!currentOrderNumber && !currentOrderId}
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-sm font-medium
                           border-2 border-purple-200 text-purple-600 hover:bg-purple-50
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="View invoice timeline"
                >
                  <HiOutlineClock size={16} />
                  Timeline
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Smart Invoice Insights Modal */}
      <SmartInvoiceInsights 
        insights={invoiceInsights}
        isVisible={showInsights}
        onClose={() => setShowInsights(false)}
      />

      {/* Invoice Timeline Modal */}
      <InvoiceTimeline
        isVisible={showTimeline}
        onClose={() => setShowTimeline(false)}
        orderNumber={currentOrderNumber}
        orderId={currentOrderId}
      />
    </div>
  );
}
