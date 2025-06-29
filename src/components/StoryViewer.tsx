import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Share, SendHorizonal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Story {
  id: string;
  user: {
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  media: string;
  type: 'photo' | 'video' | 'text';
  timestamp: string;
  background?: string;
  isViewed?: boolean;
  expiresAt: string;
  privacy?: 'public' | 'friends' | 'close-friends';
  reactions?: { [key: string]: number };
}

interface StoryViewerProps {
  stories: Story[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onReact?: (storyId: string, reaction: string) => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onReact
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [activeReactions, setActiveReactions] = useState<string[]>([]);
  const [showReactions, setShowReactions] = useState(false);

  const currentStory = stories[currentIndex];
  const storyDuration = currentStory?.type === 'video' ? 30000 : 7000; // 30s for video, 7s for others
  
  // Available reactions
  const reactions = ['❤️', '👍', '😮', '😢', '😂', '😡'];

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
    setIsPaused(false);
    setShowReactions(false);
  }, [currentIndex, isOpen]);

  // Handle story progress and auto-navigation
  useEffect(() => {
    if (!isOpen || isPaused || !currentStory) return;
    
    const interval = 100; // Update every 100ms
    const increment = (interval / storyDuration) * 100;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          
          // Auto-navigate to next story
          if (currentIndex < stories.length - 1) {
            onNavigate(currentIndex + 1);
          } else {
            onClose();
          }
          return 0;
        }
        return prev + increment;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [currentIndex, isOpen, isPaused, stories.length, storyDuration, onNavigate, onClose, currentStory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          if (currentIndex > 0) onNavigate(currentIndex - 1);
          break;
        case 'ArrowRight':
          if (currentIndex < stories.length - 1) onNavigate(currentIndex + 1);
          else onClose();
          break;
        case 'Escape':
          onClose();
          break;
        case ' ': // Spacebar
          setIsPaused(!isPaused);
          e.preventDefault();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, stories.length, onNavigate, onClose, isPaused]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onNavigate, onClose]);

  const handleReaction = (reaction: string) => {
    if (!currentStory) return;
    
    if (activeReactions.includes(reaction)) {
      setActiveReactions(activeReactions.filter(r => r !== reaction));
    } else {
      setActiveReactions([...activeReactions, reaction]);
    }
    
    if (onReact) {
      onReact(currentStory.id, reaction);
      toast.success(`Reacted with ${reaction}`);
    }
    
    setShowReactions(false);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !currentStory) return;
    
    toast.success(`Reply sent to ${currentStory.user.name}`);
    setReplyText('');
  };

  const handleShare = () => {
    if (!currentStory) return;
    
    navigator.clipboard.writeText(`Check out ${currentStory.user.name}'s story!`);
    toast.success('Story link copied to clipboard');
  };

  if (!isOpen || !currentStory) return null;

  // Calculate time remaining until expiry
  const getTimeRemaining = () => {
    const expiryDate = new Date(currentStory.expiresAt);
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) return `${diffHours}h remaining`;
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes}m remaining`;
  };

  const getPrivacyBadgeColor = (privacy?: string) => {
    switch(privacy) {
      case 'public': return 'bg-green-500';
      case 'friends': return 'bg-blue-500';
      case 'close-friends': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 bg-black h-[90vh] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">Story Viewer</DialogTitle>
        </DialogHeader>
        <div className="relative h-full flex flex-col">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 p-2 flex space-x-1">
            {stories.map((_, index) => (
              <div key={index} className="h-1 bg-white/30 rounded-full flex-1">
                {index === currentIndex ? (
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  ></div>
                ) : index < currentIndex ? (
                  <div className="h-full bg-white rounded-full w-full"></div>
                ) : null}
              </div>
            ))}
          </div>
          
          {/* Content */}
          <div 
            className="flex-1 flex items-center justify-center"
            onClick={() => setIsPaused(!isPaused)}
          >
            {currentStory.type === 'text' ? (
              <div 
                className={`w-full h-full ${currentStory.background || 'bg-gradient-to-br from-purple-500 to-pink-500'} flex items-center justify-center p-6`}
              >
                <p className="text-white text-xl font-medium text-center">
                  {currentStory.content}
                </p>
              </div>
            ) : currentStory.type === 'video' ? (
              <video
                src={currentStory.media}
                className="max-w-full max-h-full object-contain"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={currentStory.media}
                alt={currentStory.content}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
          
          {/* Navigation */}
          <div className="absolute inset-y-0 left-0 flex items-center z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              disabled={currentIndex === 0}
              className="text-white bg-black/20 hover:bg-black/40 h-10 w-10 rounded-full ml-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute inset-y-0 right-0 flex items-center z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              disabled={currentIndex === stories.length - 1}
              className="text-white bg-black/20 hover:bg-black/40 h-10 w-10 rounded-full mr-2"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Header */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 mt-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={currentStory.user.avatar} />
                <AvatarFallback>{currentStory.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-1">
                  <p className="text-white font-medium">{currentStory.user.name}</p>
                  {currentStory.user.isVerified && (
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-white/70 text-xs">{currentStory.timestamp}</p>
                  <span className="text-white/70 text-xs">•</span>
                  <p className="text-white/70 text-xs">{getTimeRemaining()}</p>
                  
                  {/* Privacy indicator */}
                  {currentStory.privacy && (
                    <>
                      <span className="text-white/70 text-xs">•</span>
                      <Badge className={`${getPrivacyBadgeColor(currentStory.privacy)} text-white text-xs`}>
                        {currentStory.privacy === 'close-friends' ? 'Close Friends' : 
                         currentStory.privacy === 'friends' ? 'Friends' : 'Public'}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Reactions */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReactions(!showReactions);
                  setIsPaused(true);
                }}
                className="bg-black/30 text-white hover:bg-black/50 h-10 w-10 rounded-full p-0"
              >
                <Heart className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="bg-black/30 text-white hover:bg-black/50 h-10 w-10 rounded-full p-0"
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Reaction selector */}
          {showReactions && (
            <div className="absolute top-1/2 right-16 transform -translate-y-1/2 bg-black/60 rounded-full p-2 z-10">
              <div className="flex space-x-1">
                {reactions.map(reaction => (
                  <Button
                    key={reaction}
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReaction(reaction);
                    }}
                    className={`h-8 w-8 p-0 rounded-full ${
                      activeReactions.includes(reaction) ? 'bg-white/30' : 'hover:bg-white/20'
                    }`}
                  >
                    {reaction}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Reply Input */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-2">
            <Input
              placeholder={`Reply to ${currentStory.user.name}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(true);
              }}
              className="bg-white/20 border-0 text-white placeholder:text-white/70 focus-visible:ring-white/50"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleSendReply();
              }}
              disabled={!replyText.trim()}
              className="bg-white/20 text-white hover:bg-white/30 h-10 w-10 rounded-full"
            >
              <SendHorizonal className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Pause indicator */}
          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="text-white text-sm bg-black/60 px-3 py-1 rounded-full">Paused</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryViewer;