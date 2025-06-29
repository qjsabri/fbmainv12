import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Image, Video, TrendingUp } from 'lucide-react';

interface NewsFeedTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NewsFeedTabs: React.FC<NewsFeedTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value)} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="foryou" className="flex items-center space-x-1 text-xs sm:text-sm whitespace-nowrap">
          <Sparkles className="w-4 h-4" />
          <span>For you</span>
        </TabsTrigger>
        <TabsTrigger value="photos" className="flex items-center space-x-1 text-xs sm:text-sm whitespace-nowrap">
          <Image className="w-4 h-4" />
          <span>Photos</span>
        </TabsTrigger>
        <TabsTrigger value="videos" className="flex items-center space-x-1 text-xs sm:text-sm whitespace-nowrap">
          <Video className="w-4 h-4" />
          <span>Videos</span>
        </TabsTrigger>
        <TabsTrigger value="popular" className="flex items-center space-x-1 text-xs sm:text-sm whitespace-nowrap">
          <TrendingUp className="w-4 h-4" />
          <span>Popular</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default NewsFeedTabs;