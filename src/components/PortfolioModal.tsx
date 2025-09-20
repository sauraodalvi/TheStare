import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Portfolio {
  name: string;
  role: string;
  title: string;
  status: string;
  portfolio_url: string;
  iframe: string;
}

interface PortfolioModalProps {
  portfolio: Portfolio | null;
  isOpen: boolean;
  onClose: () => void;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ portfolio, isOpen, onClose }) => {
  if (!portfolio) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl w-full max-h-[95vh] p-0 bg-background overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground pr-8">
            {portfolio.name}'s Portfolio
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {portfolio.title}
          </DialogDescription>
        </DialogHeader>

        <div className="pl-4 sm:pl-6 pb-4 sm:pb-6 flex-1 overflow-hidden">
          <div className="aspect-[4/5] overflow-hidden bg-muted max-h-[calc(95vh-120px)] w-full">
            <iframe
              src={portfolio.portfolio_url}
              className="w-full h-full border-0"
              title={`${portfolio.name}'s Portfolio`}
              loading="lazy"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioModal;
