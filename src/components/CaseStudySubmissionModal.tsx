
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
    name: '',
    company: '',
    creators_tag: '',
    category: [] as string[],
    market: [] as string[],
    objective: [] as string[],
    type: [] as string[],
    sort_order: '0'
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = ['Marketing', 'Sales', 'Finance', 'Technology', 'HR', 'Operations', 'Design', 'Strategy', 'E-commerce', 'Product'];
  const markets = ['B2B', 'B2C', 'E-commerce', 'SaaS', 'Healthcare', 'Education', 'Finance', 'Real Estate', 'Fintech', 'EdTech'];
  const objectives = ['Lead Generation', 'Brand Awareness', 'Customer Retention', 'Cost Reduction', 'Revenue Growth', 'Process Improvement', 'User Engagement', 'Market Expansion'];
  const types = ['Website', 'App', 'Campaign', 'Branding', 'Digital', 'Print', 'Strategy', 'UX/UI'];

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

  const uploadFile = async (file: File, type: 'pdf' | 'logo'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await supabase.functions.invoke('upload-pdf', {
      body: formData,
    });

    if (response.error) {
      throw new Error(`Failed to upload ${type}: ${response.error.message}`);
    }

    return response.data.shareUrl;
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.creators_tag.trim()) {
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
    if (formData.type.length === 0) {
      toast.error('Please select at least one type');
      return false;
    }
    if (!logoFile) {
      toast.error('Logo upload is required');
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
    setUploadProgress(10);
    
    try {
      // Upload logo to Google Drive
      setUploadProgress(30);
      const logoUrl = await uploadFile(logoFile!, 'logo');
      
      // Upload PDF to Google Drive
      setUploadProgress(60);
      const pdfUrl = await uploadFile(pdfFile!, 'pdf');
      
      setUploadProgress(80);
      
      // Save to database
      const { error: insertError } = await supabase
        .from('case_studies')
        .insert({
          name: formData.name,
          creators_tag: formData.creators_tag,
          company: formData.company,
          google_drive_logo_path: logoUrl,
          google_drive_logo_thumbnail: logoUrl,
          google_drive_pdf_path: pdfUrl,
          category: formData.category.join(', '),
          market: formData.market[0] || '',
          objective: formData.objective.join(', '),
          type: formData.type.join(', '),
          sort_order: parseInt(formData.sort_order) || 0,
          publish: true,
          free: false,
          seo_index: true,
          plan: 1,
          likes: 0
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Failed to save case study: ${insertError.message}`);
      }

      setUploadProgress(100);
      toast.success('✅ Case Study Uploaded Successfully');
      
      // Reset form
      setFormData({ 
        name: '', 
        creators_tag: '', 
        company: '', 
        category: [], 
        market: [], 
        objective: [],
        type: [],
        sort_order: '0'
      });
      setLogoFile(null);
      setLogoPreview(null);
      setPdfFile(null);
      setConfirmChecked(false);
      setUploadProgress(0);
      
      onSuccess?.();
      onClose();
      
    } catch (error) {
      console.error('Error submitting case study:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit case study. Please try again.';
      toast.error(errorMessage);
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-stare-navy">Submit Case Study</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Share your case study with the community. Fill out all required fields below to submit your work for review and potential inclusion in our case study library.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Progress Indicator */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter case study name"
              required
              disabled={isSubmitting}
              className="mt-1"
            />
          </div>

          {/* Creator Tag */}
          <div>
            <Label htmlFor="creators_tag" className="text-sm font-medium">Creator Name *</Label>
            <Input
              id="creators_tag"
              name="creators_tag"
              value={formData.creators_tag}
              onChange={handleInputChange}
              placeholder="Your name"
              required
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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

          {/* Type Multi-Select */}
          <div>
            <Label className="text-sm font-medium">Type *</Label>
            <div className="mt-1">
              <FilterDropdown
                title="Select Types"
                options={types}
                selectedOptions={formData.type}
                onSelectionChange={(types) => setFormData(prev => ({ ...prev, type: types }))}
                placeholder="Search types..."
              />
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <Label htmlFor="sort_order" className="text-sm font-medium">Sort Order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={handleInputChange}
              placeholder="0"
              disabled={isSubmitting}
              className="mt-1"
            />
          </div>

          {/* Company Logo Upload */}
          <div>
            <Label htmlFor="logo" className="text-sm font-medium">Company Logo *</Label>
            <div className="mt-1 flex items-center gap-4">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                required
                disabled={isSubmitting}
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
            {logoFile && (
              <p className="text-sm text-green-600 mt-1">{logoFile.name}</p>
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
              disabled={isSubmitting}
            />
            {pdfFile && (
              <p className="text-sm text-green-600 mt-1">{pdfFile.name}</p>
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
              I confirm the above information is correct and complete *
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
