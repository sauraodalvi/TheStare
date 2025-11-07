import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// This is a workaround for Vite's dynamic import issue with TypeScript
const InterviewQuestions = lazy(() => 
  import('./InterviewQuestions').then(module => ({
    default: module.default
  }))
);

const LoadingSkeleton = () => (
  <div className="p-4 space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-32 w-full" />
  </div>
);

const InterviewQuestionsLazy = () => (
  <Suspense fallback={<LoadingSkeleton />}>
    <InterviewQuestions />
  </Suspense>
);

export default InterviewQuestionsLazy;
