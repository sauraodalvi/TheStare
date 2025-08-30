
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import FilterDropdown from './FilterDropdown';
import { SortOption } from './CaseStudySorting';

interface CaseStudyHeaderProps {
  searchQuery: string;
  selectedCategories: string[];
  selectedCompanies: string[];
  selectedMarkets: string[];
  selectedObjectives: string[];
  categories: string[];
  companies: string[];
  markets: string[];
  objectives: string[];
  sortBy: SortOption;
  totalResults: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (categories: string[]) => void;
  onCompanyChange: (companies: string[]) => void;
  onMarketChange: (markets: string[]) => void;
  onObjectiveChange: (objectives: string[]) => void;
  onSortChange: (sort: SortOption) => void;
  onSubmitClick: () => void;
}

const CaseStudyHeader = ({
  searchQuery,
  selectedCategories,
  selectedCompanies,
  selectedMarkets,
  selectedObjectives,
  categories,
  companies,
  markets,
  objectives,
  sortBy,
  totalResults,
  onSearchChange,
  onCategoryChange,
  onCompanyChange,
  onMarketChange,
  onObjectiveChange,
  onSortChange,
  onSubmitClick
}: CaseStudyHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Full Width Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by title, creator, or company..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          title="Category"
          options={categories}
          selectedOptions={selectedCategories}
          onSelectionChange={onCategoryChange}
          placeholder="Search categories..."
        />
        
        <FilterDropdown
          title="Company"
          options={companies}
          selectedOptions={selectedCompanies}
          onSelectionChange={onCompanyChange}
          placeholder="Search companies..."
        />
        
        <FilterDropdown
          title="Market"
          options={markets}
          selectedOptions={selectedMarkets}
          onSelectionChange={onMarketChange}
          placeholder="Search markets..."
        />
        
        <FilterDropdown
          title="Objective"
          options={objectives}
          selectedOptions={selectedObjectives}
          onSelectionChange={onObjectiveChange}
          placeholder="Search objectives..."
        />
      </div>

      {/* Results and Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-lg font-medium text-gray-900">
          {totalResults} case studies found
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="most-liked">Most Liked</SelectItem>
              <SelectItem value="most-recent">Most Recent</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={onSubmitClick}
            className="bg-stare-navy hover:bg-stare-navy/90 whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Submit Case Study
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyHeader;
