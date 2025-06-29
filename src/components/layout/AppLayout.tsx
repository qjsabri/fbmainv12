import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContextType';
import { useIsMobile, useIsTablet } from '@/hooks/use-device';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import MobileNavigation from '@/components/MobileNavigation';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { ROUTES } from '@/lib/constants';
import { Toaster } from '@/components/ui/sonner';
import { LazyComponent } from '@/components/ui/LazyComponent';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebars?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showSidebars = true 
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const location = useLocation();
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  
  // Define content classes for the main content area
  const contentClasses = 'pt-2 pb-20 md:pt-4 md:pb-8 overflow-x-hidden';
  
  // Determine if we should show the right sidebar based on the current route
  useEffect(() => {
    const isHomePage = location.pathname === ROUTES.HOME;
    const shouldShowRightSidebar = isHomePage && !isMobile; // Show on tablet AND desktop
    setShowRightSidebar(shouldShowRightSidebar);
  }, [location.pathname, isMobile]);

  if (!user) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-900 overflow-x-hidden w-full">
        <Header />
        
        <div className={`main-layout flex-grow ${showRightSidebar ? 'with-right-sidebar' : 'without-right-sidebar'}`}>
          {/* Left Sidebar - Hidden on mobile */}
          {showSidebars && !isMobile && (
            <aside className="sidebar-responsive">
              <LazyComponent loadingStrategy="eager">
                <Sidebar />
              </LazyComponent>
            </aside>
          )}
          
          {/* Main Content */}
          <main className={`main-content ${contentClasses}`}>
            {children}
          </main>
          
          {/* Right Sidebar - Only shown when showRightSidebar is true (Home page + tablet/desktop) */}
          {showSidebars && showRightSidebar && (
            <aside className="right-sidebar-responsive">
              <LazyComponent loadingStrategy="lazy">
                <RightSidebar />
              </LazyComponent>
            </aside>
          )}
        </div>
        
        {/* Mobile Navigation */}
        {isMobile && <MobileNavigation />}
        
        {/* Global Toaster */}
        <Toaster position="top-right" closeButton richColors />
      </div>
    </ErrorBoundary>
  );
};

export default AppLayout;