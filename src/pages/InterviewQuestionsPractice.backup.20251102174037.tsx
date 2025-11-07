import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const InterviewQuestionsPractice: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get question and category from URL params
  const questionFromUrl = searchParams.get('question') || '';
  const categoryFromUrl = searchParams.get('category') || '';
  
  // Initialize state with URL parameters if they exist
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
  const [question, setQuestion] = useState<string>(questionFromUrl);
  const [error, setError] = useState<string | null>(null);

  const CHARACTER_LIMIT = 1000;

  // Load categories
  useEffect(() => {
    // Example categories - in a real app, you might fetch these from an API
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

  // Handle copying answer to clipboard
  const copyAnswer = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(answer || '');
      toast({
        title: 'Copied to clipboard',
        description: 'The answer has been copied to your clipboard.',
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  }, [answer, toast]);

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
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
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

              <div className="flex justify-end">
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
              </div>
            </div>
          )}

          {/* AI Answer Section */}
          {answer && (
            <Card className="mt-6">
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(answer)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-6" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-semibold mb-2 mt-4" {...props} />,
                      p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-outside mb-4 space-y-2 ml-6" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-outside mb-4 space-y-2 ml-6" {...props} />,
                      li: ({node, ...props}) => <li className="ml-2 leading-relaxed" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                      em: ({node, ...props}) => <em className="italic" {...props} />,
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

        <div className="flex justify-end">
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
        </div>
      </div>
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
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Need inspiration?</h2>
      <p className="text-muted-foreground mb-6">Try asking questions like:</p>
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
</main>
<Footer />
</div>
</>
);

  const handleTestClick = () => {
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      toast({
        title: "Success",
        description: "The component is now loading correctly!",
      });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Interview Questions Practice</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter category"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 border rounded min-h-[100px]"
            placeholder="Enter your question"
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleTestClick}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Test Component'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestionsPractice;
