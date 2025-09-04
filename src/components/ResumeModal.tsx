import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, X } from 'lucide-react';

interface Resume {
  id: string;
  name: string;
  designation: string;
  company: string;
  companyLogo: string;
  profileImage: string;
  resumeLink: string;
  previewEmbed: string;
  referenceLink: string;
  source: string;
  featured: boolean;
}

interface ResumeModalProps {
  resume: Resume | null;
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ resume, isOpen, onClose }) => {
  if (!resume) return null;

  const handleDownload = () => {
    window.open(resume.resumeLink, '_blank');
  };

  const handleViewPost = () => {
    if (resume.referenceLink) {
      window.open(resume.referenceLink, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                {resume.name}'s Resume
              </DialogTitle>
              <p className="text-muted-foreground">
                {resume.designation} at {resume.company}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              {resume.referenceLink && (
                <Button
                  onClick={handleViewPost}
                  variant="outline"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Post
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 min-h-0">
          <iframe
            src={resume.previewEmbed}
            className="w-full h-[600px] border-0"
            title={`${resume.name}'s Resume`}
            loading="lazy"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeModal;