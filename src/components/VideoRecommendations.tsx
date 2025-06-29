import React, { useState, useEffect } from 'react';
import { Play, Clock, Eye, Bookmark, History, Zap, Plus, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/utils';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { toast } from 'sonner';

interface RecommendedVideo {
  id: string;
  title: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  thumbnail: string;
  duration: string;
  views: number;
  timestamp: string;
  category: string;
  isLive?: boolean;
  isPremium?: boolean;
  isShort?: boolean;
  watchProgress?: number;
}

interface VideoRecommendationsProps {
  currentVideoId: string;
  onVideoSelect: (videoId: string) => void;
}

interface WatchHistoryRecord {
  lastWatched: string;
  watchedSeconds: number;
  completionPercentage: number;
}

const VideoRecommendations: React.FC<VideoRecommendationsProps> = ({ 
  currentVideoId, 
  onVideoSelect 
}) => {
  const [recommendations, setRecommendations] = useState<RecommendedVideo[]>([
    {
      id: '2',
      title: 'Live: Tech Conference 2024 - Latest Innovations in AI and Machine Learning',
      creator: {
        name: 'Tech Today',
        avatar: MOCK_IMAGES.AVATARS[1],
        verified: true
      },
      thumbnail: MOCK_IMAGES.POSTS[1],
      duration: 'LIVE',
      views: 5400,
      timestamp: 'Started 30 min ago',
      category: 'Technology',
      isLive: true
    },
    {
      id: '3',
      title: 'Quick Pasta Recipe - 5 Minute Cooking',
      creator: {
        name: 'Chef Maria',
        avatar: getSafeImage('AVATARS', 2),
        verified: false
      },
      thumbnail: getSafeImage('POSTS', 2),
      duration: '5:23',
      views: 8900,
      timestamp: '1 day ago',
      category: 'Food',
      isShort: true
    },
    {
      id: '4',
      title: 'Mountain Hiking Adventure - Epic Trail Views',
      creator: {
        name: 'Adventure Seeker',
        avatar: getSafeImage('AVATARS', 3),
        verified: true
      },
      thumbnail: getSafeImage('POSTS', 3),
      duration: '12:45',
      views: 15600,
      timestamp: '3 days ago',
      category: 'Travel',
      isPremium: true
    },
    {
      id: '5',
      title: 'JavaScript Tips and Tricks for Beginners',
      creator: {
        name: 'Code Academy',
        avatar: getSafeImage('AVATARS', 4),
        verified: true
      },
      thumbnail: getSafeImage('POSTS', 4),
      duration: '18:30',
      views: 23400,
      timestamp: '1 week ago',
      category: 'Education'
    },
    {
      id: '6',
      title: 'Relaxing Piano Music for Study and Work',
      creator: {
        name: 'Peaceful Sounds',
        avatar: getSafeImage('AVATARS', 5),
        verified: false
      },
      thumbnail: getSafeImage('POSTS', 5),
      duration: '2:15:30',
      views: 45600,
      timestamp: '2 weeks ago',
      category: 'Music'
    },
    {
      id: '7',
      title: 'Morning Meditation for Beginners - Start Your Day Right',
      creator: {
        name: 'Mindful Living',
        avatar: getSafeImage('AVATARS', 6),
        verified: true
      },
      thumbnail: MOCK_IMAGES.POSTS[0],
      duration: '15:30',
      views: 42000,
      timestamp: '3 days ago',
      category: 'Health',
      watchProgress: 45
    },
    {
      id: '8',
      title: 'How to Build a React App from Scratch - Complete Tutorial',
      creator: {
        name: 'Code Master',
        avatar: getSafeImage('AVATARS', 7),
        verified: true
      },
      thumbnail: MOCK_IMAGES.POSTS[1],
      duration: '1:22:15',
      views: 189000,
      timestamp: '5 days ago',
      category: 'Technology',
      watchProgress: 75
    }
  ]);

  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [savedVideos, setSavedVideos] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [watchHistory, setWatchHistory] = useState<Record<string, WatchHistoryRecord>>({});

  // Load watch history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('watchHistory');
      if (savedHistory) {
        setWatchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading watch history:', error);
    }
  }, []);

  // Update videos with watch progress
  useEffect(() => {
    if (Object.keys(watchHistory).length > 0) {
      setRecommendations(prevVideos => 
        prevVideos.map(video => {
          const history = watchHistory[video.id];
          if (history) {
            return {
              ...video,
              watchProgress: history.completionPercentage
            };
          }
          return video;
        })
      );
    }
  }, [watchHistory]);

  // Filter out current video
  const filteredRecommendations = recommendations.filter(video => video.id !== currentVideoId);

  const handleVideoClick = (videoId: string) => {
    setIsLoading(true);
    onVideoSelect(videoId);
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

  const handleAddToPlaylist = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info('Add to playlist feature coming soon');
  };

  const handleNotInterested = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecommendations(prev => prev.filter(video => video.id !== videoId));
    toast.success('Video removed from recommendations');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Up next</h3>
      
      {isLoading ? (
        // Loading skeleton
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3">
                <div className="flex space-x-3">
                  <div className="bg-gray-300 w-40 h-24 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.map((video) => (
            <Card 
              key={video.id}
              className="cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => handleVideoClick(video.id)}
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <CardContent className="p-3">
                <div className="flex space-x-3">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-40 h-24 object-cover rounded-lg"
                    />
                    
                    {/* Watch progress */}
                    {video.watchProgress && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                        <div 
                          className="h-full bg-red-600" 
                          style={{ width: `${video.watchProgress}%` }}
                        ></div>
                      </div>
                    )}
                    
                    {/* Duration/Live Badge */}
                    <div className="absolute bottom-1 right-1">
                      <Badge 
                        variant={video.isLive ? 'destructive' : 'secondary'}
                        className={`text-xs ${video.isLive ? 'animate-pulse' : ''}`}
                      >
                        {video.isLive && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                        )}
                        {video.duration}
                      </Badge>
                    </div>

                    {/* Premium Badge */}
                    {video.isPremium && (
                      <div className="absolute top-1 left-1">
                        <Badge className="bg-yellow-500 text-black text-xs">
                          Premium
                        </Badge>
                      </div>
                    )}
                    
                    {/* Short Badge */}
                    {video.isShort && (
                      <div className="absolute top-1 left-1">
                        <Badge className="bg-purple-500 text-white text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Short
                        </Badge>
                      </div>
                    )}

                    {/* Play Overlay */}
                    {hoveredVideo === video.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-blue-600">
                      {video.title}
                    </h4>
                    
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-xs text-gray-600">{video.creator.name}</span>
                      {video.creator.verified && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatNumber(video.views)} views</span>
                      </div>
                      <span>•</span>
                      <span>{video.timestamp}</span>
                    </div>

                    <Badge variant="outline" className="text-xs">
                      {video.category}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleSave(video.id, e)}
                      className="h-8 w-8 p-0"
                    >
                      <Bookmark className={`w-4 h-4 ${savedVideos.has(video.id) ? 'fill-current text-green-600' : ''}`} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleAddToPlaylist(video.id, e)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleNotInterested(video.id, e)}
                      className="h-8 w-8 p-0"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          setIsLoading(true);
          setTimeout(() => {
            // Simulate loading more recommendations
            const newRecommendations = [...recommendations];
            // Shuffle the array to simulate new recommendations
            for (let i = newRecommendations.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [newRecommendations[i], newRecommendations[j]] = [newRecommendations[j], newRecommendations[i]];
            }
            // Add new IDs to make them unique
            const moreRecommendations = newRecommendations.slice(0, 3).map(video => ({
              ...video,
              id: `new-${video.id}-${Date.now()}`
            }));
            
            setRecommendations(prev => [...prev, ...moreRecommendations]);
            setIsLoading(false);
            toast.success('More recommendations loaded');
          }, 1000);
        }}
      >
        {isLoading ? 'Loading...' : 'Load more recommendations'}
      </Button>
      
      {/* Watch History Section */}
      {Object.keys(watchHistory).length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <History className="w-5 h-5 mr-2 text-blue-600" />
            Continue Watching
          </h3>
          
          <div className="space-y-4">
            {recommendations
              .filter(video => watchHistory[video.id] && watchHistory[video.id].completionPercentage < 95)
              .slice(0, 3)
              .map(video => (
                <Card 
                  key={`history-${video.id}`}
                  className="cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex space-x-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-40 h-24 object-cover rounded-lg"
                        />
                        
                        {/* Watch progress */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                          <div 
                            className="h-full bg-red-600" 
                            style={{ width: `${video.watchProgress || 0}%` }}
                          ></div>
                        </div>
                        
                        <div className="absolute bottom-1 right-1">
                          <Badge variant="secondary" className="text-xs">
                            {video.duration}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-blue-600">
                          {video.title}
                        </h4>
                        
                        <div className="flex items-center space-x-1 mb-1">
                          <span className="text-xs text-gray-600">{video.creator.name}</span>
                          {video.creator.verified && (
                            <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Continue watching ({video.watchProgress}%)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRecommendations;