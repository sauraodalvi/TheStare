import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Star } from 'lucide-react';
import { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
}

const BookCard = ({ book, onClick }: BookCardProps) => {
  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(book.link, '_blank', 'noopener,noreferrer');
  };

  const handleGoodreadsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(book.goodreads, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(book);
    }
  };

  const categories = book.category ? book.category.split(', ').filter(cat => cat.trim() !== '') : [];

  return (
    <Card
      className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group"
      onClick={handleCardClick}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col h-full">
        {/* Book Icon and Title */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-background border-2 border-border flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
              by {book.author}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium text-foreground">{book.rating}</span>
        </div>

        {/* Categories and Actions Row */}
        <div className="mt-auto space-y-3">
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {categories.slice(0, 2).map((category, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-1 font-medium rounded-md truncate"
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handlePurchaseClick}
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <span>Buy</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
            <Button
              onClick={handleGoodreadsClick}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <span>Reviews</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;