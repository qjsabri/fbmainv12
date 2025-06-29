import React, { useState } from 'react';
import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LiveStream from './LiveStream';

const LiveStreamButton = () => {
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);

  const handleOpenLiveStream = () => {
    setIsLiveStreamOpen(true);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors h-10 w-10 dark:hover:bg-gray-800"
        onClick={handleOpenLiveStream}
        aria-label="Go Live"
      >
        <Video className="w-5 h-5 text-red-600 dark:text-red-400" />
      </Button>

      <LiveStream 
        isOpen={isLiveStreamOpen} 
        onClose={() => setIsLiveStreamOpen(false)} 
      />
    </>
  );
};

export default LiveStreamButton;