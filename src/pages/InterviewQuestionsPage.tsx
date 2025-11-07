import React from 'react';
import { SEO } from '@/components/SEO';

const InterviewQuestionsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Interview Questions | STAR-E" 
        description="Practice common interview questions with our interactive platform."
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Interview Questions</h1>
        <p className="text-lg">This is a temporary page to verify the routing is working correctly.</p>
      </div>
    </div>
  );
};

export default InterviewQuestionsPage;
