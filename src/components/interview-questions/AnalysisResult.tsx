import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AnalysisResultProps {
  answer: string;
  onReset: () => void;
  isLoading: boolean;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  answer,
  onReset,
  isLoading,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    // You might want to add a toast notification here
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Analysis Result</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              disabled={isLoading}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onReset}
              disabled={isLoading}
              title="Start over"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;
