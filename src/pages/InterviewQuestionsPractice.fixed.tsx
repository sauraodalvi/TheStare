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
const CHARACTER_LIMIT = 1000;

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

  // Initialize categories
  useEffect(() => {
    // In a real app, you would fetch these from an API
    const exampleCategories: Category[] = [
      { id: 1, name: 'Product Management', description: 'Product strategy and execution', icon: '📊' },
      { id: 2, name: 'Technical', description: 'Technical concepts and system design', icon: '💻' },
      { id: 3, name: 'Behavioral', description: 'Past experiences and teamwork', icon: '👥' },
      { id: 4, name: 'Case Study', description: 'Product case studies', icon: '📈' },
      { id: 5, name: 'Estimation', description: 'Market and metrics estimation', icon: '📊' },
    ];
    
    setCategories(exampleCategories);
    
    // Set category from URL param if present
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
    }
  }, [searchParams]);

  // Verify API key function
  const verifyApiKey = useCallback(async (key: string, silent: boolean = false): Promise<boolean> => {
    if (!key) return false;

    setIsVerifying(true);
    setError(null);

    try {
      // Simulate API verification
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

  // Check for stored API key on mount
  useEffect(() => {
    const storedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) ||
                     sessionStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
      verifyApiKey(storedKey, true);
    }
  }, [verifyApiKey]);

  // Handle category selection
  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    setQuestion(`What is ${value} and how does it work?`);
  };

  // Copy answer to clipboard
  const copyToClipboard = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    toast({
      title: 'Copied!',
      description: 'Answer copied to clipboard',
    });
  };

  // Ask another question
  const askAnotherQuestion = () => {
    setQuestion('');
    setAnswer(null);
    setError(null);
  };

  // Handle asking the AI
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
      const key = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) || 
                 sessionStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
      
      if (!key) {
        throw new Error('No API key found. Please provide a Gemini API key.');
      }

      // Create the system prompt with category-specific guidance
      let categoryGuidance = '';
      if (selectedCategory === 'RCA') {
        categoryGuidance = 'For Root Cause Analysis questions, focus on systematic debugging methodology...';
      } else if (selectedCategory === 'Others') {
        categoryGuidance = 'For general PM questions, adapt your answer to the specific topic...';
      } else {
        categoryGuidance = 'Relevant PM frameworks to apply (e.g., CIRCLES, AARM, STAR)';
      }

      const systemPrompt = `You are an experienced Product Manager interviewer helping candidates prepare for PM interviews.

Category: ${selectedCategory}
Question: ${question}

Please provide a comprehensive, structured answer...`;

      // Call Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent`, {
        method: 'POST',
        headers: {
          'x-goog-api-key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: systemPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Failed to generate answer');
      }

      const data = await response.json();
      const generatedAnswer = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedAnswer) {
        throw new Error('No answer generated. Please try again.');
      }

      setAnswer(generatedAnswer);
      
      toast({
        title: 'Answer Generated',
        description: 'Your AI-powered answer is ready!',
      });
    } catch (err: any) {
      console.error('Error generating answer:', err);
      setError(err.message || 'Failed to generate answer. Please try again.');
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to generate answer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [question, selectedCategory, toast]);

  // Update question answer in database
  const updateQuestionAnswer = async (id: number, data: any) => {
    // In a real app, you would make an API call to update the question answer
    console.log('Updating question answer:', { id, data });
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  };

  // Handle verify button click
  const handleVerifyClick = useCallback(async () => {
    await verifyApiKey(apiKey);
  }, [apiKey, verifyApiKey]);

  // Clear API key
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

  // Suppress message channel errors from browser extensions
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('message channel closed')) {
        event.preventDefault();
        return true;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('message channel closed')) {
        event.preventDefault();
        return true;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Interview Questions Practice | STARE"
        description="Practice common interview questions with AI-powered feedback"
      />
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Interview Questions
          </Button>
          
          <h1 className="text-3xl font-bold mb-6">Interview Question Practice</h1>
          
          {!isVerified ? (
            <Card>
              <CardHeader>
                <CardTitle>Enter Your API Key</CardTitle>
                <CardDescription>
                  Please enter your API key to access the interview question practice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
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
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleVerifyClick}
                  disabled={!apiKey || isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : 'Verify API Key'}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Practice Interview Questions</CardTitle>
                  <CardDescription>
                    Enter a question or select a category to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Your Question</Label>
                      <Textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your interview question here..."
                        className="min-h-[100px]"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Or select a category</Label>
                      <Select onValueChange={handleCategorySelect} disabled={isLoading}>
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
                    
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={askAI} 
                        disabled={!question || isLoading}
                        className="w-full sm:w-auto"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Thinking...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Get Answer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {answer && (
                <Card className="border-green-200 dark:border-green-900">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-green-600 dark:text-green-400">
                        Answer
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={copyToClipboard}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={askAnotherQuestion}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Ask Another
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
              )}

              {/* Help Section */}
              <div className="mt-8 bg-muted/30 rounded-lg border border-border/50 p-6">
                <h3 className="text-lg font-medium mb-3">Tips for Better Answers</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Be specific with your questions for more targeted answers</li>
                  <li>• Select the appropriate category to get framework-specific guidance</li>
                  <li>• Use the generated answers as a starting point and personalize them</li>
                  <li>• Practice articulating the answers out loud to build confidence</li>
                </ul>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/interview-questions')}
                  className="mt-4"
                >
                  Browse Sample Questions
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InterviewQuestionsPractice;
