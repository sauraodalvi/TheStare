import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { OptimizedImage } from '@/components/OptimizedImage';

interface Company {
  id: number;
  name: string;
  logoUrl: string;
  altText: string;
}

const CompanyLogos = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await fetch('/data/companies.json');
        if (!response.ok) {
          throw new Error('Failed to load companies data');
        }
        const data = await response.json();
        setCompanies(data.companies);
      } catch (error) {
        console.error('Error loading companies:', error);
        setError('Failed to load company logos');
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  if (error) {
    return null; // Gracefully hide the section if there's an error
  }

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
              Trusted by 16,000+ PMs at Leading Companies
            </h2>
          </div>

          {/* Company Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 22 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg h-28 sm:h-32 md:h-36 flex items-center justify-center p-4 sm:p-5 md:p-6"
                >
                  <div className="w-full h-16 sm:h-20 md:h-24 bg-muted rounded animate-pulse"></div>
                </div>
              ))
            ) : (
              companies.map((company) => (
                <div
                  key={company.id}
                  className="bg-card hover:shadow-lg transition-all duration-300 rounded-lg border border-border h-28 sm:h-32 md:h-36 flex items-center justify-center p-4 sm:p-5 md:p-6 group"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <OptimizedImage
                      src={company.logoUrl}
                      alt={company.altText}
                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      width={120}
                      height={80}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Text */}
          {!loading && companies.length > 0 && (
            <div className="text-center">
              <p className="text-muted-foreground text-lg">
                and many more
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CompanyLogos;
