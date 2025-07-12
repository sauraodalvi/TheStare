
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Loader2, Building } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GoogleDriveService } from '@/services/googleDriveService';
import FilterDropdown from './FilterDropdown';

interface CaseStudySubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CaseStudySubmissionModal = ({ isOpen, onClose, onSuccess }: CaseStudySubmissionModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    creator: '',
    category: [] as string[],
    market: [] as string[],
    objective: [] as string[]
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Marketing', 'Sales', 'Finance', 'Technology', 'HR', 'Operations', 'Design', 'Strategy', 'E-commerce', 'Product'];
  const markets = ['B2B', 'B2C', 'E-commerce', 'SaaS', 'Healthcare', 'Education', 'Finance', 'Real Estate', 'Fintech', 'EdTech'];
  const objectives = ['Lead Generation', 'Brand Awareness', 'Customer Retention', 'Cost Reduction', 'Revenue Growth', 'Process Improvement', 'User Engagement', 'Market Expansion'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      toast.error('Please select a valid PDF file');
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('company-logos')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('company-logos')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.creator.trim()) {
      toast.error('Creator name is required');
      return false;
    }
    if (!formData.company.trim()) {
      toast.error('Company name is required');
      return false;
    }
    if (formData.category.length === 0) {
      toast.error('Please select at least one category');
      return false;
    }
    if (formData.market.length === 0) {
      toast.error('Please select at least one market');
      return false;
    }
    if (formData.objective.length === 0) {
      toast.error('Please select at least one objective');
      return false;
    }
    if (!pdfFile) {
      toast.error('PDF upload is required');
      return false;
    }
    if (!confirmChecked) {
      toast.error('Please confirm that the information is correct');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      let logoUrl = '';
      
      // Upload logo if provided
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      }
      
      // Upload PDF to Google Drive
      const pdfUrl = await GoogleDriveService.uploadPDF(pdfFile!);
      
      // Save to database
      const { error: insertError } = await supabase
        .from('airtable_data')
        .insert({
          name: formData.title,
          organizer: formData.creator,
          company: formData.company,
          logo_url: logoUrl,
          pdf_url: pdfUrl,
          Free: true, // Always free for user submissions
          likes: 0,
          publish: 'Yes',
          category: formData.category,
          market: formData.market.join(', '), // Store as comma-separated string
          objective: formData.objective
        });

      if (insertError) throw insertError;

      toast.success('✅ Case study submitted successfully and will be reviewed shortly!');
      
      // Reset form
      setFormData({ 
        title: '', 
        creator: '', 
        company: '', 
        category: [], 
        market: [], 
        objective: [] 
      });
      setLogoFile(null);
      setLogoPreview(null);
      setPdfFile(null);
      setConfirmChecked(false);
      
      onSuccess?.();
      onClose();
      
    } catch (error) {
      console.error('Error submitting case study:', error);
      toast.error('Failed to submit case study. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-stare-navy">Submit Case Study</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter case study title"
              required
              className="mt-1"
            />
          </div>

          {/* Creator Name */}
          <div>
            <Label htmlFor="creator" className="text-sm font-medium">Creator Name *</Label>
            <Input
              id="creator"
              name="creator"
              value={formData.creator}
              onChange={handleInputChange}
              placeholder="Your name"
              required
              className="mt-1"
            />
          </div>

          {/* Company Name */}
          <div>
            <Label htmlFor="company" className="text-sm font-medium">Company Name *</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company name"
              required
              className="mt-1"
            />
          </div>

          {/* Category Multi-Select */}
          <div>
            <Label className="text-sm font-medium">Category *</Label>
            <div className="mt-1">
              <FilterDropdown
                title="Select Categories"
                options={categories}
                selectedOptions={formData.category}
                onSelectionChange={(categories) => setFormData(prev => ({ ...prev, category: categories }))}
                placeholder="Search categories..."
              />
            </div>
          </div>

          {/* Market Multi-Select */}
          <div>
            <Label className="text-sm font-medium">Market *</Label>
            <div className="mt-1">
              <FilterDropdown
                title="Select Markets"
                options={markets}
                selectedOptions={formData.market}
                onSelectionChange={(markets) => setFormData(prev => ({ ...prev, market: markets }))}
                placeholder="Search markets..."
              />
            </div>
          </div>

          {/* Objective Multi-Select */}
          <div>
            <Label className="text-sm font-medium">Objective *</Label>
            <div className="mt-1">
              <FilterDropdown
                title="Select Objectives"
                options={objectives}
                selectedOptions={formData.objective}
                onSelectionChange={(objectives) => setFormData(prev => ({ ...prev, objective: objectives }))}
                placeholder="Search objectives..."
              />
            </div>
          </div>

          {/* Company Logo Upload */}
          <div>
            <Label htmlFor="logo" className="text-sm font-medium">Company Logo (Optional)</Label>
            <div className="mt-1 flex items-center gap-4">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="cursor-pointer flex-1"
              />
              {logoPreview ? (
                <div className="w-12 h-12 rounded-lg border-2 border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg border-2 border-gray-200 bg-white flex items-center justify-center">
                  <Building className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            {!logoFile && (
              <p className="text-sm text-amber-600 mt-1">⚠️ No logo uploaded - a placeholder will be shown</p>
            )}
          </div>

          {/* PDF Upload */}
          <div>
            <Label htmlFor="pdf" className="text-sm font-medium">PDF Upload *</Label>
            <Input
              id="pdf"
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="cursor-pointer mt-1"
              required
            />
            {pdfFile && (
              <p className="text-sm text-green-600 mt-1">✓ {pdfFile.name}</p>
            )}
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm"
              checked={confirmChecked}
              onCheckedChange={(checked) => setConfirmChecked(!!checked)}
            />
            <Label htmlFor="confirm" className="text-sm">
              ✅ I confirm the above information is correct and complete *
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit Case Study
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CaseStudySubmissionModal;
