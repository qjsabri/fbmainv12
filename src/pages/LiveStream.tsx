import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Video, VideoOff, Mic, MicOff, Users, Heart, MessageCircle, Share, Settings, X } from 'lucide-react';
import { MOCK_IMAGES } from '@/lib/constants';
import { toast } from 'sonner';
import { formatNumber } from '@/lib/utils';

interface LiveComment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  message: string;
  timestamp: Date;
}

interface LiveViewer {
  id: string;
  name: string;
  avatar: string;
}

const LiveStream = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [viewers, setViewers] = useState<LiveViewer[]>([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [streamQuality, setStreamQuality] = useState('720p');
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);

  // Mock data for viewers
  const mockViewers: LiveViewer[] = useMemo(() => [
    { id: '1', name: 'Sarah Johnson', avatar: MOCK_IMAGES.AVATARS[0] },
    { id: '2', name: 'Mike Chen', avatar: MOCK_IMAGES.AVATARS[1] },
    { id: '3', name: 'Emily Davis', avatar: MOCK_IMAGES.AVATARS[2] },
    { id: '4', name: 'Alex Wilson', avatar: MOCK_IMAGES.AVATARS[3] },
    { id: '5', name: 'Lisa Brown', avatar: MOCK_IMAGES.AVATARS[4] }
  ], []);

  useEffect(() => {
    if (isStreaming) {
      const addRandomComment = () => {
        const randomViewer = mockViewers[Math.floor(Math.random() * mockViewers.length)];
        const randomMessages = [
          'Great stream! 👍',
          'Love this content!',
          'Keep it up!',
          'Amazing! 🔥',
          'This is so cool!',
          'Thanks for sharing!',
          'Awesome work!'
        ];
        
        const newComment: LiveComment = {
          id: Date.now().toString(),
          user: randomViewer,
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date()
        };
        
        setComments(prev => [...prev, newComment]);
      };

      // Simulate viewer count changes
      const interval = setInterval(() => {
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 10) - 5;
          return Math.max(0, prev + change);
        });
      }, 3000);

      // Simulate random comments
      const commentInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          addRandomComment();
        }
      }, 5000);

      return () => {
        clearInterval(interval);
        clearInterval(commentInterval);
      };
    }
  }, [isStreaming, mockViewers]);

  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [comments]);

  const startStream = async () => {
    if (!streamTitle.trim()) {
      toast.error('Please enter a stream title');
      return;
    }

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsStreaming(true);
      setViewerCount(Math.floor(Math.random() * 50) + 10);
      setViewers(mockViewers.slice(0, 3));
      toast.success('Live stream started!');
    } catch (error) {
      console.error('Failed to access camera/microphone:', error);
      toast.error('Failed to access camera/microphone');
    }
  };

  const stopStream = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    setIsStreaming(false);
    setViewerCount(0);
    setViewers([]);
    setComments([]);
    toast.info('Live stream ended');
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
      }
    }
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    
    const comment: LiveComment = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: MOCK_IMAGES.AVATARS[0]
      },
      message: newComment,
      timestamp: new Date()
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
    toast.success('❤️ Liked!');
  };

  if (!isStreaming) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-6 h-6 text-red-500" />
              Start Live Stream
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Stream Title</label>
              <Input
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="What's your stream about?"
                maxLength={100}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <Textarea
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                placeholder="Tell viewers what to expect..."
                rows={3}
                maxLength={500}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant={isVideoEnabled ? "default" : "outline"}
                onClick={toggleVideo}
                className="flex items-center gap-2"
              >
                {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                {isVideoEnabled ? 'Video On' : 'Video Off'}
              </Button>
              
              <Button
                variant={isAudioEnabled ? "default" : "outline"}
                onClick={toggleAudio}
                className="flex items-center gap-2"
              >
                {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                {isAudioEnabled ? 'Audio On' : 'Audio Off'}
              </Button>
            </div>
            
            <Button onClick={startStream} className="w-full bg-red-500 hover:bg-red-600">
              <Video className="w-4 h-4 mr-2" />
              Go Live
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stream Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="destructive" className="animate-pulse">
                    🔴 LIVE
                  </Badge>
                  <span className="font-semibold">{streamTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={stopStream}
                  >
                    <X className="w-4 h-4" />
                    End Stream
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full aspect-video object-cover"
                />
                
                {/* Stream Controls Overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Button
                    variant={isVideoEnabled ? "default" : "destructive"}
                    size="sm"
                    onClick={toggleVideo}
                  >
                    {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant={isAudioEnabled ? "default" : "destructive"}
                    size="sm"
                    onClick={toggleAudio}
                  >
                    {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                </div>
                
                {/* Viewer Count */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{formatNumber(viewerCount)}</span>
                </div>
              </div>
              
              {/* Stream Stats */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={handleLike} className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {formatNumber(likes)}
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share className="w-4 h-4" />
                    Share
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Quality: {streamQuality}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Chat and Viewers Sidebar */}
        <div className="space-y-4">
          {/* Live Chat */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={commentsRef}
                className="h-64 overflow-y-auto space-y-2 mb-4 border rounded-lg p-2"
              >
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback className="text-xs">
                        {comment.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-blue-600">
                        {comment.user.name}
                      </div>
                      <div className="text-sm break-words">
                        {comment.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Say something..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                />
                <Button onClick={handleSendComment} size="sm">
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Current Viewers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Viewers ({viewerCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {viewers.map((viewer) => (
                  <div key={viewer.id} className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={viewer.avatar} />
                      <AvatarFallback className="text-xs">
                        {viewer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{viewer.name}</span>
                  </div>
                ))}
                {viewerCount > 3 && (
                  <div className="text-xs text-gray-500 mt-2">
                    +{viewerCount - 3} more viewers
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stream Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Stream Quality</label>
              <select
                value={streamQuality}
                onChange={(e) => setStreamQuality(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="480p">480p</option>
                <option value="720p">720p (Recommended)</option>
                <option value="1080p">1080p</option>
              </select>
            </div>
            <Button onClick={() => setShowSettings(false)} className="w-full">
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveStream;