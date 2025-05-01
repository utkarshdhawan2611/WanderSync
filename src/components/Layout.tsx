
import React from 'react';
import { Button } from './ui/button';
import { Navigation, Route } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center">
            <Route className="h-6 w-6 text-primary mr-2" />
            <Link to="/" className="text-xl font-bold text-primary">
              Smart Travel Planner
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary">
              Plan Route
            </Link>
            <Link to="/saved" className="text-sm font-medium text-gray-600 hover:text-primary">
              Saved Itineraries
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              Help
            </Button>
            <Button size="sm">
              <Navigation className="h-4 w-4 mr-1" />
              New Trip
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
      
      <footer className="border-t bg-gray-50">
        <div className="container px-4 py-6 md:px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Smart Travel Planner - Built with React, TypeScript & Tailwind CSS
        </div>
      </footer>
    </div>
  );
};

export default Layout;
