import fetch from 'node-fetch';

class AIService {
  constructor() {
    this.huggingFaceToken = process.env.HUGGINGFACE_API_TOKEN;
    this.model = process.env.AI_MODEL || 'microsoft/DialoGPT-medium';
    this.baseUrl = 'https://api-inference.huggingface.co/models';
    
    // Alternative free models for different tasks
    this.models = {
      textGeneration: 'microsoft/DialoGPT-medium',
      textClassification: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
      questionAnswering: 'deepset/roberta-base-squad2',
      summarization: 'facebook/bart-large-cnn'
    };
  }

  async generateSearchSuggestions(query, context = 'general') {
    try {
      if (!this.huggingFaceToken) {
        console.warn('Hugging Face API token not configured, using fallback suggestions');
        return this.getFallbackSuggestions(query, context);
      }

      // Use Hugging Face's text generation model for smart suggestions
      const prompt = this.buildPrompt(query, context);
      const suggestions = await this.callHuggingFaceAPI(prompt, context);
      
      if (suggestions && suggestions.length > 0) {
        return this.parseSuggestions(suggestions, context);
      } else {
        return this.getFallbackSuggestions(query, context);
      }
    } catch (error) {
      console.error('Hugging Face AI Service Error:', error);
      return this.getFallbackSuggestions(query, context);
    }
  }

  buildPrompt(query, context) {
    const contextPrompts = {
      inventory: `You are helping with inventory management. User searched: "${query}". Suggest 3 helpful inventory actions:`,
      billing: `You are helping with billing and invoicing. User searched: "${query}". Suggest 3 helpful billing actions:`,
      reports: `You are helping with business reports. User searched: "${query}". Suggest 3 helpful report actions:`,
      settings: `You are helping with system settings. User searched: "${query}". Suggest 3 helpful settings actions:`,
      general: `You are helping with business management. User searched: "${query}". Suggest 3 helpful actions:`
    };

    return contextPrompts[context] || contextPrompts.general;
  }

  async callHuggingFaceAPI(prompt, context) {
    try {
      // Use a simple text generation approach
      const response = await fetch(`${this.baseUrl}/${this.models.textGeneration}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.huggingFaceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 150,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      if (Array.isArray(data) && data.length > 0) {
        return data[0].generated_text || data[0].text || '';
      } else if (data.generated_text) {
        return data.generated_text;
      }
      
      return '';
    } catch (error) {
      console.error('Hugging Face API call failed:', error);
      return '';
    }
  }

  parseSuggestions(aiResponse, context) {
    try {
      // Parse AI response and extract actionable suggestions
      const lines = aiResponse.split('\n').filter(line => line.trim());
      const suggestions = [];

      for (const line of lines) {
        const cleaned = line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim();
        if (cleaned && cleaned.length > 10 && suggestions.length < 5) {
          suggestions.push({
            text: cleaned,
            type: 'ai_suggestion',
            icon: this.getContextIcon(context)
          });
        }
      }

      // If AI didn't provide good suggestions, fall back to smart suggestions
      if (suggestions.length === 0) {
        return this.getFallbackSuggestions('', context);
      }

      return suggestions;
    } catch (error) {
      console.error('Error parsing AI suggestions:', error);
      return this.getFallbackSuggestions('', context);
    }
  }

  getContextIcon(context) {
    const icons = {
      inventory: '📦',
      billing: '💰',
      reports: '📊',
      settings: '⚙️',
      general: '🤖'
    };
    return icons[context] || '🤖';
  }

  getSystemPrompt(context) {
    const prompts = {
      inventory: `You are an AI assistant for a business inventory management system called Billfinity. Help users with inventory-related searches, product management, stock tracking, and inventory operations. Provide practical, actionable suggestions.`,
      billing: `You are an AI assistant for a billing and invoicing system called Billfinity. Help users with invoice generation, payment tracking, customer billing, and financial operations. Provide practical, actionable suggestions.`,
      reports: `You are an AI assistant for business analytics and reporting in Billfinity. Help users with data analysis, report generation, business insights, and performance metrics. Provide practical, actionable suggestions.`,
      settings: `You are an AI assistant for system settings and configuration in Billfinity. Help users with system preferences, user management, business configuration, and administrative tasks. Provide practical, actionable suggestions.`,
      general: `You are an AI assistant for Billfinity, a comprehensive business management system. Help users navigate and use inventory management, billing, reporting, and system features. Provide practical, actionable suggestions.`
    };

    return prompts[context] || prompts.general;
  }

  parseSuggestions(response) {
    try {
      // Parse the Claude response and extract suggestions
      const lines = response.split('\n').filter(line => line.trim());
      const suggestions = [];

      for (const line of lines) {
        const cleaned = line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim();
        if (cleaned && cleaned.length > 10 && suggestions.length < 5) {
          suggestions.push({
            text: cleaned,
            type: 'ai_suggestion',
            icon: '🤖'
          });
        }
      }

      return suggestions.length > 0 ? suggestions : this.getDefaultSuggestions();
    } catch (error) {
      console.error('Error parsing Claude suggestions:', error);
      return this.getDefaultSuggestions();
    }
  }

  getFallbackSuggestions(query, context) {
    const queryLower = query.toLowerCase();
    
    // Smart suggestions based on what user is searching for
    const smartSuggestions = {
      inventory: [
        // Product management
        { text: 'Add new product to inventory', type: 'action', icon: '➕', keywords: ['add', 'new', 'product', 'create'] },
        { text: 'Check low stock items', type: 'filter', icon: '⚠️', keywords: ['low', 'stock', 'alert', 'shortage'] },
        { text: 'View product categories', type: 'view', icon: '📂', keywords: ['category', 'categories', 'group'] },
        { text: 'Update stock quantities', type: 'action', icon: '📝', keywords: ['update', 'quantity', 'stock', 'edit'] },
        { text: 'Search products by SKU', type: 'search', icon: '🔍', keywords: ['sku', 'search', 'find', 'code'] },
        { text: 'Export inventory report', type: 'action', icon: '📊', keywords: ['export', 'report', 'download'] },
        { text: 'Set reorder points', type: 'action', icon: '🔄', keywords: ['reorder', 'minimum', 'threshold'] },
        { text: 'Bulk import products', type: 'action', icon: '📥', keywords: ['import', 'bulk', 'upload', 'csv'] }
      ],
      billing: [
        // Invoice and billing
        { text: 'Create new invoice', type: 'action', icon: '📄', keywords: ['invoice', 'create', 'new', 'bill'] },
        { text: 'View pending payments', type: 'filter', icon: '💰', keywords: ['payment', 'pending', 'due', 'outstanding'] },
        { text: 'Generate customer report', type: 'action', icon: '📊', keywords: ['customer', 'report', 'generate'] },
        { text: 'Send invoice via email', type: 'action', icon: '📧', keywords: ['email', 'send', 'invoice'] },
        { text: 'View invoice timeline', type: 'view', icon: '⏰', keywords: ['timeline', 'history', 'audit', 'track'] },
        { text: 'Apply discount to invoice', type: 'action', icon: '🏷️', keywords: ['discount', 'coupon', 'offer'] },
        { text: 'Print invoice PDF', type: 'action', icon: '🖨️', keywords: ['print', 'pdf', 'download'] },
        { text: 'Track payment status', type: 'view', icon: '📈', keywords: ['status', 'track', 'payment'] }
      ],
      reports: [
        // Analytics and reports
        { text: 'Generate sales report', type: 'action', icon: '📈', keywords: ['sales', 'report', 'revenue'] },
        { text: 'View inventory analytics', type: 'view', icon: '📊', keywords: ['analytics', 'inventory', 'stats'] },
        { text: 'Export data to PDF', type: 'action', icon: '📄', keywords: ['export', 'pdf', 'download'] },
        { text: 'Check business performance', type: 'view', icon: '🎯', keywords: ['performance', 'business', 'metrics'] },
        { text: 'Customer buying patterns', type: 'view', icon: '👥', keywords: ['customer', 'pattern', 'behavior'] },
        { text: 'Profit margin analysis', type: 'view', icon: '💹', keywords: ['profit', 'margin', 'analysis'] },
        { text: 'Monthly revenue trends', type: 'view', icon: '📅', keywords: ['monthly', 'revenue', 'trend'] },
        { text: 'Top selling products', type: 'view', icon: '🏆', keywords: ['top', 'selling', 'popular', 'best'] }
      ],
      settings: [
        // System settings
        { text: 'Update business information', type: 'action', icon: '🏢', keywords: ['business', 'company', 'info'] },
        { text: 'Manage user accounts', type: 'action', icon: '👥', keywords: ['user', 'account', 'manage', 'staff'] },
        { text: 'Configure system preferences', type: 'action', icon: '⚙️', keywords: ['settings', 'preferences', 'config'] },
        { text: 'Set up notifications', type: 'action', icon: '🔔', keywords: ['notification', 'alert', 'email'] },
        { text: 'Configure tax settings', type: 'action', icon: '🧾', keywords: ['tax', 'gst', 'rate'] },
        { text: 'Setup email templates', type: 'action', icon: '📧', keywords: ['email', 'template', 'customize'] },
        { text: 'Backup database', type: 'action', icon: '💾', keywords: ['backup', 'export', 'save'] },
        { text: 'Change password', type: 'action', icon: '🔐', keywords: ['password', 'security', 'change'] }
      ],
      general: [
        // General features
        { text: 'View dashboard overview', type: 'view', icon: '📊', keywords: ['dashboard', 'overview', 'summary'] },
        { text: 'Search products by name', type: 'search', icon: '🔍', keywords: ['search', 'product', 'find'] },
        { text: 'Create new invoice', type: 'action', icon: '📄', keywords: ['invoice', 'bill', 'create'] },
        { text: 'Check inventory levels', type: 'view', icon: '📦', keywords: ['inventory', 'stock', 'level'] },
        { text: 'Generate business reports', type: 'action', icon: '📈', keywords: ['report', 'analytics', 'business'] },
        { text: 'Manage customer data', type: 'action', icon: '👤', keywords: ['customer', 'client', 'manage'] },
        { text: 'Setup automated reorders', type: 'action', icon: '🔄', keywords: ['reorder', 'automatic', 'setup'] },
        { text: 'View recent activities', type: 'view', icon: '📋', keywords: ['recent', 'activity', 'history'] }
      ]
    };

    const suggestions = smartSuggestions[context] || smartSuggestions.general;
    
    // If user typed something, filter suggestions based on keywords
    if (query && query.length > 1) {
      const filtered = suggestions.filter(suggestion => 
        suggestion.keywords.some(keyword => 
          keyword.includes(queryLower) || queryLower.includes(keyword)
        ) || suggestion.text.toLowerCase().includes(queryLower)
      );
      
      if (filtered.length > 0) {
        return filtered.slice(0, 5);
      }
    }
    
    // Return default suggestions for the context
    return suggestions.slice(0, 5);
  }

  getDefaultSuggestions() {
    return [
      { text: 'Search products by name or SKU', type: 'tip', icon: '🔍' },
      { text: 'Create new invoice with timeline', type: 'action', icon: '📄' },
      { text: 'Check low stock alerts', type: 'filter', icon: '⚠️' },
      { text: 'View business analytics', type: 'view', icon: '📊' },
      { text: 'Generate sales reports', type: 'action', icon: '📈' }
    ];
  }

  async checkAIConnection() {
    try {
      if (!this.huggingFaceToken) {
        return { connected: false, provider: 'fallback', message: 'No API token configured' };
      }

      // Test with a simple request to Hugging Face
      const response = await fetch(`${this.baseUrl}/${this.models.textGeneration}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.huggingFaceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: 'Hello',
          parameters: { max_length: 10 }
        })
      });

      if (response.ok) {
        return { connected: true, provider: 'huggingface', message: 'Connected to Hugging Face API' };
      } else {
        return { connected: false, provider: 'fallback', message: `API error: ${response.status}` };
      }
    } catch (error) {
      console.error('Hugging Face connection check failed:', error);
      return { connected: false, provider: 'fallback', message: error.message };
    }
  }
}

export default new AIService();