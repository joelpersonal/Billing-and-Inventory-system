import fetch from 'node-fetch';

class AIService {
  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3.2';
  }

  async generateSearchSuggestions(query, context = 'general') {
    try {
      const systemPrompt = this.getSystemPrompt(context);
      const userPrompt = `User is searching for: "${query}". Provide 3-5 helpful search suggestions or actions they might want to take in the ${context} section of a business management system. Keep suggestions concise and actionable.`;

      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: `${systemPrompt}\n\n${userPrompt}`,
          stream: false,
          options: {
            temperature: 0.7,
            max_tokens: 200,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseSuggestions(data.response);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackSuggestions(query, context);
    }
  }

  getSystemPrompt(context) {
    const prompts = {
      inventory: `You are an AI assistant for a business inventory management system called Billfinity. Help users with inventory-related searches, product management, stock tracking, and inventory operations.`,
      billing: `You are an AI assistant for a billing and invoicing system called Billfinity. Help users with invoice generation, payment tracking, customer billing, and financial operations.`,
      reports: `You are an AI assistant for business analytics and reporting in Billfinity. Help users with data analysis, report generation, business insights, and performance metrics.`,
      settings: `You are an AI assistant for system settings and configuration in Billfinity. Help users with system preferences, user management, business configuration, and administrative tasks.`,
      general: `You are an AI assistant for Billfinity, a comprehensive business management system. Help users navigate and use inventory management, billing, reporting, and system features.`
    };

    return prompts[context] || prompts.general;
  }

  parseSuggestions(response) {
    try {
      // Parse the AI response and extract suggestions
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
      console.error('Error parsing AI suggestions:', error);
      return this.getDefaultSuggestions();
    }
  }

  getFallbackSuggestions(query, context) {
    const fallbacks = {
      inventory: [
        { text: 'Add new product to inventory', type: 'action', icon: '➕' },
        { text: 'Check low stock items', type: 'filter', icon: '⚠️' },
        { text: 'View product categories', type: 'view', icon: '📂' },
        { text: 'Update stock quantities', type: 'action', icon: '📝' }
      ],
      billing: [
        { text: 'Create new invoice', type: 'action', icon: '📄' },
        { text: 'View pending payments', type: 'filter', icon: '💰' },
        { text: 'Generate customer report', type: 'action', icon: '📊' },
        { text: 'Send invoice via email', type: 'action', icon: '📧' }
      ],
      reports: [
        { text: 'Generate sales report', type: 'action', icon: '📈' },
        { text: 'View inventory analytics', type: 'view', icon: '📊' },
        { text: 'Export data to PDF', type: 'action', icon: '📄' },
        { text: 'Check business performance', type: 'view', icon: '🎯' }
      ],
      settings: [
        { text: 'Update business information', type: 'action', icon: '🏢' },
        { text: 'Manage user accounts', type: 'action', icon: '👥' },
        { text: 'Configure system preferences', type: 'action', icon: '⚙️' },
        { text: 'Set up notifications', type: 'action', icon: '🔔' }
      ]
    };

    return fallbacks[context] || fallbacks.inventory;
  }

  getDefaultSuggestions() {
    return [
      { text: 'Search products by name or SKU', type: 'tip', icon: '🔍' },
      { text: 'Filter by category or status', type: 'tip', icon: '🏷️' },
      { text: 'View recent activities', type: 'action', icon: '📋' },
      { text: 'Generate reports', type: 'action', icon: '📊' }
    ];
  }

  async checkOllamaConnection() {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      console.error('Ollama connection check failed:', error);
      return false;
    }
  }
}

export default new AIService();