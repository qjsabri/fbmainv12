import React, { useState, useCallback } from 'react';
import { Search, Home, MessageCircle, Video, Store, Plus, Menu, Users, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import LiveStreamButton from './LiveStreamButton';
import { useIsMobile } from '@/hooks/use-device';
import { ROUTES, getSafeImage } from '@/lib/constants';
import ThemeToggle from './ThemeToggle';
import ReelsButton from './ReelsButton';
import NotificationBell from './NotificationBell';
import ChatWidget from './ChatWidget';
import { memo } from 'react';

// Optimize Header with memoization to prevent unnecessary re-renders
const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { id: 'home', icon: Home, path: ROUTES.HOME, label: 'Home' },
    { id: 'watch', icon: Video, path: ROUTES.WATCH, label: 'Watch' },
    { id: 'marketplace', icon: Store, path: ROUTES.MARKETPLACE, label: 'Marketplace' },
    { id: 'messages', icon: MessageCircle, path: ROUTES.MESSAGES, label: 'Messages' },
  ];

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    navigate(ROUTES.PROFILE);
  }, [navigate]);

  const handleNotificationsClick = useCallback(() => {
    navigate(ROUTES.NOTIFICATIONS);
  }, [navigate]);

  const handleSearch = useCallback((e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  }, [navigate, searchQuery, setSearchQuery]);

  const handleCreatePost = useCallback(() => {
    navigate(ROUTES.HOME);
  }, [navigate]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 safe-area-top dark:bg-gray-900 dark:border-gray-800 w-full">
        <div className="container-responsive mx-auto">
          <div className="flex items-center justify-between h-14 px-2 md:px-4">
            {/* Left section - Logo */}
            <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleNavigation(ROUTES.HOME)}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">f</span>
                </div>
                <span className="hide-mobile text-lg font-bold text-blue-600 dark:text-blue-400">facebook</span>
              </div>
            </div>

            {/* Center section - Search */}
            <div className="flex-1 max-w-xs sm:max-w-lg mx-2 md:mx-4">
              <form onSubmit={(e) => handleSearch(e)} className="w-full">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={isMobile ? "Search" : "Search Facebook"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-100 border-none rounded-full h-10 dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>
              </form>
            </div>

            {/* Right section - Navigation + User actions */}
            <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
              {/* Navigation Icons - Show on all screen sizes */}
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button 
                      key={item.id}
                      variant="ghost" 
                      size="sm" 
                      className={`relative p-2 rounded-md transition-colors h-10 w-10 ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                      }`}
                      onClick={() => handleNavigation(item.path)}
                      aria-label={item.label}
                    >
                      <item.icon className="w-5 h-5" />
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>
                      )}
                    </Button>
                  );
                })}
              </div>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Reels Button */}
              <ReelsButton />

              {/* Action Buttons */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors h-10 w-10 dark:hover:bg-gray-800"
                onClick={handleCreatePost}
                aria-label="Create post"
              >
                <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Button>
              
              <LiveStreamButton />
              
              <NotificationBell count={3} onClick={handleNotificationsClick} />
              
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors h-10 w-10 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Menu"
                >
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Button>
              )}
              
              <Avatar 
                className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity ml-2" 
                onClick={handleProfileClick}
              >
                <AvatarImage src={getSafeImage('AVATARS', 7)} />
                <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=400&h=400&fit=crop&crop=face" />
              </Avatar>
            </div>
          </div>

          {/* Mobile menu - Additional options */}
          {isMenuOpen && isMobile && (
            <div className="bg-white border-t border-gray-200 py-2 dark:bg-gray-900 dark:border-gray-800">
              <div className="grid grid-cols-2 gap-2 px-4">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-3 rounded-lg text-left justify-start h-12 dark:text-gray-200"
                  onClick={() => {
                    handleNavigation(ROUTES.FRIENDS);
                    setIsMenuOpen(false);
                  }}
                >
                  <Users className="w-5 h-5" />
                  <span>Friends</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-3 rounded-lg text-left justify-start h-12 dark:text-gray-200"
                  onClick={() => {
                    handleNavigation(ROUTES.GROUPS);
                    setIsMenuOpen(false);
                  }}
                >
                  <Users className="w-5 h-5" />
                  <span>Groups</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-3 rounded-lg text-left justify-start h-12 dark:text-gray-200"
                  onClick={() => {
                    handleNavigation(ROUTES.REELS);
                    setIsMenuOpen(false);
                  }}
                >
                  <Film className="w-5 h-5" />
                  <span>Reels</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-3 rounded-lg text-left justify-start h-12 dark:text-gray-200"
                  onClick={() => {
                    handleNavigation(ROUTES.GAMING);
                    setIsMenuOpen(false);
                  }}
                >
                  <Gamepad className="w-5 h-5" />
                  <span>Gaming</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
});

// Gamepad icon component
const Gamepad = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" />
    <line x1="18" y1="11" x2="18.01" y2="11" />
    <rect x="2" y="6" width="20" height="12" rx="2" />
  </svg>
);

export default Header;
