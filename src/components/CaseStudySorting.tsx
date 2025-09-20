
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'api-order' | 'most-liked' | 'most-recent' | 'a-z' | 'z-a';

interface CaseStudySortingProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const CaseStudySorting = ({ value, onChange }: CaseStudySortingProps) => {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-500" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="api-order">Default</SelectItem>
          <SelectItem value="most-liked">Most Liked</SelectItem>
          <SelectItem value="most-recent">Most Recent</SelectItem>
          <SelectItem value="a-z">A–Z Title</SelectItem>
          <SelectItem value="z-a">Z–A Title</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CaseStudySorting;
