import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Building, X, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { CaseStudy } from '@/types/caseStudy';
import { SupabaseService } from '@/services/supabaseService';
import { SafeImage } from '@/utils/imageUtils';

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
}

const CaseStudyModal = ({ caseStudy, isOpen, onClose }: CaseStudyModalProps) => {
  // State management
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [pdfMethod, setPdfMethod] = useState<'preview' | 'docs-viewer' | 'original'>('preview');
  const [retryCount, setRetryCount] = useState(0);

  // Reset states when modal opens with new case study - MOVED BEFORE EARLY RETURN
  useEffect(() => {
    if (isOpen && caseStudy) {
      setIsPdfLoading(true);
      setPdfError(false);
      setLogoError(false);
      setCurrentLogoIndex(0);
      setPdfMethod('preview');
      setRetryCount(0);
    }
  }, [isOpen, caseStudy?.id]);

  // Early return for null case study - MOVED AFTER HOOKS
  if (!caseStudy) return null;

  // Get the best available logo URL
  const logoUrl = caseStudy.google_drive_logo_thumbnail || caseStudy.Logo?.[0];
  const pdfUrls = caseStudy.PDF || [];

  // PDF URLs - convert Google Drive URLs to iframe-compatible format with fallback methods
  const rawPdfUrl = caseStudy.google_drive_pdf_path || pdfUrls[0];

  // Generate PDF URL based on current method
  const getPdfUrl = () => {
    if (!rawPdfUrl) return null;

    switch (pdfMethod) {
      case 'preview':
        return SupabaseService.convertGoogleDrivePdfUrl(rawPdfUrl);
      case 'docs-viewer':
        return SupabaseService.convertToGoogleDocsViewer(rawPdfUrl);
      case 'original':
        return rawPdfUrl;
      default:
        return SupabaseService.convertGoogleDrivePdfUrl(rawPdfUrl);
    }
  };

  const pdfUrl = getPdfUrl();

  // Debug logging for PDF URL conversion
  console.log('🔍 CaseStudyModal PDF URL Debug:', {
    caseStudyId: caseStudy.id,
    company: caseStudy.Company,
    rawPdfUrl,
    currentMethod: pdfMethod,
    convertedPdfUrl: pdfUrl,
    pdfUrlsArray: pdfUrls,
    retryCount
  });

  // Event handlers
  const handlePdfLoad = () => {
    setIsPdfLoading(false);
    setPdfError(false);
    console.log(`✅ PDF loaded successfully using ${pdfMethod} method`);
  };

  const handlePdfError = () => {
    console.warn(`❌ PDF failed to load using ${pdfMethod} method, retry count: ${retryCount}`);
    setIsPdfLoading(false);

    // Automatic fallback logic
    if (pdfMethod === 'preview' && retryCount < 2) {
      console.log('🔄 Falling back to Google Docs Viewer method');
      setPdfMethod('docs-viewer');
      setRetryCount(retryCount + 1);
      setIsPdfLoading(true);
      setPdfError(false);
    } else if (pdfMethod === 'docs-viewer' && retryCount < 3) {
      console.log('🔄 Falling back to original URL method');
      setPdfMethod('original');
      setRetryCount(retryCount + 1);
      setIsPdfLoading(true);
      setPdfError(false);
    } else {
      console.error('❌ All PDF loading methods failed');
      setPdfError(true);
    }
  };

  const handleRetryPdf = () => {
    console.log('🔄 Manual retry requested');
    setRetryCount(0);
    setPdfMethod('preview');
    setIsPdfLoading(true);
    setPdfError(false);
  };

  const handleLogoError = () => {
    console.warn('Logo failed to load:', logoUrl);
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    console.log('✅ Modal logo loaded:', logoUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 overflow-hidden">
        {/* Header Section */}
        <DialogHeader className="p-4 sm:p-6 border-b bg-background sticky top-0 z-10 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-2xl font-bold text-foreground leading-tight mb-3">
                {caseStudy.Title || caseStudy.Name}
              </DialogTitle>
              
              <DialogDescription className="sr-only">
                Case study details for {caseStudy.Company} by {caseStudy.Organizer}.
                {pdfUrl && ' View the full case study PDF.'}
              </DialogDescription>
              
              {/* Company Info Row */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {/* Company Logo */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-background border-2 border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                  <div className="w-full h-full flex items-center justify-center p-1">
                    <SafeImage
                      src={logoUrl}
                      alt={`${caseStudy.Company} logo`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
                  <span className="font-medium text-foreground">{caseStudy.Company}</span>
                  <span className="hidden sm:inline">|</span>
                  <span>by {caseStudy.Organizer}</span>
                  <span className="hidden sm:inline">|</span>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span className="font-medium">{caseStudy.Likes || 0}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {caseStudy.Creators_Tag && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  {caseStudy.Creators_Tag}
                </p>
              )}
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-2 top-2 sm:right-4 sm:top-4 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm flex items-center justify-center border transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        {/* PDF Content Section */}
        <div className="flex-1 overflow-hidden bg-muted">
          {pdfUrl && !pdfError ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0 relative">
                {/* Loading State */}
                {isPdfLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
                    <div className="flex flex-col items-center gap-3 text-center max-w-sm">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground font-medium">
                        Loading PDF...
                      </p>
                      {retryCount > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Trying method {retryCount + 1} of 3 ({pdfMethod === 'preview' ? 'Google Drive Preview' : pdfMethod === 'docs-viewer' ? 'Google Docs Viewer' : 'Original URL'})
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* PDF Iframe - Keep original URL format for better iframe compatibility */}
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0"
                  title={`${caseStudy.Company} Case Study PDF`}
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                  onLoad={handlePdfLoad}
                  onError={handlePdfError}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>
            </div>
          ) : (
            /* No PDF / Error State */
            <div className="h-96 flex items-center justify-center bg-muted border-2 border-dashed border-border rounded-lg m-6">
              <div className="text-center max-w-md">
                <div className="mb-4">
                  {pdfError ? (
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
                  ) : (
                    <Building className="w-12 h-12 text-muted-foreground mx-auto" />
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {pdfError ? 'PDF Loading Failed' : 'No PDF Available'}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {pdfError
                    ? `Unable to load PDF after trying ${retryCount + 1} method${retryCount > 0 ? 's' : ''}. This might be due to browser security restrictions or file access permissions.`
                    : 'This case study doesn\'t have an attached PDF document yet.'}
                </p>

                {/* Action Buttons */}
                {pdfError && rawPdfUrl && (
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      onClick={handleRetryPdf}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Loader2 className="w-4 h-4" />
                      Try Again
                    </Button>
                    <Button
                      onClick={() => window.open(rawPdfUrl, '_blank')}
                      variant="default"
                      size="sm"
                      className="gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open PDF in New Tab
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseStudyModal;
