/**
 * Image optimization utilities
 * Helps improve LCP by optimizing image loading
 */

export interface ImageConfig {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(src: string, widths: number[] = [320, 640, 960, 1280, 1920]): string {
  return widths
    .map(width => {
      // If using a CDN, you can add query parameters for resizing
      // Example: `${src}?w=${width} ${width}w`
      return `${src} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: { [key: string]: string } = {
  '(max-width: 640px)': '100vw',
  '(max-width: 1024px)': '50vw',
  '(max-width: 1280px)': '33vw',
}): string {
  const entries = Object.entries(breakpoints);
  const sizes = entries.map(([query, size]) => `${query} ${size}`);
  sizes.push('25vw'); // Default size
  return sizes.join(', ');
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, as: 'image' = 'image'): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  
  // Add to head if not already present
  if (!document.querySelector(`link[href="${src}"]`)) {
    document.head.appendChild(link);
  }
}

/**
 * Preload multiple images
 */
export function preloadImages(images: string[]): void {
  images.forEach(src => preloadImage(src));
}

/**
 * Check if image is in viewport
 */
export function isImageInViewport(element: HTMLElement, threshold: number = 0): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'avif' | 'webp' | 'jpeg' {
  if (typeof window === 'undefined') return 'jpeg';

  // Check for AVIF support
  const avifSupport = document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0;
  if (avifSupport) return 'avif';

  // Check for WebP support
  const webpSupport = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  if (webpSupport) return 'webp';

  return 'jpeg';
}

/**
 * Calculate aspect ratio from dimensions
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * Get dimensions maintaining aspect ratio
 */
export function getDimensionsForAspectRatio(
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number,
  maxHeight?: number
): { width: number; height: number } {
  const aspectRatio = calculateAspectRatio(originalWidth, originalHeight);

  if (maxWidth && !maxHeight) {
    return {
      width: maxWidth,
      height: Math.round(maxWidth / aspectRatio),
    };
  }

  if (maxHeight && !maxWidth) {
    return {
      width: Math.round(maxHeight * aspectRatio),
      height: maxHeight,
    };
  }

  if (maxWidth && maxHeight) {
    const widthRatio = maxWidth / originalWidth;
    const heightRatio = maxHeight / originalHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio),
    };
  }

  return { width: originalWidth, height: originalHeight };
}

/**
 * Lazy load images using Intersection Observer
 */
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();

  constructor(options: IntersectionObserverInit = {}) {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          this.loadImage(img);
        }
      });
    }, {
      rootMargin: '50px',
      ...options,
    });
  }

  observe(img: HTMLImageElement): void {
    if (!this.observer) return;
    this.images.add(img);
    this.observer.observe(img);
  }

  unobserve(img: HTMLImageElement): void {
    if (!this.observer) return;
    this.images.delete(img);
    this.observer.unobserve(img);
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
    }

    if (srcset) {
      img.srcset = srcset;
      img.removeAttribute('data-srcset');
    }

    img.classList.add('loaded');
    this.unobserve(img);
  }

  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.images.clear();
    }
  }
}

/**
 * Create a global lazy image loader instance
 */
export const globalLazyLoader = typeof window !== 'undefined' ? new LazyImageLoader() : null;

export default {
  generateSrcSet,
  generateSizes,
  preloadImage,
  preloadImages,
  isImageInViewport,
  getOptimalImageFormat,
  calculateAspectRatio,
  getDimensionsForAspectRatio,
  LazyImageLoader,
  globalLazyLoader,
};
