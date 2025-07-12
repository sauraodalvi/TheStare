
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Building, User, Target, ExternalLink, X } from 'lucide-react';
import { CaseStudy } from '@/types/caseStudy';

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
}

const CaseStudyModal = ({ caseStudy, isOpen, onClose }: CaseStudyModalProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] w-[95vw] p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 border-b bg-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {caseStudy.Logo && caseStudy.Logo[0] ? (
                <img
                  src={caseStudy.Logo[0]}
                  alt={caseStudy.Company}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100&auto=format&fit=crop&q=60';
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border">
                  <Building className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-stare-navy mb-2 pr-8">
                  {caseStudy.Title || caseStudy.Name}
                </DialogTitle>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{caseStudy.Company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{caseStudy.Organizer}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{caseStudy.Likes} likes</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {caseStudy.Category && caseStudy.Category.map((category, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-0">
                      {category}
                    </Badge>
                  ))}
                  {caseStudy.Objective && caseStudy.Objective.slice(0, 3).map((objective, index) => (
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
              className="absolute right-4 top-4 z-10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          {caseStudy.PDF && caseStudy.PDF[0] ? (
            <div className="h-full flex flex-col">
              {/* PDF Controls - Mobile */}
              <div className="sm:hidden p-3 bg-white border-b flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Case Study PDF</span>
                <Button
                  onClick={openPdfInNewTab}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open
                </Button>
              </div>
              
              {/* PDF Controls - Desktop */}
              <div className="hidden sm:flex p-4 bg-white border-b justify-between items-center">
                <h3 className="font-semibold text-gray-800">Case Study PDF</h3>
                <Button
                  onClick={openPdfInNewTab}
                  size="sm"
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
              
              {/* PDF Viewer */}
              <div className="flex-1 min-h-0">
                <iframe
                  src={getPdfEmbedUrl(caseStudy.PDF[0])}
                  className="w-full h-full border-0"
                  title="Case Study PDF"
                  style={{ minHeight: '500px' }}
                />
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg m-6">
              <div className="text-center">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No PDF available</p>
                <p className="text-gray-400 text-sm">This case study doesn't have an attached PDF document.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseStudyModal;
