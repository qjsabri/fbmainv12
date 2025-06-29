import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { toast } from 'sonner';
import StoryViewer from './StoryViewer';
import StoryCreator from './StoryCreator';
import { storage } from '@/lib/storage';

interface Story {
  id: string;
  user: {
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  media: string;
  content: string;
  timestamp: string;
  isViewed: boolean;
  type: 'photo' | 'video' | 'text';
  background?: string;
  expiresAt: string;
  privacy?: 'public' | 'friends' | 'close-friends';
  reactions?: { [key: string]: number };
}

interface StoryData {
  type: 'photo' | 'video' | 'text';
  media?: string;
  content: string;
  background?: string;
  privacy?: 'public' | 'friends' | 'close-friends';
}

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const storiesContainerRef = useRef<HTMLDivElement>(null);

  // Load stories from storage or initialize with mock data
  useEffect(() => {
    const savedStories = storage.get<Story[]>('user_stories');
    
    if (savedStories && savedStories.length > 0) {
      // Filter out expired stories
      const now = new Date();
      const validStories = savedStories.filter(story => {
        const expiresAt = new Date(story.expiresAt);
        return expiresAt > now;
      });
      
      if (validStories.length > 0) {
        setStories(validStories);
        return;
      }
    }
    
    // Default mock stories if none in storage or all expired
    const mockStories: Story[] = [
      {
        id: '1',
        type: 'photo',
        user: {
          name: 'Sarah Johnson',
          avatar: MOCK_IMAGES.AVATARS[0],
          isVerified: true
        },
        media: MOCK_IMAGES.POSTS[0],
        content: 'Amazing sunset today!',
        timestamp: '2h',
        isViewed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        privacy: 'public',
        reactions: { '❤️': 12, '👍': 8, '😮': 3 }
      },
      {
        id: '2',
        type: 'video',
        user: {
          name: 'Mike Chen',
          avatar: MOCK_IMAGES.AVATARS[1]
        },
        media: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        content: 'Check out this cool place!',
        timestamp: '4h',
        isViewed: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        privacy: 'friends'
      },
      {
        id: '3',
        type: 'text',
        user: {
          name: 'Emma Wilson',
          avatar: getSafeImage('AVATARS', 2),
          isVerified: true
        },
        media: '',
        content: 'Having a great day! 🌟',
        timestamp: '6h',
        isViewed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        background: 'bg-gradient-to-br from-purple-500 to-pink-500',
        privacy: 'close-friends'
      },
      {
        id: '4',
        type: 'photo',
        user: {
          name: 'David Kim',
          avatar: getSafeImage('AVATARS', 3)
        },
        media: getSafeImage('POSTS', 3),
        content: 'New project launch!',
        timestamp: '8h',
        isViewed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        privacy: 'public',
        reactions: { '👍': 15, '🎉': 7 }
      },
      {
        id: '5',
        type: 'photo',
        user: {
          name: 'Lisa Wang',
          avatar: getSafeImage('AVATARS', 4)
        },
        media: getSafeImage('POSTS', 4),
        content: 'Beach day with friends',
        timestamp: '12h',
        isViewed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        privacy: 'friends'
      }
    ];
    
    setStories(mockStories);
  }, []);

  // Save stories to storage when they change
  useEffect(() => {
    if (stories.length > 0) {
      storage.set('user_stories', stories);
    }
  }, [stories]);

  // Update scroll position when container scrolls
  useEffect(() => {
    const container = storiesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollPosition(container.scrollLeft);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCreateStory = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewStory = (index: number) => {
    setSelectedStoryIndex(index);
    setViewerOpen(true);
    
    // Mark as viewed
    setStories(prev => prev.map((story, i) => 
      i === index ? { ...story, isViewed: true } : story
    ));
  };

  const handleCreateNewStory = (storyData: StoryData) => {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours later
    
    const newStory: Story = {
      id: `story-${Date.now()}`,
      type: storyData.type,
      user: {
        name: 'You',
        avatar: getSafeImage('AVATARS', 7),
        isVerified: false
      },
      media: storyData.media || '',
      content: storyData.content,
      timestamp: 'Just now',
      isViewed: false,
      expiresAt: expiryDate.toISOString(),
      background: storyData.type === 'text' ? getBackgroundClass(storyData.background) : undefined,
      privacy: storyData.privacy || 'friends',
      reactions: {}
    };
    
    setStories(prev => [newStory, ...prev]);
    toast.success('Story created successfully!');
    setIsCreateModalOpen(false);
  };

  const getBackgroundClass = (bgId: string) => {
    const backgrounds: Record<string, string> = {
      'gradient-1': 'bg-gradient-to-br from-blue-500 to-purple-600',
      'gradient-2': 'bg-gradient-to-br from-green-400 to-blue-500',
      'gradient-3': 'bg-gradient-to-br from-red-500 to-orange-500',
      'gradient-4': 'bg-gradient-to-br from-purple-500 to-pink-500',
      'solid-1': 'bg-blue-600',
      'solid-2': 'bg-green-600',
      'solid-3': 'bg-red-600',
      'solid-4': 'bg-black'
    };
    
    return backgrounds[bgId] || 'bg-gradient-to-br from-purple-500 to-pink-500';
  };

  const scrollStories = (direction: 'left' | 'right') => {
    if (storiesContainerRef.current) {
      const container = storiesContainerRef.current;
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Check if scroll buttons should be visible
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = storiesContainerRef.current 
    ? scrollPosition < storiesContainerRef.current.scrollWidth - storiesContainerRef.current.clientWidth - 10
    : false;

  // Determine appropriate privacy badge color
  const getPrivacyBadgeColor = (privacy?: string) => {
    switch(privacy) {
      case 'public': return 'bg-green-500';
      case 'friends': return 'bg-blue-500';
      case 'close-friends': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative mb-6">
      {/* Scroll buttons */}
      {canScrollLeft && (
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-8 w-8 p-0 bg-white/80 shadow-md dark:bg-gray-800/80"
          onClick={() => scrollStories('left')}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}
      
      {canScrollRight && (
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-8 w-8 p-0 bg-white/80 shadow-md dark:bg-gray-800/80"
          onClick={() => scrollStories('right')}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      )}

      <div 
        ref={storiesContainerRef} 
        className="flex space-x-2 overflow-x-auto scrollbar-thin pb-2 px-1"
      >
        {/* Create Story */}
        <Card className="flex-shrink-0 w-24 sm:w-28 h-40 sm:h-48 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden" onClick={handleCreateStory}>
          <CardContent className="p-0 h-full flex flex-col">
            <div className="h-28 sm:h-32 bg-gradient-to-b from-blue-400 to-blue-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800 p-2">
              <p className="text-xs font-medium text-center leading-tight dark:text-white">Create Story</p>
            </div>
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full p-1 border-4 border-white dark:border-gray-800">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Stories */}
        {stories.map((story, index) => (
          <Card
            key={story.id} 
            className="flex-shrink-0 w-24 sm:w-28 h-40 sm:h-48 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
            onClick={() => handleViewStory(index)}
          >
            <CardContent className="p-0 relative h-full">
              {story.type === 'text' ? (
                <div className={`w-full h-full ${story.background || 'bg-gradient-to-br from-purple-500 to-pink-500'} flex items-center justify-center p-2`}>
                  <p className="text-white text-xs font-medium text-center leading-tight">
                    {story.content}
                  </p>
                </div>
              ) : story.type === 'video' ? (
                <video
                  src={story.media}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={story.media}
                  alt={`${story.user.name}'s story`}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Privacy badge */}
              {story.privacy && (
                <div className="absolute top-2 right-2">
                  <Badge className={`${getPrivacyBadgeColor(story.privacy)} text-white text-xs`}>
                    {story.privacy === 'close-friends' ? 'Close' : 
                     story.privacy === 'friends' ? 'Friends' : 'Public'}
                  </Badge>
                </div>
              )}
              
              {/* Overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
              
              {/* Story ring */}
              <div className="absolute top-1.5 sm:top-2 left-1/2 transform -translate-x-1/2">
                <div className={`w-10 h-10 rounded-full ${story.isViewed ? 'border-2 border-gray-400 dark:border-gray-600' : 'border-2 border-blue-500'} p-0.5`}>
                  <Avatar className="w-full h-full">
                    <AvatarImage src={story.user.avatar} />
                    <AvatarFallback className="text-xs">{story.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                
                {story.user.isVerified && (
                  <div className="absolute -right-1 -bottom-1 bg-blue-600 rounded-full h-4 w-4 flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <span className="text-white text-[8px]">✓</span>
                  </div>
                )}
              </div>

              {/* Story type indicator */}
              <div className="absolute top-2 left-2">
                {story.type === 'video' && (
                  <div className="w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                )}
              </div>

              {/* User Name */}
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium truncate">{story.user.name}</p>
                <p className="text-white text-xs opacity-75">{story.timestamp}</p>
              </div>
              
              {/* Reactions indicator */}
              {story.reactions && Object.keys(story.reactions).length > 0 && (
                <div className="absolute bottom-12 right-2 bg-black/40 rounded-full px-1.5 py-0.5 flex items-center">
                  <span className="text-xs text-white mr-0.5">{Object.values(story.reactions).reduce((a, b) => a + b, 0)}</span>
                  <span className="text-xs">👀</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Story Viewer */}
      <StoryViewer 
        stories={stories}
        currentIndex={selectedStoryIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onNavigate={setSelectedStoryIndex}
        onReact={(storyId, reaction) => {
          setStories(prev => prev.map(story => {
            if (story.id === storyId) {
              const updatedReactions = { ...(story.reactions || {}) };
              updatedReactions[reaction] = (updatedReactions[reaction] || 0) + 1;
              return { ...story, reactions: updatedReactions };
            }
            return story;
          }));
        }}
      />
      
      {/* Story Creator */}
      <StoryCreator 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateStory={handleCreateNewStory}
      />
    </div>
  );
};

export default Stories;