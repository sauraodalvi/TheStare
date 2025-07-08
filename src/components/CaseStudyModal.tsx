
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-stare-navy">
            {caseStudy.Title || caseStudy.Name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">Company</h3>
              <p className="text-lg">{caseStudy.Company}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700">Organizer</h3>
              <p className="text-lg">{caseStudy.Organizer}</p>
            </div>

            {caseStudy.Creators_Tag && (
              <div>
                <h3 className="font-semibold text-gray-700">Creator Tag</h3>
                <p className="text-sm text-gray-600">{caseStudy.Creators_Tag}</p>
              </div>
            )}

            {caseStudy.Category && caseStudy.Category.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.Category.map((category, index) => (
                    <Badge key={index} variant="outline">{category}</Badge>
                  ))}
                </div>
              </div>
            )}

            {caseStudy.Objective && caseStudy.Objective.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Objectives</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.Objective.map((objective, index) => (
                    <Badge key={index} variant="secondary">{objective}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p><span className="font-medium">Likes:</span> {caseStudy.Likes}</p>
              {caseStudy.Market && <p><span className="font-medium">Market:</span> {caseStudy.Market}</p>}
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-700 mb-2">Case Study PDF</h3>
            {caseStudy.PDF && caseStudy.PDF[0] ? (
              <div className="flex-1 border rounded-lg overflow-hidden">
                <iframe
                  src={getPdfEmbedUrl(caseStudy.PDF[0])}
                  className="w-full h-full min-h-[400px]"
                  title="Case Study PDF"
                />
              </div>
            ) : (
              <div className="flex-1 border rounded-lg flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">No PDF available</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseStudyModal;
