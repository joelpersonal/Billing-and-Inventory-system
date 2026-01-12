import { useState, useEffect } from 'react';
import apiService from '../services/api';

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      try {
        const connected = await apiService.testConnection();
        setIsConnected(connected);
      } catch (error) {
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
    
    // Check connection every 10 seconds
    const interval = setInterval(checkConnection, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-sm">Checking...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
      <span className="text-sm">{isConnected ? 'Backend Connected' : 'Backend Offline'}</span>
    </div>
  );
}