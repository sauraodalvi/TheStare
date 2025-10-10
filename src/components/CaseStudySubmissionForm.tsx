
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

  const uploadToGoogleDrive = async (file: File, type: 'pdf' | 'logo'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-pdf`;
    const headers = {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload file to Google Drive');
    }

    const result = await response.json();
    return result.shareUrl;
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
      toast.info('Uploading logo to Google Drive...');
      const logoUrl = await uploadToGoogleDrive(logoFile, 'logo');

      toast.info('Uploading PDF to Google Drive...');
      const pdfUrl = await uploadToGoogleDrive(pdfFile, 'pdf');

      toast.info('Saving case study to database...');
      const { error: insertError } = await supabase
        .from('case_studies')
        .insert({
          name: formData.title,
          organizer: formData.creator,
          company: formData.company,
          google_drive_logo_path: logoUrl,
          google_drive_pdf_path: pdfUrl,
          free: true,
          likes: 0,
          publish: true
        });

      if (insertError) throw insertError;

      toast.success('Case study submitted successfully!');

      setFormData({ title: '', creator: '', company: '' });
      setLogoFile(null);
      setPdfFile(null);

      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      fileInputs.forEach(input => input.value = '');

    } catch (error) {
      console.error('Error submitting case study:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit case study. Please try again.');
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
