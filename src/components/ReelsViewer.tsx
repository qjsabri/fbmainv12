import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, MessageCircle, Share, Bookmark, Volume2, VolumeX, X, Send, ChevronUp, ChevronDown, Flag, User, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

interface Reel {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
    isFollowing: boolean;
  };
  video: string;
  caption: string;
  audio?: {
    title: string;
    artist: string;
  };
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked: boolean;
  isSaved: boolean;
  tags?: string[];
  category?: string;
}

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

interface ReelsViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReelsViewer: React.FC<ReelsViewerProps> = ({ isOpen, onClose }) => {
  const [reels, setReels] = useState<Reel[]>([
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'Sarah Johnson',
        avatar: MOCK_IMAGES.AVATARS[0],
        isVerified: true,
        isFollowing: false
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
        isFollowing: true
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
        avatar: getSafeImage('AVATARS', 2),
        isVerified: true,
        isFollowing: false
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
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Record<string, Comment[]>>({
    '1': [
      {
        id: 'c1',
        user: {
          name: 'Alex Rodriguez',
          avatar: getSafeImage('AVATARS', 5),
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
          avatar: getSafeImage('AVATARS', 6)
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
          avatar: getSafeImage('AVATARS', 7)
        },
        content: 'Nice trick! How long did it take you to learn?',
        timestamp: '5h ago',
        likes: 18,
        isLiked: false
      }
    ],
    '3': [
      {
        id: 'c4',
        user: {
          name: 'David Kim',
          avatar: getSafeImage('AVATARS', 3)
        },
        content: 'What IDE are you using?',
        timestamp: '1d ago',
        likes: 8,
        isLiked: false
      },
      {
        id: 'c5',
        user: {
          name: 'Lisa Wang',
          avatar: getSafeImage('AVATARS', 4)
        },
        content: 'Coffee and coding, perfect combo! ☕💻',
        timestamp: '1d ago',
        likes: 15,
        isLiked: false
      }
    ]
  });

  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);
  
  // Current reel
  const currentReel = reels[currentIndex];

  // Load saved states from storage
  useEffect(() => {
    if (!isOpen) return;
    
    const savedLikes = storage.get<string[]>(STORAGE_KEYS.REEL_LIKES, []);
    const savedBookmarks = storage.get<string[]>(STORAGE_KEYS.SAVED_REELS, []);
    
    if (savedLikes?.length || savedBookmarks?.length) {
      setReels(prev => prev.map(reel => ({
        ...reel,
        isLiked: savedLikes?.includes(reel.id) || reel.isLiked,
        isSaved: savedBookmarks?.includes(reel.id) || reel.isSaved
      })));
    }
  }, [isOpen]);

  // Handle video playback
  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    
    if (isPlaying) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Error playing video:', error);
          setIsPlaying(false);
        });
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
    
    // Update muted state
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isPlaying, isMuted, currentIndex, isOpen]);

  // Reset scroll position when comments are opened
  useEffect(() => {
    if (commentsRef.current && showComments) {
      commentsRef.current.scrollTop = 0;
    }
  }, [showComments]);

  // Enable wheel scrolling for vertical navigation
  useEffect(() => {
    if (!containerRef.current || !isOpen) return;
    
    const handleWheel = (e: WheelEvent) => {
      // Prevent default scrolling behavior
      e.preventDefault();
      
      // Debounce wheel events to prevent rapid firing
      if (wheelTimeoutRef.current || isNavigatingRef.current) return;
      
      isNavigatingRef.current = true;
      
      // Determine scroll direction
      if (e.deltaY > 0) {
        // Scrolling down
        if (currentIndex < reels.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      } else if (e.deltaY < 0) {
        // Scrolling up
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
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
  }, [isOpen, currentIndex, reels.length]);

  // Handle touch gestures for mobile
  useEffect(() => {
    if (!containerRef.current || !isOpen) return;
    
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
          if (currentIndex < reels.length - 1) {
            setCurrentIndex(prev => prev + 1);
          }
        } else {
          // Swipe down - previous reel
          if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
          }
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
  }, [isOpen, currentIndex, reels.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp':
          if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
          break;
        case 'ArrowDown':
          if (currentIndex < reels.length - 1) setCurrentIndex(prev => prev + 1);
          break;
        case 'Escape':
          onClose();
          break;
        case 'm':
          setIsMuted(prev => !prev);
          break;
        case ' ': // Space
          setIsPlaying(prev => !prev);
          e.preventDefault();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, reels.length, onClose]);

  const handleLike = useCallback(() => {
    if (!currentReel) return;
    
    setReels(prev => prev.map(reel => 
      reel.id === currentReel.id 
        ? { 
            ...reel, 
            isLiked: !reel.isLiked,
            likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1 
          }
        : reel
    ));
    
    const newLikedState = !currentReel.isLiked;
    
    // Update storage
    const savedLikes = storage.get<string[]>(STORAGE_KEYS.REEL_LIKES, []);
    if (newLikedState) {
      if (!savedLikes.includes(currentReel.id)) {
        savedLikes.push(currentReel.id);
      }
    } else {
      const index = savedLikes.indexOf(currentReel.id);
      if (index !== -1) {
        savedLikes.splice(index, 1);
      }
    }
    storage.set(STORAGE_KEYS.REEL_LIKES, savedLikes);
    
    toast.success(newLikedState ? 'Reel liked' : 'Like removed');
  }, [currentReel]);

  const handleSave = useCallback(() => {
    if (!currentReel) return;
    
    setReels(prev => prev.map(reel => 
      reel.id === currentReel.id 
        ? { ...reel, isSaved: !reel.isSaved }
        : reel
    ));
    
    const newSavedState = !currentReel.isSaved;
    
    // Update storage
    const savedReels = storage.get<string[]>(STORAGE_KEYS.SAVED_REELS, []);
    if (newSavedState) {
      if (!savedReels.includes(currentReel.id)) {
        savedReels.push(currentReel.id);
      }
    } else {
      const index = savedReels.indexOf(currentReel.id);
      if (index !== -1) {
        savedReels.splice(index, 1);
      }
    }
    storage.set(STORAGE_KEYS.SAVED_REELS, savedReels);
    
    toast.success(newSavedState ? 'Saved to collection' : 'Removed from saved');
  }, [currentReel]);

  const handleShare = useCallback(() => {
    if (!currentReel) return;
    
    navigator.clipboard.writeText(`${window.location.origin}/reels/${currentReel.id}`);
    toast.success('Reel link copied to clipboard');
    
    // Increment share count
    setReels(prev => prev.map(reel => 
      reel.id === currentReel.id 
        ? { ...reel, shares: reel.shares + 1 }
        : reel
    ));
  }, [currentReel]);

  const handleFollow = useCallback(() => {
    if (!currentReel) return;
    
    setReels(prev => prev.map(reel => 
      reel.id === currentReel.id 
        ? { 
            ...reel,
            user: {
              ...reel.user,
              isFollowing: !reel.user.isFollowing
            }
          }
        : reel
    ));
    
    toast.success(currentReel.user.isFollowing 
      ? `Unfollowed ${currentReel.user.name}` 
      : `Following ${currentReel.user.name}`
    );
  }, [currentReel]);

  const handleAddComment = useCallback(() => {
    if (!newComment.trim() || !currentReel) return;
    
    const comment: Comment = {
      id: `new-${Date.now()}`,
      user: {
        name: 'You',
        avatar: getSafeImage('AVATARS', 7)
      },
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    };
    
    setComments(prev => ({
      ...prev,
      [currentReel.id]: [comment, ...(prev[currentReel.id] || [])]
    }));
    
    setNewComment('');
    
    // Increment comments count
    setReels(prev => prev.map(reel => 
      reel.id === currentReel.id 
        ? { ...reel, comments: reel.comments + 1 }
        : reel
    ));
    
    toast.success('Comment added');
  }, [newComment, currentReel]);

  const handleAddReply = useCallback((commentId: string) => {
    if (!replyText.trim() || !currentReel || !showReplyInput) return;
    
    const reply: Comment = {
      id: `reply-${Date.now()}`,
      user: {
        name: 'You',
        avatar: getSafeImage('AVATARS', 7)
      },
      content: replyText,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    };
    
    setComments(prev => {
      const currentComments = [...(prev[currentReel.id] || [])];
      const commentIndex = currentComments.findIndex(c => c.id === commentId);
      
      if (commentIndex !== -1) {
        const updatedComment = {
          ...currentComments[commentIndex],
          replies: [...(currentComments[commentIndex].replies || []), reply]
        };
        
        currentComments[commentIndex] = updatedComment;
      }
      
      return {
        ...prev,
        [currentReel.id]: currentComments
      };
    });
    
    setReplyText('');
    setShowReplyInput(null);
    toast.success('Reply added');
  }, [replyText, currentReel, showReplyInput]);

  const handleLikeComment = useCallback((commentId: string, isReply: boolean = false, parentId?: string) => {
    if (!currentReel) return;
    
    setComments(prev => {
      const currentComments = [...(prev[currentReel.id] || [])];
      
      if (!isReply) {
        const commentIndex = currentComments.findIndex(c => c.id === commentId);
        
        if (commentIndex !== -1) {
          const updatedComment = {
            ...currentComments[commentIndex],
            isLiked: !currentComments[commentIndex].isLiked,
            likes: currentComments[commentIndex].isLiked
              ? currentComments[commentIndex].likes - 1
              : currentComments[commentIndex].likes + 1
          };
          
          currentComments[commentIndex] = updatedComment;
        }
      } else if (parentId) {
        const parentIndex = currentComments.findIndex(c => c.id === parentId);
        
        if (parentIndex !== -1 && currentComments[parentIndex].replies) {
          const replyIndex = currentComments[parentIndex].replies!.findIndex(r => r.id === commentId);
          
          if (replyIndex !== -1) {
            const updatedReplies = [...currentComments[parentIndex].replies!];
            updatedReplies[replyIndex] = {
              ...updatedReplies[replyIndex],
              isLiked: !updatedReplies[replyIndex].isLiked,
              likes: updatedReplies[replyIndex].isLiked
                ? updatedReplies[replyIndex].likes - 1
                : updatedReplies[replyIndex].likes + 1
            };
            
            currentComments[parentIndex] = {
              ...currentComments[parentIndex],
              replies: updatedReplies
            };
          }
        }
      }
      
      return {
        ...prev,
        [currentReel.id]: currentComments
      };
    });
  }, [currentReel]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 z-50 h-10 w-10 rounded-full"
        aria-label="Close reels"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation buttons */}
      <div className="absolute left-0 inset-y-0 flex items-center justify-center pl-4 z-10">
        {currentIndex > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(prev => prev - 1);
              setShowComments(false);
            }}
            className="text-white bg-black/30 hover:bg-black/50 h-10 w-10 rounded-full"
            aria-label="Previous reel"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        )}
      </div>
      
      <div className="absolute right-0 inset-y-0 flex items-center justify-center pr-4 z-10">
        {currentIndex < reels.length - 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(prev => prev + 1);
              setShowComments(false);
            }}
            className="text-white bg-black/30 hover:bg-black/50 h-10 w-10 rounded-full"
            aria-label="Next reel"
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        )}
      </div>

      <div className="relative w-full max-w-md h-full max-h-[90vh] overflow-hidden">
        {/* Current Reel */}
        {currentReel && (
          <div className="h-full w-full">
            <video
              ref={videoRef}
              src={currentReel.video}
              className="h-full w-full object-contain"
              loop
              muted={isMuted}
              playsInline
              autoPlay
            />
            
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
            
            {/* User info */}
            <div className="absolute top-4 left-4 right-12 flex items-center space-x-3 z-10">
              <Avatar className="w-10 h-10 border-2 border-white">
                <AvatarImage src={currentReel.user.avatar} />
                <AvatarFallback>{currentReel.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-white font-medium truncate">{currentReel.user.name}</p>
                  {currentReel.user.isVerified && (
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                
                {/* Category */}
                {currentReel.category && (
                  <Badge className="bg-black/40 text-white mt-1">{currentReel.category}</Badge>
                )}
              </div>
              <Button
                variant={currentReel.user.isFollowing ? "outline" : "default"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow();
                }}
                className={currentReel.user.isFollowing ? "border-white text-white" : ""}
              >
                {currentReel.user.isFollowing ? (
                  <User className="w-4 h-4 mr-1" />
                ) : (
                  <User className="w-4 h-4 mr-1" />
                )}
                <span>{currentReel.user.isFollowing ? 'Following' : 'Follow'}</span>
              </Button>
            </div>

            {/* Caption and tags */}
            <div className="absolute bottom-20 left-4 right-16 z-10">
              <p className="text-white text-sm mb-2">{currentReel.caption}</p>
              
              {/* Tags */}
              {currentReel.tags && currentReel.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentReel.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-black/30 text-white">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Audio info */}
              {currentReel.audio && (
                <div className="flex items-center space-x-2 bg-black/30 rounded-full px-3 py-1 w-fit">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="animate-spin text-black"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="2" />
                      <line x1="12" y1="8" x2="12" y2="4" />
                    </svg>
                  </div>
                  <div className="text-white text-xs">
                    <p className="font-medium">{currentReel.audio.title}</p>
                    <p>{currentReel.audio.artist}</p>
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
                <span className="text-white/70 text-xs">{formatNumber(currentReel.views)} views</span>
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
                  <Heart className={`h-6 w-6 ${currentReel.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <span className="text-white text-xs mt-1">{formatNumber(currentReel.likes)}</span>
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
                <span className="text-white text-xs mt-1">{formatNumber(currentReel.comments)}</span>
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
                <span className="text-white text-xs mt-1">{formatNumber(currentReel.shares)}</span>
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
                  <Bookmark className={`h-6 w-6 ${currentReel.isSaved ? 'fill-white' : ''}`} />
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
                setIsMuted(!isMuted);
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
            
            {/* Play/Pause indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white ml-1">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Comments panel */}
        <AnimatePresence>
          {showComments && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-xl max-h-[60vh] overflow-hidden z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comments ({currentReel ? formatNumber(currentReel.comments) : 0})
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
                {currentReel && comments[currentReel.id]?.length > 0 ? (
                  <AnimatePresence>
                    {comments[currentReel.id].map((comment) => (
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
                                  <AvatarImage src={getSafeImage('AVATARS', 7)} />
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
                    <AvatarImage src={getSafeImage('AVATARS', 7)} />
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
        
        {/* Navigation indicators */}
        <div className="absolute left-0 right-0 bottom-4 flex justify-center z-10">
          <div className="flex space-x-1">
            {reels.map((_, index) => (
              <div 
                key={index} 
                className={`h-1 w-6 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsViewer;