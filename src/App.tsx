
import React, { useState } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import CaseStudies from "./pages/CaseStudies";
import Resources from "./pages/Resources";
import Participate from "./pages/Participate";
import About from "./pages/About";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import Portfolio from "./pages/Portfolio";
import SelfStudy from "./pages/SelfStudy";
import Courses from "./pages/Courses";
import Resume from "./pages/Resume";
import CaseStudyReview from "./pages/CaseStudyReview";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import PDFTestComponent from "./components/PDFTestComponent";

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
                <Route path="/admin" element={<Admin />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/test-pdf" element={<PDFTestComponent />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
