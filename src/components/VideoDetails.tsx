import React, { useState, useRef } from 'react';
import { ThumbsUp, ThumbsDown, Share, Download, Flag, Scissors, Bell, BellOff, ChevronDown, ChevronUp, Clock, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber, formatTimeAgo } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VideoDetailsProps {
  video: {
    id: string;
    title: string;
    creator: {
      name: string;
      avatar: string;
      verified: boolean;
      subscribers: string;
      isSubscribed: boolean;
    };
    views: number;
    likes: number;
    dislikes: number;
    timestamp: string;
    description: string;
    category: string;
    tags: string[];
  };
  onLike: () => void;
  onDislike: () => void;
  onSubscribe: () => void;
  _onShare: () => void;
}

const VideoDetails: React.FC<VideoDetailsProps> = ({
  video,
  onLike,
  onDislike,
  onSubscribe,
  _onShare
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
    onLike();
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
    onDislike();
  };

  const handleSubscribe = () => {
    onSubscribe();
    if (!video.creator.isSubscribed) {
      setIsNotificationEnabled(true);
    }
  };

  const handleNotificationToggle = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
    toast.success(isNotificationEnabled 
      ? `Notifications turned off for ${video.creator.name}` 
      : `Notifications turned on for ${video.creator.name}`);
  };

  const handleDownload = () => {
    toast.success('Video download started');
  };

  const handleClip = () => {
    toast.info('Create clip feature coming soon');
  };

  const handleReport = () => {
    setIsReportDialogOpen(true);
  };

  const submitReport = () => {
    if (!reportReason) {
      toast.error('Please select a reason for reporting');
      return;
    }
    
    toast.success('Report submitted. Thank you for your feedback.');
    setIsReportDialogOpen(false);
    setReportReason('');
  };

  const handleCopyLink = () => {
    if (linkInputRef.current) {
      linkInputRef.current.select();
      document.execCommand('copy');
      setCopiedLink(true);
      toast.success('Link copied to clipboard');
      
      setTimeout(() => {
        setCopiedLink(false);
      }, 3000);
    }
  };

  const handleSharePlatform = (platform: string) => {
    const url = window.location.href;
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(video.title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(video.title + ' ' + url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(video.title)}&body=${encodeURIComponent('Check out this video: ' + url)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
    
    toast.success(`Shared on ${platform}`);
    setIsShareDialogOpen(false);
  };

  const truncatedDescription = video.description.length > 200 && !showFullDescription
    ? video.description.substring(0, 200) + '...'
    : video.description;

  return (
    <div className="space-y-4">
      {/* Video Title */}
      <h1 className="text-xl font-bold text-gray-900 leading-tight">
        {video.title}
      </h1>

      {/* Video Stats and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{formatNumber(video.views)} views</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatTimeAgo(video.timestamp)}</span>
          </div>
          <Badge variant="outline">{video.category}</Badge>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {/* Like/Dislike */}
          <div className="flex items-center bg-gray-100 rounded-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`rounded-l-full ${isLiked ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <ThumbsUp className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              <span>{formatNumber(video.likes + (isLiked ? 1 : 0))}</span>
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              className={`rounded-r-full ${isDisliked ? 'text-red-600' : 'text-gray-600'}`}
            >
              <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Share */}
          <Button variant="outline" size="sm" onClick={() => setIsShareDialogOpen(true)}>
            <Share className="w-4 h-4 mr-1" />
            Share
          </Button>

          {/* Download */}
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>

          {/* Clip */}
          <Button variant="outline" size="sm" onClick={handleClip}>
            <Scissors className="w-4 h-4 mr-1" />
            Clip
          </Button>

          {/* Report */}
          <Button variant="outline" size="sm" onClick={handleReport}>
            <Flag className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Creator Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={video.creator.avatar} />
              <AvatarFallback>{video.creator.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900">{video.creator.name}</h3>
                {video.creator.verified && (
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {video.creator.subscribers} subscribers
              </p>

              {/* Description */}
              <div className="text-sm text-gray-700">
                <p className="mb-2 whitespace-pre-line">
                  {truncatedDescription}
                </p>
                {video.description.length > 200 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="p-0 h-auto text-blue-600 flex items-center"
                  >
                    {showFullDescription ? (
                      <>
                        Show less <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Show more <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Tags */}
              {video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {video.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Subscribe Button */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSubscribe}
                variant={video.creator.isSubscribed ? "outline" : "default"}
                className={video.creator.isSubscribed ? "bg-gray-100" : "bg-red-600 hover:bg-red-700"}
              >
                {video.creator.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>

              {video.creator.isSubscribed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNotificationToggle}
                  className={isNotificationEnabled ? "bg-gray-100" : ""}
                >
                  {isNotificationEnabled ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Video</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                ref={linkInputRef}
                type="text"
                value={window.location.href}
                readOnly
                className="w-full p-2 pr-20 border rounded-md text-sm"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1"
                onClick={handleCopyLink}
              >
                {copiedLink ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center space-y-1 h-auto py-3"
                onClick={() => handleSharePlatform('facebook')}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">f</span>
                </div>
                <span className="text-xs">Facebook</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center space-y-1 h-auto py-3"
                onClick={() => handleSharePlatform('twitter')}
              >
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">t</span>
                </div>
                <span className="text-xs">Twitter</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center space-y-1 h-auto py-3"
                onClick={() => handleSharePlatform('whatsapp')}
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">w</span>
                </div>
                <span className="text-xs">WhatsApp</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center space-y-1 h-auto py-3"
                onClick={() => handleSharePlatform('email')}
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">@</span>
                </div>
                <span className="text-xs">Email</span>
              </Button>
            </div>
            
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const startTime = Math.floor(Math.random() * 100);
                  const shareUrl = `${window.location.href}?t=${startTime}`;
                  navigator.clipboard.writeText(shareUrl);
                  toast.success('Link with timestamp copied');
                  setIsShareDialogOpen(false);
                }}
              >
                <Clock className="w-4 h-4 mr-2" />
                Share at current time
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Video</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please select a reason for reporting this video. Your report will be reviewed by our team.
            </p>
            
            <div className="space-y-2">
              {[
                'Sexual content',
                'Violent or repulsive content',
                'Hateful or abusive content',
                'Harassment or bullying',
                'Harmful or dangerous acts',
                'Misinformation',
                'Child abuse',
                'Promotes terrorism',
                'Spam or misleading',
                'Infringes my rights',
                'Other'
              ].map(reason => (
                <div 
                  key={reason}
                  className={`p-3 border rounded-md cursor-pointer ${
                    reportReason === reason ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setReportReason(reason)}
                >
                  <p className="text-sm">{reason}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsReportDialogOpen(false);
                  setReportReason('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={submitReport}>
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoDetails;