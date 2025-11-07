import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2, Copy, RotateCcw, Sparkles, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from 'react-markdown';

// Storage key for API key
const GEMINI_API_KEY_STORAGE_KEY = 'gemini_api_key';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const InterviewQuestionsPractice: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // State management
  const [apiKey, setApiKey] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [rememberKey, setRememberKey] = useState<boolean>(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const CHARACTER_LIMIT = 1000;

  // Load categories
  useEffect(() => {
    // Example categories - in a real app, you might fetch these from an API
    const exampleCategories: Category[] = [
      { id: 1, name: 'Product Strategy', description: 'Questions about product vision and strategy', icon: 'target' },
      { id: 2, name: 'Product Design', description: 'Questions about UX/UI and design', icon: 'palette' },
      { id: 3, name: 'Analytics', description: 'Questions about metrics and data analysis', icon: 'bar-chart' },
      { id: 4, name: 'Technical', description: 'Technical product management questions', icon: 'code' },
      { id: 5, name: 'Behavioral', description: 'Behavioral interview questions', icon: 'users' },
    ];
    
    setCategories(exampleCategories);
    
    // Set category from URL param if present
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
    }

    // Set question from URL param if present
    const questionParam = searchParams.get('question');
    if (questionParam) {
      setQuestion(decodeURIComponent(questionParam));
    }
  }, [searchParams]);

  // Check for stored API key on mount
  useEffect(() => {
    const storedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) ||
                     sessionStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
      verifyApiKey(storedKey, true);
    }
  }, []);

  const verifyApiKey = useCallback(async (key: string, silent: boolean = false): Promise<boolean> => {
    if (!key) return false;

    setIsVerifying(true);
    setError(null);

    try {
      // In a real app, you would verify the API key with your backend
      // For now, we'll just simulate a successful verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsVerified(true);
      setShowApiKeyInput(false);
      
      if (rememberKey) {
        localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key);
      } else {
        sessionStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key);
      }
      
      if (!silent) {
        toast({
          title: 'Success',
          description: 'API key verified successfully!',
        });
      }
      return true;
    } catch (err) {
      console.error('Error verifying API key:', err);
      setIsVerified(false);
      setShowApiKeyInput(true);
      
      if (!silent) {
        toast({
          title: 'Error',
          description: 'Failed to verify API key. Please check and try again.',
          variant: 'destructive',
        });
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [rememberKey, toast]);

  const handleVerifyClick = useCallback(async () => {
    await verifyApiKey(apiKey);
  }, [apiKey, verifyApiKey]);

  const clearApiKey = useCallback(() => {
    setApiKey('');
    setIsVerified(false);
    setShowApiKeyInput(true);
    localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
    sessionStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
    toast({
      title: 'API Key Cleared',
      description: 'Your API key has been cleared.',
    });
  }, [toast]);

  const askAI = useCallback(async () => {
    if (!question.trim() || !selectedCategory) {
      setError('Please select a category and enter a question.');
      return;
    }

    if (question.length > CHARACTER_LIMIT) {
      setError(`Question exceeds ${CHARACTER_LIMIT} character limit.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      setAnswer(`This is a mock response for the question: "${question}" in category "${selectedCategory}".\n\nIn a real implementation, this would be the AI-generated response.`);
    } catch (err) {
      console.error('Error generating answer:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [question, selectedCategory]);

  const copyToClipboard = useCallback(() => {
    if (!answer) return;
    
    navigator.clipboard.writeText(answer);
    toast({
      title: 'Copied to clipboard',
      description: 'The answer has been copied to your clipboard.',
    });
  }, [answer, toast]);

  const handleBackClick = useCallback(() => {
    navigate('/interview-questions');
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Practice Interview Questions | Stare"
        description="Practice answering interview questions with AI assistance"
        keywords="interview practice, mock interview, AI interview, job preparation"
      />
      
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Questions
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <Sparkles className="inline-block w-8 h-8 mr-2 text-primary" />
              AI Interview Practice
            </h1>
            <p className="text-muted-foreground mt-2">
              Get AI-powered answers to your interview questions.
            </p>
          </div>

          {/* API Key Section */}
          {!isVerified || showApiKeyInput ? (
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Gemini API Key</CardTitle>
                <CardDescription>
                  You need a Gemini API key to use this feature. Get one from{' '}
                  <a
                    href="https://ai.google.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                  .
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      disabled={isVerifying}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember-key"
                      checked={rememberKey}
                      onChange={(e) => setRememberKey(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="remember-key">Remember my API key</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleVerifyClick}
                      disabled={!apiKey.trim() || isVerifying}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify API Key'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>API Key Verified</CardTitle>
                <CardDescription>
                  Your API key has been verified and is ready to use.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={clearApiKey}>
                  Clear API Key
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Question Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>
                Enter your interview question and select a category.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your interview question here..."
                  rows={4}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {question.length}/{CHARACTER_LIMIT} characters
                </p>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={askAI}
                disabled={!question.trim() || !selectedCategory || isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Answer
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Answer Section */}
          {answer && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>AI-Generated Answer</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InterviewQuestionsPractice;
