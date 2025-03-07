
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-karbon-600" />
              <span className="text-xl font-bold text-foreground">KarbonLedger</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</a>
            <a href="#modules" className="text-foreground/80 hover:text-foreground transition-colors">Modules</a>
            <a href="#dashboard" className="text-foreground/80 hover:text-foreground transition-colors">Dashboard</a>
            <a href="#marketplace" className="text-foreground/80 hover:text-foreground transition-colors">Marketplace</a>
            <a href="#iot" className="text-foreground/80 hover:text-foreground transition-colors">IoT Integration</a>
            <Button variant="default" className="bg-karbon-600 hover:bg-karbon-700 text-white">
              Get Started
            </Button>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <a href="#features" className="block py-2 text-foreground/80 hover:text-foreground">Features</a>
            <a href="#modules" className="block py-2 text-foreground/80 hover:text-foreground">Modules</a>
            <a href="#dashboard" className="block py-2 text-foreground/80 hover:text-foreground">Dashboard</a>
            <a href="#marketplace" className="block py-2 text-foreground/80 hover:text-foreground">Marketplace</a>
            <a href="#iot" className="block py-2 text-foreground/80 hover:text-foreground">IoT Integration</a>
            <Button variant="default" className="w-full bg-karbon-600 hover:bg-karbon-700 text-white mt-2">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
