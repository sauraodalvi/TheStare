
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Building } from 'lucide-react';
import { CaseStudy } from '@/types/caseStudy';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onClick: (caseStudy: CaseStudy) => void;
}

const CaseStudyCard = ({ caseStudy, onClick }: CaseStudyCardProps) => {
  const cleanCategories = (caseStudy.Category || []).filter(cat => 
    cat && cat !== 'All' && cat.trim() !== ''
  ).slice(0, 1); // Show only first category

  const logoUrl = caseStudy.Logo && caseStudy.Logo[0] ? caseStudy.Logo[0] : null;

  return (
    <Card 
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden h-full flex flex-col group"
      onClick={() => onClick(caseStudy)}
    >
      <CardContent className="p-5 flex flex-col h-full">
        {/* Company Logo and Title Row */}
        <div className="flex items-start gap-4 mb-3">
          {logoUrl ? (
            <div className="w-12 h-12 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img
                src={logoUrl}
                alt={`${caseStudy.Company} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-6 text-gray-400"><svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg></div>';
                }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
              <Building className="w-6 h-6 text-gray-400" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 line-clamp-2 group-hover:text-blue-900 transition-colors">
              {caseStudy.Title || caseStudy.Name}
            </h3>
          </div>
        </div>

        {/* Company Name and Creator Row */}
        <div className="text-sm text-gray-600 mb-3 space-y-1">
          <div className="font-medium">{caseStudy.Company}</div>
          <div>by {caseStudy.Organizer}</div>
        </div>

        {/* Category and Likes Row */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {cleanCategories.map((category, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-0 font-medium rounded-md"
              >
                {category}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-1 text-gray-500">
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            <span className="text-sm font-medium">{caseStudy.Likes || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseStudyCard;
