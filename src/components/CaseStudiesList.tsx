
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  BookOpen, 
  ArrowRight,
  Filter,
  Search,
  CheckSquare,
  ListFilter,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { caseStudiesData, getUniqueCategories, getUniqueCompanies } from '@/data/caseStudiesData';
import { CaseStudy, CaseStudyObjective, CaseStudiesFilters } from '@/types/caseStudy';
import { toast } from 'sonner';

const CaseStudiesList = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter states
  const [filters, setFilters] = useState<CaseStudiesFilters>({
    categories: [],
    companies: [],
    markets: [],
    likesRange: 'All',
    objectives: [],
    searchQuery: ''
  });

  // Get unique values for filter options
  const categories = useMemo(() => getUniqueCategories(), []);
  const companies = useMemo(() => getUniqueCompanies(), []);
  const objectives: CaseStudyObjective[] = [
    'Acquisition', 'Activation', 'Adoption', 'Conversion', 'Engagement',
    'First Time Experience', 'Gamification', 'Growth', 'GTM', 'Monetization',
    'MVP', 'Notification', 'Onboarding', 'Personalization'
  ];

  // Handler for filter changes
  const handleFilterChange = (key: keyof CaseStudiesFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Toggle selection in array filters
  const toggleArrayFilter = (key: 'categories' | 'companies' | 'markets' | 'objectives', value: string) => {
    setFilters(prev => {
      const currentValues = prev[key] as string[];
      return {
        ...prev,
        [key]: currentValues.includes(value) 
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value]
      };
    });
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      categories: [],
      companies: [],
      markets: [],
      likesRange: 'All',
      objectives: [],
      searchQuery: ''
    });
    setSearchQuery('');
  };

  // Handle "Request Case Studies" button click
  const handleRequestCaseStudies = () => {
    toast.success("Request submitted! We'll review your request soon.");
  };

  // Filter case studies based on selected filters
  const filteredCaseStudies = useMemo(() => {
    return caseStudiesData.filter(study => {
      // Search query filter
      const matchesSearch = 
        filters.searchQuery === '' || 
        study.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        study.company.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (study.creator && study.creator.toLowerCase().includes(filters.searchQuery.toLowerCase()));
      
      // Categories filter
      const matchesCategory = 
        filters.categories.length === 0 || 
        filters.categories.includes(study.category);
      
      // Companies filter
      const matchesCompany = 
        filters.companies.length === 0 || 
        filters.companies.includes(study.company);
      
      // Markets filter
      const matchesMarket = 
        filters.markets.length === 0 || 
        filters.markets.includes(study.market);
      
      // Likes range filter
      const matchesLikesRange = (() => {
        switch(filters.likesRange) {
          case 'More than 100':
            return study.likes > 100;
          case 'Between 50 to 100':
            return study.likes >= 50 && study.likes <= 100;
          case 'Less than 50':
            return study.likes < 50;
          default: // 'All'
            return true;
        }
      })();
      
      // Objectives filter
      const matchesObjectives = 
        filters.objectives.length === 0 || 
        study.objective.some(obj => filters.objectives.includes(obj));
      
      return matchesSearch && 
             matchesCategory && 
             matchesCompany && 
             matchesMarket && 
             matchesLikesRange && 
             matchesObjectives;
    });
  }, [filters]);

  // Calculate active filters count
  const activeFiltersCount = 
    filters.categories.length +
    filters.companies.length +
    filters.markets.length +
    (filters.likesRange !== 'All' ? 1 : 0) +
    filters.objectives.length;
  
  return (
    <>
      {/* Header Section */}
      <section className="bg-slate-50 py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-stare-navy mb-4">
              Case Studies
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              You now have access to 900+ case studies of digital products, offering invaluable learning experiences and in-depth knowledge
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                type="text" 
                placeholder="Type company name or creator name here to search" 
                className="pl-10" 
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex gap-2 items-center">
                    <Filter size={16} />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 md:w-96">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Active Filters</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeFiltersCount > 0 ? (
                          <>
                            {filters.categories.map(cat => (
                              <Badge key={cat} variant="outline" className="flex gap-1">
                                {cat}
                                <button 
                                  onClick={() => toggleArrayFilter('categories', cat)}
                                  className="ml-1 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                            {filters.companies.map(comp => (
                              <Badge key={comp} variant="outline" className="flex gap-1">
                                {comp}
                                <button 
                                  onClick={() => toggleArrayFilter('companies', comp)}
                                  className="ml-1 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                            {filters.markets.map(market => (
                              <Badge key={market} variant="outline" className="flex gap-1">
                                {market}
                                <button 
                                  onClick={() => toggleArrayFilter('markets', market)}
                                  className="ml-1 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                            {filters.likesRange !== 'All' && (
                              <Badge variant="outline" className="flex gap-1">
                                {filters.likesRange}
                                <button 
                                  onClick={() => handleFilterChange('likesRange', 'All')}
                                  className="ml-1 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </Badge>
                            )}
                            {filters.objectives.map(obj => (
                              <Badge key={obj} variant="outline" className="flex gap-1">
                                {obj}
                                <button 
                                  onClick={() => toggleArrayFilter('objectives', obj)}
                                  className="ml-1 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={clearFilters}
                              className="text-xs"
                            >
                              Clear All
                            </Button>
                          </>
                        ) : (
                          <span className="text-sm text-slate-500">No active filters</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Likes</h4>
                      <div className="flex flex-col gap-2">
                        {['All', 'More than 100', 'Between 50 to 100', 'Less than 50'].map((range) => (
                          <div key={range} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`likes-${range}`}
                              checked={filters.likesRange === range}
                              onChange={() => handleFilterChange('likesRange', range)}
                              className="h-4 w-4 text-stare-teal"
                            />
                            <label htmlFor={`likes-${range}`} className="text-sm">{range}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Market</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {['B2C', 'B2B', 'B2C & B2B'].map((market) => (
                          <div key={market} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`market-${market}`}
                              checked={filters.markets.includes(market)}
                              onCheckedChange={() => toggleArrayFilter('markets', market)}
                            />
                            <Label htmlFor={`market-${market}`} className="text-sm">{market}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Objectives</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {objectives.map((objective) => (
                          <div key={objective} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`objective-${objective}`}
                              checked={filters.objectives.includes(objective)}
                              onCheckedChange={() => toggleArrayFilter('objectives', objective)}
                            />
                            <Label htmlFor={`objective-${objective}`} className="text-sm">{objective}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Category Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Categories {filters.categories.length > 0 && `(${filters.categories.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleArrayFilter('categories', category)}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Company Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Companies {filters.companies.length > 0 && `(${filters.companies.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Companies</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {companies.map((company) => (
                    <DropdownMenuCheckboxItem
                      key={company}
                      checked={filters.companies.includes(company)}
                      onCheckedChange={() => toggleArrayFilter('companies', company)}
                    >
                      {company}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={handleRequestCaseStudies}>
                Request Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-12">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {filteredCaseStudies.length} Case Studies Found
            </h2>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={clearFilters} className="text-sm">
                Clear All Filters
              </Button>
            )}
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCaseStudies.length > 0 ? (
              filteredCaseStudies.map((study) => (
                <Card key={study.id} className="overflow-hidden border-none shadow-md card-hover">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={study.image} 
                      alt={study.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {study.isNew && (
                        <span className="bg-stare-teal text-white text-xs font-semibold px-3 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <span className="absolute top-4 right-4 bg-white/90 text-stare-navy text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Likes: {study.likes}
                    </span>
                  </div>
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium text-stare-teal mb-2 flex items-center gap-2">
                      <BookOpen size={14} />
                      {study.category}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-stare-navy hover:text-stare-teal transition-colors">
                      <a href="#">{study.title}</a>
                    </h3>
                    <p className="text-slate-600 mb-4 text-sm line-clamp-2">
                      {study.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        {study.company}
                      </span>
                      <Button variant="link" className="px-0 text-stare-teal flex items-center gap-1">
                        Read Case Study
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-slate-500">No case studies found matching your filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CaseStudiesList;
