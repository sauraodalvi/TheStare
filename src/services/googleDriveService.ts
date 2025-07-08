
export class GoogleDriveService {
  private static getAccessToken(): string {
    // In a real implementation, this would get a fresh access token
    // For now, we'll use the service account directly in the edge function
    return '';
  }

  static async uploadPDF(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload PDF to Google Drive');
    }

    const result = await response.json();
    return result.shareUrl;
  }
}
