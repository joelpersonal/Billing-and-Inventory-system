import { useState, useEffect, useRef } from 'react';
import { HiMicrophone, HiStop, HiSpeakerWave, HiXMark } from 'react-icons/hi2';

export default function VoiceAssistant({ onCommand, isActive = false, context = 'billing' }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [lastCommand, setLastCommand] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && SpeechSynthesis) {
      setIsSupported(true);
      
      // Initialize Speech Recognition
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      // Initialize Speech Synthesis
      synthRef.current = SpeechSynthesis;

      // Event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setFeedback('Listening...');
        setShowTranscript(true);
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);

        if (finalTranscript) {
          processVoiceCommand(finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setFeedback(`Error: ${event.error}`);
        
        setTimeout(() => {
          setShowTranscript(false);
          setFeedback('');
        }, 3000);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (!transcript) {
          setFeedback('No speech detected');
          setTimeout(() => {
            setShowTranscript(false);
            setFeedback('');
          }, 2000);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const processVoiceCommand = (command) => {
    setLastCommand(command);
    const parsedCommand = parseVoiceCommand(command);
    
    if (parsedCommand.success) {
      setFeedback(`✅ ${parsedCommand.feedback}`);
      speak(parsedCommand.feedback);
      
      // Send command to parent component
      if (onCommand) {
        onCommand(parsedCommand);
      }
    } else {
      setFeedback(`❌ ${parsedCommand.error}`);
      speak(parsedCommand.error);
    }

    // Hide transcript after 4 seconds
    setTimeout(() => {
      setShowTranscript(false);
      setFeedback('');
    }, 4000);
  };

  const parseVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // More flexible patterns to match your inventory
    const patterns = {
      // Flexible add patterns - now supports simpler commands
      addItem: [
        // Original pattern: "add 2 packets of sugar"
        /^add\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten|\d+\.?\d*)\s*(kg|grams?|packets?|bottles?|pieces?|items?|boxes?|cans?|liters?|ml|units?)?\s*(?:of\s+)?(.+)$/i,
        
        // Simple pattern: "add sugar" (defaults to quantity 1)
        /^add\s+(.+)$/i,
        
        // Alternative patterns: "get sugar", "take sugar"
        /^(?:get|take)\s+(.+)$/i,
        
        // Pattern with quantity first: "2 sugar", "5 rice"
        /^(\d+|one|two|three|four|five|six|seven|eight|nine|ten|\d+\.?\d*)\s*(.+)$/i
      ],
      
      // Remove item patterns
      removeItem: [
        /^(?:remove|delete)\s+(?:(\d+)\s*(?:kg|grams?|packets?|bottles?|pieces?|items?|boxes?|cans?|liters?|ml|units?)?\s*(?:of\s+)?)?(.+)$/i,
        /^(?:remove|delete)\s+(.+)$/i
      ],
      
      // Update quantity patterns
      updateQuantity: [
        /^(?:change|update)\s+(.+?)\s+(?:to|quantity\s+to)\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten|\d+\.?\d*)\s*(kg|grams?|packets?|bottles?|pieces?|items?|boxes?|cans?|liters?|ml|units?)?$/i,
        /^(?:set|make)\s+(.+?)\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten|\d+\.?\d*)\s*(kg|grams?|packets?|bottles?|pieces?|items?|boxes?|cans?|liters?|ml|units?)?$/i
      ],
      
      // Clear all patterns
      clearAll: /^(?:clear|remove|delete)\s+(?:all|everything)$/i,
      
      // Show total patterns
      showTotal: /^(?:show|what'?s|calculate|get)\s+(?:the\s+)?total$/i,
      
      // Finish invoice patterns
      finishInvoice: /^(?:finish|complete|done|end)\s*(?:invoice|billing)?$/i
    };

    // Helper function to convert word numbers to digits
    const wordToNumber = (word) => {
      const numbers = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
      };
      return numbers[word.toLowerCase()] || parseFloat(word) || 1;
    };

    // Check add item patterns
    for (const pattern of patterns.addItem) {
      if (pattern.test(lowerCommand)) {
        const match = lowerCommand.match(pattern);
        
        if (match.length === 2) {
          // Simple "add sugar" pattern
          return {
            success: true,
            action: 'addItem',
            data: {
              name: match[1].trim(),
              quantity: 1, // Default quantity
              unit: 'pieces' // Default unit
            },
            feedback: `Added 1 ${match[1].trim()}`,
            originalCommand: command
          };
        } else if (match.length >= 4) {
          // Full pattern "add 2 packets of sugar"
          const quantity = wordToNumber(match[1]);
          const unit = match[2] || 'pieces';
          const itemName = match[3].trim();
          
          return {
            success: true,
            action: 'addItem',
            data: {
              name: itemName,
              quantity: quantity,
              unit: unit
            },
            feedback: `Added ${quantity} ${unit} of ${itemName}`,
            originalCommand: command
          };
        } else if (match.length === 3) {
          // Pattern "2 sugar" or "5 rice"
          const quantity = wordToNumber(match[1]);
          const itemName = match[2].trim();
          
          return {
            success: true,
            action: 'addItem',
            data: {
              name: itemName,
              quantity: quantity,
              unit: 'pieces'
            },
            feedback: `Added ${quantity} ${itemName}`,
            originalCommand: command
          };
        }
      }
    }
    
    // Check remove item patterns
    for (const pattern of patterns.removeItem) {
      if (pattern.test(lowerCommand)) {
        const match = lowerCommand.match(pattern);
        
        if (match.length === 2) {
          // Simple "remove sugar"
          return {
            success: true,
            action: 'removeItem',
            data: {
              name: match[1].trim(),
              quantity: null
            },
            feedback: `Removed ${match[1].trim()}`,
            originalCommand: command
          };
        } else if (match.length >= 3) {
          // "remove 2 sugar"
          const quantity = match[1] ? wordToNumber(match[1]) : null;
          const itemName = match[2].trim();
          
          return {
            success: true,
            action: 'removeItem',
            data: {
              name: itemName,
              quantity: quantity
            },
            feedback: quantity ? `Removed ${quantity} of ${itemName}` : `Removed ${itemName}`,
            originalCommand: command
          };
        }
      }
    }
    
    // Check other patterns (update, clear, total, finish)
    for (const pattern of patterns.updateQuantity) {
      if (pattern.test(lowerCommand)) {
        const match = lowerCommand.match(pattern);
        const itemName = match[1].trim();
        const quantity = wordToNumber(match[2]);
        const unit = match[3] || 'pieces';
        
        return {
          success: true,
          action: 'updateQuantity',
          data: {
            name: itemName,
            quantity: quantity,
            unit: unit
          },
          feedback: `Updated ${itemName} to ${quantity} ${unit}`,
          originalCommand: command
        };
      }
    }
    
    if (patterns.clearAll.test(lowerCommand)) {
      return {
        success: true,
        action: 'clearAll',
        data: {},
        feedback: 'Cleared all items',
        originalCommand: command
      };
    }
    
    if (patterns.showTotal.test(lowerCommand)) {
      return {
        success: true,
        action: 'showTotal',
        data: {},
        feedback: 'Showing total amount',
        originalCommand: command
      };
    }
    
    if (patterns.finishInvoice.test(lowerCommand)) {
      return {
        success: true,
        action: 'finishInvoice',
        data: {},
        feedback: 'Finishing invoice',
        originalCommand: command
      };
    }

    // If no pattern matches
    return {
      success: false,
      error: "I didn't understand that command. Try saying 'Add sugar' or 'Add 2 sugar'",
      originalCommand: command
    };
  };

  const speak = (text) => {
    if (synthRef.current && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a female voice if available
      const voices = synthRef.current.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('samantha')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setFeedback('Error starting voice recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const closeTranscript = () => {
    setShowTranscript(false);
    setFeedback('');
    setTranscript('');
  };

  if (!isSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 text-sm">
          Voice recognition is not supported in your browser. 
          Please use Chrome, Edge, or Safari for voice features.
        </p>
      </div>
    );
  }

  if (!isActive) {
    return null;
  }

  return (
    <div className="relative">
      {/* Voice Control Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          disabled={!isSupported}
        >
          {isListening ? (
            <>
              <HiStop size={20} />
              <span>Stop Listening</span>
            </>
          ) : (
            <>
              <HiMicrophone size={20} />
              <span>Voice Command</span>
            </>
          )}
        </button>

        {/* Voice Feedback Button */}
        <button
          onClick={() => speak("Voice assistant is ready. Say 'Add 2 packets of sugar' to add items.")}
          className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200"
          title="Test voice feedback"
        >
          <HiSpeakerWave size={18} />
          <span>Test Voice</span>
        </button>
      </div>

      {/* Transcript and Feedback Display */}
      {showTranscript && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-96">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-800">Voice Command</h4>
            <button
              onClick={closeTranscript}
              className="text-gray-400 hover:text-gray-600"
            >
              <HiXMark size={18} />
            </button>
          </div>
          
          {transcript && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">You said:</p>
              <p className="text-gray-800 bg-gray-50 p-2 rounded italic">
                "{transcript}"
              </p>
              {confidence > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Confidence: {Math.round(confidence * 100)}%
                </p>
              )}
            </div>
          )}
          
          {feedback && (
            <div className="mb-2">
              <p className="text-sm font-medium text-blue-600">{feedback}</p>
            </div>
          )}
          
          {isListening && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Listening for commands...</span>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-2 text-xs text-gray-500">
        <p>Try saying: "Add sugar", "Add 2 rice", "Remove milk", or "Show total"</p>
        <p className="text-blue-600 mt-1">💡 Items added via voice will need manual price setting</p>
      </div>
    </div>
  );
}