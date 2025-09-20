import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Portfolio {
  name: string;
  role: string;
  title: string;
  status: string;
  portfolio_url: string;
  iframe: string;
}

interface PortfolioSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (portfolio: Portfolio) => void;
}

const PortfolioSubmissionModal: React.FC<PortfolioSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    title: '',
    portfolio_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { name, role, title, portfolio_url } = formData;
    
    if (!name.trim()) {
      toast.error('Name is required');
      return false;
    }
    
    if (!role.trim()) {
      toast.error('Role is required');
      return false;
    }
    
    if (!title.trim()) {
      toast.error('Title is required');
      return false;
    }
    
    if (!portfolio_url.trim()) {
      toast.error('Portfolio URL is required');
      return false;
    }
    
    // Basic URL validation
    try {
      new URL(portfolio_url);
    } catch {
      toast.error('Please enter a valid URL');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const portfolio: Portfolio = {
        ...formData,
        status: 'Done', // Default status for all submissions
        iframe: `<iframe src="${formData.portfolio_url}" width="400" height="400"></iframe>`
      };
      
      onSubmit(portfolio);
      
      // Reset form
      setFormData({
        name: '',
        role: '',
        title: '',
        portfolio_url: '',
      });
      
      toast.success('Portfolio submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit portfolio. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      role: '',
      title: '',
      portfolio_url: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full p-0 bg-background">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Submit Your Portfolio
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Share your portfolio with the community. Fill out the form below to submit your work for review and potential inclusion in our portfolio showcase.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-foreground">
              Role *
            </Label>
            <Input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g., PM, SPM, UXD"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Job Title *
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Product Manager at Google"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio_url" className="text-sm font-medium text-foreground">
              Portfolio URL *
            </Label>
            <Input
              id="portfolio_url"
              name="portfolio_url"
              type="url"
              value={formData.portfolio_url}
              onChange={handleInputChange}
              placeholder="https://your-portfolio.com"
              className="w-full"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Portfolio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioSubmissionModal;
