import React from 'react';
import { motion } from 'framer-motion';

interface OnlineStatusProps {
  isOnline: boolean;
  className?: string;
  pulseAnimation?: boolean;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({ 
  isOnline, 
  className = '', 
  pulseAnimation = true 
}) => {
  return (
    <div className={`relative ${className}`}>
      {isOnline ? (
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full dark:border-gray-800"
          animate={pulseAnimation ? { scale: [1, 1.2, 1] } : {}}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            repeatType: 'loop'
          }}
        />
      ) : (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-400 border-2 border-white rounded-full dark:border-gray-800" />
      )}
    </div>
  );
};

export default OnlineStatus;