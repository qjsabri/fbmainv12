import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Pause, Volume2, VolumeX, Film, Users, Send, UserPlus, Share, Copy, Check, VideoOff, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';

interface WatchTogetherProps {
  videoId?: string;
  roomId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking?: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: Date;
}

const WatchTogether: React.FC<WatchTogetherProps> = ({
  videoId = '1',
  roomId,
  isOpen = false,
  onClose
}) => {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'user-1',
      name: 'You (Host)',
      avatar: getSafeImage('AVATARS', 7),
      isHost: true,
      isMuted: false,
      isVideoOn: true,
      isSpeaking: false
    },
    {
      id: 'user-2',
      name: 'Sarah Johnson',
      avatar: MOCK_IMAGES.AVATARS[0],
      isHost: false,
      isMuted: true,
      isVideoOn: false,
      isSpeaking: false
    },
    {
      id: 'user-3',
      name: 'Mike Chen',
      avatar: MOCK_IMAGES.AVATARS[1],
      isHost: false,
      isMuted: false,
      isVideoOn: true,
      isSpeaking: true
    }
  ]);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [sessionId] = useState(roomId || `watch-${Date.now().toString(36)}`);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate receiving chat messages
    const chatInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const participant = participants.find(p => p.id !== 'user-1');
        if (participant) {
          const messages = [
            "This part is so good!",
            "Wait, did you see that?",
            "I can't believe this scene, wow!",
            "I've watched this 5 times already",
            "The soundtrack is amazing",
            "Who's your favorite character?",
            "This reminds me of that other movie we watched",
            "Let's watch the sequel next time"
          ];
          
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          
          const newChatMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: participant.id,
            senderName: participant.name,
            senderAvatar: participant.avatar,
            message: randomMessage,
            timestamp: new Date()
          };
          
          setChatMessages(prev => [...prev, newChatMessage]);
          
          // Update speaking status
          setParticipants(prev => prev.map(p => 
            p.id === participant.id 
              ? { ...p, isSpeaking: true }
              : p.isSpeaking ? { ...p, isSpeaking: false } : p
          ));
          
          // Reset speaking after a delay
          setTimeout(() => {
            setParticipants(prev => prev.map(p => 
              p.id === participant.id ? { ...p, isSpeaking: false } : p
            ));
          }, 2000);
        }
      }
    }, 8000);
    
    return () => clearInterval(chatInterval);
  }, [participants]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Auto-hide controls
  useEffect(() => {
    const hideControls = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    if (isOpen) {
      hideControls();
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isOpen, isPlaying, showControls]);

  useEffect(() => {
    // Set up video element event listeners
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(video.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-1',
      senderName: 'You',
      senderAvatar: getSafeImage('AVATARS', 7),
      message: newMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleCopyInvite = () => {
    const inviteUrl = `${window.location.origin}/watch-together/${sessionId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopySuccess(true);
    toast.success('Invite link copied to clipboard');
    
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  const handleInviteFriends = () => {
    setIsInviteModalOpen(true);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="w-5 h-5" />
              <span>Watch Together</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                <Users className="w-3 h-3 mr-1" />
                {participants.length} Watching
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Room: {sessionId.slice(0, 8)}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[75vh]">
          {/* Video Player */}
          <div className="lg:col-span-2 relative bg-black" onMouseMove={handleMouseMove}>
            <video
              ref={videoRef}
              src={`https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`}
              className="w-full h-full"
              onClick={handlePlay}
              autoPlay
              muted={isMuted}
            />
            
            {/* Video Controls */}
            {showControls && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                {/* Progress Bar */}
                <div 
                  ref={progressBarRef}
                  className="w-full h-2 bg-white/30 rounded-full mb-3 cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleInviteFriends}
                      className="text-white hover:bg-white/20"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      <span className="text-sm">Invite</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info('Share feature coming soon')}
                      className="text-white hover:bg-white/20"
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Play Indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            )}
          </div>
          
          {/* Participants and Chat */}
          <div className="flex flex-col h-full bg-white dark:bg-gray-800">
            {/* Participants */}
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="font-semibold mb-3 dark:text-white">Participants ({participants.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                {participants.map((participant) => (
                  <div 
                    key={participant.id} 
                    className={`flex flex-col items-center p-2 rounded-lg ${
                      participant.isSpeaking ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {participant.isHost && (
                        <Badge className="absolute -top-1 -right-1 px-1 min-w-0 h-4 bg-blue-500">
                          <Crown className="w-3 h-3 text-white" />
                        </Badge>
                      )}
                      {participant.isSpeaking && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                          <Volume2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs mt-2 font-medium text-center line-clamp-1 dark:text-gray-200">
                      {participant.name.replace(' (Host)', '')}
                      {participant.isHost && ' 👑'}
                    </p>
                    <div className="flex space-x-1 mt-1">
                      {participant.isMuted && (
                        <Badge variant="outline" className="px-1 min-w-0 h-5 dark:border-gray-600">
                          <VolumeX className="w-3 h-3 text-red-500" />
                        </Badge>
                      )}
                      {!participant.isVideoOn && (
                        <Badge variant="outline" className="px-1 min-w-0 h-5 dark:border-gray-600">
                          <VideoOff className="w-3 h-3 text-red-500" />
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {chatMessages.length > 0 ? (
                  chatMessages.map((message) => (
                    <div key={message.id} className="flex space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={message.senderAvatar} />
                        <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium dark:text-white">{message.senderName}</p>
                          <p className="text-xs text-gray-500 ml-2 dark:text-gray-400">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <p className="text-sm dark:text-gray-200">{message.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400">Chat messages will appear here</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t dark:border-gray-700">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Invite Friends Modal */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Friends to Watch</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Invite Link</label>
              <div className="flex space-x-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/watch-together/${sessionId}`}
                  className="bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyInvite}
                  className="dark:border-gray-600"
                >
                  {copySuccess ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                Share this link with friends to watch together
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-200">Or select friends</label>
              {['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Kim', 'Lisa Wang'].map((name, index) => (
                <div key={name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={MOCK_IMAGES.AVATARS[index % MOCK_IMAGES.AVATARS.length]} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="dark:text-gray-200">{name}</span>
                  </div>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      toast.success(`Invite sent to ${name}`);
                    }}
                    className="dark:text-gray-200"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button onClick={() => setIsInviteModalOpen(false)} className="w-full mt-2">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

// Icon components
const VideoOff = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8" />
    <path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10Z" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const Crown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2" />
  </svg>
);

const MessageSquare = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default WatchTogether;