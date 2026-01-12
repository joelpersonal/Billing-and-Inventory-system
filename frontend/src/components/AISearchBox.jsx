import { useState, useEffect, useRef } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineSparkles, HiOutlineXMark } from 'react-icons/hi2';
import apiService from '../services/api';

export default function AISearchBox({ context = 'general', placeholder = 'Search with AI...' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.apiCall(
        `/ai/search-suggestions?query=${encodeURIComponent(searchQuery)}&context=${context}`
      );
      
      if (response.success) {
        setSuggestions(response.data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error);
      // Provide fallback suggestions when API fails
      setSuggestions(getFallbackSuggestions(searchQuery, context));
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback suggestions when API is not available
  const getFallbackSuggestions = (query, context) => {
    const queryLower = query.toLowerCase();
    
    const fallbackSuggestions = {
      inventory: [
        { text: 'Add new product to inventory', type: 'action', icon: '➕' },
        { text: 'Check low stock items', type: 'filter', icon: '⚠️' },
        { text: 'View product categories', type: 'view', icon: '📂' },
        { text: 'Update stock quantities', type: 'action', icon: '📝' },
        { text: 'Search products by SKU', type: 'search', icon: '🔍' }
      ],
      billing: [
        { text: 'Create new invoice', type: 'action', icon: '📄' },
        { text: 'View pending payments', type: 'filter', icon: '💰' },
        { text: 'Generate customer report', type: 'action', icon: '📊' },
        { text: 'Send invoice via email', type: 'action', icon: '📧' },
        { text: 'View invoice timeline', type: 'view', icon: '⏰' }
      ],
      reports: [
        { text: 'Generate sales report', type: 'action', icon: '📈' },
        { text: 'View inventory analytics', type: 'view', icon: '📊' },
        { text: 'Export data to PDF', type: 'action', icon: '📄' },
        { text: 'Check business performance', type: 'view', icon: '🎯' },
        { text: 'Customer buying patterns', type: 'view', icon: '👥' }
      ],
      settings: [
        { text: 'Update business information', type: 'action', icon: '🏢' },
        { text: 'Manage user accounts', type: 'action', icon: '👥' },
        { text: 'Configure system preferences', type: 'action', icon: '⚙️' },
        { text: 'Set up notifications', type: 'action', icon: '🔔' },
        { text: 'Configure tax settings', type: 'action', icon: '🧾' }
      ],
      general: [
        { text: 'View dashboard overview', type: 'view', icon: '📊' },
        { text: 'Search products by name', type: 'search', icon: '🔍' },
        { text: 'Create new invoice', type: 'action', icon: '📄' },
        { text: 'Check inventory levels', type: 'view', icon: '📦' },
        { text: 'Generate business reports', type: 'action', icon: '📈' }
      ]
    };

    const suggestions = fallbackSuggestions[context] || fallbackSuggestions.general;
    
    // Filter suggestions based on query
    if (query && query.length > 1) {
      return suggestions.filter(suggestion => 
        suggestion.text.toLowerCase().includes(queryLower)
      ).slice(0, 5);
    }
    
    return suggestions.slice(0, 5);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);

    // Debounce API calls
    clearTimeout(window.aiSearchTimeout);
    window.aiSearchTimeout = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    // You can add custom logic here to handle different suggestion types
    console.log('Selected suggestion:', suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    if (query.trim()) {
      fetchSuggestions(query);
    } else {
      // Show default suggestions
      fetchSuggestions('');
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="pl-10 pr-10 py-2 text-sm border border-purple-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400
                     bg-purple-50/50 placeholder-purple-400 w-64 transition-all duration-200"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600"
          >
            <HiOutlineXMark size={16} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <HiOutlineSparkles className="animate-spin" size={16} />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          ) : (
            <>
              {suggestions.length > 0 && (
                <div className="p-2 border-b border-purple-100">
                  <div className="flex items-center gap-2 text-xs text-purple-600 font-medium">
                    <HiOutlineSparkles size={12} />
                    <span>AI Suggestions</span>
                  </div>
                </div>
              )}
              
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-purple-50 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{suggestion.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm text-gray-800 font-medium">{suggestion.text}</div>
                      <div className="text-xs text-purple-600 capitalize">{suggestion.type}</div>
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}