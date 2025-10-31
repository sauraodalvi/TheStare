
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, ChevronRight, LogOut, X } from 'lucide-react';
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface NavItem {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
  onClick?: () => void;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
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

  // Navigation items with descriptions for the desktop dropdown
  const navItems: NavItem[] = [
    { 
      title: 'Case Studies', 
      href: '/case-studies',
      description: 'Real-world product management scenarios to learn from'
    },
    { 
      title: 'Self Study', 
      href: '/resources/self-study',
      description: 'Books, courses, and resources for independent learning'
    },
    { 
      title: 'Courses', 
      href: '/resources/courses',
      description: 'Free video courses and sessions from top PMs'
    },
    { 
      title: 'Participate', 
      href: '/resources/participate',
      description: 'Join case challenges to build your portfolio'
    },
    { 
      title: 'Portfolio', 
      href: '/resources/portfolio',
      description: 'Showcase your work effectively'
    },
    { 
      title: 'Resume', 
      href: '/resources/resume',
      description: 'Real PM resumes and templates'
    },
    { 
      title: 'Case Study Review', 
      href: '/case-study-review',
      description: 'Get AI-powered feedback on your case studies'
    },
  ];

  // Create a filtered list for the mobile menu (without descriptions)
  const mobileNavItems = navItems.map(({ title, href, external, onClick }) => ({
    title,
    href,
    external,
    onClick
  }));

  // Add standalone menu items to mobile menu
  mobileNavItems.push(
    { 
      title: 'Donate', 
      href: 'https://saurao.gumroad.com/l/BuymeaCoffee', 
      external: true
    },
    { 
      title: 'About', 
      href: '/about', 
      external: false
    },
    { 
      title: 'Pricing', 
      href: '/pricing', 
      external: false
    }
  );

  // Add authentication menu items
  if (user) {
    // When user is logged in, show Profile and Sign Out
    mobileNavItems.push(
      { 
        title: 'Profile', 
        href: '/profile', 
        external: false
      },
      { 
        title: 'Sign Out', 
        href: '#', 
        onClick: handleSignOut,
        external: false
      }
    );
  } else {
    // When user is NOT logged in, show Sign In and Join Now
    mobileNavItems.push(
      { 
        title: 'Sign In', 
        href: '/sign-in', 
        external: false
      },
      { 
        title: 'Join Now', 
        href: '/pricing', 
        external: false
      }
    );
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300",
      isScrolled 
        ? "bg-background/90 shadow-sm border-border/70" 
        : "bg-background/80 border-border/30"
    )}>
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display font-bold text-2xl text-stare-navy">
            The<span className="text-stare-teal">Stare</span>
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet>
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
                  Navigate through the site using the menu options below
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col flex-1 overflow-y-auto py-6">
                <div className="space-y-2 flex-1 min-h-0">
                  {mobileNavItems.map((item) => (
                    item.external ? (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <span>{item.title}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ) : (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={item.onClick}
                        className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <span>{item.title}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    )
                  ))}
                  
                  {/* Mobile Auth Buttons */}
                  <div className="pt-4 border-t mt-4">
                    <div className="px-4 py-4 flex items-center justify-between min-h-[60px]">
                      <span className="text-sm font-medium text-foreground">Theme</span>
                      <ThemeToggle />
                    </div>
                    
                    {loading ? (
                      <div className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                        <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full"></div>
                        Loading...
                      </div>
                    ) : user ? (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{user.email?.split('@')[0] || 'Profile'}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-left"
                        >
                          <div className="flex items-center gap-2 text-destructive">
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </div>
                        </button>
                      </>
                    ) : (
                      <div className="space-y-2 px-4 py-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => navigate('/sign-in')}
                        >
                          Sign In
                        </Button>
                        <Button 
                          variant="brand" 
                          className="w-full"
                          onClick={() => navigate('/pricing')}
                        >
                          Join Now
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {user && (
                  <div className="mt-auto pt-4 border-t">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground font-medium transition-colors px-4 py-2 bg-transparent hover:bg-muted/50 focus:bg-transparent data-[state=open]:bg-transparent">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {navItems
                      .filter(item => !item.external)
                      .map((item, index) => (
                        <li key={item.href} className={index === 0 ? 'row-span-3' : ''}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              onClick={item.onClick}
                              className={cn(
                                'block h-full w-full select-none rounded-md p-3 no-underline outline-none transition-colors',
                                index === 0 
                                  ? 'flex flex-col justify-end bg-gradient-to-br from-stare-teal to-stare-navy p-6 text-white' 
                                  : 'hover:bg-muted focus:bg-muted'
                              )}
                            >
                              <div className={cn(
                                'font-medium',
                                index === 0 ? 'text-lg mb-2 mt-4' : 'text-sm'
                              )}>
                                {item.title}
                              </div>
                              {item.description && (
                                <p className={cn(
                                  'leading-snug',
                                  index === 0 
                                    ? 'text-sm text-white/90' 
                                    : 'text-sm text-muted-foreground line-clamp-2'
                                )}>
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

              <NavigationMenuItem>
                <a 
                  href="https://saurao.gumroad.com/l/BuymeaCoffee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors px-4 py-2 flex"
                >
                  Donate
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/about" className="text-muted-foreground hover:text-foreground font-medium transition-colors px-4 py-2 flex">
                  About
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground font-medium transition-colors px-4 py-2 flex">
                  Pricing
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full"></div>
              Loading...
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 text-sm py-2 px-3 bg-muted rounded-md hover:bg-accent/50 transition-colors">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {user.email?.split('@')[0] || 'User'}
                </span>
              </Link>
              <Button size="sm" variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button size="sm" variant="outline" onClick={() => navigate('/sign-in')}>
                Sign In
              </Button>
              <Button size="sm" variant="brand" onClick={() => navigate('/pricing')}>
                Join Now
              </Button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;



