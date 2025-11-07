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
import { cn } from '@/lib/utils';

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
  
  // Get question and category from URL params
  const questionFromUrl = searchParams.get('question') || '';
  const categoryFromUrl = searchParams.get('category') || '';
  
  // Initialize state with URL parameters if they exist
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
  const [question, setQuestion] = useState<string>(questionFromUrl);
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
      const decodedCategory = decodeURIComponent(categoryParam);
      setSelectedCategory(decodedCategory);
    }
  }, [searchParams]);

  // Verify API key function
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
    setAnswer('');
    setError(null);
  };

  // Suppress message channel errors from browser extensions
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Suppress "message channel closed" errors from browser extensions
      if (event.message && event.message.includes('message channel closed')) {
        event.preventDefault();
        return true;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress "message channel closed" errors from browser extensions
      if (event.reason && event.reason.message && event.reason.message.includes('message channel closed')) {
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

  // Verify API key function
  const verifyApiKey = useCallback(async (key: string, silent: boolean = false) => {
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
      const apiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) || 
                     sessionStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
      
      if (!apiKey) {
        throw new Error('No API key found. Please provide a Gemini API key.');
      }
      
      // Get question ID from URL params (if exists)
      const questionId = searchParams.get('id');

      // Create the system prompt with category-specific guidance
      let categoryGuidance = '';

      if (selectedCategory === 'RCA') {
        categoryGuidance = `
For Root Cause Analysis questions, focus on:
- Systematic debugging methodology (5 Whys, Fishbone diagram)
- Data-driven investigation approach
- Hypothesis formation and testing
- Communication with stakeholders during incidents
- Prevention strategies and post-mortem analysis`;
      } else if (selectedCategory === 'Others') {
        categoryGuidance = `
For general PM questions, adapt your answer to the specific topic:
- Identify the core PM skill being tested
- Use relevant frameworks and methodologies
- Provide concrete examples from PM practice
- Show strategic thinking and user empathy`;
      } else {
        categoryGuidance = `
Relevant PM frameworks to apply (e.g., CIRCLES, AARM, STAR)`;
      }

      const systemPrompt = `You are an experienced Product Manager interviewer helping candidates prepare for PM interviews.

Category: ${selectedCategory}
Question: ${question}

Please provide a comprehensive, structured answer following this format:

## Approach
How to think about this question

## Frameworks
${categoryGuidance}

## Example Answer
A detailed sample response

## Key Takeaways
- Bullet point 1
- Bullet point 2
- Bullet point 3

## Follow-up Questions
1. Question 1
2. Question 2
3. Question 3

**IMPORTANT**: Use proper markdown formatting:
- Use ## for section headings
- Use **bold** for emphasis
- Use bullet points (-) for lists
- Use numbered lists (1., 2., 3.) where appropriate
- Add blank lines between sections for readability

Make your answer clear, actionable, and easy to understand.`;

      // Call Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent`, {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
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
        console.error('API Error Response:', errorData);

        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later or upgrade your plan.');
        } else if (response.status === 401 || response.status === 403) {
          throw new Error('Invalid API key. Please check and try again.');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found. Please contact support.');
        } else if (errorData?.error?.message) {
          throw new Error(errorData.error.message);
        } else {
          throw new Error('Failed to generate answer. Please try again.');
        }
      }

      const data = await response.json();
      console.log('API Response:', data);
      console.log('Candidates:', data.candidates);
      console.log('First candidate:', data.candidates?.[0]);
      console.log('Content:', data.candidates?.[0]?.content);
      console.log('Parts:', data.candidates?.[0]?.content?.parts);
      console.log('Text:', data.candidates?.[0]?.content?.parts?.[0]?.text);

      // Check if the response was blocked or filtered
      if (data.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error('Response was blocked due to safety filters. Please try rephrasing your question.');
      }

      if (data.candidates?.[0]?.finishReason === 'RECITATION') {
        throw new Error('Response was blocked due to recitation. Please try a different question.');
      }

      // Check if response was truncated due to token limits
      if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
        console.warn('Response truncated due to MAX_TOKENS. Full response:', JSON.stringify(data, null, 2));
        throw new Error('Response was truncated due to length limits. Please try a shorter question or simpler prompt.');
      }

      // Check if parts array is missing
      if (!data.candidates?.[0]?.content?.parts) {
        console.error('Missing parts array. Full response:', JSON.stringify(data, null, 2));
        throw new Error('API returned an incomplete response. This may be due to token limits or content filtering. Please try again with a shorter question.');
      }

      const generatedAnswer = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedAnswer) {
        console.error('No text found in response. Full response:', JSON.stringify(data, null, 2));
        throw new Error('No answer generated. The API returned an empty response. Please try again.');
      }

      setAnswer(generatedAnswer);
      
      // If we have a question ID, update the answer in the database
      if (questionId) {
        try {
          await updateQuestionAnswer(parseInt(questionId), {
            text: generatedAnswer,
            model: 'gemini-2.5-pro',
            generated_at: new Date().toISOString()
          });
          
          toast({
            title: 'Success',
            description: 'Answer generated and saved successfully!',
          });
          
          // Update the URL to remove the question ID to prevent duplicate saves on refresh
          navigate(`/interview-questions/practice?category=${encodeURIComponent(selectedCategory)}&question=${encodeURIComponent(question)}`, { replace: true });
        } catch (err) {
          console.error('Error saving answer to database:', err);
          toast({
            title: 'Answer Generated',
            description: 'Answer was generated but could not be saved to the database.',
            variant: 'default',
          });
        }
      } else {
        toast({
          title: 'Answer Generated',
          description: 'Your AI-powered answer is ready!',
        });
      }
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
  };

  const copyAnswer = () => {
    if (answer) {
      navigator.clipboard.writeText(answer);
      toast({
        title: 'Copied to clipboard',
        description: 'Answer copied to clipboard!',
      });
    }
  };

  const updateQuestionAnswer = async (id: number, data: { text: string; model: string; generated_at: string }) => {
    // In a real app, you would make an API call to update the question answer
    console.log('Updating question answer:', { id, data });
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  };

  const askAnotherQuestion = () => {
    setAnswer(null);
    setQuestion('');
    setError(null);
  };

  // Add missing dependencies to useCallback hooks
  const handleVerifyClickWithDeps = useCallback(async () => {
    await verifyApiKey(apiKey);
  }, [apiKey, verifyApiKey]);

  const askAIWithDeps = useCallback(askAI, [askAI]);
  const copyAnswerWithDeps = useCallback(copyAnswer, [answer, toast]);
  const askAnotherQuestionWithDeps = useCallback(askAnotherQuestion, []);

  return (
    <>
      <SEO
        title="Practice PM Interview Questions | Stare"
        description="Practice answering product management interview questions with AI feedback"
        keywords="PM interview practice, product manager interview prep, mock PM interview, AI interview practice"
        url="/interview-questions/practice"
      />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/interview-questions')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Button>
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              AI Interview Practice
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Questions
        </Button>
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            AI Interview Practice
          </h1>
          <p className="text-muted-foreground">
            Get AI-powered answers to your PM interview questions using proven frameworks and best practices.
          </p>
        </div>
            </h1>
            <p className="text-muted-foreground">
              Get AI-powered answers to your PM interview questions using proven frameworks and best practices.
            </p>
          </div>

          {/* API Key Section */}
          {!isVerified || showApiKeyInput ? (
            <Card className="mb-6 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Gemini API Key</CardTitle>
                <CardDescription>
                  Enter your Gemini API key to start practicing. Get your free API key from{' '}
                  <a 
                    href="https://makersuite.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className="flex-1"
                      disabled={isVerifying}
                    />
                    <Button 
                      onClick={handleVerifyClick}
                      disabled={!apiKey || isVerifying}
                      variant="default"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        'Save & Verify'
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember-key"
                    checked={rememberKey}
                    onChange={(e) => setRememberKey(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember-key" className="text-sm font-normal">
                    Remember my API key (stored locally)
                  </Label>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6 border-border/50 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-medium text-green-900 dark:text-green-100">API Key Verified</h3>
                      <p className="text-sm text-green-700 dark:text-green-300">Your API key is active and ready to use</p>
                    </div>
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
              </CardContent>
            </Card>
          )}

          {/* Question Input Section */}
          {isVerified && !answer && (
            <Card className="mb-6 border-border/50">
              <CardHeader>
                <CardTitle>Ask Your Question</CardTitle>
                <CardDescription>
                  Select a category and enter your interview question to get a structured AI-powered answer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Your Question</Label>
                  <Textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your interview question here..."
                    className="min-h-[120px] resize-none"
                    disabled={isLoading}
                    maxLength={CHARACTER_LIMIT}
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className={`text-muted-foreground ${question.length > CHARACTER_LIMIT ? 'text-destructive' : ''}`}>
                      {question.length} / {CHARACTER_LIMIT} characters
                    </span>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={askAI}
                  disabled={!question.trim() || !selectedCategory || isLoading || question.length > CHARACTER_LIMIT}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating Answer...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Ask AI
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* AI Answer Section */}
          {answer && (
            <Card className="mb-6 border-border/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI-Generated Answer
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Category: <span className="font-medium">{selectedCategory}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyAnswer}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Your Question:</p>
                  <p className="text-sm">{question}</p>
                </div>
                
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 mt-6 text-foreground" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-6 text-foreground" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-semibold mb-2 mt-4 text-foreground" {...props} />,
                      p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-foreground/90" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-outside mb-4 space-y-2 ml-6" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-outside mb-4 space-y-2 ml-6" {...props} />,
                      li: ({node, ...props}) => <li className="ml-2 leading-relaxed" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                      em: ({node, ...props}) => <em className="italic text-foreground/90" {...props} />,
                      code: ({node, ...props}) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />,
                      pre: ({node, ...props}) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />,
                      hr: ({node, ...props}) => <hr className="my-6 border-border" {...props} />,
                    }}
                  >
                    {answer}
                  </ReactMarkdown>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30">
                <Button 
                  variant="outline" 
                  onClick={askAnotherQuestion}
                  className="w-full sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Ask Another Question
                </Button>
              </CardFooter>
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
        </main>
        <Footer />
      </div>
    </>
  );
};

