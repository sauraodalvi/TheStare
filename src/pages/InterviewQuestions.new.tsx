import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  X, 
  Search, 
  Loader2,
  MessageSquare
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';

// Define the InterviewQuestion interface
interface InterviewQuestion {
  id: number;
  question: string;
  answer?: {
    text: string;
    difficulty: string;
    category: string;
    companies: string[];
    tags: string[];
  };
  category: string;
  difficulty: string;
  companies: string[];
  tags: string[];
}

const CATEGORIES = [
  { id: 1, name: 'Product Strategy', description: 'Questions about product vision, roadmap, and strategy' },
  { id: 2, name: 'Product Design', description: 'Questions about UX, UI, and product design' },
  { id: 3, name: 'Metrics & Analytics', description: 'Questions about product metrics and data analysis' },
  { id: 4, name: 'Technical', description: 'Technical PM questions about APIs, architecture, etc.' },
  { id: 5, name: 'Behavioral', description: 'Behavioral and situational interview questions' },
  { id: 6, name: 'Estimation', description: 'Market sizing and estimation questions' },
  { id: 7, name: 'RCA', description: 'Root cause analysis and problem-solving' },
  { id: 8, name: 'Others', description: 'Miscellaneous PM interview questions' },
];

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

const InterviewQuestions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    search?: string;
    category?: string;
    company?: string;
  }>({});
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Sample questions data
  const sampleQuestions: InterviewQuestion[] = [
    {
      id: 1,
      question: 'How would you improve our product?',
      category: 'Product Strategy',
      companies: ['Google', 'Microsoft'],
      difficulty: 'Medium',
      tags: ['strategy', 'improvement']
    },
    {
      id: 2,
      question: 'How would you design a new feature for our app?',
      category: 'Product Design',
      companies: ['Facebook', 'Amazon'],
      difficulty: 'Hard',
      tags: ['design', 'feature']
    },
    {
      id: 3,
      question: 'How would you measure the success of a new feature?',
      category: 'Metrics & Analytics',
      companies: ['Apple', 'Netflix'],
      difficulty: 'Medium',
      tags: ['metrics', 'analytics']
    },
  ];

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
    setQuestions(sampleQuestions);
    
    // Extract unique companies from questions
    const companies = Array.from(
      new Set(sampleQuestions.flatMap(q => q.companies))
    );
    setAvailableCompanies(companies);
    
    return () => setIsMounted(false);
  }, []);

  // Toggle question expansion
  const toggleQuestion = useCallback((questionId: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  // Handle question click - navigate to practice page
  const handleQuestionClick = useCallback((question: InterviewQuestion) => {
    navigate('/interview-questions/practice', {
      state: {
        question: question.question,
        category: question.category,
        companies: question.companies.join(',')
      }
    });
  }, [navigate]);

  // Handle add question click
  const handleAddQuestionClick = useCallback(() => {
    setIsAddDialogOpen(true);
  }, []);

  // Handle form submission for new question
  const handleSubmitQuestion = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: 'Success',
        description: 'Question added successfully!',
      });
      
      // Close dialog
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: 'Error',
        description: 'Failed to add question. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  // Filter questions based on filters
  const filteredQuestions = useCallback(() => {
    return sampleQuestions.filter(question => {
      // Filter by search term
      if (filters.search && 
          !question.question.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Filter by category
      if (filters.category && question.category !== filters.category) {
        return false;
      }
      
      // Filter by company
      if (filters.company && !question.companies.includes(filters.company)) {
        return false;
      }
      
      return true;
    });
  }, [filters]);

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Product Manager Interview Questions & Answers | Stare"
        description="Master PM interviews with our comprehensive collection of interview questions."
        keywords="PM interview questions, product manager interview prep, product management interview"
      />
      
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        
        <main className="flex-1 overflow-x-hidden">
          {/* Header */}
          <section className="py-12 px-4 bg-gradient-to-r from-stare-navy/5 to-stare-teal/5">
            <div className="container mx-auto max-w-7xl">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
                  PM Interview Questions
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                  Practice with real product management interview questions from top companies
                </p>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="py-4 px-4 bg-muted/30">
            <div className="container mx-auto max-w-7xl">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search questions..."
                      className="pl-10 w-full"
                      value={filters.search || ''}
                      onChange={(e) => 
                        setFilters(prev => ({ ...prev, search: e.target.value }))
                      }
                    />
                  </div>
                  
                  <Select
                    value={filters.category}
                    onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filters.company}
                    onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, company: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Companies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Companies</SelectItem>
                      {availableCompanies.map(company => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFilters({})}
                  className="mt-4 sm:mt-0"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </section>

          {/* Questions List */}
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {filteredQuestions().length} Questions
                </h2>
                <Button onClick={handleAddQuestionClick}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
              
              <div className="space-y-4">
                {filteredQuestions().map((question) => (
                  <Card key={question.id} className="overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleQuestion(question.id)}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-medium">{question.question}</h3>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleQuestion(question.id);
                          }}
                        >
                          {expandedQuestions.has(question.id) ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{question.category}</Badge>
                        <Badge variant="outline">{question.difficulty}</Badge>
                        {question.companies.map(company => (
                          <Badge key={company} variant="secondary">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {expandedQuestions.has(question.id) && (
                      <div className="border-t p-4 bg-muted/10">
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Answer:</h4>
                          <div className="prose max-w-none">
                            {question.answer?.text || 'No answer provided.'}
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            variant="outline"
                            onClick={() => handleQuestionClick(question)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Practice This Question
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
                
                {filteredQuestions().length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No questions found</h3>
                    <p className="text-muted-foreground mt-2">
                      Try adjusting your filters or add a new question.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
      
      {/* Add Question Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogDescription>
              Add a new interview question to the database.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitQuestion}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Textarea
                  id="question"
                  placeholder="Enter the interview question"
                  className="min-h-[100px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Companies (optional)</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add company name" 
                    className="flex-1"
                  />
                  <Button type="button" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Google', 'Amazon'].map(company => (
                    <Badge key={company} variant="secondary" className="gap-1">
                      {company}
                      <X className="w-3 h-3 cursor-pointer" />
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="answer">Answer (optional)</Label>
                <Textarea 
                  id="answer" 
                  placeholder="Enter the answer (markdown supported)" 
                  className="min-h-[150px]"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Question'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InterviewQuestions;
