import React, { useState, Suspense, lazy, useEffect } from "react";
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { toast } from 'sonner';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from './hooks/useAuth';
import { GoogleVerification } from '@/components/GoogleVerification';
import { AdminAuthService } from '@/services/adminAuthService.new';
import { AdminRouteSimple } from './components/AdminRouteSimple';

// Lazy load page components with error boundaries
const lazyWithRetry = (componentImport: any) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error('Error loading component:', error);
      // Retry once
      await new Promise(resolve => setTimeout(resolve, 1000));
      return componentImport();
    }
  });

const Index = lazyWithRetry(() => import("./pages/Index"));
const About = lazyWithRetry(() => import("./pages/About"));
const Courses = lazyWithRetry(() => import("./pages/Courses"));
const CaseStudies = lazyWithRetry(() => import("./pages/CaseStudies"));
const CaseStudyReview = lazyWithRetry(() => import("./pages/CaseStudyReview"));
const Participate = lazyWithRetry(() => import("./pages/Participate"));
const Profile = lazyWithRetry(() => import("./pages/Profile"));
const Resume = lazyWithRetry(() => import("./pages/Resume"));
const SignIn = lazyWithRetry(() => import("./pages/SignIn"));
const SignUp = lazyWithRetry(() => import("./pages/SignUp"));
const AdminPanel = lazyWithRetry(() => import("./pages/AdminPanel"));
const AdminLogin = lazyWithRetry(() => import("@/components/AdminLogin"));
const Resources = lazyWithRetry(() => import("./pages/Resources"));
const SelfStudy = lazyWithRetry(() => import("./pages/SelfStudy"));
const Portfolio = lazyWithRetry(() => import("./pages/Portfolio"));
const Pricing = lazyWithRetry(() => import("./pages/Pricing"));
const AddYourWork = lazy(() => import("./pages/AddYourWork"));
const InterviewQuestions = lazy(() => import("./pages/InterviewQuestions"));
// Import the new component
const InterviewQuestionsPractice = lazy(() => import('./pages/InterviewQuestionsPracticeNew'));
const InterviewQuestionsPracticeV1 = lazy(() => import('./pages/InterviewQuestionsPractice.component.tsx'));
const NotFound = lazy(() => import("./pages/NotFound"));
// Commented out as it's not currently used
// const PDFTestComponent = lazy(() => import("./pages/PDFTestComponent"));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false, userOnly = false, redirectTo = "/" }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: window.location.pathname }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to={redirectTo} replace />;
  }

  if (userOnly && user.role !== 'user') {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Use the simplified admin route
const AdminRoute = AdminRouteSimple;

const App: React.FC = () => {
  // Create QueryClient inside the component to ensure proper React context
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ThemeProvider defaultTheme="system" storageKey="stare-ui-theme">
            <TooltipProvider>
              <GoogleVerification />
              <Toaster />
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/case-studies" element={<CaseStudies />} />
                  <Route path="/case-study/:id" element={<CaseStudyReview />} />
                  <Route path="/case-study-review" element={<CaseStudyReview />} />
                  <Route 
                    path="/participate" 
                    element={
                      <ProtectedRoute>
                        <Participate />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/resume" element={<Resume />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <Suspense fallback={<Loading />}>
                        <AdminPanel />
                      </Suspense>
                    }
                  />
                  <Route 
                    path="/admin/login" 
                    element={
                      <AdminLogin 
                        onAuthenticated={() => window.location.href = '/admin'} 
                      />
                    } 
                  />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/resources/self-study" element={<SelfStudy />} />
                  <Route path="/resources/courses" element={<Courses />} />
                  <Route path="/resources/participate" element={<Participate />} />
                  <Route path="/resources/portfolio" element={<Portfolio />} />
                  <Route path="/resources/resume" element={<Resume />} />
                  <Route path="/self-study" element={<SelfStudy />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/interview-questions" element={<InterviewQuestions />} />
                  <Route path="/interview-questions-practice" element={
              <Suspense fallback={<Loading />}>
                <InterviewQuestionsPractice />
              </Suspense>
            } />
            <Route path="/practice-1" element={
              <Suspense fallback={<Loading />}>
                <InterviewQuestionsPracticeV1 />
              </Suspense>
            } />
                  <Route 
                    path="/add-your-work" 
                    element={
                      <ProtectedRoute>
                        <AddYourWork />
                      </ProtectedRoute>
                    } 
                  />
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;






