/**
 * Custom hook for managing AD connection
 */

import { useState, useCallback } from 'react';
import ldapService from '../services/ldapService.js';

export function useADConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState(null);

  const connect = useCallback(async (config) => {
    setIsConnecting(true);
    setError(null);

    try {
      await ldapService.connect(config);
      setIsConnected(true);
      setCredentials(config);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
      return { success: false, error: err.message };
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    ldapService.disconnect();
    setIsConnected(false);
    setCredentials(null);
    setError(null);
  }, []);

  const testConnection = useCallback(async () => {
    try {
      const result = await ldapService.testConnection();
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    credentials,
    connect,
    disconnect,
    testConnection
  };
}
