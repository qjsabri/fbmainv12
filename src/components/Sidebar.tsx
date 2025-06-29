import React, { useState, useCallback } from 'react';
import { Home, Users, Bookmark, Clock, Calendar, Store, Video, MessageCircle, Flag, ChevronDown, UsersRound, TrendingUp, Gamepad2, Film, CloudSun, Heart, Briefcase, Building2, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES, MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { useTheme } from '@/hooks/useTheme';
import { Badge } from '@/components/ui/badge';
import { useIsMobile, useIsTablet } from '@/hooks/use-device';
import WeatherWidget from './WeatherWidget';
import MarketplaceWidget from './MarketplaceWidget';
import GamingWidget from './GamingWidget';
import SavedItemsWidget from './SavedItemsWidget';
import MemoryWidget from './MemoryWidget';
import { memo } from 'react';

// Optimize sidebar with memoization to prevent unnecessary rerenders
const Sidebar = memo(() => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [showMore, setShowMore] = useState(!isMobile); // Show all tabs by default on desktop and tablet
  const [showWidgets, setShowWidgets] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // Create an array of menu items
  const menuItems = [
    { id: 'home', icon: Home, path: ROUTES.HOME, label: 'Home' },
    { id: 'friends', icon: Users, path: ROUTES.FRIENDS, label: 'Friends', count: 3 },
    { id: 'messages', icon: MessageCircle, path: ROUTES.MESSAGES, label: 'Messenger', count: 2 },
    { id: 'watch', icon: Video, path: ROUTES.WATCH, label: 'Watch' },
    { id: 'reels', icon: Film, path: ROUTES.REELS, label: 'Reels', isNew: true },
    { id: 'marketplace', icon: Store, path: ROUTES.MARKETPLACE, label: 'Marketplace' },
    { id: 'groups', icon: UsersRound, path: ROUTES.GROUPS, label: 'Groups' },
    { id: 'gaming', icon: Gamepad2, path: ROUTES.GAMING, label: 'Gaming' },
    { id: 'saved', icon: Bookmark, path: ROUTES.SAVED, label: 'Saved' },
    { id: 'events', icon: Calendar, path: ROUTES.EVENTS, label: 'Events' },
    { id: 'memories', icon: Clock, path: ROUTES.MEMORIES, label: 'Memories' },
    { id: 'pages', icon: Flag, path: '/pages', label: 'Pages' },
    { id: 'recent', icon: TrendingUp, path: '/recent', label: 'Most Recent' },
    { id: 'weather', icon: CloudSun, path: '/weather', label: 'Weather' },
    { id: 'dating', icon: Heart, path: ROUTES.DATING, label: 'Dating', isNew: true },
    { id: 'jobs', icon: Briefcase, path: ROUTES.JOBS, label: 'Jobs' },
    { id: 'business', icon: Building2, path: ROUTES.BUSINESS, label: 'Business Manager' },
    { id: 'settings', icon: Settings, path: ROUTES.SETTINGS, label: 'Settings' },
  ];

  const shortcuts = [
    { 
      name: 'React Developers', 
      image: MOCK_IMAGES.POSTS[0], 
      path: '/groups/react-developers',
      members: '12.5k'
    },
    { 
      name: 'Web Design Community', 
      image: MOCK_IMAGES.POSTS[1], 
      path: '/groups/web-design',
      members: '8.2k'
    },
    { 
      name: 'JavaScript Enthusiasts', 
      image: getSafeImage('POSTS', 2), 
      path: '/groups/javascript',
      members: '15.7k'
    },
  ];

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    navigate(ROUTES.PROFILE);
  }, [navigate]);

  const handleShortcutEdit = () => {
    // Edit shortcuts functionality
  };

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // On desktop and tablet, show all items by default. On mobile, use the showMore state
  const visibleItems = (!isMobile || showMore) ? menuItems : menuItems.slice(0, 8);

  // Memoize for performance
  const renderMenuItems = useCallback(() => {
    return visibleItems.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <Button
          key={item.label}
          variant="ghost"
          className={`w-full flex items-center justify-between p-3 rounded-lg text-left font-normal transition-colors ${
            isActive 
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
          }`}
          onClick={() => handleNavigation(item.path)}
          aria-label={item.label}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <item.icon className="w-6 h-6 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.isNew && (
              <Badge className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">New</Badge>
            )}
          </div>
          {item.count && (
            <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
              {item.count}
            </Badge>
          )}
        </Button>
      );
    });
  }, [visibleItems, location.pathname, handleNavigation]);

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin">
      <div className="p-2 md:p-4 space-y-3 md:space-y-4">
        {/* User Profile */}
        <div 
          className="flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
          onClick={handleProfileClick}
        >
          <Avatar className="w-8 h-8 md:w-10 md:h-10">
            <AvatarImage src={getSafeImage('AVATARS', 7)} />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100">John Doe</span>
        </div>

        {/* Main Menu */}
        <nav className="space-y-0.5 md:space-y-1">
          {renderMenuItems()}
        </nav>

        {/* See More Button - Only show on mobile */}
        {isMobile && (
          <>
            <Button
              variant="ghost"
              className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => setShowMore(!showMore)}
              aria-expanded={showMore}
            >
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
              </div>
              <span>{showMore ? 'See less' : 'See more'}</span>
            </Button>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={toggleTheme}
              >
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </div>
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </Button>
          </>
        )}

        {/* Divider */}
        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Widgets */}
        <div className="space-y-4">
          <Button
            variant="ghost" 
            className="w-full flex items-center justify-start space-x-3 p-2 md:p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
            onClick={() => setShowWidgets(!showWidgets)}
          >
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <ChevronDown className={`w-4 h-4 transition-transform ${!showWidgets ? 'rotate-180' : ''}`} />
            </div>
            <span>{showWidgets ? 'Hide widgets' : 'Show widgets'}</span>
          </Button>

          {showWidgets && (
            <div className="space-y-4">
              <WeatherWidget />
              <MemoryWidget />
              <MarketplaceWidget />
              <GamingWidget />
              <SavedItemsWidget />
            </div>
          )}
        </div>

        {/* Shortcuts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-xs md:text-sm">Your shortcuts</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 text-sm hover:bg-blue-50 transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
              onClick={handleShortcutEdit}
            >
              Edit
            </Button>
          </div>
          
          {shortcuts.map((shortcut) => (
            <Button
              key={shortcut.name}
              variant="ghost" 
              className="w-full flex items-center justify-start space-x-3 p-2 md:p-3 rounded-lg text-left hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
              onClick={() => handleNavigation(shortcut.path)}
            >
              <img
                src={shortcut.image}
                alt={shortcut.name}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-gray-100 font-medium truncate">{shortcut.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{shortcut.members} members</p>
              </div>
            </Button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex flex-col items-center space-y-1 p-3 h-auto dark:border-gray-700 dark:text-gray-200"
              onClick={() => {
                navigate('/');
              }}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">Post</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex flex-col items-center space-y-1 p-3 h-auto dark:border-gray-700 dark:text-gray-200"
              onClick={() => {
                navigate(ROUTES.EVENTS);
              }}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Event</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
// Sun and Moon icons
const Sun = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const Moon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default Sidebar;