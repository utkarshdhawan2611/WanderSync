
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '../components/ui/button';
import { Navigation } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center px-4 space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          We couldn't find the page you're looking for. Let's get you back on the right path.
        </p>
        <div className="pt-4">
          <Button asChild size="lg">
            <Link to="/">
              <Navigation className="h-5 w-5 mr-2" />
              Back to Planner
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
