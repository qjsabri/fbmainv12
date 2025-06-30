import React, { useState, useEffect } from 'react';
import { Clock, Camera, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_IMAGES } from '@/lib/constants';
import { useNavigate } from 'react-router-dom';
import { format, subYears, isSameDay } from 'date-fns';

interface Memory {
  id: string;
  title: string;
  date: Date;
  yearsAgo: number;
  image: string;
  type: 'photo' | 'post' | 'event' | 'friendship';
}

const MemoryWidget = () => {
  const navigate = useNavigate();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate memories for today's date
  useEffect(() => {
    const today = new Date();
    setIsLoading(true);
    
    // Generate memories for "On This Day" from previous years
    const generatedMemories: Memory[] = [];
    
    for (let year = 1; year <= 5; year++) {
      // 30% chance to have a memory for this year
      if (Math.random() < 0.3 || year === 1) { // Ensure at least one memory
        const date = subYears(today, year);
        
        // Only include if it's the same day of the year
        if (isSameDay(
          new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          new Date(today.getFullYear(), today.getMonth(), today.getDate())
        )) {
          // Randomize memory type
          const types: ('photo' | 'post' | 'event' | 'friendship')[] = ['photo', 'post', 'event', 'friendship'];
          const type = types[Math.floor(Math.random() * types.length)];
          
          // Random image
          const image = MOCK_IMAGES.POSTS[Math.floor(Math.random() * MOCK_IMAGES.POSTS.length)];
          
          // Generate title based on type
          let title = '';
          
          switch (type) {
            case 'photo':
              title = `Photos from ${format(date, 'MMMM d, yyyy')}`;
              break;
            case 'post':
              title = `Your post from ${format(date, 'MMMM d, yyyy')}`;
              break;
            case 'event':
              title = `Event you attended on ${format(date, 'MMMM d, yyyy')}`;
              break;
            case 'friendship':
              title = `Friendship anniversary`;
              break;
          }
          
          // Add memory
          generatedMemories.push({
            id: `memory_${year}_${type}`,
            type,
            title,
            date,
            yearsAgo: year,
            image
          });
        }
      }
    }
    
    // Sort memories by years ago (most recent first)
    generatedMemories.sort((a, b) => a.yearsAgo - b.yearsAgo);
    
    setMemories(generatedMemories.slice(0, 2)); // Show max 2 memories in widget
    setIsLoading(false);
  }, []);

  const handleViewMemory = (memoryId: string) => {
    navigate('/memories');
  };

  const handleViewAllMemories = () => {
    navigate('/memories');
  };

  const getMemoryIcon = (type: 'photo' | 'post' | 'event' | 'friendship') => {
    switch (type) {
      case 'photo': return <Camera className="w-5 h-5 text-blue-500" />;
      case 'event': return <Calendar className="w-5 h-5 text-green-500" />;
      case 'friendship': return <Users className="w-5 h-5 text-purple-500" />;
      default: return <Clock className="w-5 h-5 text-purple-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="hidden lg:block">
        <CardHeader className="p-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            <span>Memories</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="animate-pulse space-y-3">
            <div className="h-24 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
            <div className="h-24 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (memories.length === 0) return null;

  return (
    <Card className="hidden lg:block">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            <span>Memories</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleViewAllMemories}
            className="text-blue-600 text-xs dark:text-blue-400"
          >
            See All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-3">
          {memories.map((memory) => (
            <div 
              key={memory.id} 
              className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleViewMemory(memory.id)}
            >
              <img
                src={memory.image}
                alt={memory.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <div className="flex items-center space-x-1 mb-1">
                  {getMemoryIcon(memory.type)}
                  <span className="text-xs">{memory.yearsAgo} {memory.yearsAgo === 1 ? 'year' : 'years'} ago</span>
                </div>
                <h4 className="font-medium text-sm">{memory.title}</h4>
                <p className="text-xs opacity-80">{format(memory.date, 'MMMM d, yyyy')}</p>
              </div>
            </div>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-blue-600 dark:text-blue-400"
            onClick={handleViewAllMemories}
          >
            See all memories
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryWidget;