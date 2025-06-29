import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  emojis?: string[];
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ 
  onSelect,
  emojis = ['👍', '❤️', '😊', '😂', '🎉', '👋', '🙏', '🔥', '👏', '😍', '🥰', '😘', '😮', '😢', '😡']
}) => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="p-2 border-t overflow-hidden dark:border-gray-700"
    >
      <div className="grid grid-cols-5 gap-2">
        {emojis.map(emoji => (
          <Button
            key={emoji}
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 text-xl"
            onClick={() => onSelect(emoji)}
          >
            {emoji}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default EmojiPicker;