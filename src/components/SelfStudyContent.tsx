import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink } from 'lucide-react';
import ResourceCard from '@/components/ResourceCard';
import BookCard from '@/components/BookCard';

interface SelfStudyData {
  websiteLearning: Array<{name: string, url: string, description: string}>;
  communityLearning: Array<{name: string, url: string, description: string}>;
  cohortLearning: Array<{name: string, url: string, price: string, description?: string}>;
  books: Array<{name: string, url: string, description: string, image: string}>;
  footer: {
    note: string;
    links: Array<{name: string, url: string}>;
    madeWith: string;
  };
}

const SelfStudyContent = () => {
  const [data, setData] = useState<SelfStudyData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    if (!data || !searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    
    return {
      ...data,
      websiteLearning: data.websiteLearning.filter(
        item => item.name.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query)
      ),
      communityLearning: data.communityLearning.filter(
        item => item.name.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query)
      ),
      cohortLearning: data.cohortLearning.filter(
        item => item.name.toLowerCase().includes(query) || 
                (item.description && item.description.toLowerCase().includes(query))
      ),
      books: data.books.filter(
        item => item.name.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query)
      )
    };
  }, [data, searchQuery]);

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded-lg w-full max-w-md mx-auto"></div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-4">
                <div className="h-8 bg-muted rounded-lg w-48"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-32 bg-muted rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="section-padding">
        <div className="container text-center">
          <p className="text-muted-foreground">Failed to load resources. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-wrap justify-center gap-4 mb-12">
          <a href="#website-learning" className="px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors font-medium">
            Website Learning
          </a>
          <a href="#community-learning" className="px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors font-medium">
            Community Learning
          </a>
          <a href="#cohort-learning" className="px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors font-medium">
            Cohort Learning
          </a>
          <a href="#books" className="px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors font-medium">
            Books
          </a>
        </nav>

        <div className="space-y-16">
          {/* Website Learning Section */}
          <section id="website-learning">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-8 text-foreground">
              Website Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.websiteLearning.map((resource, index) => (
                <ResourceCard
                  key={index}
                  name={resource.name}
                  description={resource.description}
                  url={resource.url}
                  buttonText="Visit"
                />
              ))}
            </div>
            {filteredData.websiteLearning.length === 0 && searchQuery && (
              <p className="text-muted-foreground text-center py-8">No website learning resources found for "{searchQuery}"</p>
            )}
          </section>

          {/* Community Learning Section */}
          <section id="community-learning">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-8 text-foreground">
              Community Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.communityLearning.map((resource, index) => (
                <ResourceCard
                  key={index}
                  name={resource.name}
                  description={resource.description}
                  url={resource.url}
                  buttonText="Visit"
                />
              ))}
            </div>
            {filteredData.communityLearning.length === 0 && searchQuery && (
              <p className="text-muted-foreground text-center py-8">No community learning resources found for "{searchQuery}"</p>
            )}
          </section>

          {/* Cohort Learning Section */}
          <section id="cohort-learning">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-8 text-foreground">
              Cohort Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.cohortLearning.map((resource, index) => (
                <ResourceCard
                  key={index}
                  name={resource.name}
                  description={resource.description || `Price: ${resource.price}`}
                  url={resource.url}
                  buttonText="Visit"
                  price={resource.price}
                />
              ))}
            </div>
            {filteredData.cohortLearning.length === 0 && searchQuery && (
              <p className="text-muted-foreground text-center py-8">No cohort learning resources found for "{searchQuery}"</p>
            )}
          </section>

          {/* Books Section */}
          <section id="books">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-8 text-foreground">
              Books
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredData.books.map((book, index) => (
                <BookCard
                  key={index}
                  name={book.name}
                  description={book.description}
                  url={book.url}
                  image={book.image}
                />
              ))}
            </div>
            {filteredData.books.length === 0 && searchQuery && (
              <p className="text-muted-foreground text-center py-8">No books found for "{searchQuery}"</p>
            )}
          </section>
        </div>

        {/* Footer Section */}
        <footer className="mt-20 pt-12 border-t border-border">
          <div className="text-center space-y-6">
            <p className="text-sm text-muted-foreground">{data.footer.note}</p>
            
            <div className="flex flex-wrap justify-center gap-6">
              {data.footer.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1"
                >
                  {link.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground">Made with {data.footer.madeWith}</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default SelfStudyContent;