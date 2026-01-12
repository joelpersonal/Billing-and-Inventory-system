import { useState, useEffect } from 'react';
import { HiMicrophone, HiSpeakerWave, HiEye, HiEyeSlash } from 'react-icons/hi2';
import VoiceAssistant from './VoiceAssistant';

export default function VoiceAssistedBilling({ 
  cartItems = [], 
  onAddItem, 
  onRemoveItem, 
  onUpdateQuantity, 
  onClearAll,
  onShowTotal,
  products = []
}) {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastAction, setLastAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceCommand = async (command) => {
    setIsProcessing(true);
    setLastAction(command);
    
    try {
      switch (command.action) {
        case 'addItem':
          await handleAddItem(command.data);
          break;
          
        case 'removeItem':
          await handleRemoveItem(command.data);
          break;
          
        case 'updateQuantity':
          await handleUpdateQuantity(command.data);
          break;
          
        case 'clearAll':
          if (onClearAll) {
            onClearAll();
          }
          break;
          
        case 'showTotal':
          if (onShowTotal) {
            onShowTotal();
          }
          break;
          
        case 'finishInvoice':
          console.log('Finishing invoice...');
          break;
          
        default:
          console.log('Unknown voice command:', command);
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddItem = async (data) => {
    const { name, quantity, unit } = data;
    
    console.log('🎤 Voice ADD command received:', { name, quantity, unit });
    
    // For voice commands, always create items that need manual price setting
    // This is simpler and more reliable than trying to match inventory prices
    const voiceItem = {
      _id: `voice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      sku: `VOICE-${Date.now()}`,
      category: 'Voice Added',
      price: 0, // Always start with 0 - user will set price manually
      quantity: Number(quantity),
      unit: unit || 'pieces',
      isVoiceAdded: true,
      description: `Added via voice command: "${name}"`
    };
    
    console.log('🛒 Creating voice item for manual pricing:', voiceItem);
    
    if (onAddItem) {
      onAddItem(voiceItem);
    }
  };

  const handleRemoveItem = (data) => {
    const { name, quantity } = data;
    
    console.log('🗑️ Voice REMOVE command received:', { name, quantity });
    console.log('🛒 Current cart items:', cartItems.map(item => ({ name: item.name, id: item._id, quantity: item.quantity })));
    
    // Find item in cart by name matching - improved matching logic
    const cartItem = cartItems.find(item => {
      const itemNameLower = item.name.toLowerCase().trim();
      const searchNameLower = name.toLowerCase().trim();
      
      // Try different matching strategies
      const exactMatch = itemNameLower === searchNameLower;
      const containsMatch = itemNameLower.includes(searchNameLower) || searchNameLower.includes(itemNameLower);
      
      // Word-based matching for better flexibility
      const itemWords = itemNameLower.split(/\s+/).filter(word => word.length > 1);
      const searchWords = searchNameLower.split(/\s+/).filter(word => word.length > 1);
      
      const wordMatch = itemWords.some(itemWord => 
        searchWords.some(searchWord => 
          itemWord.includes(searchWord) || searchWord.includes(itemWord) ||
          itemWord === searchWord
        )
      );
      
      console.log(`🔍 Checking "${item.name}" vs "${name}":`, { 
        exactMatch, 
        containsMatch, 
        wordMatch,
        itemWords,
        searchWords
      });
      
      return exactMatch || containsMatch || wordMatch;
    });
    
    if (cartItem) {
      console.log('✅ Found cart item to remove:', cartItem);
      
      if (quantity && cartItem.quantity > quantity) {
        // Reduce quantity
        console.log(`📉 Reducing quantity from ${cartItem.quantity} to ${cartItem.quantity - quantity}`);
        if (onUpdateQuantity) {
          onUpdateQuantity(cartItem._id, cartItem.quantity - quantity);
        }
      } else {
        // Remove entire item
        console.log('🗑️ Removing entire item from cart');
        if (onRemoveItem) {
          onRemoveItem(cartItem._id);
        }
      }
    } else {
      console.log('❌ Item not found in cart for removal');
      console.log('🔍 Available cart items:', cartItems.map(item => item.name));
      console.log('🔍 Search term was:', name);
      
      // Try a more lenient search as fallback
      const fallbackItem = cartItems.find(item => {
        const itemName = item.name.toLowerCase();
        const searchName = name.toLowerCase();
        
        // Check if any word from search appears in item name
        const searchWords = searchName.split(/\s+/);
        return searchWords.some(word => word.length > 2 && itemName.includes(word));
      });
      
      if (fallbackItem) {
        console.log('🔄 Found fallback match:', fallbackItem.name);
        if (onRemoveItem) {
          onRemoveItem(fallbackItem._id);
        }
      }
    }
  };

  const handleUpdateQuantity = (data) => {
    const { name, quantity, unit } = data;
    
    console.log('📝 Voice UPDATE command received:', { name, quantity, unit });
    
    // Find item in cart
    const cartItem = cartItems.find(item => {
      const itemNameLower = item.name.toLowerCase();
      const searchNameLower = name.toLowerCase();
      
      return itemNameLower.includes(searchNameLower) || searchNameLower.includes(itemNameLower);
    });
    
    if (cartItem) {
      console.log('✅ Found cart item to update:', cartItem);
      
      if (onUpdateQuantity) {
        onUpdateQuantity(cartItem._id, quantity, unit);
      }
    } else {
      console.log('❌ Item not found in cart for update');
    }
  };

  const getVoiceCommands = () => [
    "Add sugar",
    "Add 2 rice", 
    "Add milk",
    "Remove sugar",
    "Change rice to 3",
    "Clear all items",
    "Show total",
    "Finish invoice"
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <HiMicrophone className="text-blue-600" size={24} />
            <h3 className="font-semibold text-gray-800">Voice-Assisted Billing</h3>
          </div>
          
          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <span className="text-sm">Processing...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white/50"
            title={isVisible ? "Hide voice assistant" : "Show voice assistant"}
          >
            {isVisible ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
          </button>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isVoiceEnabled}
              onChange={(e) => setIsVoiceEnabled(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable Voice</span>
          </label>
        </div>
      </div>

      {/* Voice Assistant */}
      {isVisible && (
        <div className="space-y-4">
          <VoiceAssistant
            onCommand={handleVoiceCommand}
            isActive={isVoiceEnabled}
            context="billing"
          />
          
          {/* Last Action Display */}
          {lastAction && (
            <div className="bg-white/70 rounded-lg p-3 border border-blue-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Last Voice Command:</h4>
              <div className="text-sm">
                <p className="text-gray-600 italic">"{lastAction.originalCommand}"</p>
                <p className="text-blue-600 font-medium mt-1">
                  Action: {lastAction.action} - {lastAction.feedback}
                </p>
              </div>
            </div>
          )}
          
          {/* Voice Commands Help */}
          <div className="bg-white/70 rounded-lg p-3 border border-blue-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Voice Commands:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
              {getVoiceCommands().map((command, index) => (
                <div key={index} className="flex items-center gap-2">
                  <HiSpeakerWave size={12} className="text-blue-500" />
                  <span>"{command}"</span>
                </div>
              ))}
            </div>
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <strong className="text-blue-800">💡 Manual Pricing Mode</strong>
              <div className="text-blue-700 mt-1">
                Voice commands add items with price $0. Set the price manually in the cart.
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Minimized View */}
      {!isVisible && isVoiceEnabled && (
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 text-blue-600">
            <HiMicrophone size={16} />
            <span className="text-sm">Voice Assistant Active</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}