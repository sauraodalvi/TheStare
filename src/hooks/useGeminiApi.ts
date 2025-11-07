import { useState, useEffect } from 'react';

const GEMINI_API_KEY_STORAGE_KEY = 'gemini_api_key';

export const useGeminiApi = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsVerified(true);
    }
  }, []);

  const verifyApiKey = async (key: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);
    
    try {
      // Simple validation - in a real app, you'd make an actual API call
      const isValid = typeof key === 'string' && key.length > 0;
      
      if (isValid) {
        localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key);
        setIsVerified(true);
        return true;
      } else {
        throw new Error('Invalid API key');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify API key');
      setIsVerified(false);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const removeApiKey = () => {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
    setApiKey('');
    setIsVerified(false);
  };

  return {
    apiKey,
    setApiKey,
    isVerified,
    isVerifying,
    error,
    verifyApiKey,
    removeApiKey,
  };
};

export default useGeminiApi;
