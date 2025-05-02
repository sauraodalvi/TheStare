import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CaseStudy, CaseStudiesFilters, CaseStudyObjective } from '@/types/caseStudy';
import { Toaster, toast } from 'sonner';
import { caseStudiesData } from '@/data/caseStudiesData';

const CaseStudiesList = () => {
  const initialCaseStudies: CaseStudy[] = [
    {
      id: '1',
      title: 'Revolutionizing E-commerce with AI-Powered Personalization',
      isNew: true,
      likes: 234,
      category: 'E-commerce',
      company: 'Shopify',
      market: 'B2C',
      objective: ['Acquisition', 'Personalization'],
      description: 'Shopify uses AI to personalize the shopping experience, increasing customer engagement and sales.',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGUtY29tbWVyY2V8ZW58MHx8fHx8MA=='
    },
    {
      id: '2',
      title: 'Enhancing User Engagement Through Gamification',
      isNew: false,
      likes: 189,
      category: 'Social Media',
      company: 'Facebook',
      market: 'B2C',
      objective: ['Engagement', 'Gamification'],
      description: 'Facebook implemented gamification strategies to boost user engagement and time spent on the platform.',
      image: 'https://images.unsplash.com/photo-1517694712202-14f9da678177?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c29jaWFsJTIwbWVkaWF8ZW58MHx8fHx8MA=='
    },
    {
      id: '3',
      title: 'Driving B2B Sales with Targeted Content Marketing',
      isNew: false,
      likes: 312,
      category: 'Marketing',
      company: 'HubSpot',
      creator: 'John Doe',
      market: 'B2B',
      objective: ['Acquisition', 'Conversion'],
      description: 'HubSpot utilized targeted content marketing to attract and convert B2B leads, resulting in increased sales.',
      image: 'https://images.unsplash.com/photo-1497034825429-c343dd07bca9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFya2V0aW5nfGVufDB8fHx8MA=='
    },
    {
      id: '4',
      title: 'Optimizing Mobile App Onboarding for Higher Retention',
      isNew: false,
      likes: 95,
      category: 'Mobile Apps',
      company: 'Duolingo',
      market: 'B2C',
      objective: ['Onboarding', 'Retention'],
      description: 'Duolingo improved its mobile app onboarding process, leading to higher user retention rates.',
      image: 'https://images.unsplash.com/photo-1550751579675-539cb2189043?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9iaWxlJTIwYXBwfGVufDB8fHx8MA=='
    },
    {
      id: '5',
      title: 'Expanding Market Reach Through Strategic Partnerships',
      isNew: false,
      likes: 267,
      category: 'Business Development',
      company: 'Amazon',
      market: 'B2C & B2B',
      objective: ['Growth', 'GTM'],
      description: 'Amazon expanded its market reach by forming strategic partnerships with key players in various industries.',
      image: 'https://images.unsplash.com/photo-1505051579675-539cb2189043?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzJTIwZGV2ZWxvcG1lbnR8ZW58MHx8fHx8MA=='
    },
    {
      id: '6',
      title: 'Improving Customer Satisfaction with Personalized Support',
      isNew: false,
      likes: 145,
      category: 'Customer Service',
      company: 'Zendesk',
      market: 'B2B',
      objective: ['Engagement', 'Retention'],
      description: 'Zendesk enhanced customer satisfaction by providing personalized support experiences.',
      image: 'https://images.unsplash.com/photo-1543269664-745ab67984a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3VzdG9tZXIlMjBzZXJ2aWNlfGVufDB8fHx8MA=='
    },
  ];

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(caseStudiesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<('B2C' | 'B2B' | 'B2C & B2B')[]>([]);
  const [likesRange, setLikesRange] = useState<number[]>([0, 500]);
  const [selectedObjectives, setSelectedObjectives] = useState<CaseStudyObjective[]>([]);

  const categories = [...new Set(caseStudiesData.map(cs => cs.category))];
  const companies = [...new Set(caseStudiesData.map(cs => cs.company))];

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategories, selectedCompanies, selectedMarkets, likesRange, selectedObjectives]);

  const applyFilters = () => {
    let filteredCaseStudies = [...initialCaseStudies];

    if (searchQuery) {
      filteredCaseStudies = filteredCaseStudies.filter(cs =>
        cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filteredCaseStudies = filteredCaseStudies.filter(cs =>
        selectedCategories.includes(cs.category)
      );
    }

    if (selectedCompanies.length > 0) {
      filteredCaseStudies = filteredCaseStudies.filter(cs =>
        selectedCompanies.includes(cs.company)
      );
    }

    if (selectedMarkets.length > 0) {
      filteredCaseStudies = filteredCaseStudies.filter(cs =>
        selectedMarkets.includes(cs.market)
      );
    }

    filteredCaseStudies = filteredCaseStudies.filter(cs =>
      cs.likes >= likesRange[0] && cs.likes <= likesRange[1]
    );

    if (selectedObjectives.length > 0) {
      filteredCaseStudies = filteredCaseStudies.filter(cs =>
        cs.objective.some(objective => selectedObjectives.includes(objective))
      );
    }

    setCaseStudies(filteredCaseStudies);
  };

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

  const handleMarketChange = (market: 'B2C' | 'B2B' | 'B2C & B2B') => {
    if (selectedMarkets.includes(market)) {
      setSelectedMarkets(selectedMarkets.filter(m => m !== market));
    } else {
      setSelectedMarkets([...selectedMarkets, market]);
    }
  };

  const handleObjectiveChange = (objective: CaseStudyObjective) => {
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

  const objectiveOptions: CaseStudyObjective[] = [
    'Acquisition', 'Activation', 'Adoption', 'Conversion', 'Engagement',
    'First Time Experience', 'Gamification', 'Growth', 'GTM', 'Monetization',
    'MVP', 'Notification', 'Onboarding', 'Personalization', 'Retention'
  ];

  return (
    <section className="py-12">
      <Toaster position="top-center" />
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
                  placeholder="Search by title or description"
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
                <div className="flex flex-col space-y-1">
                  {['B2C', 'B2B', 'B2C & B2B'].map(market => (
                    <div key={market} className="flex items-center space-x-2">
                      <Checkbox
                        id={`market-${market}`}
                        checked={selectedMarkets.includes(market as 'B2C' | 'B2B' | 'B2C & B2B')}
                        onCheckedChange={() => handleMarketChange(market as 'B2C' | 'B2B' | 'B2C & B2B')}
                      />
                      <Label htmlFor={`market-${market}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {market}
                      </Label>
                    </div>
                  ))}
                </div>
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
                    {objectiveOptions.map(objective => (
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
              {caseStudies.length === 0 ? (
                <div className="text-center text-gray-500">No case studies found matching your criteria.</div>
              ) : (
                caseStudies.map(caseStudy => (
                  <Card key={caseStudy.id} className="bg-white rounded-md shadow-md overflow-hidden">
                    <img
                      src={caseStudy.image}
                      alt={caseStudy.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-stare-navy">{caseStudy.title}</h3>
                        {caseStudy.isNew && <Badge variant="secondary">New</Badge>}
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        {caseStudy.objective.map(objective => (
                          <Badge key={objective} variant="outline">{objective}</Badge>
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4">{caseStudy.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-500">
                          <span className="font-medium">Category:</span> {caseStudy.category}
                        </div>
                        <div className="text-gray-500">
                          <span className="font-medium">Likes:</span> {caseStudy.likes}
                        </div>
                      </div>
                      <div className="text-gray-500">
                        <span className="font-medium">Company:</span> {caseStudy.company}
                      </div>
                      {caseStudy.creator && (
                        <div className="text-gray-500">
                          <span className="font-medium">Creator:</span> {caseStudy.creator}
                        </div>
                      )}
                      <div className="text-gray-500">
                        <span className="font-medium">Market:</span> {caseStudy.market}
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
