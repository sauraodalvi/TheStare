import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Search, 
  Loader2,
  Filter,
  X,
  ChevronRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  company: string[];
  difficulty: string;
  tags: string[];
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

// Sample companies for the filter
const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Facebook', 'Apple',
  'Netflix', 'Uber', 'Airbnb', 'Stripe', 'Slack'
];

const InterviewQuestions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    search?: string;
    category?: string;
    company?: string;
  }>({});
  
  // Sample data - replace with actual API call
  const sampleQuestions: InterviewQuestion[] = [
    {
      id: 1,
      question: 'How would you improve our product?',
      category: 'Product Strategy',
      company: ['Google', 'Microsoft'],
      difficulty: 'Medium',
      tags: ['strategy', 'improvement']
    },
    {
      id: 2,
      question: 'How would you design a new feature for our app?',
      category: 'Product Design',
      company: ['Facebook', 'Amazon'],
      difficulty: 'Hard',
      tags: ['design', 'feature']
    },
    {
      id: 3,
      question: 'How would you measure the success of a new feature?',
      category: 'Metrics & Analytics',
      company: ['Apple', 'Netflix'],
      difficulty: 'Medium',
      tags: ['metrics', 'analytics']
    },
  ];
  // Load questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setQuestions(sampleQuestions);
      } catch (err) {
        setError('Failed to load questions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleQuestionClick = (question: InterviewQuestion) => {
    // Navigate to practice page with question and category as URL parameters
    navigate(`/interview-questions/practice?question=${encodeURIComponent(question.question)}&category=${encodeURIComponent(question.category)}`);
  };

  const handleAddQuestion = () => {
    // Navigate to practice page with empty fields
    navigate('/interview-questions/practice');
  };

  // Filter questions based on search, category, and company
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = !filters.search || 
        q.question.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || 
        q.category === filters.category;
      const matchesCompany = !filters.company || 
        (Array.isArray(q.company) && q.company.includes(filters.company));
      
      return matchesSearch && matchesCategory && matchesCompany;
    });
  }, [questions, filters]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Interview Questions | STAR-E"
        description="Practice common interview questions with our interactive platform."
      />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Interview Questions</h1>
            <p className="text-muted-foreground">Practice with real PM interview questions</p>
          </div>
          <Button onClick={handleAddQuestion}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  className="pl-10"
                  value={filters.search || ''}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select 
                value={filters.category} 
                onValueChange={(value) => setFilters({...filters, category: value})}
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select 
                value={filters.company} 
                onValueChange={(value) => setFilters({...filters, company: value})}
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Companies</SelectItem>
                  {COMPANIES.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(filters.search || filters.category || filters.company) && (
              <Button
                variant="ghost"
                onClick={() => setFilters({})}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q) => (
                <Card 
                  key={q.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleQuestionClick(q)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium leading-tight">{q.question}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {q.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {q.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.isArray(q.company) && q.company.map((company) => (
                        <Badge key={company} variant="outline" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No questions found matching your filters.</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
      try {
        setLoading(true);
        const data = await fetchQuestions(filters);
        setQuestions(data);
      } catch (err) {
        setError('Failed to load questions. Please try again later.');
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [filters, isMounted]);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Toggle question expansion
  const toggleQuestion = (questionId: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Handle form submission
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.question.trim() || !newQuestion.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const addedQuestion = await addQuestion({
        ...newQuestion,
        answer: { text: '' } // Add empty answer
      });
      
      setQuestions(prev => [addedQuestion, ...prev]);
      setNewQuestion({ question: '', category: '', company: [] });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Question added successfully!",
      });
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the main content
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {questions.map(question => {
            const hasAnswer = !!question.answer;
            return (
              <Card key={question.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader 
                  className="cursor-pointer" 
                  onClick={() => toggleQuestion(question.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline">{question.category}</Badge>
                        {question.company?.map((company, i) => (
                          <Badge key={i} variant="secondary" className="capitalize">
                            {company}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-lg">{question.question}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon">
                      {expandedQuestions.has(question.id) ? 
                        <ChevronUp className="h-5 w-5" /> : 
                        <ChevronDown className="h-5 w-5" />
                      }
                    </Button>
                  </div>
                </CardHeader>
                
                {expandedQuestions.has(question.id) && (
                  <CardContent className="border-t pt-4">
                    {hasAnswer ? (
                      <div className="prose max-w-none">
                        <ReactMarkdown>{question.answer.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No answer provided yet.</p>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO
        title="Product Manager Interview Questions & Answers | Stare"
        description="Master PM interviews with our comprehensive collection of interview questions covering product strategy, design, metrics, technical concepts, and behavioral questions. Includes detailed answers from top companies like Google, Meta, and Amazon."
        keywords="PM interview questions, product manager interview prep, product management interview, PM behavioral questions, product strategy questions, PM technical questions"
      />
      
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 overflow-x-hidden">
          <section className="py-12 px-4 bg-gradient-to-r from-stare-navy/5 to-stare-teal/5">
            <div className="container mx-auto max-w-7xl">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Product Manager Interview Questions</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Practice with real PM interview questions from top tech companies
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
                <div className="w-full sm:w-auto">
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
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
                              value={newQuestion.question}
                              onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                              placeholder="Enter the interview question"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                              value={newQuestion.category}
                              onValueChange={(value) => setNewQuestion({...newQuestion, category: value})}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {CATEGORIES.map((category) => (
                                  <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Companies (optional)</Label>
                            <div className="flex gap-2">
                              <Input
                                value={currentCompanyInput}
                                onChange={(e) => setCurrentCompanyInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && currentCompanyInput.trim()) {
                                    e.preventDefault();
                                    if (!newQuestion.company.includes(currentCompanyInput.trim())) {
                                      setNewQuestion({
                                        ...newQuestion,
                                        company: [...newQuestion.company, currentCompanyInput.trim()]
                                      });
                                    }
                                    setCurrentCompanyInput('');
                                  }
                                }}
                                placeholder="Add company name and press Enter"
                              />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newQuestion.company.map((company, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  {company}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewQuestion({
                                        ...newQuestion,
                                        company: newQuestion.company.filter((_, i) => i !== index)
                                      });
                                    }}
                                    className="ml-1"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                            disabled={isSubmitting}
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
                </div>
                
                <div className="w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      className="pl-10 w-full sm:w-[300px]"
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              {renderContent()}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default InterviewQuestions;
