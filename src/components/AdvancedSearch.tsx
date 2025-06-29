import React, { useState, useRef, useCallback, memo } from 'react';
import { MessageCircle, Share, MoreHorizontal, ThumbsUp, Bookmark } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatTimeAgo } from '@/lib/utils';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { OptimizedImage } from '@/components/ui/image';
import { motion, AnimatePresence } from 'framer-motion';

// Memoize formatTimeAgo to avoid unnecessary recalculations
import { memoize } from '@/lib/utils';
const memoizedFormatTimeAgo = memoize(formatTimeAgo);

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  } | null;
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
  reactions?: Record<string, number>;
  feeling?: string;
  location?: string;
  tagged_friends?: string[];
  privacy?: string;
  is_live?: boolean;
  isPoll?: boolean;
  pollOptions?: string[];
  pollVotes?: Record<string, number>;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name?: string;
    avatar_url?: string;
  } | null;
}

interface PostCardProps {
  post: Post;
}

const PostCard = memo<PostCardProps>(({ post }) => {
  // Early return if post is undefined or null
  if (!post) {
    return null;
  }

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(post.user_has_liked || false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  const [userPollVote, setUserPollVote] = useState<number | null>(null);
  const [pollVotes, setPollVotes] = useState<Record<string, number>>(
    post.pollOptions?.slice(1)?.reduce((acc, _, index) => {
      acc[index] = post.pollVotes?.[index] || Math.floor(Math.random() * 50);
      return acc;
    }, {} as Record<string, number>) || {}
  );
  
  const likeButtonRef = useRef<HTMLButtonElement>(null);

  // Check if post is saved
  React.useEffect(() => {
    if (post.id) {
      const savedPosts = storage.get<string[]>(STORAGE_KEYS.SAVED_POSTS, []);
      if (savedPosts.includes(post.id)) {
        setIsSaved(true);
      }
    }
  }, [post]);

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    
    toast.success(isLiked ? 'Post unliked' : 'Post liked');
  }, [isLiked]);

  const handleSave = useCallback(() => {
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);
    
    // Update saved posts in storage
    const savedPosts = storage.get<string[]>(STORAGE_KEYS.SAVED_POSTS, []);
    if (newIsSaved) {
      savedPosts.push(post.id);
    } else {
      const index = savedPosts.indexOf(post.id);
      if (index !== -1) {
        savedPosts.splice(index, 1);
      }
    }
    storage.set(STORAGE_KEYS.SAVED_POSTS, savedPosts);
    
    toast.success(isSaved ? 'Post removed from saved' : 'Post saved');
  }, [isSaved, post.id]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.profiles?.full_name || 'Unknown'}`,
        text: post.content || '',
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
        navigator.clipboard.writeText(window.location.href);
        toast.success('Post link copied to clipboard');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Post link copied to clipboard');
    }
  }, [post?.profiles?.full_name, post?.content]);

  const handleSubmitComment = useCallback(() => {
    if (!newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      content: newComment,
      created_at: new Date().toISOString(),
      profiles: {
        full_name: 'You',
        avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=400&h=400&fit=crop&crop=face'
      }
    };
    
    setComments(prev => [...prev, newCommentObj]);
    setNewComment('');
    toast.success('Comment added');
  }, [newComment]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  }, [handleSubmitComment]);

  const handleVote = useCallback((optionIndex: number) => {
    if (userPollVote !== null) {
      toast.info('You have already voted');
      return;
    }
    
    setUserPollVote(optionIndex);
    setPollVotes(prev => ({
      ...prev,
      [optionIndex]: (prev[optionIndex] || 0) + 1
    }));
    
    // Save vote to storage
    const pollVotes = storage.get<Record<string, number>>(STORAGE_KEYS.POLL_VOTES, {});
    pollVotes[post.id] = optionIndex;
    storage.set(STORAGE_KEYS.POLL_VOTES, pollVotes);
    
  }, [userPollVote, post]);

  const getTotalVotes = useCallback((): number => {
    return Object.values(pollVotes).reduce((sum, count) => sum + count, 0);
  }, [pollVotes]);

  const getVotePercentage = useCallback((optionIndex: number): number => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((pollVotes[optionIndex] || 0) / total * 100);
  }, [getTotalVotes, pollVotes]);

  // Handle reactions
  const handleReaction = useCallback((reaction: string) => {
    setShowReactionPicker(false);
    
    if (currentReaction === reaction) {
      // Remove reaction
      setCurrentReaction(null);
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
      toast.success('Reaction removed');
    } else {
      // Add or change reaction
      const wasLiked = !!currentReaction;
      setCurrentReaction(reaction);
      setIsLiked(true);
      
      if (!wasLiked) {
        setLikesCount(prev => prev + 1);
      }
      
      toast.success(`Reacted with ${reaction}`);
    }
  }, [currentReaction]);

  // Determine if the post content contains a GIF
  const hasGif = post.content?.includes('[GIF:') || false;
  let gifUrl = '';
  let contentWithoutGif = post.content || '';
  
  if (hasGif) {
    const gifMatch = post.content?.match(/\[GIF: (.*?)\]/);
    if (gifMatch && gifMatch[1]) {
      gifUrl = gifMatch[1];
      contentWithoutGif = contentWithoutGif.replace(/\[GIF: .*?\]/, '').trim();
    }
  }

  return (
    <Card className="card-responsive shadow-sm hover:shadow-md transition-shadow bg-white border-0 shadow-gray-100 mb-4 dark:bg-gray-800 dark:shadow-gray-900 overflow-hidden">
      <CardContent className="spacing-responsive">
        {/* Post Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="avatar-responsive">
              <AvatarImage src={post.profiles?.avatar_url} />
              <AvatarFallback className="bg-blue-500 text-white">
                {post.profiles?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 hover:underline cursor-pointer text-responsive-sm dark:text-gray-100">
                {post.profiles?.full_name || 'Anonymous User'}
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(post.created_at)}
                </p>
                
                {/* Show feeling if available */}
                {post.feeling && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    is feeling {post.feeling}
                  </p>
                )}
                
                {/* Show location if available */}
                {post.location && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    at {post.location}
                  </p>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-gray-100 touch-target dark:hover:bg-gray-700">
            <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="mt-3">
          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed text-responsive-base dark:text-gray-100">
            {contentWithoutGif}
          </p>
        </div>

        {/* GIF Content */}
        {hasGif && gifUrl && (
          <div className="mt-3">
            <img 
              src={gifUrl} 
              alt="GIF" 
              className="rounded-lg max-h-80 mx-auto"
              loading="lazy"
            />
          </div>
        )}

        {/* Poll */}
        {post.isPoll && post.pollOptions && (
          <div className="mt-4">
            <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700">
              <h4 className="font-medium text-sm mb-3 dark:text-gray-200">{post.pollOptions[0]}</h4>
              <div className="space-y-2">
                {post.pollOptions.slice(1).map((option, index) => {
                  const percentage = getVotePercentage(index);
                  const isSelected = userPollVote === index;
                  
                  return (
                    <div 
                      key={index}
                      className={`relative p-3 rounded-lg cursor-pointer border transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30' 
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                      }`}
                      onClick={() => handleVote(index)}
                    >
                      {/* Background progress bar */}
                      {userPollVote !== null && (
                        <div 
                          className="absolute inset-0 bg-blue-100 rounded-lg dark:bg-blue-900/20"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      )}
                      
                      {/* Option content */}
                      <div className="relative flex justify-between items-center">
                        <span className="text-sm dark:text-gray-200">{option}</span>
                        {userPollVote !== null && (
                          <span className="text-sm font-medium dark:text-gray-300">{percentage}%</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {userPollVote !== null && (
                <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
                  {getTotalVotes()} votes
                </p>
              )}
            </div>
          </div>
        )}

        {/* Post Media */}
        {post.image_url && (
          <div className="mt-3 w-full">
            <OptimizedImage
              src={post.image_url}
              alt="Post content"
              className="w-full h-auto max-h-96 object-cover rounded-md cursor-pointer hover:opacity-95 transition-opacity"
              loading="lazy"
              loadingMode="blur"
            />
          </div>
        )}

        {/* Reaction Summary */}
        <div className="mt-3 pt-3 px-1 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 dark:border-gray-700 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            {likesCount > 0 && (
              <>
                <div className="flex -space-x-1">
                  {currentReaction ? (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center">
                      <span className="text-xs">{currentReaction}</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <ThumbsUp className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  {post.reactions && Object.keys(post.reactions).length > 1 && (
                    <div className="flex -ml-1">
                      {Object.keys(post.reactions).slice(0, 2).map((reaction, i) => (
                        reaction !== (currentReaction || '👍') && (
                          <div key={i} className="w-5 h-5 flex items-center justify-center">
                            <span className="text-xs">{reaction}</span>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
                <span className="hover:underline cursor-pointer text-responsive-sm">
                  {likesCount} {likesCount === 1 ? 'reaction' : 'reactions'}
                </span>
              </>
            )}
          </div>
          <div className="flex space-x-4 text-responsive-sm">
            <span className="hover:underline cursor-pointer" onClick={() => setShowComments(!showComments)}>
              {post.comments_count || comments.length || 0} {post.comments_count === 1 || comments.length === 1 ? 'comment' : 'comments'}
            </span>
            <span>0 shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-1 relative">
          <div className="flex items-center space-x-1">
            <Button
              ref={likeButtonRef}
              variant="ghost"
              className={`flex items-center space-x-2 button-responsive rounded-lg transition-colors ${
                isLiked 
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
              onClick={handleLike}
              onMouseEnter={() => setShowReactionPicker(true)}
              onMouseLeave={() => setTimeout(() => setShowReactionPicker(false), 500)}
            >
              {currentReaction ? (
                <span className="text-xl">{currentReaction}</span>
              ) : (
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              )}
              <span className="font-medium text-responsive-sm">
                {currentReaction ? 'Reacted' : 'Like'}
              </span>
            </Button>

            {showReactionPicker && (
              <ReactionPicker 
                onSelect={handleReaction} 
                position="top"
                className="z-10"
              />
            )}

            <Button
              variant="ghost"
              className="flex items-center space-x-2 button-responsive rounded-lg text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium text-responsive-sm">Comment</span>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center space-x-2 button-responsive rounded-lg text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={handleShare}
            >
              <Share className="w-5 h-5" />
              <span className="font-medium text-responsive-sm">Share</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className={`${isSaved ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            <div className="max-h-64 overflow-y-auto scrollbar-thin px-3 space-y-3">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={comment.profiles?.avatar_url} />
                      <AvatarFallback className="bg-gray-400 text-white text-xs dark:bg-gray-600">
                        {comment.profiles?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="bg-white rounded-lg px-3 py-2 shadow-sm dark:bg-gray-800">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {comment.profiles?.full_name || 'Anonymous User'}
                        </p>
                        <p className="text-gray-800 break-words text-responsive-sm dark:text-gray-200">
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex items-center mt-1 ml-1 space-x-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="text-xs text-gray-400 mt-1 dark:text-gray-500">{memoizedFormatTimeAgo(comment.created_at)}</span>
                        <button className="font-semibold hover:underline">Like</button>
                        <button className="font-semibold hover:underline">Reply</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 text-responsive-sm py-4 dark:text-gray-400">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
            
            {/* Add Comment - Optimized for mobile */}
            <div className="mt-3 pt-3 border-t border-gray-200 px-3 pb-3 flex space-x-2 dark:border-gray-700">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=400&h=400&fit=crop&crop=face" />
                <AvatarFallback className="bg-blue-500 text-white text-xs">U</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex space-x-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-9 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
                <Button 
                  onClick={handleSubmitComment} 
                  size="sm"
                  disabled={!newComment.trim()}
                  className="rounded-full px-3 h-9 min-w-[60px]"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Implement shouldComponentUpdate logic to prevent unnecessary re-renders
  return prevProps.post?.id === nextProps.post?.id && 
         prevProps.post?.likes_count === nextProps.post?.likes_count &&
         prevProps.post?.comments_count === nextProps.post?.comments_count &&
         prevProps.post?.user_has_liked === nextProps.post?.user_has_liked;
});

PostCard.displayName = 'PostCard';

export default PostCard;