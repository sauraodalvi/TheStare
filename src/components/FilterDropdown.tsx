
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Search } from 'lucide-react';

interface FilterDropdownProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (options: string[]) => void;
  placeholder?: string;
}

const FilterDropdown = ({ 
  title, 
  options, 
  selectedOptions, 
  onSelectionChange,
  placeholder = "Search..." 
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOptionToggle = (option: string) => {
    if (selectedOptions.includes(option)) {
      onSelectionChange(selectedOptions.filter(item => item !== option));
    } else {
      onSelectionChange([...selectedOptions, option]);
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-between h-10 px-3 min-w-[120px] bg-white border-gray-300 hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            {title}
            {selectedOptions.length > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5">
                {selectedOptions.length}
              </Badge>
            )}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>
        
        <div className="max-h-60 overflow-y-auto p-2">
          {filteredOptions.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-4">
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-2 rounded-sm px-2 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionToggle(option)}
              >
                <Checkbox
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionToggle(option)}
                />
                <span className="text-sm flex-1">{option}</span>
              </div>
            ))
          )}
        </div>
        
        {selectedOptions.length > 0 && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="w-full text-xs"
            >
              Clear All
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
