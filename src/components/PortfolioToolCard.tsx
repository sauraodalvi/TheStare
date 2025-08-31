import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { Tool } from '@/data/portfolioData';

interface PortfolioToolCardProps {
  tool: Tool;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-secondary/10 text-secondary border-secondary/20';
    case 'Medium':
      return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
    case 'Difficult':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const PortfolioToolCard: React.FC<PortfolioToolCardProps> = ({ tool }) => {
  const handleClick = () => {
    if (tool.link && tool.link !== '#') {
      window.open(tool.link, '_blank');
    }
  };

  return (
    <Card 
      className={`card-hover cursor-pointer group bg-card border-border ${
        tool.link && tool.link !== '#' ? 'hover:border-primary/20' : ''
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                {tool.name}
              </h3>
              {tool.link && tool.link !== '#' && (
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-tight mb-3">
              {tool.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {tool.category}
          </Badge>
          <Badge 
            variant="outline" 
            className={`text-xs ${getDifficultyColor(tool.difficulty)}`}
          >
            {tool.difficulty}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioToolCard;