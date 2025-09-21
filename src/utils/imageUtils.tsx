import React, { useState, useEffect } from 'react';

/**
 * Handles Google Drive image URLs to work around CORS issues
 * @param url Original image URL
 * @returns Processed URL that should work with CORS
 */
export const processImageUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  
  // If it's already a proxied URL, return as is
  if (url.includes('images.weserv.nl') || url.includes('drive.google.com/uc')) {
    return url;
  }
  
  // Handle Google Drive URLs
  if (url.includes('drive.google.com')) {
    let fileId = '';
    
    // Extract file ID from different Google Drive URL formats
    if (url.includes('/thumbnail')) {
      // Format: https://drive.google.com/thumbnail?id=FILE_ID
      const match = url.match(/[&?]id=([^&]+)/);
      fileId = match ? match[1] : '';
    } else if (url.includes('/file/d/')) {
      // Format: https://drive.google.com/file/d/FILE_ID/view
      const match = url.match(/\/d\/([^/]+)/);
      fileId = match ? match[1] : '';
    } else if (url.includes('export=view&id=')) {
      // Format: https://drive.google.com/uc?export=view&id=FILE_ID
      const match = url.match(/[&?]id=([^&]+)/);
      fileId = match ? match[1] : '';
    }
    
    if (fileId) {
      // Use a proxy service to fetch the image with CORS support
      return `https://images.weserv.nl/?url=${encodeURIComponent(
        `https://drive.google.com/uc?export=view&id=${fileId}`
      )}&w=800&h=600&fit=contain`;
    }
  }
  
  return url;
};

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | undefined;
  alt: string;
  className?: string;
}

/**
 * Image component that handles loading and error states
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  ...props
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const processedUrl = processImageUrl(src);
    if (!processedUrl) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setImageUrl(processedUrl);
    
    // Preload the image
    const img = new Image();
    img.src = processedUrl;
    
    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };
    
    const handleError = () => {
      console.error('Error loading image:', processedUrl);
      setHasError(true);
      setIsLoading(false);
    };
    
    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    
    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 ${className}`}>
        <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (hasError || !imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 ${className}`}>
        <div className="text-muted-foreground">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <line x1="3" x2="21" y1="9" y2="9" />
            <line x1="9" x2="9" y1="21" y2="9" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      loading="lazy"
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
