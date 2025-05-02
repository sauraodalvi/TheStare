
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

const Support = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-stare-teal/10 mb-6">
                  <Heart className="h-8 w-8 text-stare-teal" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-stare-navy mb-4">
                  Please consider supporting Stare
                </h2>
                <p className="text-slate-600 mb-8 max-w-2xl">
                  If you're unable to provide support at the moment, you can still make a difference by sharing Stare with those who may find it beneficial
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-stare-teal hover:bg-stare-teal/90">
                    Support Us
                  </Button>
                  <Button variant="outline" className="border-stare-navy text-stare-navy">
                    Share with Others
                  </Button>
                </div>
                <div className="mt-8 text-slate-500">
                  <p className="font-medium">Trusted by 16000+ PMs</p>
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
