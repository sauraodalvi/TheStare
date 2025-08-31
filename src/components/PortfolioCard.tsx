import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Portfolio } from '@/data/portfolioData';

interface PortfolioCardProps {
  portfolio: Portfolio;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio }) => {
  const handleClick = () => {
    if (portfolio.link && portfolio.link !== '#') {
      window.open(portfolio.link, '_blank');
    }
  };

  return (
    <Card 
      className={`card-hover cursor-pointer group bg-card border-border ${
        portfolio.link && portfolio.link !== '#' ? 'hover:border-primary/20' : ''
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-lg">
              {portfolio.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              {portfolio.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-tight">
              {portfolio.title}
            </p>
            {portfolio.company && (
              <p className="text-xs text-muted-foreground/80 mt-1">
                at {portfolio.company}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;