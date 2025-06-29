import React, { useState, useEffect } from 'react';
import PagesTab from '@/components/PagesTab';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Pages = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <PagesTab />
    </div>
  );
};

export default Pages;