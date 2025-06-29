import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STORAGE_KEYS } from '@/lib/constants';
import { storage } from '@/lib/storage';

interface ReelsButtonProps {
  notificationCount?: number;
}

const ReelsButton: React.FC<ReelsButtonProps> = ({ notificationCount = 0 }) => {
  const navigate = useNavigate();
  const [hasNewReels, setHasNewReels] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastOpenedTime, setLastOpenedTime] = useState<number>(0);

  // Load last opened time from storage
  useEffect(() => {
    const lastTime = storage.get<number>(STORAGE_KEYS.LAST_REELS_OPEN, 0);
    if (lastTime) {
      setLastOpenedTime(lastTime);
      
      // Check if there are new reels since last opened
      const now = Date.now();
      const hoursSinceLastOpened = (now - lastTime) / (1000 * 60 * 60);
      
      // If it's been more than 2 hours since last opened, show new indicator
      setHasNewReels(hoursSinceLastOpened > 2);
    }
    
    // Add animation effect
    if (hasNewReels) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasNewReels]);

  // Periodically check for new reels (mock)
  useEffect(() => {
    const checkNewReelsInterval = setInterval(() => {
      const now = Date.now();
      const hoursSinceLastOpened = (now - lastOpenedTime) / (1000 * 60 * 60);
      
      if (hoursSinceLastOpened > 1) {
        setHasNewReels(true);
        setIsAnimating(true);
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 2000);
      }
    }, 10 * 60 * 1000); // Check every 10 minutes
    
    return () => clearInterval(checkNewReelsInterval);
  }, [lastOpenedTime]);

  const handleOpenReels = () => {
    // Save current time
    const now = Date.now();
    storage.set(STORAGE_KEYS.LAST_REELS_OPEN, now);
    setLastOpenedTime(now);
    setHasNewReels(false);
    
    navigate('/reels');
  };

  return (
    <motion.div
      animate={isAnimating ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, -5, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors h-10 w-10 dark:hover:bg-gray-800"
        onClick={handleOpenReels}
        aria-label="Reels"
      >
        <Film className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        {hasNewReels && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1"
          >
            <Badge className="bg-red-500 text-white text-xs px-1.5 min-w-5 h-5 flex items-center justify-center rounded-full">
              {notificationCount > 0 ? notificationCount : 'New'}
            </Badge>
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
};

export default ReelsButton;