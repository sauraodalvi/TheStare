import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from '@/components/ui/badge';
import { CaseStudy, CaseStudiesFilters } from '@/types/caseStudy';
import { toast } from 'sonner';
import { XanoService } from '@/services/xanoService';

const CaseStudiesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [likesRange, setLikesRange] = useState<number[]>([0, 500]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const hasShownError = useRef(false);

  const { data: caseStudies = [], isLoading, error } = useQuery({
    queryKey: ['caseStudies'],
    queryFn: XanoService.getCaseStudies,
    retry: 1,
  });

  const categories = [...new Set(caseStudies.flatMap(cs => cs.Category || []))];
  const companies = [...new Set(caseStudies.map(cs => cs.Company).filter(Boolean))];
  const markets = [...new Set(caseStudies.map(cs => cs.Market).filter(Boolean))];
  const objectives = [...new Set(caseStudies.flatMap(cs => cs.Objective || []))];

  useEffect(() => {
    if (error && !hasShownError.current) {
      hasShownError.current = true;
      console.log('API Error details:', error);
      toast.error('Failed to load case studies', {
        description: 'The case studies endpoint is not available. Please check your Xano API configuration.'
      });
    }
  }, [error]);

  const filteredCaseStudies = useMemo(() => {
    let filtered = [...caseStudies];

    if (searchQuery) {
      filtered = filtered.filter(cs =>
        cs.Title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.Name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(cs =>
        cs.Category?.some(cat => selectedCategories.includes(cat))
      );
    }

    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(cs =>
        selectedCompanies.includes(cs.Company)
      );
    }

    if (selectedMarkets.length > 0) {
      filtered = filtered.filter(cs =>
        selectedMarkets.includes(cs.Market)
      );
    }

    filtered = filtered.filter(cs =>
      cs.Likes >= likesRange[0] && cs.Likes <= likesRange[1]
    );

    if (selectedObjectives.length > 0) {
      filtered = filtered.filter(cs =>
        cs.Objective?.some(objective => selectedObjectives.includes(objective))
      );
    }

    return filtered;
  }, [caseStudies, searchQuery, selectedCategories, selectedCompanies, selectedMarkets, likesRange, selectedObjectives]);

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCompanyChange = (company: string) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter(c => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const handleMarketChange = (market: string) => {
    if (selectedMarkets.includes(market)) {
      setSelectedMarkets(selectedMarkets.filter(m => m !== market));
    } else {
      setSelectedMarkets([...selectedMarkets, market]);
    }
  };

  const handleObjectiveChange = (objective: string) => {
    if (selectedObjectives.includes(objective)) {
      setSelectedObjectives(selectedObjectives.filter(o => o !== objective));
    } else {
      setSelectedObjectives([...selectedObjectives, objective]);
    }
  };

  const handleLikesRangeChange = (value: number[]) => {
    setLikesRange(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6 text-stare-navy">Explore Case Studies</h1>
          <div className="text-center">Loading case studies...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6 text-stare-navy">Explore Case Studies</h1>
          <div className="text-center text-red-600">
            <p>Unable to load case studies at this time.</p>
            <p className="text-sm text-gray-500 mt-2">Please check your Xano API configuration.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container">
        <h1 className="text-3xl font-bold mb-6 text-stare-navy">Explore Case Studies</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <div className="bg-white rounded-md shadow-md p-4 sticky top-20">
              <h2 className="text-xl font-semibold mb-4 text-stare-navy">Filters</h2>
              
              <div className="mb-4">
                <Label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</Label>
                <Input
                  type="text"
                  id="search"
                  placeholder="Search by title or name"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="mt-1"
                />
              </div>

              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">Categories</Label>
                <ScrollArea className="h-[200px] rounded-md border p-1">
                  <div className="flex flex-col space-y-1">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">Companies</Label>
                <ScrollArea className="h-[200px] rounded-md border p-1">
                  <div className="flex flex-col space-y-1">
                    {companies.map(company => (
                      <div key={company} className="flex items-center space-x-2">
                        <Checkbox
                          id={`company-${company}`}
                          checked={selectedCompanies.includes(company)}
                          onCheckedChange={() => handleCompanyChange(company)}
                        />
                        <Label htmlFor={`company-${company}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {company}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">Markets</Label>
                <ScrollArea className="h-[200px] rounded-md border p-1">
                  <div className="flex flex-col space-y-1">
                    {markets.map(market => (
                      <div key={market} className="flex items-center space-x-2">
                        <Checkbox
                          id={`market-${market}`}
                          checked={selectedMarkets.includes(market)}
                          onCheckedChange={() => handleMarketChange(market)}
                        />
                        <Label htmlFor={`market-${market}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {market}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">Likes Range</Label>
                <Slider
                  defaultValue={likesRange}
                  max={500}
                  step={10}
                  onValueChange={handleLikesRangeChange}
                />
                <div className="text-sm text-gray-500 mt-1">
                  Range: {likesRange[0]} - {likesRange[1]}
                </div>
              </div>

              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">Objectives</Label>
                <ScrollArea className="h-[200px] rounded-md border p-1">
                  <div className="flex flex-col space-y-1">
                    {objectives.map(objective => (
                      <div key={objective} className="flex items-center space-x-2">
                        <Checkbox
                          id={`objective-${objective}`}
                          checked={selectedObjectives.includes(objective)}
                          onCheckedChange={() => handleObjectiveChange(objective)}
                        />
                        <Label htmlFor={`objective-${objective}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {objective}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </aside>
          
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCaseStudies.length === 0 ? (
                <div className="text-center text-gray-500 col-span-2">
                  {isLoading ? 'Loading...' : 'No case studies found matching your criteria.'}
                </div>
              ) : (
                filteredCaseStudies.map(caseStudy => (
                  <Card key={caseStudy.id} className="bg-white rounded-md shadow-md overflow-hidden">
                    {caseStudy.Logo && caseStudy.Logo[0] && (
                      <img
                        src={caseStudy.Logo[0]}
                        alt={caseStudy.Title || caseStudy.Name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&auto=format&fit=crop&q=60';
                        }}
                      />
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-stare-navy">
                          {caseStudy.Title || caseStudy.Name}
                        </h3>
                        {caseStudy.Free === 'No' && <Badge variant="secondary">Premium</Badge>}
                      </div>
                      <div className="flex items-center space-x-2 mb-3 flex-wrap">
                        {caseStudy.Objective?.map(objective => (
                          <Badge key={objective} variant="outline" className="mb-1">{objective}</Badge>
                        ))}
                      </div>
                      {caseStudy.Creators_Tag && (
                        <p className="text-gray-600 mb-4">{caseStudy.Creators_Tag}</p>
                      )}
                      <div className="space-y-2 text-sm text-gray-500">
                        {caseStudy.Category && caseStudy.Category.length > 0 && (
                          <div>
                            <span className="font-medium">Categories:</span> {caseStudy.Category.join(', ')}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Likes:</span> {caseStudy.Likes}
                        </div>
                        {caseStudy.Company && (
                          <div>
                            <span className="font-medium">Company:</span> {caseStudy.Company}
                          </div>
                        )}
                        {caseStudy.Market && (
                          <div>
                            <span className="font-medium">Market:</span> {caseStudy.Market}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesList;
