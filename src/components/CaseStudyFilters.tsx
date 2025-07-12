
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);

  const FilterSection = ({ title, items, selectedItems, onChange, maxHeight = "h-32" }: {
    title: string;
    items: string[];
    selectedItems: string[];
    onChange: (item: string) => void;
    maxHeight?: string;
  }) => (
    <div>
      <Label className="text-sm font-semibold text-gray-700 mb-3 block">
        {title} {selectedItems.length > 0 && (
          <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-2">
            {selectedItems.length}
          </span>
        )}
      </Label>
      <ScrollArea className={`${maxHeight} border rounded-lg bg-white`}>
        <div className="p-3 space-y-2.5">
          {items.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No options available</p>
          ) : (
            items.map(item => (
              <div key={item} className="flex items-center space-x-2.5 hover:bg-gray-50 p-1 rounded">
                <Checkbox
                  id={`${title.toLowerCase()}-${item}`}
                  checked={selectedItems.includes(item)}
                  onCheckedChange={() => onChange(item)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label 
                  htmlFor={`${title.toLowerCase()}-${item}`} 
                  className="text-sm font-normal cursor-pointer flex-1 leading-tight"
                >
                  {item}
                </Label>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 rounded-t-xl">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              {(selectedCategories.length + selectedCompanies.length + selectedMarkets.length + selectedObjectives.length) > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                  {selectedCategories.length + selectedCompanies.length + selectedMarkets.length + selectedObjectives.length}
                </span>
              )}
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-0 space-y-6 border-t border-gray-100">
            {/* Mobile Search */}
            <div>
              <Label htmlFor="search" className="text-sm font-semibold text-gray-700 mb-3 block">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  id="search"
                  placeholder="Search by title, creator, or company..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <FilterSection
              title="Categories"
              items={categories}
              selectedItems={selectedCategories}
              onChange={onCategoryChange}
            />

            <FilterSection
              title="Companies"
              items={companies}
              selectedItems={selectedCompanies}
              onChange={onCompanyChange}
            />

            <FilterSection
              title="Markets"
              items={markets}
              selectedItems={selectedMarkets}
              onChange={onMarketChange}
            />

            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Likes Range: {likesRange[0]} - {likesRange[1]}
              </Label>
              <div className="bg-white p-3 border rounded-lg">
                <Slider
                  value={likesRange}
                  max={500}
                  step={10}
                  onValueChange={onLikesRangeChange}
                  className="mt-2"
                />
              </div>
            </div>

            <FilterSection
              title="Objectives"
              items={objectives}
              selectedItems={selectedObjectives}
              onChange={onObjectiveChange}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block p-6 sticky top-20">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          {(selectedCategories.length + selectedCompanies.length + selectedMarkets.length + selectedObjectives.length) > 0 && (
            <span className="bg-blue-100 text-blue-700 text-sm px-2.5 py-1 rounded-full font-medium">
              {selectedCategories.length + selectedCompanies.length + selectedMarkets.length + selectedObjectives.length}
            </span>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="search-desktop" className="text-sm font-semibold text-gray-700 mb-3 block">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                id="search-desktop"
                placeholder="Search by title, creator, or company..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <FilterSection
            title="Categories"
            items={categories}
            selectedItems={selectedCategories}
            onChange={onCategoryChange}
          />

          <FilterSection
            title="Companies"
            items={companies}
            selectedItems={selectedCompanies}
            onChange={onCompanyChange}
          />

          <FilterSection
            title="Markets"
            items={markets}
            selectedItems={selectedMarkets}
            onChange={onMarketChange}
          />

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Likes Range: {likesRange[0]} - {likesRange[1]}
            </Label>
            <div className="bg-gray-50 p-3 border rounded-lg">
              <Slider
                value={likesRange}
                max={500}
                step={10}
                onValueChange={onLikesRangeChange}
                className="mt-2"
              />
            </div>
          </div>

          <FilterSection
            title="Objectives"
            items={objectives}
            selectedItems={selectedObjectives}
            onChange={onObjectiveChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CaseStudyFilters;
