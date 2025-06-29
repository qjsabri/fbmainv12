import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Heart, MessageCircle, Mic, Monitor, Send, Settings, Share, Users, Video, VideoOff, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MOCK_IMAGES } from '@/lib/constants';

interface LiveStreamProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveStream: React.FC<LiveStreamProps> = ({ isOpen, onClose }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamCategory, setStreamCategory] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [comments, setComments] = useState<Array<{id: string, user: string, message: string, avatar: string, timestamp: string}>>([]);
  const [newComment, setNewComment] = useState('');
  const [reactions, setReactions] = useState({ hearts: 0, likes: 0, shares: 0 });
  const [streamQuality, setStreamQuality] = useState('720p');
  const [streamDevice, setStreamDevice] = useState('camera');
  const [streamDuration, setStreamDuration] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject && !fallbackMode) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (fallbackMode && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
    }
  }, [fallbackMode]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraError(null);
      setFallbackMode(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access camera. Please check permissions.");
      setCameraError("Could not access camera. Please check permissions.");
      // Fallback to a pre-recorded video
      if (videoRef.current) {
        videoRef.current.src = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        videoRef.current.loop = true;
        videoRef.current.muted = true;
        videoRef.current.play().catch(e => console.warn("Couldn't play fallback video", e));
        setFallbackMode(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen && isStreaming) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, isStreaming, startCamera, stopCamera]);

  useEffect(() => {
    if (isStreaming) {
      // Start duration timer
      durationTimerRef.current = setInterval(() => {
        setStreamDuration(prev => prev + 1);
      }, 1000);
      
      // Simulate viewers joining
      const interval = setInterval(() => {
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 5) - 2; // -2 to 2
          return Math.max(0, prev + change);
        });
      }, 3000);
      
      // Simulate comments
      const commentInterval = setInterval(() => {
        if (Math.random() > 0.6) {
          const randomComments = [
            "Great stream! 🔥",
            "Hello from New York!",
            "Love the content!",
            "First time watching, this is awesome",
            "Can you show us more?",
            "Amazing quality!",
            "Thanks for going live!",
            "This is so cool!",
            "Keep up the great work!",
            "Greetings from California!"
          ];
          
          const randomNames = [
            "Sarah", "Mike", "Emma", "David", "Lisa", "Alex", "Jessica", "Robert", "Maria", "John"
          ];
          
          const comment = {
            id: Date.now().toString(),
            user: randomNames[Math.floor(Math.random() * randomNames.length)],
            message: randomComments[Math.floor(Math.random() * randomComments.length)],
            avatar: MOCK_IMAGES.AVATARS[Math.floor(Math.random() * MOCK_IMAGES.AVATARS.length)],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setComments(prev => [...prev, comment]);
        }
      }, 5000);
      
      // Simulate reactions
      const reactionInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          setReactions(prev => ({
            ...prev,
            hearts: prev.hearts + Math.floor(Math.random() * 3) + 1,
            likes: prev.likes + Math.floor(Math.random() * 2),
            shares: prev.shares + (Math.random() > 0.8 ? 1 : 0)
          }));
        }
      }, 2000);
      
      return () => {
        if (durationTimerRef.current) {
          clearInterval(durationTimerRef.current);
        }
        clearInterval(interval);
        clearInterval(commentInterval);
        clearInterval(reactionInterval);
      };
    }
  }, [isStreaming]);

  // Auto-scroll comments
  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [comments]);

  // Video play/pause handlers
  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);
  
  const handleVideoPause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours > 0 ? hours.toString().padStart(2, '0') : null,
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const startStream = () => {
    if (!streamTitle.trim()) {
      toast.error('Please enter a stream title');
      return;
    }
    
    setIsStreaming(true);
    setStreamDuration(0);
    setViewerCount(Math.floor(Math.random() * 20) + 5);
    setComments([]);
    setReactions({ hearts: 0, likes: 0, shares: 0 });
    toast.success('You are now live! 🔴');
  };

  const endStream = () => {
    setIsStreaming(false);
    setViewerCount(0);
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }
    stopCamera();
    toast.info('Stream ended. Thanks for watching!');
    onClose();
  };

  const toggleVideo = () => {
    if (fallbackMode) {
      toast.info("Camera access is unavailable in demo mode");
      return;
    }
    
    setIsVideoEnabled(!isVideoEnabled);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
      }
    }
  };

  const toggleAudio = () => {
    if (fallbackMode) {
      toast.info("Microphone access is unavailable in demo mode");
      return;
    }
    
    setIsAudioEnabled(!isAudioEnabled);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
      }
    }
  };

  const sendComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      user: 'You',
      message: newComment,
      avatar: MOCK_IMAGES.AVATARS[0],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleReaction = (type: 'heart' | 'like' | 'share') => {
    setReactions(prev => ({
      ...prev,
      [type === 'heart' ? 'hearts' : type === 'like' ? 'likes' : 'shares']: prev[type === 'heart' ? 'hearts' : type === 'like' ? 'likes' : 'shares'] + 1
    }));
    
    if (type === 'share') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Stream link copied to clipboard!');
    }
  };

  const categories = [
    'Just Chatting', 'Gaming', 'Music', 'Art', 'Cooking', 'Fitness', 
    'Education', 'Technology', 'Travel', 'Lifestyle', 'Business', 'Other'
  ];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span>{isStreaming ? 'Live Streaming' : 'Go Live'}</span>
              {isStreaming && (
                <Badge variant="destructive" className="animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                  LIVE
                </Badge>
              )}
            </div>
            {isStreaming && (
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{viewerCount} viewers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>Duration: </span>
                  <span className="font-mono">{formatDuration(streamDuration)}</span>
                </div>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[75vh]">
          {/* Video Preview/Stream */}
          <div className="lg:col-span-2 relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            
            {cameraError && (
              <div className="absolute top-4 left-4 right-4 bg-blue-500 text-white p-2 rounded-md text-sm">
                {cameraError}
              </div>
            )}
            
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoOff className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">Camera is off</p>
                </div>
              </div>
            )}

            {/* Stream Info Overlay */}
            {isStreaming && (
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
                <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{viewerCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{reactions.hearts}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stream Title Overlay */}
            {isStreaming && streamTitle && (
              <div className="absolute bottom-20 left-4 right-4">
                <div className="bg-black/70 text-white p-3 rounded-lg">
                  <h3 className="font-semibold">{streamTitle}</h3>
                  {streamDescription && (
                    <p className="text-sm opacity-90 mt-1">{streamDescription}</p>
                  )}
                </div>
              </div>
            )}

            {/* Stream Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant={isVideoEnabled ? "secondary" : "destructive"}
                  size="sm"
                  onClick={toggleVideo}
                  className="bg-black/70 hover:bg-black/90"
                >
                  {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant={isAudioEnabled ? "secondary" : "destructive"}
                  size="sm"
                  onClick={toggleAudio}
                  className="bg-black/70 hover:bg-black/90"
                >
                  {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                
                {isStreaming && (
                  <div className="flex items-center space-x-2 bg-black/70 px-3 py-1 rounded text-white text-sm">
                    <Monitor className="w-3 h-3" />
                    <span>{streamQuality}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm" className="bg-black/70 hover:bg-black/90">
                  <Settings className="w-4 h-4" />
                </Button>
                {isStreaming ? (
                  <Button variant="destructive" onClick={endStream}>
                    End Stream
                  </Button>
                ) : (
                  <Button onClick={startStream} disabled={!streamTitle.trim()}>
                    Go Live
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Stream Setup & Chat */}
          <div className="flex flex-col h-full">
            {!isStreaming ? (
              /* Stream Setup */
              <Card className="flex-1 overflow-y-auto">
                <CardHeader>
                  <DialogTitle className="text-base">Stream Setup</DialogTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Stream Title *</label>
                    <Input
                      placeholder="What's your stream about?"
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">{streamTitle.length}/100</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea 
                      placeholder="Tell viewers what your stream is about..."
                      value={streamDescription}
                      onChange={(e) => setStreamDescription(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">{streamDescription.length}/500</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Select value={streamCategory} onValueChange={setStreamCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Privacy</label>
                    <Select value={privacy} onValueChange={setPrivacy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Friends</SelectItem>
                        <SelectItem value="private">Only Me</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Quality</label>
                      <Select value={streamQuality} onValueChange={setStreamQuality}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1080p">1080p HD</SelectItem>
                          <SelectItem value="720p">720p</SelectItem>
                          <SelectItem value="480p">480p</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Source</label>
                      <Select value={streamDevice} onValueChange={setStreamDevice}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="camera">
                            <div className="flex items-center space-x-2">
                              <Camera className="w-4 h-4" />
                              <span>Camera</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="screen">
                            <div className="flex items-center space-x-2">
                              <Monitor className="w-4 h-4" />
                              <span>Screen</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg dark:bg-blue-900/20">
                    <h4 className="font-medium text-sm mb-1 dark:text-blue-100">Live Streaming Tips</h4>
                    <ul className="text-xs text-gray-600 space-y-1 dark:text-blue-200">
                      <li>• Ensure good lighting and stable internet</li>
                      <li>• Interact with your viewers regularly</li>
                      <li>• Keep your content engaging and authentic</li>
                      <li>• Test your setup before going live</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Live Chat & Reactions */
              <>
                <Card className="flex-1 flex flex-col">
                  <CardHeader className="py-3">
                    <DialogTitle className="text-base flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>Live Chat</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span>{reactions.hearts}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>👍</span>
                          <span>{reactions.likes}</span>
                        </div>
                      </div>
                    </DialogTitle>
                  </CardHeader>
                  <CardContent className="p-3 flex-1 flex flex-col">
                    <div 
                      ref={commentsRef}
                      className="flex-1 overflow-y-auto space-y-2 border rounded p-2 mb-3 max-h-64 dark:border-gray-700"
                    >
                      {comments.length === 0 ? (
                        <p className="text-center text-gray-500 text-sm py-4 dark:text-gray-400">
                          Comments will appear here when viewers start chatting
                        </p>
                      ) : (
                        <AnimatePresence>
                          {comments.map((comment) => (
                            <motion.div 
                              key={comment.id} 
                              className="flex items-start space-x-2"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                            >
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={comment.avatar} />
                                <AvatarFallback className="text-xs">{comment.user.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-xs">{comment.user}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                                </div>
                                <p className="text-sm break-words">{comment.message}</p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Say something..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendComment()}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={sendComment} disabled={!newComment.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Stream Actions */}
                <Card className="mt-3">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleReaction('heart')}
                        className="flex flex-col items-center space-y-1 h-auto py-2 dark:border-gray-700"
                      >
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-xs">React</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleReaction('like')}
                        className="flex flex-col items-center space-y-1 h-auto py-2 dark:border-gray-700"
                      >
                        <span className="text-lg">👍</span>
                        <span className="text-xs">Like</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleReaction('share')}
                        className="flex flex-col items-center space-y-1 h-auto py-2 dark:border-gray-700"
                      >
                        <Share className="w-4 h-4" />
                        <span className="text-xs">Share</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiveStream;