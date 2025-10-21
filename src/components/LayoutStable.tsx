import React, { ReactNode } from 'react';

interface LayoutStableProps {
  children: ReactNode;
  minHeight?: string | number;
  className?: string;
}

/**
 * LayoutStable component to prevent Cumulative Layout Shift (CLS)
 * Reserves space for content before it loads
 */
export const LayoutStable: React.FC<LayoutStableProps> = ({
  children,
  minHeight = 'auto',
  className = '',
}) => {
  return (
    <div
      className={`w-full ${className}`}
      style={{
        minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
        contain: 'layout', // CSS containment for better performance
      }}
    >
      {children}
    </div>
  );
};

interface AspectRatioBoxProps {
  ratio?: number; // width / height, e.g., 16/9 = 1.777
  children: ReactNode;
  className?: string;
}

/**
 * AspectRatioBox maintains aspect ratio to prevent layout shifts
 * Useful for images, videos, and embedded content
 */
export const AspectRatioBox: React.FC<AspectRatioBoxProps> = ({
  ratio = 16 / 9,
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{
        paddingBottom: `${(1 / ratio) * 100}%`,
      }}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
};

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

/**
 * Skeleton component for loading states
 * Prevents layout shift by reserving space
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  className = '',
  variant = 'rectangular',
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-800 animate-pulse ${variantClasses[variant]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

export default LayoutStable;
