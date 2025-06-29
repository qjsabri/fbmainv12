import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '@/components/VideoPlayer';
import VideoDetails from '@/components/VideoDetails';
import VideoComments from '@/components/VideoComments';
import VideoRecommendations from '@/components/VideoRecommendations';
import { MOCK_IMAGES } from '@/lib/constants';

import { useIsMobile } from '@/hooks/use-device';
import { toast } from 'sonner';

interface VideoData {
  id: string;
  title: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
    subscribers: string;
    isSubscribed: boolean;
  };
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  dislikes: number;
  timestamp: string;
  description: string;
  category: string;
  tags: string[];
  isLive?: boolean;
  commentsCount: number;
  watchHistory?: {
    lastWatched: string;
    watchedSeconds: number;
    completionPercentage: number;
  };
}

const VideoWatch = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  
  const [video, setVideo] = useState<VideoData>({
    id: videoId || '1',
    title: 'Amazing Sunset Timelapse from Mount Wilson Observatory',
    creator: {
      name: 'Nature Explorer',
      avatar: MOCK_IMAGES.AVATARS[0],
      verified: true,
      subscribers: '890K',
      isSubscribed: false
    },
    thumbnail: MOCK_IMAGES.POSTS[0],
    duration: '3:45',
    views: 125000,
    likes: 8900,
    dislikes: 234,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    description: `Watch this breathtaking sunset timelapse captured from Mount Wilson Observatory. This 4K footage showcases the natural beauty of the golden hour as the sun sets behind the mountains.

Shot with:
- Canon EOS R5
- 24-70mm f/2.8 lens
- Intervalometer for timelapse
- Neutral density filters

The location offers one of the best vantage points for sunset photography in Southern California. The clear mountain air and elevated position provide stunning views of the surrounding landscape.

Don't forget to like and subscribe for more nature content!

#sunset #timelapse #nature #photography #mountains #california #4k`,
    category: 'Nature',
    tags: ['sunset', 'timelapse', 'nature', 'photography', 'mountains', 'california', '4k'],
    commentsCount: 1247
  });

  const [isLoading, setIsLoading] = useState(true);
  const [watchTime, setWatchTime] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);


  // Simulate loading video data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Increment view count after a valid view (at least 5 seconds)
      const viewTimer = setTimeout(() => {
        if (watchTime > 5) {
          setVideo(prev => ({
            ...prev,
            views: prev.views + 1
          }));
          // View counted
        }
      }, 5000);
      
      return () => clearTimeout(viewTimer);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [watchTime]);

  // Track watch history
  useEffect(() => {
    if (watchTime > 0 && videoId) {
      // In a real app, this would save to a database
      const watchHistory = {
        videoId,
        lastWatched: new Date().toISOString(),
        watchedSeconds: watchTime,
        completionPercentage: Math.min(100, Math.round((watchTime / parseFloat(video.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0))) * 100))
      };
      
      // Watch history updated
      
      // Save to localStorage as an example
      const history = JSON.parse(localStorage.getItem('watchHistory') || '{}');
      history[videoId] = watchHistory;
      localStorage.setItem('watchHistory', JSON.stringify(history));
    }
  }, [watchTime, videoId, video.duration]);

  const handleLike = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    
    setVideo(prev => ({
      ...prev,
      likes: prev.likes + 1
    }));
    
    toast.success('Video liked');
  };

  const handleDislike = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    
    setVideo(prev => ({
      ...prev,
      dislikes: prev.dislikes + 1
    }));
    
    toast.info('Video disliked');
  };

  const handleSubscribe = () => {
    setVideo(prev => ({
      ...prev,
      creator: {
        ...prev.creator,
        isSubscribed: !prev.creator.isSubscribed
      }
    }));
    
    toast.success(video.creator.isSubscribed 
      ? `Unsubscribed from ${video.creator.name}` 
      : `Subscribed to ${video.creator.name}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Video link copied to clipboard');
  };

  const handleVideoSelect = (newVideoId: string) => {
    // Save current watch progress before navigating
    if (watchTime > 0 && videoId) {
      const history = JSON.parse(localStorage.getItem('watchHistory') || '{}');
      history[videoId] = {
        videoId,
        lastWatched: new Date().toISOString(),
        watchedSeconds: watchTime,
        completionPercentage: Math.min(100, Math.round((watchTime / parseFloat(video.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0))) * 100))
      };
      localStorage.setItem('watchHistory', JSON.stringify(history));
    }
    
    // Navigate to new video
    navigate(`/watch/${newVideoId}`);
    
    // Reset state for new video
    setWatchTime(0);
    setHasInteracted(false);
    setIsLoading(true);
    
    // Simulate loading new video
    setTimeout(() => {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 500);
  };

  const handleTimeUpdate = (currentTime: number) => {
    setWatchTime(currentTime);
  };

  const handleVideoEnded = () => {
    // Video ended
    toast.info('Video ended. Recommendations are shown below.');
    
    // In a real app, you might auto-play the next video
    // or show an end screen with recommendations
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-300 animate-pulse w-full h-[50vh] rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 animate-pulse rounded-lg w-3/4"></div>
                <div className="flex space-x-4">
                  <div className="h-10 w-10 bg-gray-300 animate-pulse rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-300 animate-pulse rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 animate-pulse rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="space-y-4">
                <div className="h-6 bg-gray-300 animate-pulse rounded w-1/2"></div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex space-x-2">
                    <div className="h-24 bg-gray-300 animate-pulse rounded w-40"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
                      <div className="h-4 bg-gray-300 animate-pulse rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 animate-pulse rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <VideoPlayer
                video={video}
                autoPlay={true}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
              />

              {/* Video Details */}
              <VideoDetails
                video={video}
                onLike={handleLike}
                onDislike={handleDislike}
                onSubscribe={handleSubscribe}
                onShare={handleShare}
              />

              {/* Comments */}
              <div id="video-comments">
                <VideoComments
                  videoId={video.id}
                  commentsCount={video.commentsCount}
                />
              </div>
            </div>

            {/* Sidebar - Recommendations */}
            <div className="lg:col-span-1">
              <VideoRecommendations
                currentVideoId={video.id}
                onVideoSelect={handleVideoSelect}
              />
            </div>
          </div>
        )}
        
        {/* Mobile Recommendations (shown below video on mobile) */}
        {isMobile && !isLoading && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Up next</h3>
            <VideoRecommendations
              currentVideoId={video.id}
              onVideoSelect={handleVideoSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoWatch;