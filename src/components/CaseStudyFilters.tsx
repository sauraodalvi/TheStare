
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter } from 'lucide-react';

interface CaseStudyFiltersProps {
  searchQuery: string;
  selectedCategories: string[];
  selectedCompanies: string[];
  selectedMarkets: string[];
  selectedObjectives: string[];
  likesRange: number[];
  categories: string[];
  companies: string[];
  markets: string[];
  objectives: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onCompanyChange: (company: string) => void;
  onMarketChange: (market: string) => void;
  onObjectiveChange: (objective: string) => void;
  onLikesRangeChange: (value: number[]) => void;
}

const CaseStudyFilters = ({
  searchQuery,
  selectedCategories,
  selectedCompanies,
  selectedMarkets,
  selectedObjectives,
  likesRange,
  categories,
  companies,
  markets,
  objectives,
  onSearchChange,
  onCategoryChange,
  onCompanyChange,
  onMarketChange,
  onObjectiveChange,
  onLikesRangeChange
}: CaseStudyFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-stare-navy" />
        <h2 className="text-lg font-semibold text-stare-navy">Filters</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              id="search"
              placeholder="Search by title or name"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Categories ({selectedCategories.length})
          </Label>
          <ScrollArea className="h-32 border rounded-md">
            <div className="p-3 space-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => onCategoryChange(category)}
                  />
                  <Label 
                    htmlFor={`category-${category}`} 
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Companies ({selectedCompanies.length})
          </Label>
          <ScrollArea className="h-32 border rounded-md">
            <div className="p-3 space-y-2">
              {companies.map(company => (
                <div key={company} className="flex items-center space-x-2">
                  <Checkbox
                    id={`company-${company}`}
                    checked={selectedCompanies.includes(company)}
                    onCheckedChange={() => onCompanyChange(company)}
                  />
                  <Label 
                    htmlFor={`company-${company}`} 
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {company}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Markets ({selectedMarkets.length})
          </Label>
          <ScrollArea className="h-32 border rounded-md">
            <div className="p-3 space-y-2">
              {markets.map(market => (
                <div key={market} className="flex items-center space-x-2">
                  <Checkbox
                    id={`market-${market}`}
                    checked={selectedMarkets.includes(market)}
                    onCheckedChange={() => onMarketChange(market)}
                  />
                  <Label 
                    htmlFor={`market-${market}`} 
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {market}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Likes Range: {likesRange[0]} - {likesRange[1]}
          </Label>
          <Slider
            value={likesRange}
            max={500}
            step={10}
            onValueChange={onLikesRangeChange}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Objectives ({selectedObjectives.length})
          </Label>
          <ScrollArea className="h-32 border rounded-md">
            <div className="p-3 space-y-2">
              {objectives.map(objective => (
                <div key={objective} className="flex items-center space-x-2">
                  <Checkbox
                    id={`objective-${objective}`}
                    checked={selectedObjectives.includes(objective)}
                    onCheckedChange={() => onObjectiveChange(objective)}
                  />
                  <Label 
                    htmlFor={`objective-${objective}`} 
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {objective}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyFilters;
