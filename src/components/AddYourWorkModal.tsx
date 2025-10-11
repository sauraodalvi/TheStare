import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AddYourWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddYourWorkModal: React.FC<AddYourWorkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-h-[90vh] sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-stare-navy">Add Your Work</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Showcase your work on "The Stare" and get it in front of a wider relevant audience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="prose max-w-none py-4">
          <p className="text-foreground">
            If you want to showcase your work on "The Stare" and get it in front of a wider relevant audience, 
            tagging us on your LinkedIn post is a great way to do it.
          </p>
          
          <div className="my-6 p-4 sm:p-6 bg-muted/10 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3">How to get featured:</h3>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-foreground">
                Create a LinkedIn post showcasing your work
              </li>
              <li className="text-foreground">
                Mention "The Stare" (@The Stare) in your post by tagging the official LinkedIn account
              </li>
              <li className="text-foreground">
                Our team will review your submission and reach out if it's a good fit
              </li>
            </ol>
            
            <div className="mt-6 flex flex-col items-center justify-center p-4 bg-background rounded border border-border">
              <img 
                src="https://assets.softr-files.com/applications/fb373a75-278f-42c5-9baa-274e2cc5d2b2/assets/669f61aa-6d86-41de-b697-2e8858b1a41f.svg" 
                alt="LinkedIn Post Example"
                className="max-w-full h-auto rounded-md shadow-sm mb-3"
              />
              <p className="text-sm text-muted-foreground text-center">
                Example of how to tag The Stare in your LinkedIn post
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button 
              asChild
              variant="brand" 
              className="w-full sm:w-auto"
            >
              <a 
                href="https://www.linkedin.com/company/the-stare" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Our LinkedIn
              </a>
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddYourWorkModal;
