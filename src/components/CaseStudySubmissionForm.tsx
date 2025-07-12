
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GoogleDriveService } from '@/services/googleDriveService';

const CaseStudySubmissionForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    company: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      // Save to database using the existing airtable_data table
      const { error: insertError } = await supabase
        .from('airtable_data')
        .insert({
          name: formData.title,
          organizer: formData.creator,
          company: formData.company,
          logo_url: logoUrl,
          pdf_url: pdfUrl,
          Free: true, // Default to free
          likes: 0, // Default to 0 likes
          publish: 'Yes' // Default to published
        });

      if (insertError) throw insertError;

      toast.success('Case study submitted successfully!');
      
      // Reset form
      setFormData({ title: '', creator: '', company: '' });
      setLogoFile(null);
      setPdfFile(null);
      
      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      fileInputs.forEach(input => input.value = '');
      
    } catch (error) {
      console.error('Error submitting case study:', error);
      toast.error('Failed to submit case study. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-stare-navy">Submit Case Study</CardTitle>
      </CardHeader>
      <CardContent>
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
              <Label htmlFor="logo" className="text-sm font-medium">Company Logo *</Label>
              <div className="mt-1">
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
            </div>
            
            <div>
              <Label htmlFor="pdf" className="text-sm font-medium">Case Study PDF *</Label>
              <div className="mt-1">
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
      </CardContent>
    </Card>
  );
};

export default CaseStudySubmissionForm;
