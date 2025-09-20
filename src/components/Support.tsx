
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

const Support = () => {
  const handleSupportUs = () => {
    window.open('https://saurao.gumroad.com/l/BuymeaCoffee', '_blank', 'noopener,noreferrer');
  };

  const handleShareWithOthers = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = window.location.origin;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card hover:shadow-lg transition-all duration-300 border border-border overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-stare-teal/10 mb-6">
                  <Heart className="h-8 w-8 text-stare-teal" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
                  Please consider supporting Stare
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl">
                  If you're unable to provide support at the moment, you can still make a difference by sharing Stare with those who may find it beneficial
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="bg-stare-teal hover:bg-stare-teal/90"
                    onClick={handleSupportUs}
                  >
                    Support Us
                  </Button>
                  <Button
                    variant="outline"
                    className="border-stare-navy text-stare-navy"
                    onClick={handleShareWithOthers}
                  >
                    Share with Others
                  </Button>
                </div>
                <div className="mt-8 text-muted-foreground">
                  <p className="font-medium">Trusted by 16,000+ PMs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Support;
