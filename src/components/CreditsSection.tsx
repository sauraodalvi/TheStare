
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';

const CreditsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 rounded-full bg-stare-navy/10 mb-4">
                  <Award className="h-6 w-6 text-stare-navy" />
                </div>
                <h2 className="text-2xl font-bold text-stare-navy mb-4">
                  Credits
                </h2>
                <p className="text-slate-600 mb-8">
                  Special thanks to storyset.com for providing free illustrations
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CreditsSection;
