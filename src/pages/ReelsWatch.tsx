import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share, Bookmark, Music, Volume2, VolumeX, X, Send, ArrowUp, ArrowDown, Flag, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { MOCK_IMAGES, STORAGE_KEYS } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    isVerified?: boolean;
    isAuthor?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

const ReelsWatch = () => {
  const { reelId } = useParams<{ reelId: string }>();
  const navigate = useNavigate();
  
  // Mock reels data - in a real app, this would come from an API
  const mockReels = useMemo(() => [
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'Sarah Johnson',
        avatar: MOCK_IMAGES.AVATARS[0],
        isVerified: true,
        isFollowing: false,
        followers: 125000
      },
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      caption: 'Amazing sunset at the beach today! 🌅 #sunset #beach #summer',
      audio: {
        title: 'Summer Vibes',
        artist: 'DJ Sunshine'
      },
      likes: 45600,
      comments: 1230,
      shares: 320,
      views: 128900,
      isLiked: false,
      isSaved: false,
      tags: ['sunset', 'beach', 'summer'],
      category: 'Travel'
    },
    {
      id: '2',
      user: {
        id: 'user2',
        name: 'Mike Chen',
        avatar: MOCK_IMAGES.AVATARS[1],
        isVerified: false,
        isFollowing: true,
        followers: 89000
      },
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      caption: 'Just learned this new trick! What do you think? 🤔 #skateboarding #trick',
      audio: {
        title: 'Skater Boy',
        artist: 'Punk Rock'
      },
      likes: 23400,
      comments: 567,
      shares: 120,
      views: 89500,
      isLiked: true,
      isSaved: false,
      tags: ['skateboarding', 'trick', 'sports'],
      category: 'Sports'
    },
    {
      id: '3',
      user: {
        id: 'user3',
        name: 'Emma Wilson',
        avatar: MOCK_IMAGES.AVATARS[2],
        isVerified: true,
        isFollowing: false,
        followers: 230000
      },
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      caption: 'Morning coffee and coding session ☕💻 #developer #coding #morningroutine',
      audio: {
        title: 'Lofi Beats',
        artist: 'Chill Vibes'
      },
      likes: 78900,
      comments: 2345,
      shares: 450,
      views: 230400,
      isLiked: false,
      isSaved: true,
      tags: ['developer', 'coding', 'morningroutine'],
      category: 'Technology'
    },
    {
      id: '4',
      user: {
        id: 'user4',
        name: 'David Kim',
        avatar: MOCK_IMAGES.AVATARS[3],
        isVerified: false,
        isFollowing: false,
        followers: 56000
      },
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      caption: 'New workout routine! 💪 #fitness #workout #gym',
      audio: {
        title: 'Workout Mix',
        artist: 'Fitness Beats'
      },
      likes: 12300,
      comments: 456,
      shares: 89,
      views: 45600,
      isLiked: false,
      isSaved: false,
      tags: ['fitness', 'workout', 'gym'],
      category: 'Fitness'
    }
  ], []);
  
  // Mock comments data
  const mockComments = useMemo(() => ({
    '1': [
      {
        id: 'c1',
        user: {
          name: 'Alex Rodriguez',
          avatar: MOCK_IMAGES.AVATARS[5],
          isVerified: true
        },
        content: 'This is absolutely amazing! 🔥',
        timestamp: '2h ago',
        likes: 45,
        isLiked: false,
        replies: [
          {
            id: 'c1r1',
            user: {
              name: 'Sarah Johnson',
              avatar: MOCK_IMAGES.AVATARS[0],
              isVerified: true,
              isAuthor: true
            },
            content: 'Thank you so much! 💕',
            timestamp: '1h ago',
            likes: 12,
            isLiked: false
          }
        ]
      },
      {
        id: 'c2',
        user: {
          name: 'Jessica Park',
          avatar: MOCK_IMAGES.AVATARS[6]
        },
        content: 'Where was this taken? The colors are incredible!',
        timestamp: '3h ago',
        likes: 23,
        isLiked: true
      }
    ],
    '2': [
      {
        id: 'c3',
        user: {
          name: 'Robert Smith',
          avatar: MOCK_IMAGES.AVATARS[7]
        },
        content: 'Nice trick! How long did it take you to learn?',
        timestamp: '5h ago',
        likes: 18,
        isLiked: false
      }
    ]
  }), []);
  
  const [reel, setReel] = useState<typeof mockReels[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedReels, setRelatedReels] = useState<typeof mockReels>([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  // Load reel data
  useEffect(() => {
    const loadReel = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the reel by ID
      const foundReel = mockReels.find(r => r.id === reelId);
      
      if (foundReel) {
        // Check for saved states
        const savedLikes = storage.get<string[]>(STORAGE_KEYS.REEL_LIKES, []);
        const savedReels = storage.get<string[]>(STORAGE_KEYS.SAVED_REELS, []);
        
        // Update reel with saved states
        setReel({
          ...foundReel,
          isLiked: savedLikes?.includes(foundReel.id) || foundReel.isLiked,
          isSaved: savedReels?.includes(foundReel.id) || foundReel.isSaved
        });
        
        // Set comments for this reel
        setComments(mockComments[foundReel.id as keyof typeof mockComments] || []);
        
        // Set related reels (all except current)
        const related = mockReels.filter(r => r.id !== reelId);
        setRelatedReels(related);
        
        // Find index of current reel in all reels
        const index = mockReels.findIndex(r => r.id === reelId);
        if (index !== -1) {
          setCurrentReelIndex(index);
        }
      } else {
        // Reel not found, redirect to reels page
        toast.error('Reel not found');
        navigate('/reels');
      }
      
      setIsLoading(false);
    };
    
    loadReel();
  }, [reelId, navigate, mockReels, mockComments]);

  // Handle video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isLoading) return;
    
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);
    
    if (isPlaying) {
      video.play().catch(error => {
        console.error('Error playing video:', error);
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
    
    video.muted = isMuted;
    
    return () => {
      video.removeEventListener('play', handleVideoPlay);
      video.removeEventListener('pause', handleVideoPause);
    };
  }, [isPlaying, isMuted, isLoading, reel, handleVideoPlay, handleVideoPause]);

  // Auto-scroll comments
  useEffect(() => {
    if (commentsRef.current && showComments) {
      commentsRef.current.scrollTop = 0;
    }
  }, [showComments]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        navigateToPrevReel();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        navigateToNextReel();
      } else if (e.key === 'Escape') {
        navigate('/reels');
      } else if (e.key === 'm') {
        toggleMute();
      } else if (e.key === ' ') {
        togglePlay();
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, currentReelIndex, navigateToNextReel, navigateToPrevReel, toggleMute, togglePlay]);

  // Handle wheel scrolling
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleWheel = (e: WheelEvent) => {
      // Prevent default scrolling behavior
      e.preventDefault();
      
      // Debounce wheel events to prevent rapid firing
      if (wheelTimeoutRef.current || isNavigatingRef.current) return;
      
      isNavigatingRef.current = true;
      
      // Determine scroll direction
      if (e.deltaY > 0) {
        // Scrolling down
        navigateToNextReel();
      } else if (e.deltaY < 0) {
        // Scrolling up
        navigateToPrevReel();
      }
      
      // Set a timeout to prevent rapid navigation
      wheelTimeoutRef.current = setTimeout(() => {
        wheelTimeoutRef.current = null;
        isNavigatingRef.current = false;
      }, 300);
    };
    
    const container = containerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, [navigateToNextReel, navigateToPrevReel]);

  // Handle touch gestures
  useEffect(() => {
    if (!containerRef.current) return;
    
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      // Threshold to determine if it's a swipe (50px)
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe up - next reel
          navigateToNextReel();
        } else {
          // Swipe down - previous reel
          navigateToPrevReel();
        }
      }
    };
    
    const container = containerRef.current;
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigateToNextReel, navigateToPrevReel]);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleVideoPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleLike = () => {
    if (!reel) return;
    
    const newIsLiked = !reel.isLiked;
    
    setReel({
      ...reel,
      isLiked: newIsLiked,
      likes: newIsLiked ? reel.likes + 1 : reel.likes - 1
    });
    
    // Update storage
    const savedLikes = storage.get<string[]>(STORAGE_KEYS.REEL_LIKES, []);
    if (newIsLiked) {
      if (!savedLikes.includes(reel.id)) {
        savedLikes.push(reel.id);
      }
    } else {
      const index = savedLikes.indexOf(reel.id);
      if (index !== -1) {
        savedLikes.splice(index, 1);
      }
    }
    storage.set(STORAGE_KEYS.REEL_LIKES, savedLikes);
    
    toast.success(newIsLiked ? 'Liked reel' : 'Removed like');
  };

  const handleSave = () => {
    if (!reel) return;
    
    const newIsSaved = !reel.isSaved;
    
    setReel({
      ...reel,
      isSaved: newIsSaved
    });
    
    // Update storage
    const savedReels = storage.get<string[]>(STORAGE_KEYS.SAVED_REELS, []);
    if (newIsSaved) {
      if (!savedReels.includes(reel.id)) {
        savedReels.push(reel.id);
      }
    } else {
      const index = savedReels.indexOf(reel.id);
      if (index !== -1) {
        savedReels.splice(index, 1);
      }
    }
    storage.set(STORAGE_KEYS.SAVED_REELS, savedReels);
    
    toast.success(newIsSaved ? 'Saved to collection' : 'Removed from saved');
  };

  const handleShare = () => {
    if (!reel) return;
    
    navigator.clipboard.writeText(`${window.location.origin}/reels/${reel.id}`);
    toast.success('Reel link copied to clipboard');
    
    // Increment share count
    setReel({
      ...reel,
      shares: reel.shares + 1
    });
  };

  const handleFollow = () => {
    if (!reel) return;
    
    setReel({
      ...reel,
      user: {
        ...reel.user,
        isFollowing: !reel.user.isFollowing,
        followers: reel.user.isFollowing ? reel.user.followers - 1 : reel.user.followers + 1
      }
    });
    
    toast.success(reel.user.isFollowing 
      ? `Unfollowed ${reel.user.name}` 
      : `Following ${reel.user.name}`
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !reel) return;
    
    const comment: Comment = {
      id: `new-${Date.now()}`,
      user: {
        name: 'You',
        avatar: MOCK_IMAGES.AVATARS[7]
      },
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
    
    // Increment comments count
    setReel({
      ...reel,
      comments: reel.comments + 1
    });
    
    toast.success('Comment added');
  };

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim() || !reel || !showReplyInput) return;
    
    const reply: Comment = {
      id: `reply-${Date.now()}`,
      user: {
        name: 'You',
        avatar: MOCK_IMAGES.AVATARS[7]
      },
      content: replyText,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    };
    
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));
    
    setReplyText('');
    setShowReplyInput(null);
    toast.success('Reply added');
  };

  const handleLikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (!reel) return;
    
    if (!isReply) {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          };
        }
        return comment;
      }));
    } else if (parentId) {
      setComments(comments.map(comment => {
        if (comment.id === parentId && comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                };
              }
              return reply;
            })
          };
        }
        return comment;
      }));
    }
  };

  const navigateToReel = useCallback((id: string) => {
    navigate(`/reels/${id}`);
  }, [navigate]);

  const navigateToNextReel = useCallback(() => {
    if (currentReelIndex < mockReels.length - 1) {
      navigateToReel(mockReels[currentReelIndex + 1].id);
    }
  }, [currentReelIndex, mockReels, navigateToReel]);

  const navigateToPrevReel = useCallback(() => {
    if (currentReelIndex > 0) {
      navigateToReel(mockReels[currentReelIndex - 1].id);
    }
  }, [currentReelIndex, mockReels, navigateToReel]);

  const formatNumber = useCallback((num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!reel) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-4">Reel not found</h2>
          <Button onClick={() => navigate('/reels')}>Back to Reels</Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black flex items-center justify-center">
      {/* Close button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/reels')}
        className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 z-50 h-10 w-10 rounded-full"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation buttons */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50">
        {currentReelIndex > 0 && (
          <Button
            variant="secondary"
            size="lg"
            onClick={navigateToPrevReel}
            className="text-white bg-black/50 hover:bg-black/70 h-12 w-12 rounded-full flex items-center justify-center"
            aria-label="Previous reel"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        )}
      </div>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
        {currentReelIndex < mockReels.length - 1 && (
          <Button
            variant="secondary"
            size="lg"
            onClick={navigateToNextReel}
            className="text-white bg-black/50 hover:bg-black/70 h-12 w-12 rounded-full flex items-center justify-center"
            aria-label="Next reel"
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
        )}
      </div>

      <div className="relative w-full max-w-md h-full max-h-[90vh] overflow-hidden">
        {/* Video */}
        <div className="h-full w-full" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={reel.video}
            className="h-full w-full object-contain"
            loop
            playsInline
            autoPlay
            muted={isMuted}
          />
          
          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
          
          {/* Play/Pause overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white ml-1">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* User info */}
        <div className="absolute top-4 left-4 right-12 flex items-center space-x-3 z-10">
          <Avatar className="w-10 h-10 border-2 border-white">
            <AvatarImage src={reel.user.avatar} />
            <AvatarFallback>{reel.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-white font-medium truncate">{reel.user.name}</p>
              {reel.user.isVerified && (
                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-white/70 text-xs">{formatNumber(reel.user.followers)} followers</p>
          </div>
          <Button
            variant={reel.user.isFollowing ? "outline" : "default"}
            size="sm"
            onClick={handleFollow}
            className={reel.user.isFollowing ? "border-white text-white" : ""}
          >
            {reel.user.isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>

        {/* Caption and tags */}
        <div className="absolute bottom-20 left-4 right-16 z-10">
          <p className="text-white text-sm mb-2">{reel.caption}</p>
          
          {/* Tags */}
          {reel.tags && reel.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {reel.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-black/30 text-white">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Audio info */}
          {reel.audio && (
            <div className="flex items-center space-x-2 bg-black/30 rounded-full px-3 py-1 w-fit">
              <Music className="w-4 h-4 text-white" />
              <div className="text-white text-xs">
                <p className="font-medium">{reel.audio.title}</p>
                <p>{reel.audio.artist}</p>
              </div>
            </div>
          )}
          
          {/* View count */}
          <div className="flex items-center space-x-1 mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/70"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="text-white/70 text-xs">{formatNumber(reel.views)} views</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="absolute right-4 bottom-20 flex flex-col space-y-6 z-10">
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className="rounded-full h-10 w-10 p-0 bg-black/30 text-white hover:bg-black/50"
            >
              <Heart className={`h-6 w-6 ${reel.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <span className="text-white text-xs mt-1">{formatNumber(reel.likes)}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
                setIsPlaying(!showComments);
              }}
              className="rounded-full h-10 w-10 p-0 bg-black/30 text-white hover:bg-black/50"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <span className="text-white text-xs mt-1">{formatNumber(reel.comments)}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="rounded-full h-10 w-10 p-0 bg-black/30 text-white hover:bg-black/50"
            >
              <Share className="h-6 w-6" />
            </Button>
            <span className="text-white text-xs mt-1">{formatNumber(reel.shares)}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="rounded-full h-10 w-10 p-0 bg-black/30 text-white hover:bg-black/50"
            >
              <Bookmark className={`h-6 w-6 ${reel.isSaved ? 'fill-white' : ''}`} />
            </Button>
            <span className="text-white text-xs mt-1">Save</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toast.info('Reported reel');
              }}
              className="rounded-full h-10 w-10 p-0 bg-black/30 text-white hover:bg-black/50"
            >
              <Flag className="h-6 w-6" />
            </Button>
            <span className="text-white text-xs mt-1">Report</span>
          </div>
        </div>
        
        {/* Mute/unmute button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className="absolute bottom-4 left-4 rounded-full h-10 w-10 p-0 bg-black/30 text-white hover:bg-black/50 z-10"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        
        {/* Time indicator */}
        <div className="absolute bottom-4 right-4 z-10">
          <Badge variant="outline" className="bg-black/30 text-white border-transparent">
            <Clock className="w-3 h-3 mr-1" />
            <span className="text-xs">Forever</span>
          </Badge>
        </div>
      </div>
      
      {/* Comments panel */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-xl max-h-[60vh] overflow-hidden z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Comments ({formatNumber(reel.comments)})
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setShowComments(false);
                  setIsPlaying(true);
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div 
              ref={commentsRef}
              className="p-4 space-y-4 max-h-[40vh] overflow-y-auto"
            >
              {comments.length > 0 ? (
                <AnimatePresence>
                  {comments.map((comment) => (
                    <motion.div 
                      key={comment.id} 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.user.avatar} />
                          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                            <div className="flex items-center space-x-1">
                              <p className="font-medium text-sm dark:text-white">{comment.user.name}</p>
                              {comment.user.isVerified && (
                                <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-[6px]">✓</span>
                                </div>
                              )}
                              {comment.user.isAuthor && (
                                <Badge variant="secondary" className="text-[10px] h-4">Author</Badge>
                              )}
                            </div>
                            <p className="text-sm dark:text-gray-200">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span>{comment.timestamp}</span>
                            <button 
                              className={`font-medium ${comment.isLiked ? 'text-blue-600' : ''}`}
                              onClick={() => handleLikeComment(comment.id)}
                            >
                              Like {comment.likes > 0 && `(${comment.likes})`}
                            </button>
                            <button 
                              className="font-medium"
                              onClick={() => setShowReplyInput(prev => prev === comment.id ? null : comment.id)}
                            >
                              Reply
                            </button>
                          </div>
                          
                          {/* Reply input */}
                          {showReplyInput === comment.id && (
                            <div className="mt-2 flex space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={MOCK_IMAGES.AVATARS[7]} />
                                <AvatarFallback>Y</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 flex space-x-2">
                                <Input
                                  placeholder="Write a reply..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  className="flex-1 text-sm h-8 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                                <Button 
                                  size="sm" 
                                  onClick={() => handleAddReply(comment.id)}
                                  disabled={!replyText.trim()}
                                  className="h-8 px-3"
                                >
                                  Reply
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-11 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={reply.user.avatar} />
                                <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                                  <div className="flex items-center space-x-1">
                                    <p className="font-medium text-sm dark:text-white">{reply.user.name}</p>
                                    {reply.user.isVerified && (
                                      <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-[6px]">✓</span>
                                      </div>
                                    )}
                                    {reply.user.isAuthor && (
                                      <Badge variant="secondary" className="text-[10px] h-4">Author</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm dark:text-gray-200">{reply.content}</p>
                                </div>
                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                  <span>{reply.timestamp}</span>
                                  <button 
                                    className={`font-medium ${reply.isLiked ? 'text-blue-600' : ''}`}
                                    onClick={() => handleLikeComment(reply.id, true, comment.id)}
                                  >
                                    Like {reply.likes > 0 && `(${reply.likes})`}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={MOCK_IMAGES.AVATARS[7]} />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    aria-label="Post comment"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Related reels */}
      <div className="absolute top-4 bottom-4 right-4 w-16 flex flex-col space-y-2 items-center overflow-hidden">
        {relatedReels.slice(0, 5).map((relatedReel, index) => (
          <div 
            key={relatedReel.id}
            className={`w-12 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${
              relatedReel.id === reelId ? 'border-blue-500' : 'border-white/30'
            }`}
            onClick={() => navigateToReel(relatedReel.id)}
          >
            <img 
              src={MOCK_IMAGES.POSTS[index % MOCK_IMAGES.POSTS.length]} 
              alt={`Related reel ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {relatedReels.length > 5 && (
          <Badge variant="secondary" className="bg-black/70 text-white">
            +{relatedReels.length - 5} more
          </Badge>
        )}
      </div>
      
      {/* Navigation indicators */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 flex items-center space-x-2">
        {currentReelIndex > 0 && (
          <Badge variant="secondary" className="bg-black/50 text-white animate-pulse">
            <ArrowUp className="w-3 h-3 mr-1" />
            Swipe up
          </Badge>
        )}
        {currentReelIndex < mockReels.length - 1 && (
          <Badge variant="secondary" className="bg-black/50 text-white animate-pulse">
            <ArrowDown className="w-3 h-3 mr-1" />
            Swipe down
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ReelsWatch;