
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import PageNavigationMenu from './PageNavigationMenu';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold text-indigo-600">CloudHost</Link>
            
            {/* Page Navigation Menu */}
            <PageNavigationMenu />
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Login</Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
