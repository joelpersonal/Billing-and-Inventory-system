// Voice Assistant Test Utilities

export const testVoiceSupport = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechSynthesis = window.speechSynthesis;
  
  return {
    speechRecognition: !!SpeechRecognition,
    speechSynthesis: !!SpeechSynthesis,
    isSupported: !!(SpeechRecognition && SpeechSynthesis),
    userAgent: navigator.userAgent,
    isHTTPS: window.location.protocol === 'https:',
    isLocalhost: window.location.hostname === 'localhost'
  };
};

export const testVoiceCommands = [
  {
    command: "Add 2 packets of sugar",
    expected: {
      action: "addItem",
      data: { name: "sugar", quantity: 2, unit: "packets" }
    }
  },
  {
    command: "Add 5 kg rice",
    expected: {
      action: "addItem", 
      data: { name: "rice", quantity: 5, unit: "kg" }
    }
  },
  {
    command: "Remove sugar",
    expected: {
      action: "removeItem",
      data: { name: "sugar" }
    }
  },
  {
    command: "Change rice to 3 kg",
    expected: {
      action: "updateQuantity",
      data: { name: "rice", quantity: 3, unit: "kg" }
    }
  },
  {
    command: "Clear all items",
    expected: {
      action: "clearAll",
      data: {}
    }
  },
  {
    command: "Show total",
    expected: {
      action: "showTotal",
      data: {}
    }
  }
];

export const simulateVoiceCommand = (command, onResult) => {
  // Simulate speech recognition result
  const mockEvent = {
    results: [{
      0: { 
        transcript: command, 
        confidence: 0.95 
      },
      isFinal: true
    }],
    resultIndex: 0
  };
  
  // This would normally be handled by the actual speech recognition
  if (onResult) {
    onResult(mockEvent);
  }
  
  return mockEvent;
};

export const getBrowserVoiceSupport = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome')) {
    return { browser: 'Chrome', support: 'Excellent', recommendation: 'Recommended' };
  } else if (userAgent.includes('edge')) {
    return { browser: 'Edge', support: 'Excellent', recommendation: 'Recommended' };
  } else if (userAgent.includes('safari')) {
    return { browser: 'Safari', support: 'Good', recommendation: 'Supported' };
  } else if (userAgent.includes('firefox')) {
    return { browser: 'Firefox', support: 'Limited', recommendation: 'Use Chrome/Edge for best experience' };
  } else {
    return { browser: 'Unknown', support: 'Unknown', recommendation: 'Use Chrome/Edge for best experience' };
  }
};

export const checkMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return { granted: true, message: 'Microphone access granted' };
  } catch (error) {
    return { 
      granted: false, 
      message: error.name === 'NotAllowedError' 
        ? 'Microphone access denied' 
        : 'Microphone not available' 
    };
  }
};

export const testSpeechSynthesis = (text = "Voice assistant is working correctly") => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    window.speechSynthesis.speak(utterance);
    return { success: true, message: 'Speech synthesis test started' };
  } else {
    return { success: false, message: 'Speech synthesis not supported' };
  }
};