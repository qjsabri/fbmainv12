import React, { useState, useRef, useEffect } from 'react';
import { Film, Heart, MessageCircle, Share, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { memo, useCallback } from 'react';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

interface ReelPreview {
  id: string;
  thumbnail: string;
  video: string;
  views: number;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  caption: string;
  likes: number;
  comments: number;
  audio?: {
    title: string;
    artist: string;
  };
}

const ReelsCarousel = memo(() => {
  const navigate = useNavigate();
  const [reels, setReels] = useState<ReelPreview[]>([
    {
      id: '1',
      thumbnail: MOCK_IMAGES.POSTS[0],
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      views: 1245000,
      user: {
        name: 'Sarah Johnson',
        avatar: MOCK_IMAGES.AVATARS[0],
        verified: true
      },
      caption: 'Amazing sunset at the beach today! 🌅 #sunset #beach #summer',
      likes: 45600,
      comments: 1230,
      audio: {
        title: 'Summer Vibes',
        artist: 'DJ Sunshine'
      }
    },
    {
      id: '2',
      thumbnail: MOCK_IMAGES.POSTS[1],
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      views: 890000,
      user: {
        name: 'Mike Chen',
        avatar: MOCK_IMAGES.AVATARS[1],
        verified: false
      },
      caption: 'Just learned this new trick! What do you think? 🤔 #skateboarding #trick',
      likes: 23400,
      comments: 567,
      audio: {
        title: 'Skater Boy',
        artist: 'Punk Rock'
      }
    },
    {
      id: '3',
      thumbnail: getSafeImage('POSTS', 2),
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      views: 2300000,
      user: {
        name: 'Emma Wilson',
        avatar: getSafeImage('AVATARS', 2),
        verified: true
      },
      caption: 'Morning coffee and coding session ☕💻 #developer #coding #morningroutine',
      likes: 78900,
      comments: 2345,
      audio: {
        title: 'Lofi Beats',
        artist: 'Chill Vibes'
      }
    },
    {
      id: '4',
      thumbnail: getSafeImage('POSTS', 3),
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      views: 567000,
      user: {
        name: 'David Kim',
        avatar: getSafeImage('AVATARS', 3),
        verified: false
      },
      caption: 'New workout routine! 💪 #fitness #workout #gym',
      likes: 12300,
      comments: 456,
      audio: {
        title: 'Workout Mix',
        artist: 'Fitness Beats'
      }
    }
  ]);
  
  const [hoveredReel, setHoveredReel] = useState<string | null>(null);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  // Load liked reels from storage
  useEffect(() => {
    const savedLikedReels = storage.get<string[]>(STORAGE_KEYS.REEL_LIKES, []);
    if (savedLikedReels && savedLikedReels.length > 0) {
      setLikedReels(new Set(savedLikedReels));
    }
  }, []);

  // Save liked reels when changed
  useEffect(() => {
    if (likedReels.size > 0) {
      storage.set(STORAGE_KEYS.REEL_LIKES, Array.from(likedReels));
    }
  }, [likedReels]);

  // Update scroll position when container scrolls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollPosition(container.scrollLeft);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle video playback on hover
  useEffect(() => {
    if (hoveredReel && videoRefs.current[hoveredReel]) {
      const video = videoRefs.current[hoveredReel];
      video.currentTime = 0;
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(err => console.warn('Could not autoplay video', err));
      }
      
      // Pause all other videos
      Object.entries(videoRefs.current).forEach(([id, videoEl]) => {
        if (id !== hoveredReel && videoEl && !videoEl.paused) {
          videoEl.pause();
        }
      });
    }
    
    // If no longer hovering any reel, stop all playback
    if (!hoveredReel) {
      Object.values(videoRefs.current).forEach(video => {
        if (video && !video.paused) {
          video.pause();
        }
      });
    }
  }, [hoveredReel]);

  const scrollReels = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleReelClick = (reelId: string) => {
    navigate(`/reels/${reelId}`);
  };

  const handleLike = (reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedReels = new Set(likedReels);
    
    if (likedReels.has(reelId)) {
      newLikedReels.delete(reelId);
      setReels(reels.map(reel => 
        reel.id === reelId 
        ? {...reel, likes: reel.likes - 1} 
        : reel
      ));
      toast.success('Removed like from reel');
    } else {
      newLikedReels.add(reelId);
      setReels(reels.map(reel => 
        reel.id === reelId 
        ? {...reel, likes: reel.likes + 1} 
        : reel
      ));
      toast.success('Liked reel');
    }
    
    setLikedReels(newLikedReels);
  };

  const handleShare = (reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/reels/${reelId}`);
    toast.success('Reel link copied to clipboard');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Check if scroll buttons should be visible
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = containerRef.current 
    ? scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth - 10
    : false;

  return (
    <div className="relative mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold flex items-center">
          <Film className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Reels
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-600 dark:text-blue-400"
          onClick={() => navigate('/reels')}
        >
          See All
        </Button>
      </div>
      
      {/* Scroll buttons */}
      {canScrollLeft && (
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-8 w-8 p-0 bg-white/80 shadow-md dark:bg-gray-800/80"
          onClick={() => scrollReels('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}
      
      {canScrollRight && (
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-8 w-8 p-0 bg-white/80 shadow-md dark:bg-gray-800/80"
          onClick={() => scrollReels('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      )}
      
      <div 
        ref={containerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-thin pb-2"
      >
        {reels.map((reel) => (
          <motion.div
            key={reel.id}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card 
              className="flex-shrink-0 w-36 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleReelClick(reel.id)}
              onMouseEnter={() => setHoveredReel(reel.id)}
              onMouseLeave={() => setHoveredReel(null)}
            >
              <CardContent className="p-0 h-64 relative overflow-hidden rounded-t-lg">
                {/* Video preview on hover, image otherwise */}
                <div className="relative w-full h-full">
                  {hoveredReel === reel.id ? (
                    <video
                      ref={(el: HTMLVideoElement | null) => videoRefs.current[reel.id] = el}
                      src={reel.video}
                      className="w-full h-full object-cover"
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={reel.thumbnail}
                      alt={reel.caption}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70"></div>
                
                {/* User info */}
                <div className="absolute bottom-20 left-0 right-0 px-2">
                  <div className="flex items-center justify-center mb-1">
                    <Avatar className="w-6 h-6 border border-white">
                      <AvatarImage src={reel.user.avatar} />
                      <AvatarFallback>{reel.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-white text-xs line-clamp-2 text-center px-1">{reel.caption}</p>
                </div>
                
                {/* Audio info */}
                {reel.audio && (
                  <div className="absolute bottom-8 left-2 right-2 flex items-center justify-center">
                    <div className="flex items-center space-x-1 bg-black/30 rounded-full px-2 py-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="animate-spin text-white"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="2" />
                        <line x1="12" y1="8" x2="12" y2="4" />
                      </svg>
                      <p className="text-white text-[10px] truncate max-w-[80px]">{reel.audio.title}</p>
                    </div>
                  </div>
                )}
                
                {/* Stats */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white/80 text-xs">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{formatNumber(reel.likes)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{formatNumber(reel.comments)}</span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="absolute right-1 top-1/3 transform -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleLike(reel.id, e)}
                    className={`bg-black/50 text-white hover:bg-black/70 h-7 w-7 p-0 rounded-full ${
                      likedReels.has(reel.id) ? 'bg-red-500/60' : ''
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${likedReels.has(reel.id) ? 'fill-white' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleShare(reel.id, e)}
                    className="bg-black/50 text-white hover:bg-black/70 h-7 w-7 p-0 rounded-full"
                  >
                    <Share className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Hover indicator */}
                {hoveredReel === reel.id && (
                  <div className="absolute top-2 left-2 right-2 flex justify-center">
                    <Badge className="bg-blue-500 animate-pulse">
                      Playing
                    </Badge>
                  </div>
                )}
                
                {/* View count */}
                <div className="absolute top-2 right-2">
                  <div className="flex items-center space-x-1 bg-black/40 rounded-full px-1.5 py-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span className="text-white text-[10px]">{formatNumber(reel.views)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default ReelsCarousel;