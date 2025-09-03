
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';

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

  const totalFilters = selectedCategories.length + selectedCompanies.length + selectedMarkets.length + selectedObjectives.length + (searchQuery ? 1 : 0);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
      <div className="flex items-center gap-2 text-sm font-semibold text-accent-foreground">
        <Filter className="w-4 h-4" />
        <span>Active filters ({totalFilters}):</span>
      </div>
      
      {searchQuery && (
        <Badge variant="secondary" className="flex items-center gap-1.5">
          <span className="text-xs">Search: "{searchQuery}"</span>
          <button 
            onClick={onClearSearch} 
            className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      )}
      
      {selectedCategories.map(category => (
        <Badge key={category} variant="secondary" className="flex items-center gap-1.5">
          <span className="text-xs">{category}</span>
          <button 
            onClick={() => onRemoveCategory(category)} 
            className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      
      {selectedCompanies.map(company => (
        <Badge key={company} variant="secondary" className="flex items-center gap-1.5">
          <span className="text-xs">{company}</span>
          <button 
            onClick={() => onRemoveCompany(company)} 
            className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      
      {selectedMarkets.map(market => (
        <Badge key={market} variant="secondary" className="flex items-center gap-1.5">
          <span className="text-xs">{market}</span>
          <button 
            onClick={() => onRemoveMarket(market)} 
            className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      
      {selectedObjectives.map(objective => (
        <Badge key={objective} variant="secondary" className="flex items-center gap-1.5">
          <span className="text-xs">{objective}</span>
          <button 
            onClick={() => onRemoveObjective(objective)} 
            className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onClearAll}
        className="ml-2 text-xs px-3 py-1"
      >
        Clear All
      </Button>
    </div>
  );
};

export default CaseStudyFilterChips;
