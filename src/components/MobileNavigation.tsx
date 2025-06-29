import React, { useCallback } from 'react';
import { Home, Users, Video, Film, Store } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-device';
import { Badge } from '@/components/ui/badge';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'friends', icon: Users, label: 'Friends', path: '/friends' },
    { id: 'reels', icon: Film, label: 'Reels', path: '/reels', isNew: true },
    { id: 'watch', icon: Video, label: 'Watch', path: '/watch' },
    { id: 'marketplace', icon: Store, label: 'Store', path: '/marketplace' }
  ];

  const handleNavigation = useCallback((path: string) => {
    // Haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    navigate(path);
  }, [navigate]);

  return (
    <nav className="nav-responsive safe-area-bottom shadow-lg z-50">
      <div className="flex items-center justify-around px-1 py-1.5 max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center space-y-0.5 py-1.5 px-2 rounded-lg touch-action-manipulation transition-all duration-100 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50 transform scale-105 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
              onClick={() => handleNavigation(item.path)}
              aria-label={item.label}
              aria-pressed={isActive}
            >
              <div className="relative min-h-[24px] flex items-center justify-center">
                <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                {item.isNew && (
                  <Badge className="absolute -top-1.5 -right-1.5 w-2 h-2 min-w-0 p-0 bg-red-500 rounded-full">
                    <span className="sr-only">New</span>
                  </Badge>
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;