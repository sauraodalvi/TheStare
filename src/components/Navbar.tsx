
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <span className="font-display font-bold text-2xl text-stare-navy">The<span className="text-stare-teal">Stare</span></span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks className="flex items-center gap-6" />
          <div className="flex items-center gap-4">
            <Button size="sm" variant="outline" className="font-medium">
              Sign In
            </Button>
            <Button size="sm" className="bg-stare-teal hover:bg-stare-teal/90 text-white font-medium">
              Join Now
            </Button>
          </div>
        </nav>

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
              <NavLinks className="flex flex-col gap-4" />
              <div className="flex flex-col gap-3 pt-3 border-t border-slate-200">
                <Button size="sm" variant="outline" className="font-medium w-full">
                  Sign In
                </Button>
                <Button size="sm" className="bg-stare-teal hover:bg-stare-teal/90 text-white font-medium w-full">
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

const NavLinks = ({ className }: { className?: string }) => {
  return (
    <ul className={cn('', className)}>
      <li>
        <a href="#resources" className="text-stare-gray hover:text-stare-navy font-medium transition-colors">
          Resources
        </a>
      </li>
      <li>
        <a href="#jobs" className="text-stare-gray hover:text-stare-navy font-medium transition-colors">
          Jobs
        </a>
      </li>
      <li>
        <a href="#referrals" className="text-stare-gray hover:text-stare-navy font-medium transition-colors">
          Referrals
        </a>
      </li>
      <li>
        <a href="#about" className="text-stare-gray hover:text-stare-navy font-medium transition-colors">
          About
        </a>
      </li>
    </ul>
  );
};

export default Navbar;
