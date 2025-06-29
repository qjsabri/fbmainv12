import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, MoreHorizontal, Heart, Reply, Flag, Pin, Filter, ChevronDown, ChevronUp, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatTimeAgo } from '@/lib/utils';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { toast } from 'sonner';

interface VideoComment {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
    isCreator?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: VideoComment[];
  isPinned?: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
  isHearted?: boolean;
}

interface VideoCommentsProps {
  videoId: string;
  commentsCount: number;
}

const VideoComments: React.FC<VideoCommentsProps> = ({ commentsCount }) => {
  const [comments, setComments] = useState<VideoComment[]>([
    {
      id: '1',
      user: {
        name: 'Sarah Johnson',
        avatar: MOCK_IMAGES.AVATARS[0],
        verified: true
      },
      content: 'This is absolutely amazing! The cinematography is breathtaking. How did you capture those aerial shots?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 234,
      dislikes: 3,
      replies: [
        {
          id: '1-1',
          user: {
            name: 'Nature Explorer',
            avatar: MOCK_IMAGES.AVATARS[1],
            isCreator: true
          },
          content: 'Thank you! I used a DJI drone for the aerial shots. The weather conditions were perfect that day!',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          likes: 89,
          dislikes: 0,
          replies: [],
          isHearted: true
        }
      ],
      isPinned: true
    },
    {
      id: '2',
      user: {
        name: 'Mike Chen',
        avatar: getSafeImage('AVATARS', 2)
      },
      content: 'First! Amazing content as always. Keep up the great work! 🔥',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      likes: 156,
      dislikes: 12,
      replies: []
    },
    {
      id: '3',
      user: {
        name: 'Emma Wilson',
        avatar: getSafeImage('AVATARS', 3),
        verified: true
      },
      content: 'I\'ve been following your channel for years and the quality just keeps getting better. This video is no exception - absolutely stunning work!',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      likes: 342,
      dislikes: 4,
      replies: [
        {
          id: '3-1',
          user: {
            name: 'Nature Explorer',
            avatar: MOCK_IMAGES.AVATARS[1],
            isCreator: true
          },
          content: 'Thank you so much for your continued support, Emma! It means a lot to me. I\'m always trying to improve with each video.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          likes: 67,
          dislikes: 0,
          replies: [],
          isHearted: true
        },
        {
          id: '3-2',
          user: {
            name: 'David Kim',
            avatar: getSafeImage('AVATARS', 4)
          },
          content: 'Totally agree! Been watching since the early days too.',
          timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
          likes: 23,
          dislikes: 0,
          replies: []
        }
      ]
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');
  const [showReplies, setShowReplies] = useState<Set<string>>(new Set(['1'])); // Show first comment replies by default
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCreator, setFilterCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Simulate loading comments
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (commentId: string, parentId?: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          isDisliked: false,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes
        };
      }
      if (parentId && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId 
              ? {
                  ...reply,
                  isLiked: !reply.isLiked,
                  isDisliked: false,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  dislikes: reply.isDisliked ? reply.dislikes - 1 : reply.dislikes
                }
              : reply
          )
        };
      }
      return comment;
    }));
    
    toast.success('Comment liked');
  };

  const handleDislike = (commentId: string, parentId?: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isDisliked: !comment.isDisliked,
          isLiked: false,
          dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes + 1,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes
        };
      }
      if (parentId && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId 
              ? {
                  ...reply,
                  isDisliked: !reply.isDisliked,
                  isLiked: false,
                  dislikes: reply.isDisliked ? reply.dislikes - 1 : reply.dislikes + 1,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes
                }
              : reply
          )
        };
      }
      return comment;
    }));
    
    toast.info('Comment disliked');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: VideoComment = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: getSafeImage('AVATARS', 7)
      },
      content: newComment + (selectedEmoji ? ` ${selectedEmoji}` : ''),
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isLiked: true
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setSelectedEmoji('');
    toast.success('Comment added');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const reply: VideoComment = {
      id: `${parentId}-${Date.now()}`,
      user: {
        name: 'You',
        avatar: MOCK_IMAGES.AVATARS[7]
      },
      content: replyText,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isLiked: true
    };

    setComments(prev => prev.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));

    setReplyText('');
    setReplyingTo(null);
    
    // Ensure replies are shown
    setShowReplies(prev => {
      const newSet = new Set(prev);
      newSet.add(parentId);
      return newSet;
    });
    
    toast.success('Reply added');
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handlePinComment = (commentId: string) => {
    setComments(prev => prev.map(comment => ({
      ...comment,
      isPinned: comment.id === commentId
    })));
    
    toast.success('Comment pinned');
  };

  const handleHeartComment = (commentId: string, parentId?: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isHearted: !comment.isHearted
        };
      }
      if (parentId && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId 
              ? {
                  ...reply,
                  isHearted: !reply.isHearted
                }
              : reply
          )
        };
      }
      return comment;
    }));
    
    toast.success('Comment hearted by creator');
  };

  const handleReportComment = (_commentId: string) => {
    toast.info('Comment reported. Thank you for your feedback.');
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
    
    // Focus back on input
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    if (sortBy === 'top') {
      return b.likes - a.likes;
    } else {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  // Filter comments if creator filter is enabled
  const filteredComments = filterCreator 
    ? sortedComments.filter(comment => 
        comment.user.isCreator || 
        comment.replies.some(reply => reply.user.isCreator)
      )
    : sortedComments;

  const renderComment = (comment: VideoComment, isReply = false, parentId?: string) => (
    <div key={comment.id} className={`${isReply ? 'ml-12' : ''} mb-4`}>
      <div className="flex space-x-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={comment.user.avatar} />
          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-sm">{comment.user.name}</span>
            {comment.user.verified && (
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            {comment.user.isCreator && (
              <Badge variant="secondary" className="text-xs">Creator</Badge>
            )}
            <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
            {comment.isPinned && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Pin className="w-3 h-3" />
                <span>Pinned</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-900 mb-2 break-words">{comment.content}</p>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(comment.id, isReply, parentId)}
                className={`h-8 px-2 ${comment.isLiked ? 'text-blue-600' : 'text-gray-600'}`}
              >
                <ThumbsUp className={`w-4 h-4 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{comment.likes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDislike(comment.id, isReply, parentId)}
                className={`h-8 px-2 ${comment.isDisliked ? 'text-red-600' : 'text-gray-600'}`}
              >
                <ThumbsDown className={`w-4 h-4 mr-1 ${comment.isDisliked ? 'fill-current' : ''}`} />
                <span className="text-xs">{comment.dislikes}</span>
              </Button>
            </div>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(comment.id)}
                className="h-8 px-2 text-gray-600"
              >
                <Reply className="w-4 h-4 mr-1" />
                <span className="text-xs">Reply</span>
              </Button>
            )}
            
            {comment.isHearted && (
              <div className="flex items-center space-x-1 text-red-500">
                <Heart className="w-4 h-4 fill-current" />
                <span className="text-xs">Creator</span>
              </div>
            )}
            
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  const menu = document.getElementById(`comment-menu-${comment.id}`);
                  if (menu) {
                    menu.classList.toggle('hidden');
                  }
                }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              
              <div 
                id={`comment-menu-${comment.id}`}
                className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 hidden"
              >
                <div className="py-1">
                  {!comment.isPinned && !isReply && (
                    <button 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => handlePinComment(comment.id)}
                    >
                      <Pin className="w-4 h-4 mr-2" />
                      Pin comment
                    </button>
                  )}
                  
                  {!comment.isHearted && (
                    <button 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleHeartComment(comment.id, isReply, parentId)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Heart comment
                    </button>
                  )}
                  
                  <button 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => handleReportComment(comment.id)}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report comment
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-3 flex space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={getSafeImage('AVATARS', 7)} />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex space-x-2">
                <Input
                  placeholder="Add a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  size="sm" 
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyText.trim()}
                >
                  Reply
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleReplies(comment.id)}
                className="text-blue-600 text-xs flex items-center"
              >
                {showReplies.has(comment.id) ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide {comment.replies.length} replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show {comment.replies.length} replies
                  </>
                )}
              </Button>
              
              {showReplies.has(comment.id) && (
                <div className="mt-2 space-y-3">
                  {comment.replies.map(reply => renderComment(reply, true, comment.id))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Common emojis for comments
  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '👏', '🎉', '🤔'];

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold">{commentsCount.toLocaleString()} Comments</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant={sortBy === 'top' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('top')}
              >
                Top comments
              </Button>
              <Button
                variant={sortBy === 'newest' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('newest')}
              >
                Newest first
              </Button>
              <Button
                variant={showFilters ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Filter comments</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterCreator ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCreator(!filterCreator)}
              >
                Creator comments
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Mentioned you filter coming soon')}
              >
                Mentioned you
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Questions filter coming soon')}
              >
                Questions
              </Button>
            </div>
          </div>
        )}
        
        {/* Add Comment */}
        <div className="flex space-x-3 mb-6">
          <Avatar className="w-10 h-10">
            <AvatarImage src={getSafeImage('AVATARS', 7)} />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex space-x-2">
            <div className="relative flex-1">
              <Input
                ref={commentInputRef}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-4 h-4 text-gray-500" />
              </Button>
              
              {showEmojiPicker && (
                <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-lg p-2 z-10">
                  <div className="grid grid-cols-5 gap-1">
                    {commonEmojis.map(emoji => (
                      <button
                        key={emoji}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                        onClick={() => handleEmojiSelect(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Comment
            </Button>
          </div>
        </div>
        
        {/* Comments List */}
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredComments.length > 0 ? (
          <div className="space-y-4">
            {filteredComments.map(comment => renderComment(comment))}
            
            {/* Load More Comments */}
            {filteredComments.length < commentsCount && (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    // Generate some new mock comments
                    const newComments: VideoComment[] = [
                      {
                        id: `new-${Date.now()}-1`,
                        user: {
                          name: 'Alex Rodriguez',
                          avatar: getSafeImage('AVATARS', 5)
                        },
                        content: 'Just discovered your channel and I\'m binge watching all your videos! Amazing content!',
                        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                        likes: 45,
                        dislikes: 1,
                        replies: []
                      },
                      {
                        id: `new-${Date.now()}-2`,
                        user: {
                          name: 'Jessica Park',
                          avatar: getSafeImage('AVATARS', 6),
                          verified: true
                        },
                        content: 'The editing on this video is top-notch. What software do you use?',
                        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
                        likes: 78,
                        dislikes: 0,
                        replies: []
                      }
                    ];
                    
                    setComments(prev => [...prev, ...newComments]);
                    setIsLoading(false);
                    toast.success('More comments loaded');
                  }, 1000);
                }}
              >
                Load more comments
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoComments;