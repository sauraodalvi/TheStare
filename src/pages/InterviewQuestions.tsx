import React, { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Palette, 
  BarChart3, 
  Code, 
  Users, 
  Calculator,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface Question {
  id: number;
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  company: string;
  answer: string;
  tags: string[];
  followUpQuestions: string[];
}

interface InterviewQuestionsData {
  categories: Category[];
  questions: Question[];
}

const InterviewQuestions = () => {
  const [data, setData] = useState<InterviewQuestionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/interview-questions.json');
        if (!response.ok) {
          throw new Error('Failed to load interview questions');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error('Error loading interview questions:', err);
        setError('Failed to load interview questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      target: <Target className="w-6 h-6" />,
      palette: <Palette className="w-6 h-6" />,
      chart: <BarChart3 className="w-6 h-6" />,
      code: <Code className="w-6 h-6" />,
      users: <Users className="w-6 h-6" />,
      calculator: <Calculator className="w-6 h-6" />,
    };
    return icons[iconName] || <Target className="w-6 h-6" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredQuestions = data?.questions.filter(question => {
    const categoryMatch = selectedCategory === 'all' || question.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  }) || [];

  if (loading) {
    return (
      <>
        <SEO
          title="PM Interview Questions | Stare"
          description="Comprehensive collection of product management interview questions with detailed answers"
          keywords="PM interview questions, product manager interview, PM interview prep"
          url="/interview-questions"
        />
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <SEO
          title="PM Interview Questions | Stare"
          description="Comprehensive collection of product management interview questions with detailed answers"
          keywords="PM interview questions, product manager interview, PM interview prep"
          url="/interview-questions"
        />
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-destructive text-lg">{error || 'Failed to load data'}</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Product Manager Interview Questions & Answers | Stare"
        description="Master PM interviews with our comprehensive collection of interview questions covering product strategy, design, metrics, technical concepts, and behavioral questions. Includes detailed answers from top companies like Google, Meta, and Amazon."
        keywords="PM interview questions, product manager interview prep, product management interview, PM behavioral questions, product strategy questions, PM technical questions"
        url="/interview-questions"
      />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 overflow-x-hidden">
          {/* Hero Section */}
          <section className="py-8 px-4 bg-gradient-to-r from-stare-navy/5 to-stare-teal/5">
            <div className="container mx-auto max-w-7xl">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Product Manager Interview Questions
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Master your PM interviews with our curated collection of questions and detailed answers 
                  from top companies like Google, Meta, Amazon, and more.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="text-sm">
                    {data.questions.length} Questions
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    {data.categories.length} Categories
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    Detailed Answers
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Question Categories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {data.categories.map((category) => (
                  <Card 
                    key={category.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {getIconComponent(category.icon)}
                        </div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </div>
                      <CardDescription className="mt-2">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Filters Section */}
          <section className="py-4 px-4 bg-muted/30">
            <div className="container mx-auto max-w-7xl">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter Questions:</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {data.categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="All Difficulties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          {/* Questions Section */}
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-4">
                {filteredQuestions.map((question) => {
                  const isExpanded = expandedQuestions.has(question.id);
                  
                  return (
                    <Card key={question.id} className="overflow-hidden">
                      <CardHeader className="cursor-pointer" onClick={() => toggleQuestion(question.id)}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                {question.difficulty}
                              </Badge>
                              <Badge variant="outline">{question.category}</Badge>
                              <Badge variant="secondary">{question.company}</Badge>
                            </div>
                            <CardTitle className="text-lg md:text-xl">
                              {question.question}
                            </CardTitle>
                          </div>
                          <Button variant="ghost" size="sm">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Answer:</h4>
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="text-muted-foreground whitespace-pre-line">
                                  {question.answer}
                                </p>
                              </div>
                            </div>

                            {question.followUpQuestions && question.followUpQuestions.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-foreground mb-2">Follow-up Questions:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {question.followUpQuestions.map((followUp, index) => (
                                    <li key={index} className="text-muted-foreground text-sm">
                                      {followUp}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {question.tags && question.tags.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-foreground mb-2">Tags:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {question.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>

              {filteredQuestions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No questions found matching your filters. Try adjusting your selection.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default InterviewQuestions;

