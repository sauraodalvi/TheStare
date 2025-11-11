import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';

interface NavItem {
  id: string;
  title: string;
  href: string;
  description?: string;
  external?: boolean;
  onClick?: () => void;
  type: 'main' | 'additional' | 'auth';
  showInMobile: boolean;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMobile && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [isMobile, isMenuOpen]);

  // Navigation items - in the order they should appear in both desktop and mobile
  const navItems: NavItem[] = [
    { 
      id: 'nav-case-studies',
      title: 'Case Studies', 
      href: '/case-studies',
      description: 'Real-world product management scenarios',
      type: 'main',
      showInMobile: true
    },
    { 
      id: 'nav-self-study',
      title: 'Self Study', 
      href: '/resources/self-study',
      description: 'Learning resources and materials',
      type: 'main',
      showInMobile: true
    },
    { 
      id: 'nav-courses',
      title: 'Courses', 
      href: '/resources/courses',
      description: 'Video courses and sessions',
      type: 'main',
      showInMobile: true
    },
    { 
      id: 'nav-interview-questions',
      title: 'Interview Questions', 
      href: '/interview-questions',
      description: 'PM interview preparation',
      type: 'main',
      showInMobile: true
    },
    { 
      id: 'nav-participate',
      title: 'Participate', 
      href: '/resources/participate',
      description: 'Join case challenges',
      type: 'main',
      showInMobile: true
    },
    { 
      id: 'nav-portfolio',
      title: 'Portfolio', 
      href: '/resources/portfolio',
      description: 'Showcase your work',
      type: 'main',
      showInMobile: true
    },
    { 
      id: 'nav-resume',
      title: 'Resume', 
      href: '/resources/resume',
      description: 'Resume templates and tips',
      type: 'main',
      showInMobile: true
    },
    { 
      id: 'nav-case-study-review',
      title: 'Case Study Review', 
      href: '/case-study-review',
      description: 'Get feedback on case studies',
      type: 'main',
      showInMobile: true
    },
    { 
      id: 'nav-donate',
      title: 'Donate', 
      href: 'https://saurao.gumroad.com/l/BuymeaCoffee', 
      type: 'additional',
      external: true,
      showInMobile: true
    },
    { 
      id: 'nav-about',
      title: 'About', 
      href: '/about',
      type: 'additional',
      showInMobile: true
    },
    { 
      id: 'nav-pricing',
      title: 'Pricing', 
      href: '/pricing',
      type: 'additional',
      showInMobile: true
    }
  ];

  // Auth items
  const authItems: NavItem[] = user
    ? [
        { 
          id: 'nav-profile',
          title: 'Profile', 
          href: '/profile',
          type: 'auth',
          showInMobile: true
        },
        { 
          id: 'nav-sign-out',
          title: 'Sign Out', 
          href: '#',
          type: 'auth',
          onClick: handleSignOut,
          showInMobile: true
        }
      ]
    : [
        { 
          id: 'nav-sign-in',
          title: 'Sign In', 
          href: '/sign-in',
          type: 'auth',
          showInMobile: true
        },
        { 
          id: 'nav-join-now',
          title: 'Join Now', 
          href: '/pricing',
          type: 'auth',
          showInMobile: true
        }
      ];

  // Get all navigation items in the order they should appear
  const allNavItems = [...navItems, ...authItems].filter(item => item.showInMobile);
  
  // For desktop navigation, filter out auth items
  const desktopNavItems = allNavItems.filter(item => item.type !== 'auth');

  // Render navigation item
  const renderNavItem = (item: NavItem) => {
    const navItem = (
      <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-accent transition-colors text-sm">
        <span>{item.title}</span>
        {!item.external && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </div>
    );

    if (item.external) {
      return (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          {navItem}
        </a>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.href}
        onClick={() => {
          item.onClick?.();
          setIsMenuOpen(false);
        }}
        className="block w-full"
      >
        {navItem}
      </Link>
    );
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all",
      isScrolled && "shadow-sm"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block">Stare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {desktopNavItems.map((item) => (
                  <NavigationMenuItem key={item.id}>
                    <Link to={item.href}>
                      <Button variant="ghost" className="text-sm">
                        {item.title}
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop Auth Buttons */}
          {!isMobile && (
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                  <Button size="sm" variant="brand" asChild>
                    <Link to="/profile">
                      Profile
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/sign-in">
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" variant="brand" asChild>
                    <Link to="/pricing">
                      Join Now
                    </Link>
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] flex flex-col h-full">
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Main navigation menu with links to different sections of the website
                  </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col flex-1 overflow-y-auto py-4">
                  {/* Navigation Items */}
                  <div className="space-y-1 px-4">
                    {allNavItems.map(item => renderNavItem(item))}
                  </div>
                  
                  {/* User Section */}
                  <div className="mt-auto pt-4 border-t px-4 space-y-2">
                    {/* Theme Toggle */}
                    <div className="px-3 py-2.5 flex items-center justify-between rounded-lg hover:bg-accent transition-colors">
                      <span className="text-sm">Theme</span>
                      <div className="h-9 w-9 -mr-1.5 flex items-center justify-center">
                        <div className="h-8 w-8 flex items-center justify-center overflow-hidden">
                          <div className="scale-75">
                            <ThemeToggle />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {user ? (
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 text-destructive">
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </div>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            navigate('/sign-in');
                            setIsMenuOpen(false);
                          }}
                        >
                          Sign In
                        </Button>
                        <Button 
                          variant="brand" 
                          className="w-full"
                          onClick={() => {
                            navigate('/pricing');
                            setIsMenuOpen(false);
                          }}
                        >
                          Join Now
                        </Button>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
