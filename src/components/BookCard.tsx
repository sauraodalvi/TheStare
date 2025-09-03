import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen } from 'lucide-react';

interface BookCardProps {
  name: string;
  description: string;
  url: string;
  image: string;
}

const BookCard = ({ name, description, url, image }: BookCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="h-full flex flex-col bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border group">
      <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg bg-muted">
        {!imageError && image ? (
          <img
            src={image}
            alt={`${name} book cover`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
            <BookOpen className="h-16 w-16 text-accent/40" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex-1 space-y-3">
          <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
            {name}
          </h3>
          
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
        
        <Button
          onClick={handleClick}
          className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
          size="sm"
        >
          <span>Read More</span>
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;