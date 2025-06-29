import React from 'react';
import { memo } from 'react';
import FriendRequestsPanel from '@/components/FriendRequestsPanel';
import PeopleYouMayKnow from '@/components/PeopleYouMayKnow';
import BirthdayWidget from '@/components/BirthdayWidget';
import EventsWidget from '@/components/EventsWidget';
import TrendingTopics from '@/components/TrendingTopics';
import MarketplaceWidget from '@/components/MarketplaceWidget';
import GamingWidget from '@/components/GamingWidget';
import GroupSuggestions from '@/components/GroupSuggestions';
import SavedItemsWidget from '@/components/SavedItemsWidget';
import MemoryWidget from '@/components/MemoryWidget';
import { useIsMobile } from '@/hooks/use-device';

// Optimize RightSidebar with memoization to prevent unnecessary re-renders
const RightSidebar = memo(() => {
  const isMobile = useIsMobile();
  
  // Don't render on mobile as it's handled differently in the layout
  if (isMobile) return null;

  return (
    <div className="w-full space-y-4 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pb-6 pr-1 scrollbar-thin">
      {/* Friend Requests */}
      <FriendRequestsPanel />
      
      {/* People You May Know */}
      <PeopleYouMayKnow />
      
      {/* Birthday Widget */}
      <BirthdayWidget />

      {/* Events Widget */}
      <EventsWidget />
      
      {/* Trending Topics */}
      <TrendingTopics />
      
      {/* Marketplace Widget */}
      <MarketplaceWidget />
      
      {/* Gaming Widget */}
      <GamingWidget />
      
      {/* Group Suggestions */}
      <GroupSuggestions />
      
      {/* Saved Items Widget */}
      <SavedItemsWidget />
      
      {/* Memory Widget */}
      <MemoryWidget />
    </div>
  );
});

RightSidebar.displayName = 'RightSidebar';

export default RightSidebar;