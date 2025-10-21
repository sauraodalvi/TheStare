
import React, { useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme-provider";

// Lazy load all pages for better code splitting and faster initial load
const Index = lazy(() => import("./pages/Index"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const Resources = lazy(() => import("./pages/Resources"));
const Participate = lazy(() => import("./pages/Participate"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const SelfStudy = lazy(() => import("./pages/SelfStudy"));
const Courses = lazy(() => import("./pages/Courses"));
const Resume = lazy(() => import("./pages/Resume"));
const CaseStudyReview = lazy(() => import("./pages/CaseStudyReview"));
const Profile = lazy(() => import("./pages/Profile"));
const AddYourWork = lazy(() => import("./pages/AddYourWork"));

// Lazy load admin components
const Admin = lazy(() => import("./pages/Admin"));
const SecureAdminLayout = lazy(() => import("@/components/SecureAdminLayout"));
const SecureAdminLogin = lazy(() => import("@/components/SecureAdminLogin"));

const PDFTestComponent = lazy(() => import("./components/PDFTestComponent"));

// Loading component for Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

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
              <Toaster />
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/case-studies" element={<CaseStudies />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/resources/participate" element={<Participate />} />
                  <Route path="/resources/portfolio" element={<Portfolio />} />
                  <Route path="/resources/self-study" element={<SelfStudy />} />
                  <Route path="/resources/courses" element={<Courses />} />
                  <Route path="/resources/resume" element={<Resume />} />
                  <Route path="/case-study-review" element={<CaseStudyReview />} />
                  <Route path="/about" element={<About />} />
                  {/* Admin Routes */}
                  <Route path="/admin">
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="login" element={
                      <SecureAdminLogin onAuthenticated={() => window.location.href = '/admin/dashboard'} />
                    } />
                    <Route element={<SecureAdminLayout />}>
                      <Route path="dashboard" element={<Admin />} />
                      {/* Add more secure admin routes here */}
                    </Route>
                  </Route>
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/add-your-work" element={<AddYourWork />} />
                  <Route path="/test-pdf" element={<PDFTestComponent />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
