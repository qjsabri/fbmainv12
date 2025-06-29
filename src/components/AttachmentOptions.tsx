import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mic, Image, File, Sticker } from 'lucide-react';

interface AttachmentOptionsProps {
  onSendImage: () => void;
  onSendFile: () => void;
  onSendSticker: () => void;
  onSendVoice: () => void;
}

const AttachmentOptions: React.FC<AttachmentOptionsProps> = ({
  onSendImage,
  onSendFile,
  onSendSticker,
  onSendVoice
}) => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="p-2 border-t overflow-hidden dark:border-gray-700"
    >
      <div className="grid grid-cols-4 gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center space-y-1 h-auto py-2 dark:text-gray-300"
          onClick={onSendImage}
        >
          <Image className="h-5 w-5 text-blue-500" />
          <span className="text-xs">Photos</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center space-y-1 h-auto py-2 dark:text-gray-300"
          onClick={onSendFile}
        >
          <File className="h-5 w-5 text-green-500" />
          <span className="text-xs">Files</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center space-y-1 h-auto py-2 dark:text-gray-300"
          onClick={onSendSticker}
        >
          <Sticker className="h-5 w-5 text-yellow-500" />
          <span className="text-xs">Stickers</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center space-y-1 h-auto py-2 dark:text-gray-300"
          onClick={onSendVoice}
        >
          <Mic className="h-5 w-5 text-red-500" />
          <span className="text-xs">Voice</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default AttachmentOptions;