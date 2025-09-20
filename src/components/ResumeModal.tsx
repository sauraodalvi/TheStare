import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl w-full max-h-[95vh] p-0 bg-background overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground pr-8">
            {resume.name}'s Resume
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {resume.designation} at {resume.company}
          </DialogDescription>
        </DialogHeader>

        <div className="pl-4 sm:pl-6 pb-4 sm:pb-6 flex-1 overflow-hidden">
          <div className="aspect-[4/5] overflow-hidden bg-muted max-h-[calc(95vh-120px)] w-full">
            <iframe
              src={resume.previewEmbed}
              className="w-full h-full border-0"
              title={`${resume.name}'s Resume`}
              loading="lazy"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeModal;