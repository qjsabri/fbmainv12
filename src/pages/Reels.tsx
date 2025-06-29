import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Film, Search, TrendingUp, Clock, Bookmark, Plus, Heart, MessageCircle, Share, Music, Filter, Zap, BarChart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_IMAGES, STORAGE_KEYS } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ReelsViewer from '@/components/ReelsViewer';

interface ReelPreview {
  id: string;
  thumbnail: string;
  video: string;
  views: number;
  duration: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  caption: string;
  isTrending: boolean;
  isNew: boolean;
  category: string;
  likes: number;
  comments: number;
  audio?: {
    title: string;
    artist: string;
  };
  isLiked?: boolean;
  isSaved?: boolean;
}

const Reels = () => {
  const navigate = useNavigate();
  const [reels, setReels] = useState<ReelPreview[]>([
    {
      id: '1',
      thumbnail: MOCK_IMAGES.POSTS[0],
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      views: 1245000,
      duration: '0:30',
      user: {
        name: 'Sarah Johnson',
        avatar: MOCK_IMAGES.AVATARS[0],
        verified: true
      },
      caption: 'Amazing sunset at the beach today! 🌅 #sunset #beach #summer',
      isTrending: true,
      isNew: true,
      category: 'Travel',
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
      duration: '0:15',
      user: {
        name: 'Mike Chen',
        avatar: MOCK_IMAGES.AVATARS[1],
        verified: false
      },
      caption: 'Just learned this new trick! What do you think? 🤔 #skateboarding #trick',
      isTrending: false,
      isNew: true,
      category: 'Sports',
      likes: 23400,
      comments: 567,
      audio: {
        title: 'Skater Boy',
        artist: 'Punk Rock'
      }
    },
    {
      id: '3',
      thumbnail: MOCK_IMAGES.POSTS[2],
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      views: 2300000,
      duration: '0:45',
      user: {
        name: 'Emma Wilson',
        avatar: MOCK_IMAGES.AVATARS[2],
        verified: true
      },
      caption: 'Morning coffee and coding session ☕💻 #developer #coding #morningroutine',
      isTrending: true,
      isNew: false,
      category: 'Technology',
      likes: 78900,
      comments: 2345,
      audio: {
        title: 'Lofi Beats',
        artist: 'Chill Vibes'
      }
    },
    {
      id: '4',
      thumbnail: MOCK_IMAGES.POSTS[3],
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      views: 567000,
      duration: '0:20',
      user: {
        name: 'David Kim',
        avatar: MOCK_IMAGES.AVATARS[3],
        verified: false
      },
      caption: 'New workout routine! 💪 #fitness #workout #gym',
      isTrending: false,
      isNew: false,
      category: 'Fitness',
      likes: 12300,
      comments: 456,
      audio: {
        title: 'Workout Mix',
        artist: 'Fitness Beats'
      }
    },
    {
      id: '5',
      thumbnail: MOCK_IMAGES.POSTS[4],
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      views: 1890000,
      duration: '0:35',
      user: {
        name: 'Lisa Wang',
        avatar: MOCK_IMAGES.AVATARS[4],
        verified: true
      },
      caption: 'Cooking my favorite pasta recipe 🍝 #cooking #food #recipe',
      isTrending: true,
      isNew: true,
      category: 'Food',
      likes: 56700,
      comments: 1890,
      audio: {
        title: 'Italian Cooking',
        artist: 'Food Vibes'
      }
    },
    {
      id: '6',
      thumbnail: MOCK_IMAGES.POSTS[5],
      video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      views: 456000,
      duration: '0:25',
      user: {
        name: 'Alex Rodriguez',
        avatar: MOCK_IMAGES.AVATARS[5],
        verified: false
      },
      caption: 'Beautiful hike today! 🏔️ #nature #hiking #outdoors',
      isTrending: false,
      isNew: true,
      category: 'Nature',
      likes: 34500,
      comments: 789,
      audio: {
        title: 'Nature Sounds',
        artist: 'Outdoor Vibes'
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('foryou');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'trending'>('popular');
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const [savedReels, setSavedReels] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [playingReel, setPlayingReel] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const reelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const playingReelRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Define video control functions first
  const handleVideoPlay = useCallback((reelId: string) => {
    const videoElement = videoRefs.current[reelId];
    if (!videoElement) return;

    // Pause any currently playing video
    if (playingReelRef.current && playingReelRef.current !== reelId) {
      const currentVideo = videoRefs.current[playingReelRef.current];
      if (currentVideo && !currentVideo.paused) {
        currentVideo.pause();
      }
    }

    // Play the new video
    if (videoElement.paused) {
      playingReelRef.current = reelId;
      setPlayingReel(reelId);
      videoElement.muted = true;
      videoElement.currentTime = 0;
      const playPromise = videoElement.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Couldn't play video:", error);
        });
      }
    }
  }, []);

  const handleVideoPause = useCallback((reelId: string) => {
    const videoElement = videoRefs.current[reelId];
    if (!videoElement) return;

    if (!videoElement.paused) {
      videoElement.pause();
    }
    
    if (playingReelRef.current === reelId) {
      playingReelRef.current = null;
      setPlayingReel(null);
    }
  }, []);

  // Load saved data from storage
  useEffect(() => {
    const savedLikedReels = storage.get<string[]>(STORAGE_KEYS.REEL_LIKES, []);
    const savedReelsData = storage.get<string[]>(STORAGE_KEYS.SAVED_REELS, []);
    
    if (savedLikedReels) setLikedReels(new Set(savedLikedReels));
    if (savedReelsData) setSavedReels(new Set(savedReelsData));
    
    // Update the reels with saved states
    setReels(prev => prev.map(reel => ({
      ...reel,
      isLiked: savedLikedReels?.includes(reel.id) || false,
      isSaved: savedReelsData?.includes(reel.id) || false
    })));
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize intersection observer once
  useEffect(() => {
    // Create observer instance
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const reelId = entry.target.getAttribute('data-reel-id');
          if (!reelId) return;

          const videoElement = videoRefs.current[reelId];
          if (!videoElement) return;

          if (entry.isIntersecting) {
            handleVideoPlay(reelId);
          } else {
            handleVideoPause(reelId);
          }
        });
      },
      { threshold: 0.6 }
    );

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleVideoPause, handleVideoPlay]);

  // Manage observation targets when reels change
  useEffect(() => {
    if (isLoading || !observerRef.current) return;

    // Disconnect all previous observations
    observerRef.current.disconnect();

    // Observe current reel elements
    Object.keys(reelRefs.current).forEach(reelId => {
      const element = reelRefs.current[reelId];
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });
  }, [isLoading, reels, handleVideoPause, handleVideoPlay]);

  const formatViews = useCallback((views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  }, []); // formatViews has no dependencies

  const handleOpenReel = useCallback((reelId: string) => {
    const index = reels.findIndex(reel => reel.id === reelId);
    if (index !== -1) {
      setViewerOpen(true);
    } else {
      navigate(`/reels/${reelId}`);
    }
  }, [reels, navigate]);

  const handleLikeReel = useCallback((reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Update liked state
    const isLiked = likedReels.has(reelId);
    const newLikedReels = new Set(likedReels);
    
    if (isLiked) {
      newLikedReels.delete(reelId);
    } else {
      newLikedReels.add(reelId);
    }
    
    setLikedReels(newLikedReels);
    
    // Update storage
    storage.set(STORAGE_KEYS.REEL_LIKES, Array.from(newLikedReels));
    
    // Update reels state
    setReels(prev => prev.map(reel => 
      reel.id === reelId 
        ? { 
            ...reel, 
            isLiked: !isLiked,
            likes: isLiked ? reel.likes - 1 : reel.likes + 1 
          }
        : reel
    ));
    
    toast.success(isLiked ? 'Removed like' : 'Liked reel');
  }, [likedReels]);

  const handleSaveReel = useCallback((reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Update saved state
    const isSaved = savedReels.has(reelId);
    const newSavedReels = new Set(savedReels);
    
    if (isSaved) {
      newSavedReels.delete(reelId);
    } else {
      newSavedReels.add(reelId);
    }
    
    setSavedReels(newSavedReels);
    
    // Update storage
    storage.set(STORAGE_KEYS.SAVED_REELS, Array.from(newSavedReels));
    
    // Update reels state
    setReels(prev => prev.map(reel => 
      reel.id === reelId 
        ? { ...reel, isSaved: !isSaved }
        : reel
    ));
    
    toast.success(isSaved ? 'Removed from saved' : 'Saved for later');
  }, [savedReels]);

  const handleShareReel = useCallback((reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/reels/${reelId}`);
    toast.success('Reel link copied to clipboard');
  }, []);

  const handleFollowUser = useCallback((userId: string, userName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`Following ${userName}`);
  }, []);

  const handleCreateReel = useCallback(() => {
    toast.info('Reel creation coming soon!', {
      description: 'We\'re working on this feature. Stay tuned!'
    });
  }, []);

  // Filter reels based on search, category, etc.
  const filteredReels = reels.filter(reel => {
    const matchesSearch = reel.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          reel.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (reel.audio?.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (reel.audio?.artist.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = category === 'All' || reel.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // Sort reels based on selected sort option
  const sortedReels = [...filteredReels].sort((a, b) => {
    switch(sortBy) {
      case 'recent':
        // Sort by new/not new then by id (newer ids are higher)
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return parseInt(b.id) - parseInt(a.id);
      case 'trending':
        // Trending reels first, then by views
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        return b.views - a.views;
      case 'popular':
      default:
        // Sort by views
        return b.views - a.views;
    }
  });

  // Get reels for different tabs
  const trendingReels = sortedReels.filter(reel => reel.isTrending);
  const newReels = sortedReels.filter(reel => reel.isNew);
  const savedReelsList = sortedReels.filter(reel => savedReels.has(reel.id));
  const followingReels = sortedReels.filter(reel => {
    const userIds = ['user1', 'user2']; // Mock followed user IDs
    return userIds.includes(reel.id);
  });

  // Get available categories
  const categories = ['All', ...Array.from(new Set(reels.map(reel => reel.category)))];

  // Render a reel card
  const renderReelCard = useCallback((reel: ReelPreview) => (
    <motion.div
      key={reel.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
      ref={el => { reelRefs.current[reel.id] = el }}
      data-reel-id={reel.id}
    >
      <Card 
        className="overflow-hidden cursor-pointer group h-[400px]"
        onClick={() => handleOpenReel(reel.id)}
      >
        <div className="relative h-full">
          {/* Video element */}
          <video
            ref={el => { videoRefs.current[reel.id] = el }}
            src={reel.video}
            className={`absolute inset-0 w-full h-full object-cover ${
              playingReel === reel.id ? 'z-10' : 'z-0'
            }`}
            loop
            muted
            playsInline
          />
          
          {/* Thumbnail image */}
          <img 
            src={reel.thumbnail} 
            alt={reel.caption} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              playingReel === reel.id ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 z-20"></div>
          
          {/* Play indicator */}
          {playingReel === reel.id && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
              <Badge className="bg-blue-500 text-white animate-pulse">Playing</Badge>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 z-20 flex flex-col space-y-1">
            {reel.isTrending && (
              <Badge className="bg-red-500 text-white">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
            
            {reel.isNew && !reel.isTrending && (
              <Badge className="bg-blue-500 text-white">
                <Clock className="w-3 h-3 mr-1" />
                New
              </Badge>
            )}
            
            <Badge variant="outline" className="bg-black/40 text-white border-none">
              {reel.category}
            </Badge>
          </div>
          
          <div className="absolute top-2 right-2 z-20">
            <Badge variant="outline" className="bg-black/40 text-white border-none">
              {reel.duration}
            </Badge>
          </div>
          
          {/* User info */}
          <div className="absolute top-12 left-2 right-2 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="w-7 h-7 border border-white">
                  <AvatarImage src={reel.user.avatar} />
                  <AvatarFallback>{reel.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex items-center">
                  <p className="text-white text-xs font-medium truncate max-w-[100px]">{reel.user.name}</p>
                  {reel.user.verified && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center ml-1">
                      <span className="text-white text-[6px]">✓</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleFollowUser('user1', reel.user.name, e)}
                className="h-6 text-xs bg-black/40 text-white hover:bg-black/60 px-2 py-0 rounded-full"
              >
                <User className="w-3 h-3 mr-1" />
                <span>Follow</span>
              </Button>
            </div>
          </div>
          
          {/* Caption and audio */}
          <div className="absolute bottom-16 left-2 right-2 z-20">
            <p className="text-white text-xs line-clamp-2 mb-1">{reel.caption}</p>
            
            {reel.audio && (
              <div className="flex items-center space-x-1 bg-black/40 rounded-full px-2 py-1 w-fit">
                <Music className="w-3 h-3 text-white" />
                <div className="text-white text-[10px] truncate max-w-[120px]">
                  {reel.audio.title} · {reel.audio.artist}
                </div>
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs z-20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Heart className={`w-3 h-3 ${reel.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{formatViews(reel.likes)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{formatViews(reel.comments)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
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
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>{formatViews(reel.views)}</span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="absolute right-2 top-1/3 transform -translate-y-1/2 flex flex-col space-y-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleLikeReel(reel.id, e)}
              className={`bg-black/50 text-white hover:bg-black/70 h-8 w-8 p-0 rounded-full ${
                reel.isLiked ? 'bg-red-500/80 hover:bg-red-500/90' : ''
              }`}
            >
              <Heart className={`w-4 h-4 ${reel.isLiked ? 'fill-white' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleSaveReel(reel.id, e)}
              className={`bg-black/50 text-white hover:bg-black/70 h-8 w-8 p-0 rounded-full ${
                reel.isSaved ? 'bg-green-500/80 hover:bg-green-500/90' : ''
              }`}
            >
              <Bookmark className={`w-4 h-4 ${reel.isSaved ? 'fill-white' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleShareReel(reel.id, e)}
              className="bg-black/50 text-white hover:bg-black/70 h-8 w-8 p-0 rounded-full"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  ), [handleOpenReel, handleLikeReel, handleSaveReel, handleShareReel, handleFollowUser, playingReel, formatViews]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="container-responsive mx-auto py-6 h-[calc(100vh-3.5rem)] overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-3">
              <Film className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reels</h1>
                <p className="text-gray-500 dark:text-gray-400">Short, entertaining videos from creators you love</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search reels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button onClick={handleCreateReel}>
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[140px] dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(val: string) => setSortBy(val)}>
                <SelectTrigger className="w-[140px] dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">
                    <div className="flex items-center">
                      <BarChart className="w-4 h-4 mr-2" />
                      <span>Most Popular</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="recent">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Most Recent</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="trending">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span>Trending</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="dark:border-gray-600">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-md">
              <TabsTrigger value="foryou">For You</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>

            {isLoading ? (
              // Loading skeleton
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="h-[400px] bg-gray-200 rounded-lg animate-pulse dark:bg-gray-700"></div>
                ))}
              </div>
            ) : (
              <>
                {/* For You tab */}
                <TabsContent value="foryou" className="mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <AnimatePresence>
                      {sortedReels.map(reel => renderReelCard(reel))}
                    </AnimatePresence>
                  </div>
                </TabsContent>
                
                {/* Following tab */}
                <TabsContent value="following" className="mt-6">
                  {followingReels.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {followingReels.map(reel => renderReelCard(reel))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                      <User className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">Follow creators to see their reels</h3>
                      <p className="text-gray-500 mb-6 dark:text-gray-400">
                        When you follow people, their reels will show up here
                      </p>
                      <Button onClick={() => setActiveTab('foryou')}>
                        Discover Creators
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* Trending tab */}
                <TabsContent value="trending" className="mt-6">
                  {trendingReels.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {trendingReels.map(reel => renderReelCard(reel))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No trending reels</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Check back later for trending content
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                {/* New tab */}
                <TabsContent value="new" className="mt-6">
                  {newReels.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {newReels.map(reel => renderReelCard(reel))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No new reels</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Check back later for new content
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                {/* Saved tab */}
                <TabsContent value="saved" className="mt-6">
                  {savedReelsList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {savedReelsList.map(reel => renderReelCard(reel))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                      <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No saved reels</h3>
                      <p className="text-gray-500 mb-4 dark:text-gray-400">
                        Reels you save will appear here
                      </p>
                      <Button onClick={() => setActiveTab('foryou')}>
                        Explore Reels
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </>
            )}
            
            {/* No results state */}
            {!isLoading && activeTab === 'foryou' && sortedReels.length === 0 && (
              <TabsContent value="foryou" className="mt-6">
                <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                  <Film className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No reels found</h3>
                  <p className="text-gray-500 mb-4 dark:text-gray-400">
                    {searchTerm ? `No results for "${searchTerm}"` : "We couldn't find any reels for you right now."}
                  </p>
                  {searchTerm && (
                    <Button variant="outline" onClick={() => setSearchTerm('')} className="dark:border-gray-600 dark:text-gray-200">
                      Clear Search
                    </Button>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      
      {/* Reels Viewer */}
      <ReelsViewer 
        isOpen={viewerOpen} 
        onClose={() => setViewerOpen(false)} 
      />
      
      {/* Stats/Categories section at bottom */}
      {!isLoading && sortedReels.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-10">
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium">{formatViews(reels.reduce((sum, r) => sum + r.views, 0))} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-xs font-medium">{formatViews(reels.reduce((sum, r) => sum + r.likes, 0))} likes</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium">{formatViews(reels.reduce((sum, r) => sum + r.comments, 0))} comments</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reels;