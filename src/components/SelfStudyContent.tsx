import React, { useState, useEffect, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import ResourceCard from '@/components/ResourceCard';
import BookCard from '@/components/BookCard';
import BookHeader, { BookSortOption } from '@/components/BookHeader';
import { Book } from '@/types/book';

interface SelfStudyData {
  websiteLearning: Array<{name: string, url: string, description: string}>;
  communityLearning: Array<{name: string, url: string, description: string}>;
  cohortLearning: Array<{name: string, url: string, price: string, description?: string}>;
  footer: {
    note: string;
    links: Array<{name: string, url: string}>;
    madeWith: string;
  };
}

const SelfStudyContent = () => {
  const [data, setData] = useState<SelfStudyData | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<BookSortOption>('rating-high');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch main data
        const response = await fetch('/data.json');
        const jsonData = await response.json();
        setData(jsonData);

        // Fetch books data
        const booksResponse = await fetch('/books.json');
        const booksData = await booksResponse.json();
        setBooks(booksData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract unique categories from books
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    books.forEach(book => {
      if (book.category) {
        book.category.split(', ').forEach(cat => {
          const trimmedCat = cat.trim();
          if (trimmedCat) {
            categories.add(trimmedCat);
          }
        });
      }
    });
    return Array.from(categories).sort();
  }, [books]);

  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books;

    // Apply category filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(book => {
        if (!book.category) return false;
        const bookCategories = book.category.split(', ').map(cat => cat.trim());
        return selectedCategories.some(selectedCat =>
          bookCategories.includes(selectedCat)
        );
      });
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'rating-high':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'must-read-first':
        sorted.sort((a, b) => {
          const aIsMustRead = a.category?.includes('Must Read') ? 1 : 0;
          const bIsMustRead = b.category?.includes('Must Read') ? 1 : 0;
          if (aIsMustRead !== bIsMustRead) {
            return bIsMustRead - aIsMustRead; // Must Read first
          }
          return b.rating - a.rating; // Then by rating
        });
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return sorted;
  }, [books, selectedCategories, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategories([]);
  };

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
    <div className="container mx-auto max-w-7xl">
      <div className="space-y-12 md:space-y-16">
        {/* Website Learning Section */}
        <section id="website-learning">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
            Website Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
            Community Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
            Cohort Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
            Product Management Books
          </h2>

          <BookHeader
            selectedCategories={selectedCategories}
            availableCategories={availableCategories}
            sortBy={sortBy}
            totalResults={filteredAndSortedBooks.length}
            onCategoryChange={setSelectedCategories}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
          />

          {filteredAndSortedBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-2">No books found</p>
              <p className="text-muted-foreground/70 text-sm mb-4">Try adjusting your filters to see more results.</p>
              <button
                onClick={handleClearFilters}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredAndSortedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SelfStudyContent;