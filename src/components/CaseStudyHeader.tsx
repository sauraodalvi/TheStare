
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Plus, Search } from 'lucide-react';
import FilterDropdown from './FilterDropdown';
import SortDropdown from './SortDropdown';
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by title, creator, or company..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 h-12 text-base w-full"
        />
      </div>

      {/* Filters and Actions Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Left side - Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
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

        {/* Right side - Sorting and Submit */}
        <div className="flex items-center gap-3 shrink-0">
          <SortDropdown value={sortBy} onChange={onSortChange} />
          
          <Button 
            onClick={onSubmitClick}
            variant="brand"
            className="whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Submit Case Study
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-lg font-medium text-foreground">
        {totalResults} case studies found
      </div>
    </div>
  );
};

export default CaseStudyHeader;
