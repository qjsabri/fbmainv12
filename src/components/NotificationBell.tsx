import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NotificationsCenter from './NotificationsCenter';

interface NotificationBellProps {
  count: number;
  onClick?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ count, onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(count);
  
  // Animate when count changes
  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [count]);

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance of new notification
        setNotificationCount(prev => prev + 1);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setIsOpen(true);
    setNotificationCount(0);
    if (onClick) onClick();
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors h-10 w-10 dark:hover:bg-gray-800"
        onClick={handleClick}
        aria-label="Notifications"
      >
        <motion.div
          animate={isAnimating ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </motion.div>
        
        <AnimatePresence>
          {notificationCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1"
            >
              <Badge className="bg-red-500 text-white text-xs px-1.5 min-w-5 h-5 flex items-center justify-center rounded-full">
                {notificationCount > 99 ? '99+' : notificationCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="sr-only">Notifications</DialogTitle>
          </DialogHeader>
          <NotificationsCenter />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationBell;