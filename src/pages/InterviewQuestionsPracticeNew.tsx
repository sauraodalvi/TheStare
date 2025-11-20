import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2, Copy, RotateCcw, Sparkles, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // State management
  const [apiKey, setApiKey] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [rememberKey, setRememberKey] = useState<boolean>(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isPreFilled, setIsPreFilled] = useState<boolean>(false);

  // Initialize categories
  useEffect(() => {
    const defaultCategories = [
      'Product Strategy',
      'Product Design',
      'Metrics & Analytics',
      'Technical',
      'Behavioral',
      'Case Study',
      'Estimation',
      'System Design'
    ];
    setAvailableCategories(defaultCategories);
  }, []);

  // Load saved API key from localStorage or sessionStorage if available
  useEffect(() => {
    const savedApiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) ||
      sessionStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsVerified(true);
      setShowApiKeyInput(false);
      setRememberKey(!!localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY));
    }
  }, []);

  // Handle pre-filled data from navigation
  useEffect(() => {
    if (location.state?.question) {
      const q = location.state.question;
      setQuestion(q.question);
      setSelectedCategory(q.category);
      setCompany(q.company || '');
      setIsPreFilled(true);
    }
  }, [location.state]);

  // Handle API key verification
  const verifyApiKey = useCallback(async (key: string) => {
    if (!key.trim()) return false;

    setIsVerifying(true);
    setError(null);

    try {
      // Test the API key by making a simple request
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-latest:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello'
            }]
          }]
        })
      });

      if (response.ok) {
        setIsVerified(true);
        setShowApiKeyInput(false);

        if (rememberKey) {
          localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key);
        } else {
          sessionStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key);
        }

        toast({
          title: 'Success',
          description: 'API key verified successfully!',
        });

        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Invalid API key');
      }
    } catch (err) {
      console.error('Error verifying API key:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify API key';
      setError(errorMessage);
      toast({
        title: 'Verification Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [rememberKey, toast]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAnswer('');

    try {
      // Input validation
      if (!question.trim()) {
        throw new Error('Please enter a question');
      }

      if (!selectedCategory) {
        throw new Error('Please select a category');
      }

      const trimmedApiKey = apiKey.trim();
      if (!trimmedApiKey) {
        throw new Error('Please enter a valid API key');
      }

      setIsLoading(true);

      // Build the prompt based on the question and category
      const prompt = `You are an expert interviewer. Provide a comprehensive answer to this ${selectedCategory.toLowerCase()} interview question in a JSON format with the following structure:
      
Question: ${question}
Company: ${company || 'General'}

{
  "introduction": "A clear introduction to the answer",
  "mainPoints": [
    {
      "point": "Key point 1",
      "example": "Relevant example or explanation"
    },
    {
      "point": "Key point 2",
      "example": "Relevant example or explanation"
    }
  ],
  "conclusion": "A concise conclusion",
  "followUpQuestions": [
    "Potential follow-up question 1",
    "Potential follow-up question 2"
  ]
}

Please make sure to only return valid JSON that can be parsed with JSON.parse().`;

      // First, list available models to ensure we're using a valid one
      const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(trimmedApiKey)}`);

      if (!modelsResponse.ok) {
        const errorData = await modelsResponse.json();
        throw new Error(`Failed to fetch models: ${errorData.error?.message || 'Unknown error'}`);
      }

      const modelsData = await modelsResponse.json();

      // Try to find a suitable model
      const availableModels = modelsData.models || [];
      const modelName = availableModels.find((m: any) => m.name.includes('gemini-1.5-pro') || m.name.includes('gemini-pro'))?.name || 'gemini-pro';

      if (!modelName) {
        throw new Error('No suitable Gemini model found.');
      }

      // Make API call to Gemini with the found model
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(trimmedApiKey)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to generate response');
      }

      const data = await response.json();

      // Handle the Gemini API response
      let answerText = 'Sorry, I could not generate an answer. Please try again.';

      try {
        // Extract the response text
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (responseText) {
          // First try to parse as JSON
          try {
            // Clean the response to ensure it's valid JSON
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            if (jsonStart >= 0 && jsonEnd > jsonStart) {
              const jsonString = responseText.substring(jsonStart, jsonEnd);
              const result = JSON.parse(jsonString);

              // Format the answer nicely if we have the expected structure
              if (result.introduction && Array.isArray(result.mainPoints)) {
                answerText = [
                  `## Introduction\n${result.introduction}\n`,
                  `## Main Points\n${result.mainPoints.map((point: any, i: number) =>
                    `${i + 1}. **${point.point}**\n   ${point.example || ''}`
                  ).filter(Boolean).join('\n\n')}\n`,
                  result.conclusion ? `## Conclusion\n${result.conclusion}\n` : '',
                  Array.isArray(result.followUpQuestions) && result.followUpQuestions.length > 0
                    ? `## Follow-up Questions\n${result.followUpQuestions.map((q: string, i: number) =>
                      `${i + 1}. ${q}`
                    ).join('\n')}`
                    : ''
                ].filter(Boolean).join('\n\n');
              } else {
                // If not in expected JSON format, use the raw text
                answerText = responseText;
              }
            } else {
              // If no JSON found, use the raw text
              answerText = responseText;
            }
          } catch (jsonError) {
            console.error('Error parsing JSON response:', jsonError);
            // If JSON parsing fails, use the raw text
            answerText = responseText;
          }
        }
      } catch (e) {
        console.error('Error processing response text:', e);
      }

      setAnswer(answerText);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error in handleSubmit:', err);

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy answer to clipboard
  const copyToClipboard = () => {
    if (answer) {
      navigator.clipboard.writeText(answer);
      toast({
        title: 'Copied to clipboard',
        description: 'Answer has been copied to your clipboard.',
      });
    }
  };

  // Reset the form
  const askAnotherQuestion = () => {
    setQuestion('');
    setCompany('');
    setSelectedCategory('');
    setAnswer(null);
    setError(null);
    setIsPreFilled(false);
  };

  // Reset API key
  const clearApiKey = () => {
    setApiKey('');
    setIsVerified(false);
    setShowApiKeyInput(true);
    setRememberKey(false);
    localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
    sessionStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
  };

  return (
    <>
      <SEO
        title="Interview Questions Practice | STARE"
        description="Practice answering interview questions with AI assistance"
      />
      <Navbar />
      <div className="container mx-auto p-4 max-w-4xl min-h-screen">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/interview-questions')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Interview Questions
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Interview Questions Practice</h1>

        {showApiKeyInput ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Enter Your API Key</CardTitle>
              <CardDescription>
                Please enter your Gemini API key to continue. Your key is stored locally in your browser.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Gemini API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your Gemini API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberKey"
                    checked={rememberKey}
                    onChange={(e) => setRememberKey(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="rememberKey" className="text-sm font-medium leading-none">
                    Remember my API key
                  </label>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => verifyApiKey(apiKey)}
                disabled={!apiKey.trim() || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : 'Save API Key'}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">API Key Verified</h3>
                  <p className="text-sm text-muted-foreground">Your API key is active and ready to use</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearApiKey}
                  className="whitespace-nowrap"
                >
                  Change API Key
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Practice Interview Question</CardTitle>
                <CardDescription>
                  Enter a question and select a category to get an AI-generated response.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      placeholder="e.g., Google, Amazon, etc."
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={isLoading || isPreFilled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category-select">Category *</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                      disabled={isLoading || isPreFilled}
                    >
                      <SelectTrigger id="category-select">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question">Question *</Label>
                    <Textarea
                      id="question"
                      placeholder="Enter your interview question here..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      disabled={isLoading || isPreFilled}
                      rows={4}
                      className="min-h-[100px]"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={askAnotherQuestion}
                      disabled={isLoading}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Ask Another Question
                    </Button>
                    <Button
                      type="submit"
                      disabled={!question.trim() || !selectedCategory || isLoading}
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
                  </div>
                </form>

                {answer && (
                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Generated Answer</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-lg bg-muted/50">
                      <ReactMarkdown>{answer}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default InterviewQuestionsPractice;
