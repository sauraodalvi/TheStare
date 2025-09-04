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
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          {template.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          by {template.author}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          {template.description}
        </p>
        
        {template.downloadInstructions && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>How to use:</strong> {template.downloadInstructions}
            </p>
          </div>
        )}
        
        <Button
          onClick={handleClick}
          className="w-full"
          variant={isFree ? "default" : "secondary"}
        >
          {isFree ? (
            <>
              <Download className="h-4 w-4 mr-2" />
              Get Template (Free)
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {template.button}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResumeTemplateCard;