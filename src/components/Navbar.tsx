
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleJoinNowClick = () => {
    navigate('/pricing');
  };
  
  const handleSignInClick = () => {
    toast.error("This is a premium feature", {
      description: "Only paid users can sign in. Please subscribe to a plan first.",
      action: {
        label: "View Plans",
        onClick: () => navigate('/pricing'),
      },
    });
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
      isScrolled ? "bg-white/90 shadow-sm border-slate-200/70" : "bg-white/80 border-slate-200/30"
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
              <NavigationMenuTrigger className="bg-transparent hover:bg-slate-50 focus:bg-slate-50 data-[state=open]:bg-slate-50">Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/case-studies"
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-stare-navy/80 to-stare-navy p-6 no-underline outline-none focus:shadow-md"
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
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100"
                      >
                        <div className="text-sm font-medium leading-none text-stare-navy">Self Study</div>
                        <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                          Books, courses, and resources for independent learning
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/resources/participate"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100"
                      >
                        <div className="text-sm font-medium leading-none text-stare-navy">Participate</div>
                        <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                          Join case challenges to build your portfolio
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/resources/portfolio"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100"
                      >
                        <div className="text-sm font-medium leading-none text-stare-navy">Portfolio Examples</div>
                        <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                          Showcase your work effectively
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="#jobs" className="text-stare-gray hover:text-stare-navy font-medium transition-colors px-4 py-2 flex">
                Jobs
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="#referrals" className="text-stare-gray hover:text-stare-navy font-medium transition-colors px-4 py-2 flex">
                Referrals
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about" className="text-stare-gray hover:text-stare-navy font-medium transition-colors px-4 py-2 flex">
                About
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/pricing" className="text-stare-gray hover:text-stare-navy font-medium transition-colors px-4 py-2 flex">
                Pricing
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button size="sm" variant="outline" className="font-medium" onClick={handleSignInClick}>
            Sign In
          </Button>
          <Button size="sm" className="bg-stare-teal hover:bg-stare-teal/90 text-white font-medium" onClick={handleJoinNowClick}>
            Join Now
          </Button>
        </div>

        {/* Mobile Navigation */}
        <button onClick={toggleMenu} className="block md:hidden">
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg animate-fade-in md:hidden">
            <div className="container py-4 flex flex-col gap-4">
              <ul className="flex flex-col gap-4">
                <li className="border-b border-slate-100 pb-2">
                  <div className="flex items-center justify-between">
                    <Link to="/resources" className="text-stare-navy font-medium py-2" onClick={toggleMenu}>
                      Resources
                    </Link>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-2 pl-4 flex flex-col gap-3">
                    <Link to="/case-studies" className="text-stare-gray text-sm py-1" onClick={toggleMenu}>
                      Case Studies
                    </Link>
                    <Link to="/resources/self-study" className="text-stare-gray text-sm py-1" onClick={toggleMenu}>
                      Self Study
                    </Link>
                    <Link to="/resources/participate" className="text-stare-gray text-sm py-1" onClick={toggleMenu}>
                      Participate
                    </Link>
                    <Link to="/resources/portfolio" className="text-stare-gray text-sm py-1" onClick={toggleMenu}>
                      Portfolio Examples
                    </Link>
                  </div>
                </li>
                <li>
                  <Link to="#jobs" className="text-stare-gray hover:text-stare-navy font-medium transition-colors block py-2" onClick={toggleMenu}>
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link to="#referrals" className="text-stare-gray hover:text-stare-navy font-medium transition-colors block py-2" onClick={toggleMenu}>
                    Referrals
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-stare-gray hover:text-stare-navy font-medium transition-colors block py-2" onClick={toggleMenu}>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-stare-gray hover:text-stare-navy font-medium transition-colors block py-2" onClick={toggleMenu}>
                    Pricing
                  </Link>
                </li>
              </ul>
              <div className="flex flex-col gap-3 pt-3 border-t border-slate-200">
                <Button size="sm" variant="outline" className="font-medium w-full" onClick={(e) => { toggleMenu(); handleSignInClick(); }}>
                  Sign In
                </Button>
                <Button size="sm" className="bg-stare-teal hover:bg-stare-teal/90 text-white font-medium w-full" onClick={(e) => { toggleMenu(); handleJoinNowClick(); }}>
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
