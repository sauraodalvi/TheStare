import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';

interface PortfolioTool {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  url: string;
}

interface PortfolioToolCardProps {
  tool: PortfolioTool;
  onClick: (tool: PortfolioTool) => void;
}

const PortfolioToolCardNew = ({ tool, onClick }: PortfolioToolCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'difficult':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card 
      className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group"
      onClick={() => onClick(tool)}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col h-full">
        {/* Tool Icon and Title Row */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-background border-2 border-border flex items-center justify-center flex-shrink-0">
            <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Category and Difficulty Row */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            <Badge 
              variant="secondary" 
              className="text-xs px-2 py-1 font-medium rounded-md truncate"
            >
              {tool.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <Badge 
              className={`text-xs px-2 py-1 font-medium rounded-md ${getDifficultyColor(tool.difficulty)}`}
            >
              {tool.difficulty}
            </Badge>

          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioToolCardNew;
