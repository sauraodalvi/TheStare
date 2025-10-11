
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  // Debug authentication state
  console.log('=== NAVBAR AUTH DEBUG ===');
  console.log('User:', user);
  console.log('Loading:', loading);
  console.log('User email:', user?.email);
  console.log('=== END NAVBAR AUTH DEBUG ===');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleJoinNowClick = () => {
    navigate('/pricing');
  };
  
  const handleSignInClick = () => {
    navigate('/sign-in');
  };

  const handleSignOutClick = async () => {
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
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300",
      isScrolled 
        ? "bg-background/90 shadow-sm border-border/70" 
        : "bg-background/80 border-border/30"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display font-bold text-2xl text-stare-navy">The<span className="text-stare-teal">Stare</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground font-medium transition-colors px-4 py-2 bg-transparent hover:bg-muted/50 focus:bg-transparent data-[state=open]:bg-transparent">
                Resources
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/case-studies"
                        className="flex h-full w-full select-none flex-col justify-end rounded-md stare-gradient p-6 no-underline outline-none focus:shadow-md"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium text-white">
                          Case Studies
                        </div>
                        <p className="text-sm leading-tight text-white/90">
                          Real-world product management scenarios to learn from
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/resources/self-study"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted"
                      >
                        <div className="text-sm font-medium leading-none text-foreground">Self Study</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Books, courses, and resources for independent learning
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/resources/courses"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted"
                      >
                        <div className="text-sm font-medium leading-none text-foreground">Courses</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Free video courses and sessions from top PMs
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/resources/participate"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted"
                      >
                        <div className="text-sm font-medium leading-none text-foreground">Participate</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Join case challenges to build your portfolio
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/resources/portfolio"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted"
                      >
                        <div className="text-sm font-medium leading-none text-foreground">Portfolio</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Showcase your work effectively
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/resources/resume"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted"
                      >
                        <div className="text-sm font-medium leading-none text-foreground">Resume</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Real PM resumes and templates
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/case-study-review"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted"
                      >
                        <div className="text-sm font-medium leading-none text-foreground">Case Study Review</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Get AI-powered feedback on your case studies
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
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
              <Button size="sm" variant="outline" onClick={handleSignOutClick}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button size="sm" variant="outline" onClick={handleSignInClick}>
                Sign In
              </Button>
              <Button size="sm" variant="brand" onClick={handleJoinNowClick}>
                Join Now
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", isMenuOpen ? 'block' : 'hidden')}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/case-studies"
            className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Case Studies
          </Link>
          <Link
            to="/resources/self-study"
            className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Self Study
          </Link>
          <Link
            to="/resources/courses"
            className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Courses
          </Link>
          <Link
            to="/resources/participate"
            className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Participate
          </Link>
          <Link
            to="/resources/portfolio"
            className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Portfolio
          </Link>
          <Link
            to="/resources/resume"
            className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Resume
          </Link>
          <Link
            to="/case-study-review"
            className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Case Study Review
          </Link>
          <a
            href="https://saurao.gumroad.com/l/BuymeaCoffee"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Donate
          </a>
          <Link
            to="/about"
            className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/pricing"
            className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Pricing
          </Link>
        </div>

        <div className="pt-4 pb-3 border-t border-border">
          <div className="flex items-center justify-between px-4">
            <div className="text-sm font-medium text-foreground">Theme</div>
            <ThemeToggle />
          </div>
          <div className="mt-3 space-y-1 px-2">
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
                <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full"></div>
                Loading...
              </div>
            ) : user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={toggleMenu}
                >
                  <User className="h-4 w-4" />
                  <span>{user.email?.split('@')[0] || 'User'}</span>
                </Link>
                <button
                  onClick={(e) => { toggleMenu(); handleSignOutClick(); }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => { toggleMenu(); handleSignInClick(); }}
                  className="w-full text-left px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Sign In
                </button>
                <button
                  onClick={(e) => { toggleMenu(); handleJoinNowClick(); }}
                  className="w-full text-left px-3 py-2 text-sm font-medium rounded-md text-foreground bg-brand hover:bg-brand/90"
                >
                  Join Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
