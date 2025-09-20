
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Building } from 'lucide-react';
import { CaseStudy } from '@/types/caseStudy';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onClick: (caseStudy: CaseStudy) => void;
}

const CaseStudyCard = ({ caseStudy, onClick }: CaseStudyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasImageError, setHasImageError] = useState(false);

  const cleanCategories = (caseStudy.Category || []).filter(cat =>
    cat && cat !== 'All' && cat.trim() !== ''
  ).slice(0, 1); // Show only first category

  // FIXED: Use the processed Logo array (which contains converted URLs) instead of raw google_drive_logo_path
  const logoUrls = caseStudy.Logo || [];
  const currentLogoUrl = logoUrls[currentImageIndex];

  // Debug: Show the data flow and conversion process
  console.log(`🔧 FIXED DATA FLOW for ${caseStudy.Company}:`);
  console.log('  Raw google_drive_logo_path:', caseStudy.google_drive_logo_path);
  console.log('  Processed Logo array (should contain converted URLs):', caseStudy.Logo);
  console.log('  Current URL being used:', currentLogoUrl);
  console.log('  URL type:', currentLogoUrl?.includes('drive.google.com') ? 'Google Drive' : 'Other');
  console.log('  Is URL converted?:', currentLogoUrl?.includes('uc?export=view') ? 'YES (converted)' : 'NO (original or other)');

  if (caseStudy.Logo && caseStudy.Logo.length > 0) {
    console.log(`✅ Using PROCESSED logo for ${caseStudy.Company}:`, currentLogoUrl);
  } else {
    console.log(`❌ No processed logo available for ${caseStudy.Company}`);
  }

  console.log('CaseStudyCard logo data:', {
    id: caseStudy.id,
    company: caseStudy.Company,
    google_drive_logo_path: caseStudy.google_drive_logo_path,
    Logo: caseStudy.Logo,
    logoUrls,
    currentLogoUrl,
    currentImageIndex,
    hasImageError,
    'Logo array length': caseStudy.Logo?.length,
    'logoUrls length': logoUrls.length
  });

  const handleImageError = () => {
    console.log(`Image failed to load: ${currentLogoUrl} (index: ${currentImageIndex}/${logoUrls.length - 1})`);
    console.log('Available logo URLs:', logoUrls);

    // Try next image in the array
    if (currentImageIndex < logoUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      console.log(`Trying next image at index: ${currentImageIndex + 1}`);
    } else {
      // All images failed, show fallback
      console.log('All logo images failed, showing fallback icon');
      setHasImageError(true);
    }
  };

  const resetImageState = () => {
    setCurrentImageIndex(0);
    setHasImageError(false);
  };

  return (
    <Card 
      className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group"
      onClick={() => onClick(caseStudy)}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col h-full">
        {/* Company Logo and Title Row */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3">
          {currentLogoUrl && !hasImageError ? (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-background border-2 border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img
                src={currentLogoUrl}
                alt={`${caseStudy.Company} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log(`🚨 IMAGE LOAD ERROR for ${caseStudy.Company}:`);
                  console.log('  Failed URL:', currentLogoUrl);
                  console.log('  Error event:', e);
                  handleImageError();
                }}
                onLoad={(e) => {
                  console.log(`✅ IMAGE LOAD SUCCESS for ${caseStudy.Company}:`);
                  console.log('  Successful URL:', currentLogoUrl);
                  resetImageState();
                }}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-background border-2 border-border flex items-center justify-center flex-shrink-0">
              <Building className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {caseStudy.Title || caseStudy.Name}
            </h3>
          </div>
        </div>

        {/* Company Name and Creator Row */}
        <div className="text-xs sm:text-sm text-muted-foreground mb-3 space-y-1">
          <div className="font-medium text-foreground">{caseStudy.Company}</div>
          <div>by {caseStudy.Organizer}</div>
        </div>

        {/* Category and Likes Row */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {cleanCategories.map((category, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-1 font-medium rounded-md truncate"
              >
                {category}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 fill-red-400" />
            <span className="text-xs sm:text-sm font-medium">{caseStudy.Likes || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseStudyCard;
