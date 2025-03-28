
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Server } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Server className="h-7 w-7 text-hosting-blue mr-2" />
            <span className="text-xl font-bold text-hosting-gray">Cloud<span className="text-hosting-blue">Host</span></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-700 hover:text-hosting-blue transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-gray-700 hover:text-hosting-blue transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-hosting-blue transition-colors">Testimonials</a>
            <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-hosting-blue transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-sm font-medium">Log In</Button>
            <Button className="bg-hosting-blue hover:bg-hosting-dark-blue text-white">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 pb-6 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-base font-medium text-gray-700 hover:text-hosting-blue transition-colors">Features</a>
              <a href="#pricing" className="text-base font-medium text-gray-700 hover:text-hosting-blue transition-colors">Pricing</a>
              <a href="#testimonials" className="text-base font-medium text-gray-700 hover:text-hosting-blue transition-colors">Testimonials</a>
              <a href="#contact" className="text-base font-medium text-gray-700 hover:text-hosting-blue transition-colors">Contact</a>
              <div className="pt-2 flex flex-col space-y-3">
                <Button variant="outline" className="w-full justify-center">Log In</Button>
                <Button className="w-full bg-hosting-blue hover:bg-hosting-dark-blue text-white justify-center">Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
