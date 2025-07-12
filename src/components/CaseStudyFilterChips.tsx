
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CaseStudyFilterChipsProps {
  selectedCategories: string[];
  selectedCompanies: string[];
  selectedMarkets: string[];
  selectedObjectives: string[];
  searchQuery: string;
  onRemoveCategory: (category: string) => void;
  onRemoveCompany: (company: string) => void;
  onRemoveMarket: (market: string) => void;
  onRemoveObjective: (objective: string) => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

const CaseStudyFilterChips = ({
  selectedCategories,
  selectedCompanies,
  selectedMarkets,
  selectedObjectives,
  searchQuery,
  onRemoveCategory,
  onRemoveCompany,
  onRemoveMarket,
  onRemoveObjective,
  onClearSearch,
  onClearAll
}: CaseStudyFilterChipsProps) => {
  const hasActiveFilters = 
    selectedCategories.length > 0 ||
    selectedCompanies.length > 0 ||
    selectedMarkets.length > 0 ||
    selectedObjectives.length > 0 ||
    searchQuery.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">Active filters:</span>
      
      {searchQuery && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Search: "{searchQuery}"
          <button onClick={onClearSearch} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      )}
      
      {selectedCategories.map(category => (
        <Badge key={category} variant="secondary" className="flex items-center gap-1">
          {category}
          <button onClick={() => onRemoveCategory(category)} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      
      {selectedCompanies.map(company => (
        <Badge key={company} variant="secondary" className="flex items-center gap-1">
          {company}
          <button onClick={() => onRemoveCompany(company)} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      
      {selectedMarkets.map(market => (
        <Badge key={market} variant="secondary" className="flex items-center gap-1">
          {market}
          <button onClick={() => onRemoveMarket(market)} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      
      {selectedObjectives.map(objective => (
        <Badge key={objective} variant="secondary" className="flex items-center gap-1">
          {objective}
          <button onClick={() => onRemoveObjective(objective)} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearAll}
          className="ml-2"
        >
          Clear All
        </Button>
      )}
    </div>
  );
};

export default CaseStudyFilterChips;
