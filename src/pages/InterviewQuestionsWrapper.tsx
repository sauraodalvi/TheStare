import { lazy, Suspense } from 'react';
import Loading from '@/components/Loading';

// This is a workaround for Vite's dynamic import issue with TypeScript
const InterviewQuestions = lazy(() => import('./InterviewQuestions'));

const InterviewQuestionsWrapper = () => (
  <Suspense fallback={<Loading />}>
    <InterviewQuestions />
  </Suspense>
);

export default InterviewQuestionsWrapper;
