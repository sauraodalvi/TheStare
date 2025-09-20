import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

export type VideoSortOption = 'date-recent' | 'popularity' | 'alphabetical';

interface VideoSessionHeaderProps {
  selectedCategories: string[];
  availableCategories: string[];
  sortBy: VideoSortOption;
  totalResults: number;
  onCategoryChange: (categories: string[]) => void;
  onSortChange: (sort: VideoSortOption) => void;
  onClearFilters: () => void;
}

const VideoSessionHeader = ({
  selectedCategories,
  availableCategories,
  sortBy,
  totalResults,
  onCategoryChange,
  onSortChange,
  onClearFilters
}: VideoSessionHeaderProps) => {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleRemoveCategory = (category: string) => {
    onCategoryChange(selectedCategories.filter(c => c !== category));
  };

  const getSortLabel = (sort: VideoSortOption) => {
    switch (sort) {
      case 'date-recent':
        return 'Most Recent';
      case 'popularity':
        return 'Most Popular';
      case 'alphabetical':
        return 'A-Z';
      default:
        return 'Sort by';
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Filters and Sorting Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Left side - Category Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <span className="text-sm font-medium text-foreground mr-2">Filter by:</span>
          {availableCategories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={() => handleCategoryToggle(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Right side - Sorting */}
        <div className="flex items-center gap-3 shrink-0">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-recent">Most Recent</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters and Results */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Active Filters */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => handleRemoveCategory(category)}
              >
                {category}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs h-6 px-2"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm font-medium text-foreground">
          {totalResults} sessions found
        </div>
      </div>
    </div>
  );
};

export default VideoSessionHeader;
