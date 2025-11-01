import React, { useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from './hooks/useAuth';
import { GoogleVerification } from '@/components/GoogleVerification';

// Lazy load page components
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Courses = lazy(() => import("./pages/Courses"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyReview = lazy(() => import("./pages/CaseStudyReview"));
const Participate = lazy(() => import("./pages/Participate"));
const Profile = lazy(() => import("./pages/Profile"));
const Resume = lazy(() => import("./pages/Resume"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("@/components/AdminLogin"));
const Resources = lazy(() => import("./pages/Resources"));
const SelfStudy = lazy(() => import("./pages/SelfStudy"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AddYourWork = lazy(() => import("./pages/AddYourWork"));
const InterviewQuestions = lazy(() => import("./pages/InterviewQuestions"));
const InterviewQuestionsPractice = lazy(() => import("./pages/InterviewQuestionsPractice"));
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
    return <Navigate to="/sign-in" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to={redirectTo} replace />;
  }

  if (userOnly && user.role !== 'user') {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

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
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute adminOnly>
                        <Admin />
                      </ProtectedRoute>
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
                  <Route path="/interview-questions/practice" element={<InterviewQuestionsPractice />} />
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






