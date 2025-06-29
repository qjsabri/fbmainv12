import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageCircle } from 'lucide-react';
import FriendRequestsPanel from './FriendRequestsPanel';
import PeopleYouMayKnow from './PeopleYouMayKnow';
import ActivityFeed from './ActivityFeed';
import TrendingTopics from './TrendingTopics';
import QuickActions from './QuickActions';
import EventsWidget from './EventsWidget';
import BirthdayWidget from './BirthdayWidget';
import GroupSuggestions from './GroupSuggestions';
import FriendSuggestions from './FriendSuggestions';
import FundraiserWidget from './FundraiserWidget';
import { useFriends } from '@/hooks/useFriends';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import OnlineStatus from './OnlineStatus';
import { toast } from 'sonner';
import { memo } from 'react';

const RightSidebar = memo(() => {
  const { data: friends } = useFriends();

  const onlineFriends = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: MOCK_IMAGES.AVATARS[0],
      isOnline: true
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: MOCK_IMAGES.AVATARS[1],
      isOnline: true
    },
    {
      id: 3,
      name: "Emily Davis",
      avatar: getSafeImage('AVATARS', 2),
      isOnline: false
    }
  ];

  const handleMessageClick = (contactName: string) => {
    toast.info(`Opening chat with ${contactName}`);
    // In a real app, this would dispatch an event or call a context method
    const event = new CustomEvent('openMessenger', {
      detail: {
        contact: onlineFriends.find(f => f.name === contactName) || {
          id: contactName.toLowerCase().replace(' ', '_'), // Mock ID
          name: contactName,
          avatar: MOCK_IMAGES.AVATARS[Math.floor(Math.random() * MOCK_IMAGES.AVATARS.length)],
          isOnline: true
        }
      }
    });
    document.dispatchEvent(event);
  };

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin hidden lg:block">
      <div className="p-2 md:p-4 space-y-3">
        {/* Birthday Widget */}
        <div className="mb-4">
          <BirthdayWidget />
        </div>

        {/* Friend Requests */}
        <div className="mb-4">
          <FriendRequestsPanel />
        </div>
        
        {/* Friend Suggestions */}
        <div className="mb-4">
          <FriendSuggestions />
        </div>
        
        {/* People You May Know */}
        <div className="mb-4">
          <PeopleYouMayKnow />
        </div>

        {/* Group Suggestions */}
        <div className="mb-4">
          <GroupSuggestions />
        </div>

        {/* Fundraiser Widget */}
        <div className="mb-4">
          <FundraiserWidget />
        </div>

        {/* Events Widget */}
        <div className="mb-4">
          <EventsWidget />
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <QuickActions />
        </div>

        {/* Trending Topics */}
        <div className="mb-4">
          <TrendingTopics />
        </div>

        {/* Activity Feed */}
        <div className="mb-4">
          <ActivityFeed />
        </div>

        {/* Online Friends */}
        <Card className="mb-4">
          <CardHeader className="p-3">
            <CardTitle className="text-base font-semibold flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
              <span>Contacts ({friends?.length || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            {onlineFriends.map((friend) => (
              <div 
                key={friend.id} 
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors dark:hover:bg-gray-700"
                onClick={() => handleMessageClick(friend.name)}
              >
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback className="text-xs">{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <OnlineStatus isOnline={friend.isOnline} />
                </div>
                <span className="text-sm font-medium text-gray-900 truncate flex-1 dark:text-gray-100">{friend.name}</span>
                <MessageCircle className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Your Pages and Profiles */}
        <Card className="mb-4">
          <CardHeader className="p-3">
            <CardTitle className="text-base font-semibold">Your Pages and profiles</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors dark:hover:bg-gray-700">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">YP</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Your Page</span>
            </div>
          </CardContent>
        </Card>

        {/* Group conversations */}
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-base font-semibold">Group conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors dark:hover:bg-gray-700">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Design Team</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors dark:hover:bg-gray-700">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Weekend Plans</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

RightSidebar.displayName = 'RightSidebar';
export default RightSidebar;