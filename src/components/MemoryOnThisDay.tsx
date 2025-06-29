import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Heart, MessageCircle, Share, Camera, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MOCK_IMAGES } from '@/lib/constants';
import { format, subYears, isSameDay } from 'date-fns';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface OnThisDayMemory {
  id: string;
  type: 'photo' | 'post' | 'event' | 'friendship';
  title: string;
  date: Date;
  yearsAgo: number;
  content?: string;
  images: string[];
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

const MemoryOnThisDay = () => {
  const [memories, setMemories] = useState<OnThisDayMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Generate memories for today's date
  useEffect(() => {
    const today = new Date();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const generatedMemories: OnThisDayMemory[] = [];
      
      // Generate memories for "On This Day" from previous years
      for (let year = 1; year <= 5; year++) {
        // 50% chance to have a memory for this year
        if (Math.random() > 0.5 || year === 1) { // Ensure at least one memory
          const date = subYears(today, year);
          
          // Only include if it's the same day of the year
          if (isSameDay(
            new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            new Date(today.getFullYear(), today.getMonth(), today.getDate())
          )) {
            // Randomize memory type
            const types: ('photo' | 'post' | 'event' | 'friendship')[] = ['photo', 'post', 'event', 'friendship'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            // Generate random number of images (1-3)
            const imageCount = Math.floor(Math.random() * 3) + 1;
            const images = Array.from({ length: imageCount }, (_, _i) =>
              MOCK_IMAGES.POSTS[Math.floor(Math.random() * MOCK_IMAGES.POSTS.length)]
            );
            
            // Random people tagged (0-3)
            const taggedCount = Math.floor(Math.random() * 4);
            const peopleTagged = taggedCount > 0 ? Array.from({ length: taggedCount }, (_, _i) => ({
              id: `user_${_i}`,
              name: ['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Kim', 'Lisa Wang'][_i],
              avatar: MOCK_IMAGES.AVATARS[_i]
            })) : undefined;
            
            // Generate memory content based on type
            let title = '';
            let content = '';
            
            switch (type) {
              case 'photo':
                title = `Photos from ${format(date, 'MMMM d, yyyy')}`;
                content = [
                  'Amazing day with friends! The weather was perfect.',
                  'Throwback to this beautiful day. Miss these moments!',
                  'One of my favorite memories from this day.',
                  'Can\'t believe it\'s been so long since this day!'
                ][Math.floor(Math.random() * 4)];
                break;
              case 'post':
                title = `Your post from ${format(date, 'MMMM d, yyyy')}`;
                content = [
                  'Just had the most amazing day! Feeling blessed. ✨',
                  'New beginnings start today. So excited for what\'s ahead!',
                  'Reflecting on how far I\'ve come. Grateful for everyone who\'s been part of this journey.',
                  'Sometimes you just need to take a step back and appreciate the little things in life.'
                ][Math.floor(Math.random() * 4)];
                break;
              case 'event':
                title = `Event you attended on ${format(date, 'MMMM d, yyyy')}`;
                content = [
                  'Had a blast at this event! Can\'t wait for the next one.',
                  'Such an amazing experience at this conference!',
                  'Great memories from this concert. The energy was incredible!',
                  'This workshop changed my perspective on so many things.'
                ][Math.floor(Math.random() * 4)];
                break;
              case 'friendship':
                title = `Friendship anniversary with ${peopleTagged?.[0]?.name || 'a friend'}`;
                content = `You became friends with ${peopleTagged?.[0]?.name || 'someone special'} ${year} ${year === 1 ? 'year' : 'years'} ago today!`;
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
            generatedMemories.push({
              id: `memory_${year}_${type}`,
              type,
              title,
              date,
              yearsAgo: year,
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
        }
      }
      
      // Sort memories by years ago (most recent first)
      generatedMemories.sort((a, b) => a.yearsAgo - b.yearsAgo);
      
      setMemories(generatedMemories);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handlePrevMemory = () => {
    setCurrentMemoryIndex(prev => (prev > 0 ? prev - 1 : memories.length - 1));
    setCurrentImageIndex(0);
  };

  const handleNextMemory = () => {
    setCurrentMemoryIndex(prev => (prev < memories.length - 1 ? prev + 1 : 0));
    setCurrentImageIndex(0);
  };

  const handleLike = (memoryId: string) => {
    setMemories(prev => prev.map(memory => 
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
    ));
    
    toast.success('Memory reaction updated!');
  };

  const handleShare = (memoryId: string) => {
    const memory = memories.find(m => m.id === memoryId);
    if (memory) {
      toast.success(`Shared memory: ${memory.title}`);
    }
  };

  const handleRepost = (memoryId: string) => {
    const memory = memories.find(m => m.id === memoryId);
    if (memory) {
      toast.success(`Reposted memory: ${memory.title}`);
    }
  };

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="w-5 h-5 text-blue-500" />;
      case 'event': return <Calendar className="w-5 h-5 text-green-500" />;
      case 'friendship': return <Users className="w-5 h-5 text-purple-500" />;
      default: return <MessageCircle className="w-5 h-5 text-purple-500" />;
    }
  };

  const currentMemory = memories[currentMemoryIndex];

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6 dark:bg-gray-700"></div>
            <div className="h-64 bg-gray-300 rounded-lg mb-6 dark:bg-gray-700"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-2 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-4 dark:bg-gray-700"></div>
            <div className="flex justify-between">
              <div className="h-10 w-24 bg-gray-300 rounded dark:bg-gray-700"></div>
              <div className="h-10 w-24 bg-gray-300 rounded dark:bg-gray-700"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No memories for today</h3>
            <p className="text-gray-500 mb-6 dark:text-gray-400">
              Check back tomorrow or explore your memories from other days!
            </p>
            <Button>
              Explore All Memories
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Memory Carousel */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentMemoryIndex}-${currentImageIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative h-64 md:h-80"
              >
                {currentMemory && currentMemory.images.length > 0 ? (
                  <img
                    src={currentMemory.images[currentImageIndex]}
                    alt={currentMemory.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center dark:bg-gray-700">
                    <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              </motion.div>
            </AnimatePresence>
            
            {/* Memory Navigation */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMemory}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-10 w-10 rounded-full p-0"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMemory}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-10 w-10 rounded-full p-0"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            {/* Image Navigation (if multiple images) */}
            {currentMemory && currentMemory.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {currentMemory.images.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
            
            {/* Memory Info Overlay */}
            {currentMemory && (
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <Badge className="mb-2 bg-blue-500">
                  {currentMemory.yearsAgo} {currentMemory.yearsAgo === 1 ? 'year' : 'years'} ago
                </Badge>
                <h3 className="text-xl font-bold mb-1">{currentMemory.title}</h3>
                <p className="text-sm opacity-90">{format(currentMemory.date, 'MMMM d, yyyy')}</p>
              </div>
            )}
          </div>
          
          {/* Memory Details */}
          {currentMemory && (
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900/30">
                  {getMemoryIcon(currentMemory.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{currentMemory.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{format(currentMemory.date, 'MMMM d, yyyy')} • {currentMemory.yearsAgo} {currentMemory.yearsAgo === 1 ? 'year' : 'years'} ago</span>
                  </div>
                </div>
              </div>
              
              {currentMemory.content && (
                <p className="text-gray-700 mb-4 dark:text-gray-300">{currentMemory.content}</p>
              )}
              
              {/* Location */}
              {currentMemory.location && (
                <div className="flex items-center space-x-1 text-sm text-gray-600 mb-4 dark:text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>{currentMemory.location}</span>
                </div>
              )}
              
              {/* Tagged People */}
              {currentMemory.peopleTagged && currentMemory.peopleTagged.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2 dark:text-gray-300">With:</p>
                  <div className="flex flex-wrap gap-2">
                    {currentMemory.peopleTagged.map((person) => (
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
              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <span>{currentMemory.interactions.likes} likes</span>
                  <span>{currentMemory.interactions.comments} comments</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(currentMemory.id)}
                    className={`text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 ${
                      currentMemory.isLiked ? 'text-red-600 dark:text-red-400' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${currentMemory.isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(currentMemory.id)}
                    className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <Button
                  onClick={() => handleRepost(currentMemory.id)}
                  className="w-full"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share this memory
                </Button>
              </div>
              
              {/* Memory Navigation Indicators */}
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  {memories.map((_, index) => (
                    <div 
                      key={index} 
                      className={`w-2 h-2 rounded-full cursor-pointer ${
                        index === currentMemoryIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      onClick={() => {
                        setCurrentMemoryIndex(index);
                        setCurrentImageIndex(0);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryOnThisDay;