import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PortfolioCard from '@/components/PortfolioCard';
import PortfolioToolCard from '@/components/PortfolioToolCard';
import { portfolios, tools } from '@/data/portfolioData';

const Portfolio = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPortfolios = useMemo(() => {
    if (!searchQuery) return portfolios;
    
    const query = searchQuery.toLowerCase();
    return portfolios.filter(portfolio =>
      portfolio.name.toLowerCase().includes(query) ||
      portfolio.title.toLowerCase().includes(query) ||
      portfolio.company?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredTools = useMemo(() => {
    if (!searchQuery) return tools;
    
    const query = searchQuery.toLowerCase();
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toolsByCategory = useMemo(() => {
    const categories: { [key: string]: typeof tools } = {};
    filteredTools.forEach(tool => {
      if (!categories[tool.category]) {
        categories[tool.category] = [];
      }
      categories[tool.category].push(tool);
    });
    return categories;
  }, [filteredTools]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted/20 py-16">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              PM Portfolios
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore their portfolios and witness how they crafted success from vision to execution!
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto">
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Type here to search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border focus:ring-ring"
              />
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="py-12">
          <div className="container mx-auto">
            <Tabs defaultValue="portfolios" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
                <TabsTrigger value="portfolios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Top Product Portfolios
                </TabsTrigger>
                <TabsTrigger value="tools" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Portfolio Tools
                </TabsTrigger>
              </TabsList>

              <TabsContent value="portfolios" className="mt-0">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Top Product Portfolios
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredPortfolios.length} portfolio{filteredPortfolios.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPortfolios.map((portfolio) => (
                    <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                  ))}
                </div>
                
                {filteredPortfolios.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No portfolios found matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tools" className="mt-0">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Tools to Build Your Portfolio
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
                  <div key={category} className="mb-12">
                    <h3 className="text-xl font-semibold text-foreground mb-6 border-b border-border pb-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryTools.map((tool) => (
                        <PortfolioToolCard key={tool.id} tool={tool} />
                      ))}
                    </div>
                  </div>
                ))}
                
                {filteredTools.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No tools found matching "{searchQuery}"
                    </p>
                  </div>
                )}

                {/* Help Section */}
                <div className="mt-16 p-8 bg-muted/30 rounded-lg text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Want to build your portfolio but don't know where to start?
                  </h3>
                  <p className="text-muted-foreground">
                    I am here to help. Free and paid service available!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;