import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioCardNew from '@/components/PortfolioCardNew';
import PortfolioToolCardNew from '@/components/PortfolioToolCardNew';
import PortfolioSubmissionModal from '@/components/PortfolioSubmissionModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Skeleton } from '@/components/LayoutStable';

interface Portfolio {
  name: string;
  role: string;
  title: string;
  status: string;
  portfolio_url: string;
  iframe: string;
}

interface PortfolioTool {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  url: string;
}

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [tools, setTools] = useState<PortfolioTool[]>([]);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfoliosResponse, toolsResponse] = await Promise.all([
          fetch('/portfolios.json'),
          fetch('/portfolio-tools.json')
        ]);

        const portfoliosData = await portfoliosResponse.json();
        const toolsData = await toolsResponse.json();

        setPortfolios(portfoliosData);
        setTools(toolsData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePortfolioClick = (portfolio: Portfolio) => {
    if (portfolio.portfolio_url && portfolio.portfolio_url !== '#') {
      window.open(portfolio.portfolio_url, '_blank');
    }
  };

  const handleToolClick = (tool: PortfolioTool) => {
    if (tool.url && tool.url !== '#') {
      window.open(tool.url, '_blank');
    }
  };

  const handlePortfolioSubmit = (newPortfolio: Portfolio) => {
    setPortfolios(prev => [...prev, newPortfolio]);
  };

  // Filter portfolios to show only those with "Done" status
  const donePortfolios = portfolios.filter(portfolio => portfolio.status === 'Done');

  // Filter tools by selected difficulties
  const filteredTools = selectedDifficulties.length === 0
    ? tools
    : tools.filter(tool => selectedDifficulties.includes(tool.difficulty));

  const handleDifficultyFilter = (difficulty: string) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const clearAllFilters = () => {
    setSelectedDifficulties([]);
  };

  const difficultyOptions = ['Easy', 'Medium', 'Difficult'];

  if (!portfolios.length && !tools.length) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="mb-8">
                <Skeleton width="200px" height={36} className="mb-2" />
                <Skeleton width="500px" height={20} />
              </div>
            </div>
          </section>
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="space-y-12">
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <Skeleton width="300px" height={32} />
                    <Skeleton width="150px" height={40} className="rounded" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg">
                        <Skeleton width="100%" height={200} className="rounded-lg" />
                        <Skeleton width="80%" height={24} />
                        <Skeleton width="60%" height={20} />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Header Section */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio</h1>
              <p className="text-muted-foreground">Explore inspiring portfolios and tools from successful product managers</p>
            </div>
          </div>
        </section>

        <section className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="space-y-12 md:space-y-16">
              {/* Top Product Portfolios Section */}
              <section>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Top Product Portfolios
                  </h2>
                  <Button
                    onClick={() => setIsSubmissionModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="default"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Portfolio
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {donePortfolios.map((portfolio, index) => (
                    <PortfolioCardNew
                      key={index}
                      portfolio={portfolio}
                      onClick={handlePortfolioClick}
                    />
                  ))}
                </div>
              </section>

              {/* Portfolio Tools Section */}
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
                  Portfolio Tools
                </h2>

                {/* Filter Controls */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-foreground">Filter by difficulty:</span>
                    {difficultyOptions.map((difficulty) => (
                      <Button
                        key={difficulty}
                        variant={selectedDifficulties.includes(difficulty) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDifficultyFilter(difficulty)}
                        className={`${
                          selectedDifficulties.includes(difficulty)
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {difficulty}
                      </Button>
                    ))}
                    {selectedDifficulties.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear all
                      </Button>
                    )}
                  </div>

                  {selectedDifficulties.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground">Active filters:</span>
                      {selectedDifficulties.map((difficulty) => (
                        <Badge
                          key={difficulty}
                          variant="secondary"
                          className="text-xs px-2 py-1"
                        >
                          {difficulty}
                          <button
                            onClick={() => handleDifficultyFilter(difficulty)}
                            className="ml-1 hover:text-foreground"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
                    Showing {filteredTools.length} of {tools.length} tools
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredTools.map((tool) => (
                    <PortfolioToolCardNew
                      key={tool.id}
                      tool={tool}
                      onClick={handleToolClick}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* Hero Banner Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Want to build your portfolio but don't know where to start?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              I am here to help. Free and paid service available!
            </p>
            <Button
              onClick={() => window.open('https://www.linkedin.com/in/saurao-dalvi/', '_blank')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-medium"
            >
              Message me on LinkedIn
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Portfolio Submission Modal */}
      <PortfolioSubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSubmit={handlePortfolioSubmit}
      />
    </div>
  );
};

export default Portfolio;