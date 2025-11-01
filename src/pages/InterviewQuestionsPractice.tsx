import React, { useState, useEffect } from 'react';
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
import { AlertCircle, CheckCircle2, Loader2, Copy, RotateCcw, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from 'react-markdown';

// Storage key for API key
const GEMINI_API_KEY_STORAGE_KEY = 'gemini_api_key';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface InterviewQuestionsData {
  categories: Category[];
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

  // Load categories from JSON file
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/data/interview-questions.json');
        if (!response.ok) {
          throw new Error('Failed to load categories');
        }
        const data: InterviewQuestionsData = await response.json();
        setCategories(data.categories);
        
        // Set category from URL param if present
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
          const decodedCategory = decodeURIComponent(categoryParam);
          const categoryExists = data.categories.some(cat => cat.name === decodedCategory);
          if (categoryExists) {
            setSelectedCategory(decodedCategory);
          }
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        toast({
          title: 'Error',
          description: 'Failed to load categories. Please refresh the page.',
          variant: 'destructive',
        });
      }
    };

    fetchCategories();
  }, [searchParams, toast]);

  // Check for stored API key on mount
  useEffect(() => {
    const storedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) ||
                      sessionStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
      verifyApiKey(storedKey, true);
    }
  }, []);

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
  const verifyApiKey = async (key: string, silent: boolean = false) => {
    if (!key) return;

    setIsVerifying(true);
    setError(null);

    try {
      // Simple verification by making a test call
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`, {
        method: 'POST',
        headers: {
          'x-goog-api-key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Hello' }]
          }]
        })
      });

      if (response.ok || response.status === 400) {
        // 400 is ok because it means the API key is valid but the request format might be wrong
        setIsVerified(true);
        setShowApiKeyInput(false);

        // Store the API key based on user preference
        if (rememberKey) {
          localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key);
        } else {
          sessionStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key);
        }

        if (!silent) {
          toast({
            title: 'API Key Verified',
            description: 'Your API key has been verified successfully!',
          });
        }
      } else if (response.status === 403) {
        throw new Error('Invalid API key. Please check your API key and try again.');
      } else if (response.status === 404) {
        throw new Error('API endpoint not found. Please contact support.');
      } else {
        throw new Error('Invalid API key or network error. Please try again.');
      }
    } catch (err) {
      setIsVerified(false);
      setShowApiKeyInput(true);

      if (!silent) {
        const errorMessage = err instanceof Error ? err.message : 'Could not verify your API key. Please check and try again.';
        toast({
          title: 'Verification Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyClick = () => {
    verifyApiKey(apiKey, false);
  };

  const clearApiKey = () => {
    setApiKey('');
    setIsVerified(false);
    setShowApiKeyInput(true);
    localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
    sessionStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
    setAnswer(null);
    setQuestion('');
  };

  const askAI = async () => {
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

      // Create the system prompt
      const systemPrompt = `You are an experienced Product Manager interviewer helping candidates prepare for PM interviews.

Category: ${selectedCategory}
Question: ${question}

Please provide a comprehensive, structured answer following this format:

## Approach
How to think about this question

## Frameworks
Relevant PM frameworks to apply (e.g., CIRCLES, AARM, STAR)

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

  const askAnotherQuestion = () => {
    setAnswer(null);
    setQuestion('');
    setError(null);
  };

  return (
    <>
      <SEO
        title="AI Interview Practice | STARE"
        description="Practice PM interview questions with AI-powered answers. Get structured responses using proven frameworks."
        keywords="AI interview practice, PM interview prep, interview questions AI, product manager interview"
        url="/interview-questions/practice"
      />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
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

export default InterviewQuestionsPractice;

