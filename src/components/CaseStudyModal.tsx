
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Heart, Building, X, Loader2 } from 'lucide-react';
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

  const logoUrl = caseStudy.Logo && caseStudy.Logo[0] ? caseStudy.Logo[0] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 overflow-hidden">
        {/* Simplified Header */}
        <DialogHeader className="p-4 sm:p-6 border-b bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight mb-3">
                {caseStudy.Title || caseStudy.Name}
              </DialogTitle>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {logoUrl ? (
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={logoUrl}
                      alt={`${caseStudy.Company} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-4 h-4 text-gray-400"><svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg></div>';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                    <Building className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                
                <span className="font-medium">{caseStudy.Company}</span>
                <span>|</span>
                <span>by {caseStudy.Organizer}</span>
                <span>|</span>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  <span className="font-medium">{caseStudy.Likes || 0}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="absolute right-2 top-2 sm:right-4 sm:top-4 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm flex items-center justify-center border"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        {/* PDF Content */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          {caseStudy.PDF && caseStudy.PDF[0] ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0 relative">
                {isPdfLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      <p className="text-sm text-gray-600 font-medium">Loading PDF...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={getPdfEmbedUrl(caseStudy.PDF[0])}
                  className="w-full h-full border-0"
                  title="Case Study PDF"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
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
