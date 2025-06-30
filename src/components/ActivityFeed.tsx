import React, { useState } from 'react';
import { Heart, MessageCircle, UserPlus, Calendar, Share, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';

interface Activity {
  id: string;
  type: 'like' | 'comment' | 'friend' | 'event' | 'share';
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target?: string;
  timestamp: string;
}

const ActivityFeed = () => {
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'like',
      user: {
        name: 'Sarah Johnson',
        avatar: MOCK_IMAGES.AVATARS[0]
      },
      action: 'liked your photo',
      target: 'Sunset at the beach',
      timestamp: '5m'
    },
    {
      id: '2',
      type: 'comment',
      user: {
        name: 'Mike Chen',
        avatar: MOCK_IMAGES.AVATARS[1]
      },
      action: 'commented on your post',
      target: 'React development tips',
      timestamp: '15m'
    },
    {
      id: '3',
      type: 'friend',
      user: {
        name: 'Emma Wilson',
        avatar: getSafeImage('AVATARS', 2)
      },
      action: 'accepted your friend request',
      timestamp: '1h'
    },
    {
      id: '4',
      type: 'event',
      user: {
        name: 'David Kim',
        avatar: getSafeImage('AVATARS', 3)
      },
      action: 'invited you to Tech Conference 2024',
      timestamp: '2h'
    }
  ]);

  const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'friend': return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'event': return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'share': return <Share className="w-4 h-4 text-orange-500" />;
      default: return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-2">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <ActivityIcon type={activity.type} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user.name}</span>{' '}
                  {activity.action}
                  {activity.target && (
                    <span className="text-blue-600"> "{activity.target}"</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;