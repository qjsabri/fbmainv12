import React, { useState } from 'react';
import { Heart, Share, Filter, Search, Bookmark, List, Users, Plus, TrendingUp, Zap, Grid, Calendar, Play } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { formatNumber, formatTimeAgo } from '@/lib/utils';
import WatchTogether from '@/components/WatchTogether';

interface Video {
  id: string;
  title: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
    isFollowing: boolean;
    subscribers: string;
  };
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  timestamp: string;
  isLive?: boolean;
  category: string;
  description: string;
  isTrending?: boolean;
  isShort?: boolean;
  isPremium?: boolean;
}

const Watch = () => {
  const navigate = useNavigate();
  
  const [videos] = useState<Video[]>([
    {
      id: '1',
      title: 'Amazing Sunset Timelapse from Mount Wilson Observatory',
      creator: {
        name: 'Nature Explorer',
        avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face',
        verified: true,
        isFollowing: false,
        subscribers: '890K'
      },
      thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
      duration: '3:45',
      views: 125000,
      likes: 8900,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category: 'Nature',
      description: 'Watch this breathtaking sunset timelapse captured from Mount Wilson Observatory.',
      isTrending: true
    },
    {
      id: '2',
      title: 'Live: Tech Conference 2024 - Latest Innovations',
      creator: {
        name: 'Tech Today',
        avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face',
        verified: true,
        isFollowing: true,
        subscribers: '2.5M'
      },
      thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
      duration: 'LIVE',
      views: 5400,
      likes: 234,
      timestamp: 'Started 30 min ago',
      isLive: true,
      category: 'Technology',
      description: 'Join us live for the biggest tech conference of 2024!'
    },
    {
      id: '3',
      title: 'Quick Pasta Recipe',
      creator: {
        name: 'Chef Maria',
        avatar: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop&crop=face',
        verified: false,
        isFollowing: false,
        subscribers: '156K'
      },
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
      duration: '0:45',
      views: 8900,
      likes: 567,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Food',
      description: 'Quick 45-second pasta recipe!',
      isShort: true
    },
    {
      id: '4',
      title: 'Advanced Photography Masterclass',
      creator: {
        name: 'Pro Photographer',
        avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop&crop=face',
        verified: true,
        isFollowing: false,
        subscribers: '1.2M'
      },
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
      duration: '45:20',
      views: 67000,
      likes: 3400,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Education',
      description: 'Learn advanced photography techniques from a professional.',
      isPremium: true
    }
  ]);

  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [savedVideos, setSavedVideos] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isWatchTogetherOpen, setIsWatchTogetherOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const categories = ['All', 'Technology', 'Nature', 'Food', 'Music', 'Gaming', 'Sports', 'Education', 'Health'];

  const handleVideoClick = (videoId: string) => {
    setSelectedVideoId(videoId);
    navigate(`/watch/${videoId}`);
  };

  const handleChannelClick = (creatorName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const channelId = creatorName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/channel/${channelId}`);
  };

  const handleLike = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = new Set(likedVideos);
    
    if (likedVideos.has(videoId)) {
      newLiked.delete(videoId);
      toast.success('Removed from liked videos');
    } else {
      newLiked.add(videoId);
      toast.success('Added to liked videos');
    }
    setLikedVideos(newLiked);
  };

  const handleSave = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSaved = new Set(savedVideos);
    
    if (savedVideos.has(videoId)) {
      newSaved.delete(videoId);
      toast.success('Removed from saved videos');
    } else {
      newSaved.add(videoId);
      toast.success('Saved to watch later');
    }
    setSavedVideos(newSaved);
  };

  const handleFollow = (creatorName: string, videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`Subscribed to ${creatorName}`);
  };

  const handleShare = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/watch/${videoId}`);
    toast.success('Video link copied to clipboard');
  };
  
  const handleWatchTogether = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVideoId(videoId);
    setIsWatchTogetherOpen(true);
  };

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      case 'newest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      default:
        return 0;
    }
  });

  const liveVideos = videos.filter(v => v.isLive);
  const trendingVideos = videos.filter(v => v.isTrending);
  const shortsVideos = videos.filter(v => v.isShort);

  const renderVideoCard = (video: Video) => (
    <Card 
      key={video.id} 
      className="cursor-pointer hover:shadow-md transition-all duration-200 group"
      onClick={() => handleVideoClick(video.id)}
      onMouseEnter={() => setPlayingVideo(video.id)}
      onMouseLeave={() => setPlayingVideo(null)}
    >
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Live indicator */}
        {video.isLive && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-500 text-white animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
              LIVE
            </Badge>
          </div>
        )}
        
        {video.isTrending && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-red-500 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              TRENDING
            </Badge>
          </div>
        )}
        
        {video.isShort && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-purple-500 text-white">
              <Zap className="w-3 h-3 mr-1" />
              SHORTS
            </Badge>
          </div>
        )}

        {video.isPremium && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-500 text-black">
              Premium
            </Badge>
          </div>
        )}

        {/* Play overlay */}
        {playingVideo === video.id && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <Play className="w-8 h-8 text-white" />
          </div>
        )}

        {/* Duration */}
        <div className="absolute bottom-2 right-2">
          <Badge 
            variant={video.isLive ? 'destructive' : video.isShort ? 'secondary' : 'secondary'}
            className={video.isLive ? 'animate-pulse' : ''}
          >
            {video.duration}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Creator info */}
        <div className="flex items-start space-x-3 mb-3">
          <Avatar 
            className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={(e) => handleChannelClick(video.creator.name, e)}
          >
            <AvatarImage src={video.creator.avatar} />
            <AvatarFallback>{video.creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors dark:text-white">
              {video.title}
            </h3>
            <div className="flex items-center space-x-1 mt-1">
              <p 
                className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors dark:text-gray-300 dark:hover:text-blue-400"
                onClick={(e) => handleChannelClick(video.creator.name, e)}
              >
                {video.creator.name}
              </p>
              {video.creator.verified && (
                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1 dark:text-gray-400">
              <span>{formatNumber(video.views)} views</span>
              <span>•</span>
              <span>{video.timestamp.includes('ago') ? video.timestamp : formatTimeAgo(video.timestamp)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 dark:text-gray-400">{video.description}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleLike(video.id, e)}
              className={`flex items-center space-x-1 ${
                likedVideos.has(video.id) ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${likedVideos.has(video.id) ? 'fill-current' : ''}`} />
              <span className="text-sm">{video.likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleSave(video.id, e)}
              className={`flex items-center space-x-1 ${
                savedVideos.has(video.id) ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${savedVideos.has(video.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleShare(video.id, e)}
              className="text-gray-600 hover:text-green-600"
            >
              <Share className="w-4 h-4" />
            </Button>
                    
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleWatchTogether(video.id, e)}
              className="text-gray-600 hover:text-purple-600"
            >
              <Users className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toast.info('More options');
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Subscribe button for non-following creators */}
        {!video.creator.isFollowing && (
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              onClick={(e) => handleFollow(video.creator.name, video.id, e)}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Subscribe
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab list */}
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Home</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger value="shorts" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Shorts</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Live</span>
            </TabsTrigger>
          </TabsList>

          {/* Home tab */}
          <TabsContent value="home" className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Watch</h1>
                  <p className="text-gray-600 dark:text-gray-300">Discover videos from creators you follow and explore new content</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive" className="animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                    {liveVideos.length} LIVE
                  </Badge>
                  <Badge variant="secondary">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {trendingVideos.length} Trending
                  </Badge>
                  <Badge variant="outline">
                    <Zap className="w-3 h-3 mr-1" />
                    {shortsVideos.length} Shorts
                  </Badge>
                </div>
              </div>

              {/* Search and filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search videos, creators, or topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px] dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                      <SelectItem value="likes">Most Liked</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="dark:border-gray-600"
                  >
                    {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Filter options"
                    className="dark:border-gray-600"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Category filters */}
            <div className="flex space-x-2 overflow-x-auto scrollbar-thin">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap dark:border-gray-600"
                >
                  {category}
                  {category !== 'All' && videos.filter(v => v.category === category).length > 0 && (
                    <span className="ml-1 text-xs">
                      ({videos.filter(v => v.category === category).length})
                    </span>
                  )}
                </Button>
              ))}
            </div>

            {/* Videos grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {sortedVideos.map(renderVideoCard)}
            </div>

            {/* Empty state */}
            {sortedVideos.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No videos found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? `No results for "${searchQuery}"` : 'Try selecting a different category or check back later.'}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                    className="mt-4 dark:border-gray-600 dark:text-gray-200"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Other tabs with similar structure */}
          <TabsContent value="trending" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-4 flex items-center dark:text-white">
                <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                Trending Videos
              </h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {trendingVideos.map(renderVideoCard)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shorts" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-4 flex items-center dark:text-white">
                <Zap className="w-5 h-5 mr-2 text-purple-500" />
                Shorts
              </h2>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {shortsVideos.map(renderVideoCard)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-4 flex items-center dark:text-white">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Your Subscriptions
              </h2>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No subscriptions yet</h3>
                <p className="text-gray-500 mb-6 dark:text-gray-400">Subscribe to creators to see their latest videos here</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Discover Creators
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="live" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-4 flex items-center dark:text-white">
                <Calendar className="w-5 h-5 mr-2 text-red-500" />
                Live Now
              </h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {liveVideos.map(renderVideoCard)}
              </div>
              {liveVideos.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No live streams</h3>
                  <p className="text-gray-500 dark:text-gray-400">Check back later for live content from your favorite creators</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    
    {/* Watch Together Modal */}
    <WatchTogether 
      videoId={selectedVideoId || undefined}
      isOpen={isWatchTogetherOpen}
      onClose={() => setIsWatchTogetherOpen(false)}
    />
  );
};

// MoreHorizontal icon component
const MoreHorizontal = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

export default Watch;