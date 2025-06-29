import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, ChevronUp, Heart, MessageCircle, Share, Camera, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_IMAGES } from '@/lib/constants';
import { format, subYears, subMonths, subDays } from 'date-fns';
import { toast } from 'sonner';

interface TimelineMemory {
  id: string;
  type: 'photo' | 'post' | 'event' | 'friendship';
  title: string;
  date: Date;
  content?: string;
  images?: string[];
  location?: string;
  peopleTagged?: {
    id: string;
    name: string;
    avatar: string;
  }[];
  interactions: {
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked?: boolean;
}

interface TimelineYear {
  year: number;
  memories: TimelineMemory[];
  isExpanded: boolean;
}

const MemoryTimeline = () => {
  const [timelineData, setTimelineData] = useState<TimelineYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const years: TimelineYear[] = [];
      
      // Generate memories for the past 5 years
      for (let year = 0; year < 5; year++) {
        const yearDate = subYears(today, year);
        const memories: TimelineMemory[] = [];
        
        // Generate 3-8 random memories for each year
        const memoryCount = Math.floor(Math.random() * 6) + 3;
        
        for (let i = 0; i < memoryCount; i++) {
          // Random date within the year
          const randomMonths = Math.floor(Math.random() * 12);
          const randomDays = Math.floor(Math.random() * 28) + 1;
          const memoryDate = subDays(subMonths(yearDate, randomMonths), randomDays);
          
          // Randomize memory type
          const types: ('photo' | 'post' | 'event' | 'friendship')[] = ['photo', 'post', 'event', 'friendship'];
          const type = types[Math.floor(Math.random() * types.length)];
          
          // Random images (0-3)
          const imageCount = type === 'photo' ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2);
          const images = imageCount > 0 ? Array.from({ length: imageCount }, () => 
            MOCK_IMAGES.POSTS[Math.floor(Math.random() * MOCK_IMAGES.POSTS.length)]
          ) : undefined;
          
          // Random people tagged (0-3)
          const taggedCount = Math.floor(Math.random() * 4);
          const peopleTagged = taggedCount > 0 ? Array.from({ length: taggedCount }, (_, i) => ({
            id: `user_${i}`,
            name: ['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Kim', 'Lisa Wang'][i],
            avatar: MOCK_IMAGES.AVATARS[i]
          })) : undefined;
          
          // Generate memory content based on type
          let title = '';
          let content = '';
          
          switch (type) {
            case 'photo':
              title = `Photos from ${format(memoryDate, 'MMMM d, yyyy')}`;
              content = [
                'Amazing day with friends! The weather was perfect.',
                'Throwback to this beautiful day. Miss these moments!',
                'One of my favorite memories from this day.',
                'Can\'t believe it\'s been so long since this day!'
              ][Math.floor(Math.random() * 4)];
              break;
            case 'post':
              title = `Your post from ${format(memoryDate, 'MMMM d, yyyy')}`;
              content = [
                'Just had the most amazing day! Feeling blessed. ✨',
                'New beginnings start today. So excited for what\'s ahead!',
                'Reflecting on how far I\'ve come. Grateful for everyone who\'s been part of this journey.',
                'Sometimes you just need to take a step back and appreciate the little things in life.'
              ][Math.floor(Math.random() * 4)];
              break;
            case 'event':
              title = `Event you attended on ${format(memoryDate, 'MMMM d, yyyy')}`;
              content = [
                'Had a blast at this event! Can\'t wait for the next one.',
                'Such an amazing experience at this conference!',
                'Great memories from this concert. The energy was incredible!',
                'This workshop changed my perspective on so many things.'
              ][Math.floor(Math.random() * 4)];
              break;
            case 'friendship':
              title = `Friendship anniversary with ${peopleTagged?.[0]?.name || 'a friend'}`;
              content = `You became friends with ${peopleTagged?.[0]?.name || 'someone special'} on this day!`;
              break;
          }
          
          // Random location (30% chance)
          const hasLocation = Math.random() < 0.3;
          const location = hasLocation ? 
            ['San Francisco, CA', 'New York, NY', 'Chicago, IL', 'Seattle, WA', 'Boston, MA'][Math.floor(Math.random() * 5)] : 
            undefined;
          
          // Random interactions
          const likes = Math.floor(Math.random() * 50) + 5;
          const comments = Math.floor(Math.random() * 10);
          const shares = Math.floor(Math.random() * 5);
          
          // Add memory
          memories.push({
            id: `memory_${year}_${i}`,
            type,
            title,
            date: memoryDate,
            content,
            images,
            location,
            peopleTagged,
            interactions: {
              likes,
              comments,
              shares
            },
            isLiked: Math.random() > 0.7 // 30% chance to be liked
          });
        }
        
        // Sort memories by date (newest first)
        memories.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        // Add year to timeline
        years.push({
          year: yearDate.getFullYear(),
          memories,
          isExpanded: year === 0 // Expand only the current year
        });
      }
      
      setTimelineData(years);
      setIsLoading(false);
    }, 1500);
  }, []);

  const toggleYearExpansion = (year: number) => {
    setTimelineData(prev => prev.map(item => 
      item.year === year ? { ...item, isExpanded: !item.isExpanded } : item
    ));
  };

  const handleLike = (memoryId: string) => {
    setTimelineData(prev => prev.map(year => ({
      ...year,
      memories: year.memories.map(memory => 
        memory.id === memoryId 
          ? { 
              ...memory, 
              isLiked: !memory.isLiked,
              interactions: { 
                ...memory.interactions,
                likes: memory.isLiked ? memory.interactions.likes - 1 : memory.interactions.likes + 1
              }
            } 
          : memory
      )
    })));
    
    toast.success('Memory reaction updated!');
  };

  const handleComment = (_memoryId: string) => {
    toast.info('Comment feature coming soon!');
  };

  const handleShare = (_memoryId: string) => {
    toast.success('Memory shared!');
  };

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="w-5 h-5 text-blue-500" />;
      case 'event': return <Calendar className="w-5 h-5 text-green-500" />;
      case 'friendship': return <Users className="w-5 h-5 text-purple-500" />;
      default: return <MessageCircle className="w-5 h-5 text-purple-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-4 dark:bg-gray-700"></div>
                <div className="space-y-4">
                  {[1, 2].map(j => (
                    <div key={j} className="flex space-x-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full dark:bg-gray-700"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-1/2 dark:bg-gray-700"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4 dark:bg-gray-700"></div>
                        <div className="h-32 bg-gray-300 rounded dark:bg-gray-700"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <div className="space-y-6">
        {timelineData.map((yearData) => (
          <Card key={yearData.year} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Year Header */}
              <div 
                className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => toggleYearExpansion(yearData.year)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900/30">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{yearData.year}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{yearData.memories.length} memories</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {yearData.isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </Button>
              </div>
              
              {/* Memories for this year */}
              {yearData.isExpanded && (
                <div className="divide-y dark:divide-gray-700">
                  {yearData.memories.map((memory) => (
                    <div key={memory.id} className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
                          {getMemoryIcon(memory.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{memory.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{format(memory.date, 'MMMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      
                      {memory.content && (
                        <p className="text-gray-700 mb-3 dark:text-gray-300">{memory.content}</p>
                      )}
                      
                      {/* Location */}
                      {memory.location && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3 dark:text-gray-300">
                          <MapPin className="w-4 h-4" />
                          <span>{memory.location}</span>
                        </div>
                      )}
                      
                      {/* Images */}
                      {memory.images && memory.images.length > 0 && (
                        <div 
                          className={`grid gap-2 mb-3 ${
                            memory.images.length === 1 ? 'grid-cols-1' : 
                            memory.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                          }`}
                        >
                          {memory.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Memory ${index + 1}`}
                                className="w-full h-40 object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Tagged People */}
                      {memory.peopleTagged && memory.peopleTagged.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2 dark:text-gray-300">With:</p>
                          <div className="flex flex-wrap gap-2">
                            {memory.peopleTagged.map((person) => (
                              <div key={person.id} className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1 dark:bg-gray-700">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={person.avatar} />
                                  <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{person.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Interactions */}
                      <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <span>{memory.interactions.likes} likes</span>
                          <span>{memory.interactions.comments} comments</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(memory.id)}
                            className={`text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 ${
                              memory.isLiked ? 'text-red-600 dark:text-red-400' : ''
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${memory.isLiked ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleComment(memory.id)}
                            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(memory.id)}
                            className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                          >
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemoryTimeline;