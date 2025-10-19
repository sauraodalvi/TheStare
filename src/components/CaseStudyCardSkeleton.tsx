import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const CaseStudyCardSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 sm:p-5 flex flex-col h-full">
        {/* Company Logo and Title Row */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3">
          <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>

        {/* Company Name and Creator Row */}
        <div className="space-y-2 mb-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>

        {/* Category and Likes Row */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyCardSkeleton;
