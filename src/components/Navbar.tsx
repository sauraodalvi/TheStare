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
      id: 'nav-resources',
      title: 'Resources', 
      href: '#',
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
    },
    // Resources dropdown items
    { 
      id: 'nav-case-studies',
      title: 'Case Studies', 
      href: '/case-studies',
      type: 'main',
      showInMobile: false
    },
    { 
      id: 'nav-self-study',
      title: 'Self Study', 
      href: '/resources/self-study',
      type: 'main',
      showInMobile: false
    },
    { 
      id: 'nav-courses',
      title: 'Courses', 
      href: '/resources/courses',
      type: 'main',
      showInMobile: false
    },
    { 
      id: 'nav-participate',
      title: 'Participate', 
      href: '/resources/participate',
      type: 'main',
      showInMobile: false
    },
    { 
      id: 'nav-portfolio',
      title: 'Portfolio', 
      href: '/resources/portfolio',
      type: 'main',
      showInMobile: false
    },
    { 
      id: 'nav-resume',
      title: 'Resume', 
      href: '/resources/resume',
      type: 'main',
      showInMobile: false
    },
    { 
      id: 'nav-case-study-review',
      title: 'Case Study Review', 
      href: '/case-study-review',
      type: 'main',
      showInMobile: false
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

  // Get resources items for dropdown
  const resourcesItems = navItems.filter(item => !['nav-resources', 'nav-donate', 'nav-about', 'nav-pricing'].includes(item.id));

  // Navigation link component
  const NavLink = ({ item }: { item: NavItem }) => {
    if (item.external) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md"
        >
          {item.title}
        </a>
      );
    }
    
    return (
      <Link
        to={item.href}
        className="text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md"
        onClick={() => setIsMenuOpen(false)}
      >
        {item.title}
      </Link>
    );
  };

  // Add padding to the body when mobile menu is open to prevent scrolling
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Add padding to the top of the page to prevent content from being hidden behind the fixed navbar */}
      <div className="h-16 md:h-20" />
      
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background border-b',
        isMenuOpen ? 'h-screen md:h-auto' : 'h-auto'
      )}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between bg-background">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-display font-bold text-2xl text-stare-navy">The<span className="text-stare-teal">Stare</span></span>
        </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {/* Resources Dropdown */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {resourcesItems.map((item) => (
                    <li key={item.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{item.title}</div>
                          {item.description && (
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Other main nav items */}
        {navItems
          .filter(item => ['nav-donate', 'nav-about', 'nav-pricing'].includes(item.id))
          .map((item) => (
            <NavLink key={item.id} item={item} />
          ))}
      </nav>

      {/* Right side - Auth and Theme Toggle */}
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          {authItems.map((item) => (
            <Button
              key={item.id}
              asChild={!item.onClick}
              variant={item.id.includes('join') ? 'default' : 'outline'}
              onClick={item.onClick}
            >
              {item.onClick ? (
                <button>{item.title}</button>
              ) : (
                <Link to={item.href} target={item.external ? '_blank' : '_self'}>
                  {item.title}
                </Link>
              )}
            </Button>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Mobile Menu - Bottom Sheet */}
      <div
        className={cn(
          'md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out transform',
          'bg-background rounded-t-2xl shadow-2xl',
          isMenuOpen ? 'translate-y-0' : 'translate-y-full',
          'h-[85vh] max-h-[90vh] flex flex-col'
        )}
      >
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>
        
        {/* Menu Content */}
        <div className="px-4 pb-6 flex-1 overflow-y-auto">
        {/* Resources Section */}
        <div className="mb-4">
          <h3 className="px-4 mb-2 text-sm font-medium text-muted-foreground">Resources</h3>
          <div className="space-y-1">
            {resourcesItems.map((item) => (
              <Button
                key={item.id}
                asChild
                variant="ghost"
                className="w-full justify-start text-left h-auto py-3 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to={item.href} className="w-full">
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Other Links */}
        <div className="border-t pt-4">
          {navItems
            .filter(item => ['nav-donate', 'nav-about', 'nav-pricing'].includes(item.id))
            .map((item) => (
              <Button
                key={item.id}
                asChild
                variant="ghost"
                className="w-full justify-start text-left h-auto py-3 px-4 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to={item.href} target={item.external ? '_blank' : '_self'} className="w-full">
                  {item.title}
                </Link>
              </Button>
            ))}
        </div>

        {/* Auth Buttons */}
        <div className="border-t pt-4 mt-4">
          {authItems.map((item) => (
            <Button
              key={item.id}
              asChild={!item.onClick}
              variant={item.id.includes('join') || item.id.includes('sign-up') ? 'default' : 'outline'}
              className="w-full justify-start text-left h-auto py-3 px-4 rounded-lg mb-2"
              onClick={() => {
                if (item.onClick) item.onClick();
                setIsMenuOpen(false);
              }}
            >
              {item.onClick ? (
                <button className="w-full text-left">{item.title}</button>
              ) : (
                <Link to={item.href} className="w-full">
                  {item.title}
                </Link>
              )}
            </Button>
          ))}
        </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
