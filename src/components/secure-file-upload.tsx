import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

interface SecureFileUploadProps {
  bucket: 'company-logos' | 'case-study-pdfs';
  path: string;
  acceptedFileTypes?: string[];
  maxSizeMB?: number;
  onUploadSuccess?: (filePath: string) => void;
  onUploadError?: (error: Error) => void;
}

export function SecureFileUpload({
  bucket,
  path,
  acceptedFileTypes = ['image/*', 'application/pdf'],
  maxSizeMB = 10,
  onUploadSuccess,
  onUploadError,
}: SecureFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  // Supabase client is already initialized at the top level

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `File must be smaller than ${maxSizeMB}MB`,
          variant: 'destructive',
        });
        return;
      }

      try {
        setIsUploading(true);

        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        onUploadSuccess?.(publicUrl);

        toast({
          title: 'Upload successful',
          description: 'Your file has been uploaded.',
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        onUploadError?.(error as Error);
        
        toast({
          title: 'Upload failed',
          description: 'There was an error uploading your file. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, path, maxSizeMB, onUploadSuccess, onUploadError, toast, supabase]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        {isUploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop the file here' : 'Drag and drop a file here, or click to select'}
              </p>
              <p className="text-xs text-muted-foreground">
                {acceptedFileTypes.join(', ')} (max {maxSizeMB}MB)
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2">
              Select file
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
