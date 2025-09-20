import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ShoppingCart } from 'lucide-react';

interface Template {
  name: string;
  author: string;
  description: string;
  downloadInstructions?: string;
  link: string;
  button?: string;
}

interface ResumeTemplateCardProps {
  template: Template;
}

const ResumeTemplateCard: React.FC<ResumeTemplateCardProps> = ({ template }) => {
  const handleClick = () => {
    window.open(template.link, '_blank');
  };

  const isFree = !template.button || template.button !== 'Buy Now';

  return (
    <Card className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-4 sm:gap-6">
          {/* Left side - Content */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground text-base mb-1">
                {template.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                by {template.author}
              </p>
            </div>

            <p className="text-muted-foreground text-sm">
              {template.description}
            </p>

            {template.downloadInstructions && (
              <div className="bg-muted/50 p-3 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>How to use:</strong> {template.downloadInstructions}
                </p>
              </div>
            )}
          </div>

          {/* Right side - CTA Buttons */}
          <div className="flex flex-col justify-center gap-2 min-w-[120px] sm:min-w-[140px]">
            <Button
              onClick={handleClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              {isFree ? (
                <>
                  <Download className="h-3 w-3 mr-2" />
                  Get Template
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3 w-3 mr-2" />
                  Buy Now
                </>
              )}
            </Button>
            {isFree && (
              <span className="text-xs text-muted-foreground text-center">
                Free
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeTemplateCard;