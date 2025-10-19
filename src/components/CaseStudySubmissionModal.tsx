
import React, { useState } from 'react';
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { GoogleDriveService } from '@/services/googleDriveService';
import { toast } from 'sonner';
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
    organizer: '',
    category: [] as string[],
    market: '',
    objective: [] as string[]
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = ['Dating', 'Social Media', 'SaaS', 'E-commerce', 'Finance', 'Healthcare', 'Education', 'Entertainment', 'Productivity', 'Travel'];
  const markets = ['B2C', 'B2B', 'B2B,B2C'];
  const objectives = ['Onboarding', 'Retention', 'Marketing', 'Growth', 'User Engagement', 'Monetization', 'Product Development'];
  const organizers = ['NextLeap', 'Producthood', 'PMSchool', 'TPF', 'Others', 'Self'];

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
    try {
      // Use the secure file upload service
      const result = await GoogleDriveService.uploadFile(file, type);
      return result; // Returns the file URL
    } catch (error) {
      console.error(`Failed to upload ${type}:`, error);
      throw new Error(error instanceof Error ? error.message : `Failed to upload ${type}`);
    }
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
    if (!formData.market) {
      toast.error('Please select a market');
      return false;
    }
    if (formData.objective.length === 0) {
      toast.error('Please select at least one objective');
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
          organizer: formData.organizer || null,
          google_drive_logo_path: logoUrl,
          google_drive_logo_thumbnail: logoUrl,
          google_drive_pdf_path: pdfUrl,
          category: formData.category.join(', '),
          market: formData.market,
          objective: formData.objective.join(', '),
          publish: false,
          free: false,
          seo_index: false,
          plan: 0,
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
        organizer: '',
        category: [], 
        market: '', 
        objective: []
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
            <Label htmlFor="name" className="text-sm font-medium">Title of Case Study *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Bumble's onboarding journey"
              required
              disabled={isSubmitting}
              className="mt-1"
            />
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

          {/* Company Name */}
          <div>
            <Label htmlFor="company" className="text-sm font-medium">Company Name *</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="e.g., Bumble"
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

          {/* Market Dropdown (Single Select) */}
          <div>
            <Label htmlFor="market" className="text-sm font-medium">Market *</Label>
            <Select
              value={formData.market}
              onValueChange={(value) => setFormData(prev => ({ ...prev, market: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select market type" />
              </SelectTrigger>
              <SelectContent>
                {markets.map((market) => (
                  <SelectItem key={market} value={market}>
                    {market}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Organizer Dropdown (Optional) */}
          <div>
            <Label htmlFor="organizer" className="text-sm font-medium">Organizer (Optional)</Label>
            <Select
              value={formData.organizer}
              onValueChange={(value) => setFormData(prev => ({ ...prev, organizer: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select organizer" />
              </SelectTrigger>
              <SelectContent>
                {organizers.map((organizer) => (
                  <SelectItem key={organizer} value={organizer}>
                    {organizer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Creator Tag */}
          <div>
            <Label htmlFor="creators_tag" className="text-sm font-medium">Creator Name *</Label>
            <Input
              id="creators_tag"
              name="creators_tag"
              value={formData.creators_tag}
              onChange={handleInputChange}
              placeholder="e.g., Arpit Agrawal"
              required
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
