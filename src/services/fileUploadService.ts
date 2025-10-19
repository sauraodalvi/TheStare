import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export type UploadResponse = {
  success: boolean;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  url?: string;
  error?: string;
};

export class FileUploadService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
  ];

  /**
   * Upload a file to the server
   */
  // Sanitize filename to prevent path traversal
  private static sanitizeFilename(filename: string): string {
    // Remove any path information
    const basename = filename.replace(/^.*[\\/]/, '');
    // Replace any non-alphanumeric characters (except ._-) with _
    return basename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  // Validate file type and extension
  private static validateFile(file: File, allowedTypes: string[]): void {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    // Additional check for file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension) {
      throw new Error('Invalid file name');
    }
  }

  static async uploadFile(file: File, type: 'pdf' | 'logo' = 'pdf'): Promise<UploadResponse> {
    try {
      // Validate file
      this.validateFile(file, this.ALLOWED_FILE_TYPES);
      
      // Sanitize filename
      const sanitizedFilename = this.sanitizeFilename(file.name);
      
      // Create a new File object with the sanitized name
      const safeFile = new File([file], sanitizedFilename, { type: file.type });

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Get session to ensure user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Upload the file using the secure endpoint
      const { data, error } = await supabase.functions.invoke('secure-upload', {
        body: formData,
        // Don't set Content-Type header, let the browser set it with the correct boundary
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to upload file');
      }

      return {
        success: true,
        filename: data.filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: data.url,
      };
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        filename: '',
        originalName: file?.name || '',
        size: file?.size || 0,
        type: file?.type || '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate a secure filename
   */
  static generateSecureFilename(originalName: string, userId: string): string {
    const ext = originalName.split('.').pop() || '';
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const sanitizedBase = baseName.replace(/[^\w\d-]/g, '_').replace(/_+/g, '_');
    return `${userId}_${Date.now()}_${sanitizedBase}.${ext}`.toLowerCase();
  }

  /**
   * Get file extension from filename
   */
  static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Check if file type is allowed
   */
  static isFileTypeAllowed(fileType: string): boolean {
    return this.ALLOWED_FILE_TYPES.includes(fileType);
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
