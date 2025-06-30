import React from 'react';
import { Users, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import FriendRequestsPanel from '@/components/FriendRequestsPanel';
import PeopleYouMayKnow from '@/components/PeopleYouMayKnow';
import BirthdayWidget from '@/components/BirthdayWidget';
import EventsWidget from '@/components/EventsWidget';

const RightSidebar = () => {
  return (
    <div className="w-80 space-y-4 sticky top-20 h-fit">
      {/* Friend Suggestions */}
      <FriendRequestsPanel />
      
      {/* People You May Know */}
      <PeopleYouMayKnow />
      
      {/* Birthday Widget */}
      <BirthdayWidget />

      {/* Events Widget */}
      <EventsWidget />
    </div>
  );
};

export default RightSidebar;