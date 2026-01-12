const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Create headers with auth token
  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData) {
    return this.apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getProfile() {
    return this.apiCall('/auth/profile');
  }

  // Dashboard endpoints
  async getDashboardData() {
    const [
      totalProducts,
      stockValue,
      todaysSales,
      lowStock,
      salesRevenue,
      productCategories
    ] = await Promise.all([
      this.apiCall('/dashboard/total-products'),
      this.apiCall('/dashboard/stock-value'),
      this.apiCall('/dashboard/todays-sales'),
      this.apiCall('/dashboard/low-stock'),
      this.apiCall('/dashboard/sales-revenue'),
      this.apiCall('/dashboard/product-categories')
    ]);

    return {
      totalProducts: totalProducts.data,
      stockValue: stockValue.data,
      todaysSales: todaysSales.data,
      lowStock: lowStock.data,
      salesRevenue: salesRevenue.data,
      productCategories: productCategories.data
    };
  }

  // Product endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return this.apiCall(endpoint);
  }

  async getProduct(id) {
    return this.apiCall(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id, productData) {
    return this.apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id) {
    return this.apiCall(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // Order endpoints
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
    return this.apiCall(endpoint);
  }

  async getOrder(id) {
    return this.apiCall(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async updateOrderStatus(id, status) {
    return this.apiCall(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  async getInvoiceInsights(orderId, cartItems) {
    return this.apiCall(`/orders/${orderId}/insights`, {
      method: 'POST',
      body: JSON.stringify({ cartItems })
    });
  }

  // Reorder endpoints
  async getReorders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/reorders${queryString ? `?${queryString}` : ''}`;
    return this.apiCall(endpoint);
  }

  async getReorderStats() {
    return this.apiCall('/reorders/stats');
  }

  async updateReorderStatus(id, status, updates = {}) {
    return this.apiCall(`/reorders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...updates })
    });
  }

  async createManualReorder(productId, quantity, notes = '') {
    return this.apiCall('/reorders/manual', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, notes })
    });
  }

  async checkAutoReorderTriggers() {
    return this.apiCall('/reorders/check-triggers', {
      method: 'POST'
    });
  }

  // Health check
  async healthCheck() {
    return this.apiCall('/health');
  }

  // PDF generation endpoints
  async generateBusinessReport(businessInfo) {
    const response = await fetch(`${this.baseURL}/pdf/business-report`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ businessInfo })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to generate PDF report');
    }

    return response.blob();
  }

  async generateInvoicePDF(cartItems, customerInfo, businessInfo, totals, orderId = null) {
    const response = await fetch(`${this.baseURL}/pdf/generate-invoice`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ cartItems, customerInfo, businessInfo, totals, orderId })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to generate invoice PDF');
    }

    return response.blob();
  }

  async emailInvoice(cartItems, customerInfo, businessInfo, totals, orderId = null) {
    const response = await fetch(`${this.baseURL}/pdf/email-invoice`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ cartItems, customerInfo, businessInfo, totals, orderId })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to send invoice email');
    }

    return response.json();
  }

  async generateInvoice(orderId, businessInfo) {
    const response = await fetch(`${this.baseURL}/pdf/invoice/${orderId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ businessInfo })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to generate invoice PDF');
    }

    return response.blob();
  }

  async previewBusinessReport(businessInfo) {
    const response = await fetch(`${this.baseURL}/pdf/business-report/preview`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ businessInfo })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to generate PDF preview');
    }

    return response.blob();
  }

  // Test connection
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // AI endpoints
  async getAISearchSuggestions(query, context = 'general') {
    return this.apiCall(`/ai/search-suggestions?query=${encodeURIComponent(query)}&context=${context}`);
  }

  async getAIStatus() {
    return this.apiCall('/ai/status');
  }

  // Invoice Timeline endpoints
  async getInvoiceTimeline(orderId) {
    return this.apiCall(`/timeline/order/${orderId}`);
  }

  async getTimelineByOrderNumber(orderNumber) {
    return this.apiCall(`/timeline/invoice/${orderNumber}`);
  }

  async addTimelineEvent(orderId, eventType, description, details = {}) {
    return this.apiCall(`/timeline/order/${orderId}/event`, {
      method: 'POST',
      body: JSON.stringify({ eventType, description, details })
    });
  }
}

export default new ApiService();