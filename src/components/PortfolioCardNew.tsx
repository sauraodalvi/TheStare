import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface Portfolio {
  name: string;
  role: string;
  title: string;
  status: string;
  portfolio_url: string;
  iframe: string;
}

interface PortfolioCardProps {
  portfolio: Portfolio;
  onClick: (portfolio: Portfolio) => void;
}

const PortfolioCardNew = ({ portfolio, onClick }: PortfolioCardProps) => {
  return (
    <Card 
      className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group"
      onClick={() => onClick(portfolio)}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col h-full">
        {/* Profile and Title Row */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-background border-2 border-border flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {portfolio.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
              {portfolio.title}
            </p>
          </div>
        </div>


      </CardContent>
    </Card>
  );
};

export default PortfolioCardNew;
