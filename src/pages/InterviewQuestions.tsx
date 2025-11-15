import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Loader2, ArrowRight } from 'lucide-react';
import { fetchQuestions } from '@/services/questionService';

interface InterviewQuestion {
  id?: number;
  created_at?: string;
  category: string;
  company: string[];
  companies?: string[]; // Added companies to match the sample data
  question: string;
  answer: {
    text: string;
    generated_at: string;
    model: string;
    difficulty?: string;
    category?: string;
    companies?: string[];
    tags?: string[];
  } | null;
  image: string | null;
  difficulty?: string;
  tags?: string[];
}

const CATEGORIES = [
  { id: 1, name: 'Product Strategy', description: 'Questions about product vision, roadmap, and strategy', icon: 'target' },
  { id: 2, name: 'Product Design', description: 'Questions about UX, UI, and product design', icon: 'palette' },
  { id: 3, name: 'Metrics & Analytics', description: 'Questions about product metrics and data analysis', icon: 'bar-chart' },
  { id: 4, name: 'Technical', description: 'Technical PM questions about APIs, architecture, etc.', icon: 'code' },
  { id: 5, name: 'Behavioral', description: 'Behavioral and situational interview questions', icon: 'users' },
  { id: 6, name: 'Estimation', description: 'Market sizing and estimation questions', icon: 'calculator' },
  { id: 7, name: 'RCA', description: 'Root cause analysis and problem-solving', icon: 'search' },
  { id: 8, name: 'Others', description: 'Miscellaneous PM interview questions', icon: 'grid' },
];

const SAMPLE_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    question: 'How would you improve our product?',
    answer: {
      text: 'To improve your product, I would first analyze user feedback and metrics to identify pain points and areas for enhancement. Then, I would prioritize features based on impact and feasibility.',
      difficulty: 'Medium',
      category: 'Product Strategy',
      companies: ['Google', 'Microsoft'],
      tags: ['strategy', 'improvement'],
      generated_at: new Date().toISOString(),
      model: 'gpt-4'
    },
    category: 'Product Strategy',
    company: ['Google', 'Microsoft'],
    difficulty: 'Medium',
    tags: ['strategy', 'improvement'],
    image: null
  },
  {
    id: 2,
    question: 'How would you design a new feature for our app?',
    answer: {
      text: 'To design a new feature, I would follow a structured approach: 1) Understand user needs through research, 2) Define clear requirements, 3) Create wireframes and prototypes, 4) Test with users, and 5) Iterate based on feedback.',
      difficulty: 'Medium',
      category: 'Product Design',
      companies: ['Facebook', 'Apple'],
      tags: ['design', 'feature'],
      generated_at: new Date().toISOString(),
      model: 'gpt-4'
    },
    category: 'Product Design',
    company: ['Facebook', 'Apple'],
    difficulty: 'Medium',
    tags: ['design', 'feature'],
    image: null
  },
  {
    id: 3,
    question: 'What metrics would you track to measure the success of a new feature?',
    answer: {
      text: 'Key metrics to track would include: 1) User engagement (DAU/WAU/MAU), 2) Feature adoption rate, 3) Retention rate, 4) Conversion rate (if applicable), 5) Time spent on feature, and 6) Impact on overall product metrics.',
      difficulty: 'Hard',
      category: 'Metrics & Analytics',
      companies: ['Amazon', 'Netflix'],
      tags: ['metrics', 'analytics'],
      generated_at: new Date().toISOString(),
      model: 'gpt-4'
    },
    category: 'Metrics & Analytics',
    company: ['Amazon', 'Netflix'],
    difficulty: 'Hard',
    tags: ['metrics', 'analytics'],
    image: null
  }
];

const InterviewQuestions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load questions from Supabase
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await fetchQuestions({});
        setQuestions(data);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load questions. Using sample data instead.',
          variant: 'destructive',
        });
        setQuestions(SAMPLE_QUESTIONS);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleQuestionClick = (question: InterviewQuestion) => {
    console.log('Question clicked:', { id: question.id, question: question.question });
    
    if (!question.id) {
      console.error('Question ID is missing:', question);
      // Fallback to just the question text if no ID is available
      const encodedQuestion = encodeURIComponent(question.question);
      navigate(`/interview-questions-practice?question=${encodedQuestion}`);
      return;
    }

    // Create an object with the data we need, including the ID
    const questionData = {
      q: question.question,
      c: question.category || '',
      id: question.id  // Include the question ID
    };
    
    // Convert to JSON and encode for URL
    const encodedData = encodeURIComponent(JSON.stringify(questionData));
    console.log('Navigating with data:', { questionData, encodedData });
    
    // Navigate with the encoded data
    navigate(`/interview-questions-practice?data=${encodedData}`);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="space-y-4">
          {questions.map((question) => (
            <Card 
              key={question.id} 
              className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => handleQuestionClick(question)}
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-2">{question.question}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {question.difficulty && (
                        <Badge variant="outline">
                          {question.difficulty}
                        </Badge>
                      )}
                      {question.category && (
                        <Badge variant="outline">
                          {question.category}
                        </Badge>
                      )}
                      {question.company?.map((company) => (
                        <Badge key={company} variant="secondary">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-2">
                    Practice
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
          
          {questions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No questions available.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO
        title="Product Manager Interview Questions & Answers | Stare"
        description="Master PM interviews with our comprehensive collection of interview questions covering product strategy, design, metrics, technical concepts, and behavioral questions."
        keywords="PM interview questions, product manager interview prep, product management interview, PM behavioral questions, product strategy questions, PM technical questions"
      />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Product Manager Interview Questions</h1>
              <p className="text-muted-foreground">Practice with real interview questions from top tech companies</p>
            </div>
            
            {/* Questions List */}
            {renderContent()}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default InterviewQuestions;
