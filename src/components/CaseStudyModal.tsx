
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Building, User, Target, ExternalLink, X, Loader2 } from 'lucide-react';
import { CaseStudy } from '@/types/caseStudy';

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
}

const CaseStudyModal = ({ caseStudy, isOpen, onClose }: CaseStudyModalProps) => {
  const [isPdfLoading, setIsPdfLoading] = useState(true);

  if (!caseStudy) return null;

  // Convert Google Drive view URL to embed URL for PDF preview
  const getPdfEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  const openPdfInNewTab = () => {
    if (caseStudy.PDF && caseStudy.PDF[0]) {
      window.open(caseStudy.PDF[0], '_blank');
    }
  };

  const cleanCategories = (caseStudy.Category || []).filter(cat => 
    cat && cat !== 'All' && cat.trim() !== ''
  );

  const cleanObjectives = (caseStudy.Objective || []).filter(obj => 
    obj && obj.trim() !== ''
  ).slice(0, 3);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] w-[95vw] p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 border-b bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {caseStudy.Logo && caseStudy.Logo[0] ? (
                <img
                  src={caseStudy.Logo[0]}
                  alt={`${caseStudy.Company} logo`}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0 border"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100&auto=format&fit=crop&q=60';
                  }}
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border">
                  <Building className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-2xl font-bold text-stare-navy mb-2 pr-8 leading-tight">
                  {caseStudy.Title || caseStudy.Name}
                </DialogTitle>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span className="font-medium">{caseStudy.Company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>by {caseStudy.Organizer}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="font-medium">{caseStudy.Likes || 0} likes</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cleanCategories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-0">
                      {category}
                    </Badge>
                  ))}
                  {cleanObjectives.map((objective, index) => (
                    <Badge key={index} variant="outline" className="border-stare-teal text-stare-teal">
                      <Target className="w-3 h-3 mr-1" />
                      {objective}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-2 top-2 sm:right-4 sm:top-4 z-10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          {caseStudy.PDF && caseStudy.PDF[0] ? (
            <div className="h-full flex flex-col">
              {/* PDF Controls */}
              <div className="p-3 sm:p-4 bg-white border-b flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Case Study PDF</h3>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Have your own story? 
                    <button 
                      className="text-stare-navy hover:underline ml-1"
                      onClick={() => {/* Add submission logic */}}
                    >
                      Submit a case study!
                    </button>
                  </p>
                </div>
                <Button
                  onClick={openPdfInNewTab}
                  size="sm"
                  variant="outline"
                  className="text-xs sm:text-sm"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Open in New Tab</span>
                  <span className="sm:hidden">Open</span>
                </Button>
              </div>
              
              {/* PDF Viewer */}
              <div className="flex-1 min-h-0 relative">
                {isPdfLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-stare-navy" />
                      <p className="text-sm text-gray-600">Loading PDF...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={getPdfEmbedUrl(caseStudy.PDF[0])}
                  className="w-full h-full border-0"
                  title="Case Study PDF"
                  style={{ minHeight: '60vh' }}
                  onLoad={() => setIsPdfLoading(false)}
                  onError={() => setIsPdfLoading(false)}
                />
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg m-6">
              <div className="text-center">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium mb-2">No PDF available</p>
                <p className="text-gray-400 text-sm mb-4">This case study doesn't have an attached PDF document.</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {/* Add submission logic */}}
                >
                  Submit Your Case Study
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseStudyModal;
