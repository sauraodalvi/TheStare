
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display font-bold text-2xl">The<span className="text-stare-teal">Stare</span></span>
            </div>
            <p className="text-slate-300">
              India's premier platform dedicated to supporting aspiring and experienced product managers in advancing their careers.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-stare-teal/80 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-stare-teal/80 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#resources" className="text-slate-300 hover:text-white transition-colors">Resources</a>
              </li>
              <li>
                <a
                  href="https://saurao.gumroad.com/l/BuymeaCoffee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Donate
                </a>
              </li>
              <li>
                <a href="#about" className="text-slate-300 hover:text-white transition-colors">About Us</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Case Studies</a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Resume Templates</a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Portfolio Examples</a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Interview Prep</a>
              </li>
            </ul>
          </div>
          

        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10 flex justify-center">
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="https://www.linkedin.com/in/saurao-dalvi/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
