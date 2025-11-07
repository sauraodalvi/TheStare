import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ApiKeyFormProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  isVerifying: boolean;
  error: string | null;
  onVerify: () => Promise<void>;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  apiKey,
  setApiKey,
  isVerifying,
  error,
  onVerify,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onVerify();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4">Enter Your Gemini API Key</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Please enter your Gemini API key to continue. We don't store your API key on our servers.
      </p>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">Gemini API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            required
            className="w-full"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your API key is stored locally in your browser.
          </p>
        </div>

        <Button type="submit" disabled={isVerifying} className="w-full">
          {isVerifying ? 'Verifying...' : 'Continue'}
        </Button>
      </form>
    </div>
  );
};

export default ApiKeyForm;
