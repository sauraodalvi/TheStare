import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  name: string;
  description: string;
  url: string;
  buttonText?: string;
  price?: string;
}

const ResourceCard = ({ name, description, url, buttonText = "Visit", price }: ResourceCardProps) => {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="h-full flex flex-col bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border group">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1 space-y-4">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
            {name}
          </h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          {price && (
            <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
              {price}
            </div>
          )}
        </div>
        
        <Button
          onClick={handleClick}
          className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
          size="sm"
        >
          <span>{buttonText}</span>
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;