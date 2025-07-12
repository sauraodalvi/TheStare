
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GoogleDriveService } from '@/services/googleDriveService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    market: '',
    objective: [] as string[],
    isFree: true
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Marketing', 'Sales', 'Finance', 'Technology', 'HR', 'Operations', 'Design', 'Strategy'];
  const markets = ['B2B', 'B2C', 'E-commerce', 'SaaS', 'Healthcare', 'Education', 'Finance', 'Real Estate'];
  const objectives = ['Lead Generation', 'Brand Awareness', 'Customer Retention', 'Cost Reduction', 'Revenue Growth', 'Process Improvement'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  const handleObjectiveChange = (objective: string) => {
    setFormData(prev => ({
      ...prev,
      objective: prev.objective.includes(objective)
        ? prev.objective.filter(o => o !== objective)
        : [...prev.objective, objective]
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.creator || !formData.company) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!logoFile || !pdfFile) {
      toast.error('Please upload both logo and PDF files');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload logo to Supabase Storage
      const logoUrl = await uploadLogo(logoFile);
      
      // Upload PDF to Google Drive
      const pdfUrl = await GoogleDriveService.uploadPDF(pdfFile);
      
      // Save to database
      const { error: insertError } = await supabase
        .from('airtable_data')
        .insert({
          name: formData.title,
          organizer: formData.creator,
          company: formData.company,
          logo_url: logoUrl,
          pdf_url: pdfUrl,
          Free: formData.isFree,
          likes: 0,
          publish: 'Yes',
          category: formData.category,
          market: formData.market,
          objective: formData.objective
        });

      if (insertError) throw insertError;

      toast.success('✅ Case study submitted successfully!');
      
      // Reset form
      setFormData({ 
        title: '', 
        creator: '', 
        company: '', 
        category: [], 
        market: '', 
        objective: [], 
        isFree: true 
      });
      setLogoFile(null);
      setPdfFile(null);
      
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Case study title"
                required
              />
            </div>
            <div>
              <Label htmlFor="creator" className="text-sm font-medium">Creator Name *</Label>
              <Input
                id="creator"
                name="creator"
                value={formData.creator}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company" className="text-sm font-medium">Company Name *</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Category</Label>
              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={formData.category.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="market" className="text-sm font-medium">Market</Label>
              <Select value={formData.market} onValueChange={(value) => setFormData(prev => ({ ...prev, market: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select market" />
                </SelectTrigger>
                <SelectContent>
                  {markets.map(market => (
                    <SelectItem key={market} value={market}>{market}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Objectives</Label>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
              {objectives.map(objective => (
                <div key={objective} className="flex items-center space-x-2">
                  <Checkbox
                    id={`objective-${objective}`}
                    checked={formData.objective.includes(objective)}
                    onCheckedChange={() => handleObjectiveChange(objective)}
                  />
                  <Label htmlFor={`objective-${objective}`} className="text-sm">
                    {objective}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="logo" className="text-sm font-medium">Company Logo *</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="cursor-pointer"
              />
              {logoFile && (
                <p className="text-sm text-green-600 mt-1">✓ {logoFile.name}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="pdf" className="text-sm font-medium">Case Study PDF *</Label>
              <Input
                id="pdf"
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="cursor-pointer"
              />
              {pdfFile && (
                <p className="text-sm text-green-600 mt-1">✓ {pdfFile.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFree"
              checked={formData.isFree}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFree: !!checked }))}
            />
            <Label htmlFor="isFree" className="text-sm">
              Make this case study free for all users
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
