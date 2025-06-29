import React from 'react';
import { Users, Calendar, TrendingUp, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const RightSidebar = () => {
  const suggestions = [
    {
      id: 1,
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=400&h=400&fit=crop&crop=face',
      mutualFriends: 12
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=400&h=400&fit=crop&crop=face',
      mutualFriends: 8
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=400&h=400&fit=crop&crop=face',
      mutualFriends: 15
    }
  ];

  const trendingTopics = [
    { topic: '#ReactJS', posts: '2.1k posts' },
    { topic: '#WebDevelopment', posts: '1.8k posts' },
    { topic: '#JavaScript', posts: '3.2k posts' },
    { topic: '#TechNews', posts: '856 posts' }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Meetup 2025',
      date: 'Jan 20, 2025',
      attending: 124
    },
    {
      id: 2,
      title: 'React Conference',
      date: 'Feb 15, 2025',
      attending: 89
    }
  ];

  return (
    <div className="w-80 space-y-4 sticky top-20 h-fit">
      {/* Friend Suggestions */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
            <Users className="w-5 h-5" />
            People You May Know
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestions.map((person) => (
            <div key={person.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={person.avatar} />
                  <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm dark:text-gray-100">{person.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {person.mutualFriends} mutual friends
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Add
              </Button>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-sm">
            See All
          </Button>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
            <TrendingUp className="w-5 h-5" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((trend, index) => (
            <div key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded cursor-pointer">
              <p className="font-medium text-sm dark:text-gray-100">{trend.topic}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{trend.posts}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
            <Calendar className="w-5 h-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded cursor-pointer">
              <p className="font-medium text-sm dark:text-gray-100">{event.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{event.date}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">{event.attending} attending</p>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-sm">
            See All Events
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
            <Bookmark className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-sm">
            Saved Posts
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Create Event
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Find Friends
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;