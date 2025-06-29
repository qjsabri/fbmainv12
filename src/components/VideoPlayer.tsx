import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Heart, MessageCircle, Share, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  video: {
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
    likes: number;
    timestamp: string;
    description: string;
  };
  autoPlay?: boolean;
  showControls?: boolean;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

interface WatchHistoryRecord {
  lastWatched: string;
  watchedSeconds: number;
  completionPercentage: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  video, 
  autoPlay = false, 
  showControls = true,
  onTimeUpdate,
  onEnded
}) => {
  // All hooks must be called before any early returns
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(autoPlay);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControlsOverlay, setShowControlsOverlay] = useState(false);
  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showPlaybackOptions, setShowPlaybackOptions] = useState(false);
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [isSubtitlesEnabled, setIsSubtitlesEnabled] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isPipMode, setIsPipMode] = useState(false);
  const [showHotkeys, setShowHotkeys] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Get a consistent video source based on video ID using useMemo for better performance
  const videoSource = useMemo(() => {
    // Enhanced safety check for video prop
    if (!video || typeof video !== 'object' || !video.id) {
      return 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    }
    
    const numericId = video.id.replace(/\D/g, '') || '0';
    const videoId = parseInt(numericId) || 0;
    
    // Define video sources
    const sources = [
      'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    ];
    
    // Ensure sources array is not empty and videoId is valid
    if (!sources || sources.length === 0) {
      return 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    }
    
    // Additional safety check for videoId
    const safeVideoId = typeof videoId === 'number' && !isNaN(videoId) ? videoId : 0;
    const index = safeVideoId % sources.length;
    
    return sources[index] || sources[0];
  }, [video]);

  // Check for watch history
  useEffect(() => {
    if (!video || typeof video !== 'object' || !video.id || !videoRef.current) return;

    const videoElement = videoRef.current;
    const watchHistory = storage.get<Record<string, WatchHistoryRecord>>(STORAGE_KEYS.WATCH_HISTORY, {});
    const videoHistory = watchHistory[video.id];

    if (videoHistory && videoHistory.watchedSeconds > 0) {
      videoElement.currentTime = videoHistory.watchedSeconds;
    }
  }, [video]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateTime = () => {
      setCurrentTime(videoElement.currentTime);
      onTimeUpdate?.(videoElement.currentTime);
      
      // Save watch progress
      const watchHistory = storage.get<Record<string, WatchHistoryRecord>>(STORAGE_KEYS.WATCH_HISTORY, {});
      if (video && typeof video === 'object' && video.id) {
        watchHistory[video.id] = {
        lastWatched: new Date().toISOString(),
          watchedSeconds: videoElement.currentTime,
          completionPercentage: Math.min(100, Math.round((videoElement.currentTime / videoElement.duration) * 100))
        };
        storage.set(STORAGE_KEYS.WATCH_HISTORY, watchHistory);
      }
    };
    
    const updateDuration = () => setDuration(videoElement.duration);
    
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    // Add play and pause event listeners to sync state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('timeupdate', updateTime);
    videoElement.addEventListener('loadedmetadata', updateDuration);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    // Set initial muted state
    videoElement.muted = isMuted;
    videoElement.loop = isLooping;

    // Auto play if specified
    if (autoPlay) {
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Auto-play was prevented:', error);
        });
      }
    }

    return () => {
      videoElement.removeEventListener('timeupdate', updateTime);
      videoElement.removeEventListener('loadedmetadata', updateDuration);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [autoPlay, onTimeUpdate, onEnded, isMuted, isLooping, video]);

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      // setIsFullscreen(!!document.fullscreenElement); // This line is removed as _isFullscreen is unused
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (showControlsOverlay && !showPlaybackOptions && !showQualityOptions) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControlsOverlay(false);
        }
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControlsOverlay, isPlaying, showPlaybackOptions, showQualityOptions]);

  // Define callback functions before useEffect
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Play was prevented:', error);
        });
      }
    } else {
      video.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      setVolume(video.volume);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, [isMuted, videoRef]);

  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, [playerRef]);

  const togglePictureInPicture = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPipMode(false);
      } else {
        await videoRef.current.requestPictureInPicture();
        setIsPipMode(true);
      }
    } catch (error) {
      console.error('Picture-in-Picture failed:', error);
      toast.error('Picture-in-Picture mode is not supported in your browser');
    }
  }, [videoRef]);

  const seekVideo = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
    video.currentTime = newTime;
  }, [videoRef]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case ' ': // Space
          togglePlay();
          e.preventDefault();
          break;
        case 'k':
          togglePlay();
          e.preventDefault();
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'ArrowRight':
          seekVideo(10);
          break;
        case 'ArrowLeft':
          seekVideo(-10);
          break;
        case 'ArrowUp':
          if (videoRef.current) {
            const newVolume = Math.min(1, volume + 0.1);
            setVolume(newVolume);
            videoRef.current.volume = newVolume;
            setIsMuted(false);
          }
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (videoRef.current) {
            const newVolume = Math.max(0, volume - 0.1);
            setVolume(newVolume);
            videoRef.current.volume = newVolume;
            if (newVolume === 0) setIsMuted(true);
          }
          e.preventDefault();
          break;
        case 't':
          setIsTheaterMode(!isTheaterMode);
          break;
        case 'i':
          togglePictureInPicture();
          break;
        case 'c':
          setIsSubtitlesEnabled(!isSubtitlesEnabled);
          break;
        case 'l':
          setIsLooping(!isLooping);
          if (videoRef.current) {
            videoRef.current.loop = !isLooping;
          }
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          if (videoRef.current && duration) {
            const percent = parseInt(e.key) * 10;
            videoRef.current.currentTime = (percent / 100) * duration;
          }
          break;
        case '?':
          setShowHotkeys(true);
          setTimeout(() => setShowHotkeys(false), 5000);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [volume, isTheaterMode, isSubtitlesEnabled, isLooping, duration, toggleMute, togglePlay, seekVideo, toggleFullscreen, togglePictureInPicture]);

  // Early return if video prop is invalid - moved after all hooks
  if (!video || typeof video !== 'object' || !video.id || !video.title || !video.creator) {
    return (
      <Card className="overflow-hidden bg-black dark:bg-black">
        <div className="flex items-center justify-center h-64 text-white">
          <p>Video data is not available</p>
        </div>
      </Card>
    );
  }

  const handleVolumeChange = (value: number[]) => {
    if (!value || !Array.isArray(value) || value.length === 0) return;
    
    const newVolume = value[0];
    if (typeof newVolume !== 'number' || isNaN(newVolume)) return;
    
    setVolume(newVolume);
    
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed like' : 'Added like');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Video link copied to clipboard');
  };



  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowPlaybackOptions(false);
    toast.success(`Playback speed: ${rate}x`);
  };

  const changeQuality = (quality: string) => {
    setSelectedQuality(quality);
    setShowQualityOptions(false);
    toast.success(`Quality changed to ${quality}`);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className={`overflow-hidden bg-black dark:bg-black ${isTheaterMode ? 'max-w-full' : ''}`}>
      <div 
        ref={playerRef}
        className="relative group"
        onMouseEnter={() => setShowControlsOverlay(true)}
        onMouseLeave={() => {
          if (isPlaying && !showPlaybackOptions && !showQualityOptions) {
            setShowControlsOverlay(false);
          }
        }}
        onMouseMove={() => {
          setShowControlsOverlay(true);
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
          }
          
          if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
              if (!showPlaybackOptions && !showQualityOptions) {
                setShowControlsOverlay(false);
              }
            }, 3000);
          }
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-auto max-h-[70vh] object-contain bg-black"
          poster={video?.thumbnail}
          muted={isMuted}
          onClick={togglePlay}
          playsInline
        >
          <source src={videoSource} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="w-16 h-16 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Hotkeys Help Overlay */}
        <AnimatePresence>
          {showHotkeys && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={() => setShowHotkeys(false)}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md">
                <h3 className="font-bold text-lg mb-4 dark:text-white">Keyboard Shortcuts</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-sm dark:text-gray-200">
                    <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">Space</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">k</kbd> - Play/Pause
                  </div>
                  <div className="text-sm dark:text-gray-200">
                    <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">m</kbd> - Mute/Unmute
                  </div>
                  <div className="text-sm dark:text-gray-200">
                    <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">f</kbd> - Fullscreen
                  </div>
                  <div className="text-sm dark:text-gray-200">
                    <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">t</kbd> - Theater mode
                  </div>
                  <div className="text-sm dark:text-gray-200">
                    <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">i</kbd> - Picture-in-Picture
                  </div>
                  <div className="text-sm dark:text-gray-200">
                    <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">c</kbd> - Subtitles
                  </div>
                  <div className="text-sm dark:text-gray-200">
                    <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">←</kbd> / <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">→</kbd> - Seek ±10s
                  </div>
                  <div className="text-sm dark:text-gray-200">
                    <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">↑</kbd> / <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">↓</kbd> - Volume ±10%
                  </div>
                  <div className="text-sm dark:text-gray-200">
                    <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">l</kbd> - Loop video
                  </div>
                  <div className="text-sm dark:text-gray-200">
                    <kbd className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-700">0-9</kbd> - Seek to 0-90%
                  </div>
                </div>
                <p className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400">Click anywhere to close</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play/Pause Overlay */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            showControlsOverlay || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={togglePlay}
        >
          <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </div>

        {/* Skip Forward/Backward Overlay */}
        <div className="absolute inset-0 flex items-center justify-between px-12 pointer-events-none">
          <Button
            variant="ghost"
            size="lg"
            className="text-white bg-black/30 hover:bg-black/50 rounded-full h-12 w-12 p-0 pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              seekVideo(-10);
              toast.info('Rewound 10 seconds');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m11 17-5-5 5-5" />
              <path d="m18 17-5-5 5-5" />
            </svg>
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="text-white bg-black/30 hover:bg-black/50 rounded-full h-12 w-12 p-0 pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              seekVideo(10);
              toast.info('Skipped 10 seconds');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m13 17 5-5-5-5" />
              <path d="m6 17 5-5-5-5" />
            </svg>
          </Button>
        </div>

        {/* Controls Overlay */}
        {showControls && (
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity ${
            showControlsOverlay ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Progress Bar */}
            <div 
              ref={progressBarRef}
              className="w-full h-2 bg-white/30 rounded-full mb-3 cursor-pointer"
              onClick={handleProgressBarClick}
            >
              <div 
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    seekVideo(-10);
                  }}
                  className="text-white hover:bg-white/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m11 17-5-5 5-5" />
                    <path d="m18 17-5-5 5-5" />
                  </svg>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    seekVideo(10);
                  }}
                  className="text-white hover:bg-white/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m13 17 5-5-5-5" />
                    <path d="m6 17 5-5-5-5" />
                  </svg>
                </Button>
                
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    onMouseEnter={() => setIsVolumeSliderVisible(true)}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  
                  {isVolumeSliderVisible && (
                    <div 
                      className="absolute bottom-full left-0 mb-2 p-2 bg-black/80 rounded-md w-32"
                      onMouseEnter={() => setIsVolumeSliderVisible(true)}
                      onMouseLeave={() => setIsVolumeSliderVisible(false)}
                    >
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSubtitlesEnabled(!isSubtitlesEnabled)}
                  className={`text-white hover:bg-white/20 ${isSubtitlesEnabled ? 'bg-white/20' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 13h4" />
                    <path d="M15 13h2" />
                    <path d="M7 9h2" />
                    <path d="M13 9h4" />
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
                  </svg>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePictureInPicture}
                  className={`text-white hover:bg-white/20 ${isPipMode ? 'bg-white/20' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="13" width="10" height="7" rx="2" />
                    <rect x="12" y="4" width="10" height="7" rx="2" />
                  </svg>
                </Button>
                
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPlaybackOptions(!showPlaybackOptions)}
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  
                  {showPlaybackOptions && (
                    <div className="absolute bottom-full right-0 mb-2 p-2 bg-black/80 rounded-md w-40">
                      <div className="text-white text-xs mb-2">Playback Speed</div>
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                        <Button
                          key={rate}
                          variant="ghost"
                          size="sm"
                          onClick={() => changePlaybackRate(rate)}
                          className={`w-full text-left text-white hover:bg-white/20 ${
                            playbackRate === rate ? 'bg-white/20' : ''
                          }`}
                        >
                          {rate === 1 ? 'Normal' : `${rate}x`}
                        </Button>
                      ))}
                      
                      <div className="border-t border-white/20 mt-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowPlaybackOptions(false);
                            setShowQualityOptions(true);
                          }}
                          className="w-full text-left text-white hover:bg-white/20 flex justify-between items-center"
                        >
                          <span>Quality</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {showQualityOptions && (
                    <div className="absolute bottom-full right-0 mb-2 p-2 bg-black/80 rounded-md w-40">
                      <div className="flex items-center mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowQualityOptions(false);
                            setShowPlaybackOptions(true);
                          }}
                          className="p-0 h-6 w-6 mr-2 text-white"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-white text-xs">Quality</span>
                      </div>
                      
                      {['auto', '1080p', '720p', '480p', '360p', '240p'].map((quality) => (
                        <Button
                          key={quality}
                          variant="ghost"
                          size="sm"
                          onClick={() => changeQuality(quality)}
                          className={`w-full text-left text-white hover:bg-white/20 ${
                            selectedQuality === quality ? 'bg-white/20' : ''
                          }`}
                        >
                          {quality}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  className={`text-white hover:bg-white/20 ${isTheaterMode ? 'bg-white/20' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6" />
                    <path d="M9 21H3v-6" />
                    <path d="m21 3-7 7" />
                    <path d="m3 21 7-7" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <CardContent className="p-4 bg-white dark:bg-gray-800">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={video?.creator?.avatar} />
            <AvatarFallback>{video?.creator?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-2 dark:text-gray-100">{video?.title}</h3>
            <div className="flex items-center space-x-1 mt-1">
              <p className="text-sm text-gray-600 dark:text-gray-300">{video?.creator?.name}</p>
              {video?.creator?.verified && (
                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
              {video?.views?.toLocaleString()} views • {video?.timestamp}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked ? 'text-red-600 dark:text-red-400' : 'text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{video?.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              onClick={() => {
                const commentsSection = document.getElementById('video-comments');
                if (commentsSection) {
                  commentsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Comment</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
              onClick={handleShare}
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLooping(!isLooping)}
              className={`text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 ${
                isLooping ? 'text-blue-600 dark:text-blue-400' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLooping ? 'fill-current' : ''}>
                <path d="M17 2l4 4-4 4" />
                <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                <path d="M7 22l-4-4 4-4" />
                <path d="M21 13v1a4 4 0 0 1-4 4H3" />
              </svg>
            </Button>
            
            <Badge variant="outline" className="text-xs dark:border-gray-600">
              {video?.duration}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;