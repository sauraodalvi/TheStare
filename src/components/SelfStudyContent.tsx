import React, { useState, useEffect, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
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

  const filteredData = data;

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
        <div className="space-y-16">
          {/* Website Learning Section */}
          <section id="website-learning">
            <h2 className="text-3xl font-bold text-foreground mb-8">
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
          </section>

          {/* Community Learning Section */}
          <section id="community-learning">
            <h2 className="text-3xl font-bold text-foreground mb-8">
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
          </section>

          {/* Cohort Learning Section */}
          <section id="cohort-learning">
            <h2 className="text-3xl font-bold text-foreground mb-8">
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
          </section>

          {/* Books Section */}
          <section id="books">
            <h2 className="text-3xl font-bold text-foreground mb-8">
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