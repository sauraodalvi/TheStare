/**
 * Google Drive service
 */
import { FileUploadService } from './fileUploadService';

export class GoogleDriveService {
  /**
   * Upload a file to Google Drive using the secure upload service
   * @param file The file to upload
   * @param type The type of file ('pdf' or 'logo')
   */
  static async uploadFile(file: File, type: 'pdf' | 'logo' = 'pdf'): Promise<string> {
    try {
      // First validate the file type
      if (!this.isFileTypeAllowed(file.type)) {
        throw new Error(`File type ${file.type} is not allowed`);
      }

      // Use the secure file upload service
      const result = await FileUploadService.uploadFile(file, type);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to upload file');
      }

      // In a production environment, you might want to:
      // 1. Set appropriate sharing permissions
      // 2. Generate a signed URL with expiration
      // 3. Log the upload for auditing
      
      return `https://drive.google.com/file/d/${result.filename}/view?usp=sharing`;
    } catch (error) {
      console.error('Google Drive upload error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to upload file');
    }
  }

  /**
   * Upload a PDF file
   */
  static async uploadPDF(file: File): Promise<string> {
    return this.uploadFile(file, 'pdf');
  }

  /**
   * Upload a logo file
   */
  static async uploadLogo(file: File): Promise<string> {
    return this.uploadFile(file, 'logo');
  }

  /**
   * Check if a file type is allowed
   */
  static isFileTypeAllowed(fileType: string): boolean {
    return FileUploadService.isFileTypeAllowed(fileType);
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    return FileUploadService.formatFileSize(bytes);
  }
}
