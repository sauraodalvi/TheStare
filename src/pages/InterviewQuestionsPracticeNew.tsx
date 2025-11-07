import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Copy, RotateCcw, Sparkles, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Storage 
const GEMINI_API_KEY_STORAGE_KEY = 'gemini_api_key';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  prompt?: string;
}

const InterviewQuestionsPractice: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);
  const [rememberKey, setRememberKey] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  
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
      { 
        id: 6, 
        name: 'RCA', 
        description: 'Root Cause Analysis and problem-solving', 
        icon: '🔍',
        prompt: `You are an expert in Root Cause Analysis. For the following issue:
"${question}"

Please provide a comprehensive RCA following this structure:

## 🎯 Problem Statement
- Clearly define the problem
- Impact assessment
- Timeline of events

## 🔍 Data Collection
- What data would you collect?
- Metrics to track
- Logs and monitoring needed

## 🧩 Analysis
- 5 Whys analysis
- Fishbone diagram components
- Potential contributing factors

## ✅ Verification
- How would you verify each potential cause?
- Tests to confirm root cause
- Data validation steps

## 🛠️ Solution & Prevention
- Immediate actions
- Long-term fixes
- Prevention strategies

## 📊 Monitoring
- Success metrics
- Early warning signs
- Alerting strategy

Use markdown formatting with proper headings, bullet points, and code blocks where appropriate.`
      },
      { 
        id: 7, 
        name: 'Others', 
        description: 'General and miscellaneous questions', 
        icon: '✨',
        prompt: `You are an expert in analyzing and answering general questions. For the following:
"${question}"

Please provide a comprehensive response with:

## 🧠 Understanding
- Key concepts and context
- Why this question matters
- Common misconceptions

## 📚 Key Information
- Essential facts and data
- Relevant examples
- Current trends (if applicable)

## 🔍 Analysis
- Different perspectives
- Pros and cons
- Potential implications

## 💡 Insights
- Unique observations
- Expert opinions
- Thought-provoking angles

## 🛠️ Practical Applications
- How to apply this knowledge
- Real-world use cases
- Implementation tips

## 📖 Additional Resources
- Recommended readings
- Related topics
- References

Use markdown formatting with proper headings, bullet points, and code blocks where appropriate.`
      },
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
    
    // Load saved API key if exists
    const savedApiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) || 
                       sessionStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setRememberKey(!!localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY));
      verifyApiKey(savedApiKey, true);
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

  // Handle verify button click
  const handleVerifyClick = useCallback(async () => {
    await verifyApiKey(apiKey);
  }, [apiKey, verifyApiKey]);

  // Ask another question
  const askAnotherQuestion = useCallback(() => {
    setQuestion('');
    setAnswer(null);
    setError(null);
  }, []);

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

      // Get the selected category's prompt or use default
      const selectedCategoryObj = categories.find(cat => cat.name === selectedCategory);
      const categoryPrompt = selectedCategoryObj?.prompt || 
        `You are an experienced expert helping with interview preparation. 
        
        For the following ${selectedCategory} question:
        "${question}"
        
        Please provide a comprehensive, structured answer that includes:
        - Clear explanation of key concepts
        - Relevant frameworks or methodologies
        - Practical examples or case studies
        - Common pitfalls to avoid
        - Best practices
        
        Format your response in clear, well-structured markdown with appropriate headings.`;

      const systemPrompt = categoryPrompt;

      // Call Gemini API with structured JSON response format
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent`, {
        method: 'POST',
        headers: {
          'x-goog-api-key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert at generating structured interview question responses. 
              Please provide a well-formatted JSON response for the following question:
              "${question}"
              
              Format your response as a JSON object with these exact keys:
              {
                "approach": "How to think about this question",
                "frameworks": ["Relevant frameworks or methodologies"],
                "answer": "A detailed, structured response",
                "keyTakeaways": ["Key point 1", "Key point 2", "Key point 3"],
                "followUpQuestions": ["Question 1", "Question 2", "Question 3"]
              }
              
              Ensure the response is valid JSON that can be parsed with JSON.parse().`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json'
          },
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Failed to generate answer');
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error('No answer generated. Please try again.');
      }

      // Parse the JSON response
      let parsedResponse;
      try {
        // Sometimes the response might be wrapped in markdown code blocks
        const jsonMatch = responseText.match(/```(?:json)?\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : responseText;
        parsedResponse = JSON.parse(jsonString);
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        throw new Error('Failed to parse the AI response. Please try again.');
      }

      // Format the response with enhanced markdown styling
      const formattedResponse = `## 📝 Approach
${parsedResponse.approach}

## 🧩 Frameworks & Methodologies
${parsedResponse.frameworks?.map((f: string) => `- **${f.trim()}**`).join('\n') || 'N/A'}

## 💡 Detailed Answer
${parsedResponse.answer}

## 🎯 Key Takeaways
${parsedResponse.keyTakeaways?.map((item: string, index: number) => 
  `**${index + 1}.** ${item.trim()}`
).join('\n\n') || 'N/A'}

## ❓ Follow-up Questions
${parsedResponse.followUpQuestions?.map((q: string, i: number) => 
  `**${i + 1}.** ${q.trim()}`
).join('\n\n') || 'N/A'}

---
<small>🔍 *AI-generated content. For educational purposes only. Always verify critical information.*</small>`;

      setAnswer(formattedResponse);
      
      // Auto-scroll to the answer
      setTimeout(() => {
        const answerElement = document.getElementById('ai-answer');
        if (answerElement) {
          answerElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      toast({
        title: '✨ Answer Ready',
        description: 'Your AI-powered response is ready to view!',
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
                    <CardDescription className="mt-1">
                      Review the AI's response to your interview question
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyAnswer}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <style>{
                    `
                    .prose {
                      color: #374151;
                      line-height: 1.7;
                    }
                    .dark .prose {
                      color: #e5e7eb;
                    }
                    .prose h2 {
                      margin-top: 1.75em;
                      margin-bottom: 0.75em;
                      font-weight: 700;
                      color: #1e40af;
                      border-bottom: 1px solid #e5e7eb;
                      padding-bottom: 0.5em;
                    }
                    .dark .prose h2 {
                      color: #93c5fd;
                      border-color: #374151;
                    }
                    .prose h3 {
                      margin-top: 1.5em;
                      margin-bottom: 0.75em;
                      font-weight: 600;
                      color: #1e40af;
                    }
                    .dark .prose h3 {
                      color: #93c5fd;
                    }
                    .prose p {
                      margin-top: 1em;
                      margin-bottom: 1em;
                    }
                    .prose ul, .prose ol {
                      margin-top: 0.75em;
                      margin-bottom: 1.25em;
                      padding-left: 1.5em;
                    }
                    .prose li {
                      margin-bottom: 0.5em;
                      position: relative;
                    }
                    .prose li:before {
                      content: '•';
                      color: #3b82f6;
                      font-weight: bold;
                      position: absolute;
                      left: -1em;
                    }
                    .prose ol {
                      counter-reset: item;
                    }
                    .prose ol li {
                      counter-increment: item;
                    }
                    .prose ol li:before {
                      content: counter(item) '.';
                      color: #3b82f6;
                      font-weight: bold;
                      position: absolute;
                      left: -1.5em;
                    }
                    .prose a {
                      color: #3b82f6;
                      text-decoration: none;
                      font-weight: 500;
                    }
                    .prose a:hover {
                      text-decoration: underline;
                    }
                    .prose code {
                      background-color: #f3f4f6;
                      color: #dc2626;
                      padding: 0.2em 0.4em;
                      border-radius: 0.25rem;
                      font-size: 0.9em;
                    }
                    .dark .prose code {
                      background-color: #374151;
                      color: #f87171;
                    }
                    .prose pre {
                      background-color: #1e293b;
                      color: #e2e8f0;
                      padding: 1em;
                      border-radius: 0.5rem;
                      overflow-x: auto;
                      margin: 1.5em 0;
                    }
                    .prose blockquote {
                      border-left: 4px solid #3b82f6;
                      padding-left: 1em;
                      margin: 1.5em 0;
                      color: #4b5563;
                      font-style: italic;
                    }
                    .dark .prose blockquote {
                      border-color: #60a5fa;
                      color: #9ca3af;
                    }
                    .prose table {
                      width: 100%;
                      border-collapse: collapse;
                      margin: 1.5em 0;
                    }
                    .prose th, .prose td {
                      border: 1px solid #e5e7eb;
                      padding: 0.75em;
                      text-align: left;
                    }
                    .dark .prose th, .dark .prose td {
                      border-color: #4b5563;
                    }
                    .prose th {
                      background-color: #f9fafb;
                      font-weight: 600;
                    }
                    .dark .prose th {
                      background-color: #1f2937;
                    }
                    `}
                  </style>
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button 
                  variant="outline" 
                  onClick={askAnotherQuestion}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Ask Another Question
                </Button>
                <div className="text-sm text-muted-foreground">
                  Powered by Gemini AI
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InterviewQuestionsPractice;
