import React, { useState } from 'react';
import { TrendingUp, Hash, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TrendingTopic {
  id: string;
  hashtag: string;
  posts: number;
  category: string;
  location?: string;
  growth: number;
}

const TrendingTopics = () => {
  const [topics] = useState<TrendingTopic[]>([
    {
      id: '1',
      hashtag: '#ReactJS',
      posts: 12500,
      category: 'Technology',
      growth: 25
    },
    {
      id: '2',
      hashtag: '#WebDevelopment',
      posts: 8900,
      category: 'Technology',
      growth: 18
    },
    {
      id: '3',
      hashtag: '#TechConference2024',
      posts: 5600,
      category: 'Events',
      location: 'San Francisco',
      growth: 45
    },
    {
      id: '4',
      hashtag: '#JavaScript',
      posts: 15200,
      category: 'Technology',
      growth: 12
    }
  ]);

  const handleTopicClick = (topic: TrendingTopic) => {
    toast.info(`Exploring ${topic.hashtag}`);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Card className="hidden lg:block">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          <span>Trending Topics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-2">
          {topics.map((topic, index) => (
            <div 
              key={topic.id} 
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer dark:hover:bg-gray-700"
              onClick={() => handleTopicClick(topic)}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <Hash className="w-3 h-3 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate dark:text-white">{topic.hashtag}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatNumber(topic.posts)} posts</span>
                    {topic.location && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{topic.location}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant="secondary" className="text-xs">
                  +{topic.growth}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t dark:border-gray-700">
          <Button variant="ghost" size="sm" className="w-full text-blue-600 dark:text-blue-400">
            See all trending
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;