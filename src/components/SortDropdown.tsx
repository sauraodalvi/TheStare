import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Search, ArrowUpDown } from 'lucide-react';
import { SortOption } from './CaseStudySorting';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions = [
  { value: 'most-liked' as SortOption, label: 'Most Liked' },
  { value: 'most-recent' as SortOption, label: 'Most Recent' },
  { value: 'a-z' as SortOption, label: 'A-Z' },
  { value: 'z-a' as SortOption, label: 'Z-A' },
];

const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSort = sortOptions.find(option => option.value === value);
  
  const filteredOptions = sortOptions.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOptionSelect = (option: SortOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-between h-10 px-3 min-w-[140px] bg-white border-gray-300 hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            {currentSort?.label || 'Sort by'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 z-50 bg-white shadow-lg border" align="start">
        <div className="p-3 border-b bg-white">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sort options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 bg-white"
            />
          </div>
        </div>
        
        <div className="max-h-60 overflow-y-auto p-2 bg-white">
          {filteredOptions.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-4">
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-2 rounded-sm px-2 py-2 hover:bg-gray-100 cursor-pointer ${
                  value === option.value ? 'bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => handleOptionSelect(option.value)}
              >
                <span className="text-sm flex-1">{option.label}</span>
                {value === option.value && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5">
                    Active
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortDropdown;