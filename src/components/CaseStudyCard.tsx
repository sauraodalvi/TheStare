
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
  ).slice(0, 2);

  return (
    <Card 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 overflow-hidden h-full flex flex-col"
      onClick={() => onClick(caseStudy)}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start gap-3 mb-3">
          {caseStudy.Logo && caseStudy.Logo[0] ? (
            <img
              src={caseStudy.Logo[0]}
              alt={`${caseStudy.Company} logo`}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100&auto=format&fit=crop&q=60';
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border">
              <Building className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
              {caseStudy.Title || caseStudy.Name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              {caseStudy.Company}
            </p>
            <p className="text-xs text-gray-500">
              by {caseStudy.Organizer}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-1">
            {cleanCategories.map((category, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-0"
              >
                {category}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Heart className="w-4 h-4" />
            <span>{caseStudy.Likes || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseStudyCard;
