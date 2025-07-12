
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Building, User } from 'lucide-react';
import { CaseStudy } from '@/types/caseStudy';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onClick: (caseStudy: CaseStudy) => void;
}

const CaseStudyCard = ({ caseStudy, onClick }: CaseStudyCardProps) => {
  const cleanCategories = (caseStudy.Category || []).filter(cat => 
    cat && cat !== 'All' && cat.trim() !== ''
  ).slice(0, 2);

  const logoUrl = caseStudy.Logo && caseStudy.Logo[0] ? caseStudy.Logo[0] : null;

  return (
    <Card 
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden h-full flex flex-col group"
      onClick={() => onClick(caseStudy)}
    >
      <CardContent className="p-5 flex flex-col h-full">
        {/* Header with Logo and Title */}
        <div className="flex items-start gap-4 mb-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${caseStudy.Company} logo`}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border-2 border-gray-100 group-hover:border-blue-200 transition-colors"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-shrink-0 border-2 border-gray-100 group-hover:border-blue-200 transition-colors">
              <Building className="w-7 h-7 text-blue-500" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-tight mb-2 line-clamp-2 group-hover:text-blue-900 transition-colors">
              {caseStudy.Title || caseStudy.Name}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-medium truncate">{caseStudy.Company}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">by {caseStudy.Organizer}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        {cleanCategories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {cleanCategories.map((category, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 border-0 font-medium rounded-full"
              >
                {category}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer with Likes */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium">{caseStudy.Likes || 0}</span>
              <span className="text-xs">likes</span>
            </div>
            
            {caseStudy.Free === 'No' && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-300 text-amber-700 bg-amber-50">
                Premium
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseStudyCard;
