import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ReactionPickerProps {
  onSelect: (reaction: string) => void;
  position?: 'top' | 'bottom';
  className?: string;
}

const ReactionPicker: React.FC<ReactionPickerProps> = ({ 
  onSelect, 
  position = 'top',
  className = ''
}) => {
  const reactions = [
    { emoji: '👍', name: 'Like', color: 'blue' },
    { emoji: '❤️', name: 'Love', color: 'red' },
    { emoji: '😆', name: 'Haha', color: 'yellow' },
    { emoji: '😮', name: 'Wow', color: 'yellow' },
    { emoji: '😢', name: 'Sad', color: 'yellow' },
    { emoji: '😡', name: 'Angry', color: 'orange' }
  ];

  return (
    <Card className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 p-1 shadow-lg z-50 ${className} dark:bg-gray-800`}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex space-x-1"
      >
        {reactions.map((reaction) => (
          <motion.div key={reaction.name} whileHover={{ scale: 1.2 }}>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              onClick={() => onSelect(reaction.emoji)}
              title={reaction.name}
            >
              <span className="text-xl">{reaction.emoji}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};

export default ReactionPicker;