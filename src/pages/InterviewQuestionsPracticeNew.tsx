import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Loader2, Sparkles, AlertCircle, Copy, RotateCcw } from 'lucide-react';
import { updateQuestionAnswer } from '@/services/questionService';

// Constants
const GEMINI_API_KEY_STORAGE_KEY = 'gemini_api_key';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

/**
 * Helper function to make API calls with retry logic
 */
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  retries = 0
): Promise<Response> {
  try {
    console.log(`Making API request to ${url} (attempt ${retries + 1}/${MAX_RETRIES + 1})`);
    const response = await fetch(url, options);
    
    // If successful, return the response
    if (response.ok) {
      return response;
    }
    
    // Get error details if available
    let errorDetails = '';
    try {
      const errorData = await response.json();
      errorDetails = errorData?.error?.message || JSON.stringify(errorData);
    } catch (e) {
      errorDetails = await response.text().catch(() => 'No error details available');
    }
    
    console.error(`API Error [${response.status}]:`, errorDetails);
    
    // If we get a 5xx error or 429 (rate limit) and have retries left, retry
    if ((response.status >= 500 || response.status === 429) && retries < MAX_RETRIES) {
      const delay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, retries), 30000); // Max 30s delay
      console.log(`API returned ${response.status}, retrying in ${delay}ms (attempt ${retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries + 1);
    }
    
    // Special handling for common error statuses
    const errorMessages: Record<number, string> = {
      400: 'Invalid request. Please check your input and try again.',
      401: 'Authentication failed. Please check your API key.',
      403: 'Permission denied. Your API key may not have the required permissions.',
      404: 'The requested resource was not found.',
      429: 'Rate limit exceeded. Please wait a moment and try again.',
      500: 'Internal server error. Please try again later.',
      502: 'Bad gateway. The server received an invalid response.',
      503: 'Service temporarily unavailable. The server is currently unable to handle the request.',
      504: 'Gateway timeout. The server took too long to respond.'
    };
    
    const errorMessage = errorMessages[response.status as keyof typeof errorMessages] || 
      `API request failed with status ${response.status}`;
    
    const error = new Error(`${errorMessage}${errorDetails ? ` (${errorDetails})` : ''}`);
    (error as any).status = response.status;
    throw error;
    
  } catch (error) {
    if (retries < MAX_RETRIES) {
      const delay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, retries), 30000); // Max 30s delay
      console.log(`Request failed (${error instanceof Error ? error.message : 'Unknown error'}), retrying in ${delay}ms (attempt ${retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries + 1);
    }
    
    // If we're out of retries, enhance the error message
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        error.message = 'Network error: Could not connect to the server. Please check your internet connection.';
      } else if (error.message.includes('Unexpected token')) {
        error.message = 'Invalid response format from the server. Please try again.';
      }
    }
    
    throw error;
  }
}
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Storage 
const STORAGE_TYPE = 'local'; // 'local' or 'session'

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
  const [isPrefilled, setIsPrefilled] = useState(false);
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
  const [questionId, setQuestionId] = useState<string | number | null>(null);
  
  const CHARACTER_LIMIT = 1000;

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    console.log('URL search params:', params);
    
    // First check for the new data format
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        console.log('Decoded data from URL:', decodedData);
        
        if (decodedData && typeof decodedData === 'object') {
          // Set question and category from the data object
          if (decodedData.q) {
            setQuestion(decodedData.q);
            console.log('Set question from URL:', decodedData.q);
          }
          if (decodedData.c) {
            setSelectedCategory(decodedData.c);
            console.log('Set category from URL:', decodedData.c);
          }
          
          // Handle question ID - support both numeric IDs and UUIDs
          if (decodedData.id !== undefined && decodedData.id !== null) {
            // Check if the ID is a valid UUID (v4)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            const id = decodedData.id.toString();
            
            if (!isNaN(Number(id)) || uuidRegex.test(id)) {
              setQuestionId(id);
              console.log('Set questionId from URL:', id);
            } else {
              console.warn('Invalid question ID format in URL:', id);
              // Still set the ID but log the warning
              setQuestionId(id);
            }
          } else {
            console.warn('No question ID found in URL data:', decodedData);
          }
          
          setIsPrefilled(true);
          return;
        }
      } catch (e) {
        console.error('Error parsing data parameter:', e);
      }
    }
    
    // Fallback to old question parameter for backward compatibility
    const questionParam = searchParams.get('question');
    const idParam = searchParams.get('id');
    
    if (questionParam) {
      const decodedQuestion = decodeURIComponent(questionParam);
      setQuestion(decodedQuestion);
      console.log('Set question from legacy URL param:', decodedQuestion);
      setIsPrefilled(true);
    }
    
    if (idParam) {
      // Support both numeric IDs and UUIDs
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!isNaN(Number(idParam)) || uuidRegex.test(idParam)) {
        setQuestionId(idParam);
        console.log('Set questionId from legacy URL param:', idParam);
      } else {
        console.warn('Invalid question ID format in legacy URL param:', idParam);
        // Still set the ID but log the warning
        setQuestionId(idParam);
      }
    }
  }, [searchParams]);

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
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted', { 
      question: question.substring(0, 50) + (question.length > 50 ? '...' : ''), 
      selectedCategory,
      isPrefilled,
      questionId, // Log the questionId
      hasExistingAnswer: !!answer
    });
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }
    
    // If form is prefilled and we already have an answer, ask for confirmation
    if (isPrefilled && answer && !confirm('Would you like to generate a new answer for this question?')) {
      console.log('User canceled regeneration');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const key = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) || 
                 sessionStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
      
      if (!key) {
        const errorMsg = 'No API key found. Please provide a Gemini API key.';
        console.error(errorMsg);
        throw new Error(errorMsg);
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

      // Call Gemini API with retry mechanism
      // Using the working configuration from CaseStudyReview
      const modelName = 'gemini-2.5-flash';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
      
      console.log('Sending request to Gemini API with model:', modelName);
      const response = await fetchWithRetry(
        // Build the request URL with API key
        `${apiUrl}?key=${encodeURIComponent(key)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': key
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
              maxOutputTokens: 2048,
              responseMimeType: 'application/json'
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              }
            ]
          })
        }
      );

      const data = await response.json();
      let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('Raw API response received, length:', responseText.length);

      if (!responseText) {
        const errorMsg = 'No answer generated from the API. Response data: ' + JSON.stringify(data, null, 2);
        console.error(errorMsg);
        throw new Error('No answer generated. Please try again.');
      }

      // Log first 200 chars of response for debugging
      console.log('Response preview:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));

      // Parse the JSON response with better error handling
      let parsedResponse;
      try {
        // First, try to extract JSON from markdown code blocks if present
        const jsonMatch = responseText.match(/```(?:json)?\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          responseText = jsonMatch[1];
        }
        
        // Try to parse the JSON directly first
        try {
          parsedResponse = JSON.parse(responseText);
        } catch (e) {
          // If direct parsing fails, try to fix common issues
          console.log('Direct JSON parse failed, attempting to fix common issues...');
          
          // Make a copy of the original text for recovery
          let fixedText = responseText;
          
          // 1. Try to fix truncated JSON (common with large responses)
          if (fixedText.includes('...')) {
            console.log('Detected potential truncation, attempting to fix...');
            // Find the last complete object/array that ends properly
            const lastBrace = Math.max(
              fixedText.lastIndexOf('}'),
              fixedText.lastIndexOf(']')
            );
            
            if (lastBrace > 0) {
              // Take everything up to the last complete brace
              fixedText = fixedText.substring(0, lastBrace + 1);
              
              // If we have an unclosed string at the end, remove it
              if ((fixedText.match(/"/g) || []).length % 2 !== 0) {
                const lastQuote = fixedText.lastIndexOf('"');
                if (lastQuote > fixedText.lastIndexOf(':')) {
                  fixedText = fixedText.substring(0, lastQuote) + '"';
                }
              }
              
              // Try to parse the fixed text
              try {
                parsedResponse = JSON.parse(fixedText);
                console.log('Successfully parsed after fixing truncation');
                return parsedResponse;
              } catch (e) {
                console.log('Fixing truncation alone was not enough, trying additional fixes...');
              }
            }
          }
          
          // 2. Try to fix common JSON syntax issues
          try {
            fixedText = fixedText
              // Fix unescaped quotes in strings
              .replace(/([^\\])\\([^"\\/bfnrtu])/g, '$1\\\\$2')
              // Remove trailing commas
              .replace(/,\s*([}\]])/g, '$1')
              // Add quotes around unquoted keys
              .replace(/([\{\,]\s*)([a-zA-Z0-9_]+?):/g, '$1"$2":')
              // Fix single quotes to double quotes
              .replace(/'/g, '"')
              // Remove any control characters
              .replace(/[\x00-\x1F\x7F-\x9F]/g, '');
              
            parsedResponse = JSON.parse(fixedText);
            console.log('Successfully parsed after fixing syntax issues');
          } catch (e) {
            console.log('Could not parse as complete JSON, attempting to extract partial content...');
            
            // 3. Try to extract just the answer field as a last resort
            const answerMatch = responseText.match(/"answer"\s*:\s*"([\s\S]*?)"/);
            if (answerMatch && answerMatch[1]) {
              console.log('Extracted partial answer from response');
              parsedResponse = {
                approach: 'The AI provided a response that could not be fully parsed.',
                frameworks: [],
                answer: answerMatch[1],
                keyTakeaways: [],
                followUpQuestions: []
              };
            } else {
              throw new Error('Could not extract valid content from the response');
            }
          }
        }
        
        console.log('Successfully parsed response with keys:', Object.keys(parsedResponse));
      } catch (error) {
        console.error('Error parsing JSON response. Error:', error, '\nRaw text:', responseText);
        // If we have a response text but couldn't parse it, try to use it as a fallback
        if (responseText.trim().length > 0) {
          console.log('Using response text as fallback due to parsing error');
          return {
            approach: 'The AI provided a response that could not be fully parsed.',
            frameworks: [],
            answer: responseText,
            keyTakeaways: [],
            followUpQuestions: []
          };
        }
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
      
      // Save the generated answer to the database
      console.log('Saving answer to database...', { questionId, isPrefilled });
      let success = false;
      try {
        if (isPrefilled && questionId) {
          await saveAnswerToDatabase(formattedResponse, questionId);
          console.log('Answer saved successfully');
        } else {
          console.log('Skipping database save - not a prefilled question or missing questionId');
        }
        success = true;
      } catch (saveError) {
        console.error('Failed to save answer to database:', saveError);
        // Don't fail the entire operation if saving to DB fails
        // The user still gets their answer, we just log the error
        success = true;
      }
      console.log('handleSubmit completed successfully:', success);
    } catch (err: any) {
      console.error('Error generating answer:', err);
      const errorMessage = err.status === 503 
        ? 'The AI service is currently overloaded. Please try again in a moment.'
        : err.message || 'Failed to generate answer. Please try again.';
      
      setError(errorMessage);
      
      toast({
        title: err.status === 503 ? 'Service Busy' : 'Error',
        description: errorMessage,
        variant: 'destructive',
        duration: err.status === 503 ? 8000 : 5000, // Show for longer if service is busy
      });
    } finally {
      setIsLoading(false);
    }
  }, [question, selectedCategory, toast, questionId, isPrefilled]);

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

  // Save the generated answer to the database only if the question exists
  const saveAnswerToDatabase = async (answerText: string, questionIdParam?: string | number | null) => {
    // Use the passed questionIdParam if available, otherwise fall back to the component state
    const idToUse = questionIdParam !== undefined ? questionIdParam : questionId;
    const modelName = 'gemini-2.5-flash';
    
    console.log('saveAnswerToDatabase called with:', { 
      answerLength: answerText?.length || 0,
      isPrefilled,
      questionId: idToUse,
      hasQuestion: !!question,
      hasCategory: !!selectedCategory,
      source: questionIdParam !== undefined ? 'parameter' : 'state',
      currentState: { questionId, isPrefilled, selectedCategory },
      timestamp: new Date().toISOString()
    });
    
    // Make sure we have a valid question ID and it's a prefilled question
    if (!isPrefilled) {
      console.log('Not saving to database: not a prefilled question');
      return;
    }
    
    if (!idToUse) {
      console.error('Cannot save answer: missing question ID');
      throw new Error('Cannot save answer: missing question ID');
    }
    
    if (!answerText) {
      console.error('Cannot save empty answer');
      throw new Error('Cannot save empty answer');
    }
    
    console.log('Checking if question exists in database before saving answer...');
    
    try {
      // First, verify the question exists in the database
      const { data: questionData, error: fetchError } = await supabase
        .from('questions')
        .select('id')
        .eq('id', idToUse.toString())
        .maybeSingle();
      
      if (fetchError || !questionData) {
        console.log('Question not found in database, skipping save:', {
          id: idToUse,
          error: fetchError,
          exists: !!questionData
        });
        return; // Skip saving if question doesn't exist in the database
      }
      
      console.log('Question found in database, proceeding with save. Question ID:', idToUse);
      
      // Only proceed with saving if we found the question in the database
      console.log('Calling updateQuestionAnswer with:', {
        id: idToUse,
        answer: {
          text: answerText.substring(0, 50) + (answerText.length > 50 ? '...' : ''),
          model: modelName
        }
      });
      
      const result = await updateQuestionAnswer(idToUse, {
        text: answerText,
        model: modelName
      });
      
      console.log('Successfully saved answer to existing question. Result:', {
        result,
        questionId: idToUse,
        answerLength: answerText.length,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: 'Answer saved',
        description: 'The answer has been saved to the database.',
      });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Detailed error saving answer to database:', {
        error: errorMessage,
questionId: idToUse,
        answerLength: answerText.length,
        isPrefilled,
        question,
        selectedCategory,
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      toast({
        title: 'Error',
        description: `Failed to save answer to database: ${errorMessage}`,
        variant: 'destructive',
      });
      
      // Re-throw to allow error boundary to catch it
      throw error;
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isPrefilled}>
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
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="question">Question</Label>
                  {isPrefilled && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setIsPrefilled(false);
                        setQuestion('');
                        setSelectedCategory('');
                      }}
                    >
                      Edit Question
                    </Button>
                  )}
                </div>
                {isPrefilled ? (
                  <div className="p-3 border rounded-md bg-muted/50 min-h-[100px] flex items-center">
                    <p className="text-foreground">{question}</p>
                  </div>
                ) : (
                  <Textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your interview question here..."
                    className="min-h-[100px] resize-none"
                    disabled={isLoading}
                    maxLength={CHARACTER_LIMIT}
                  />
                )}
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
                  type="submit" 
                  disabled={isLoading || !question.trim() || !selectedCategory}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isPrefilled && answer ? 'Updating...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {isPrefilled && answer ? 'Regenerate Answer' : 'Generate Answer'}
                    </>
                  )}
                </Button>
              </div>
            </form>
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
