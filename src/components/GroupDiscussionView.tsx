import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Image, Users, Pin, MoreHorizontal, ThumbsUp, MessageCircle, Share } from 'lucide-react';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { toast } from 'sonner';

interface GroupPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isAdmin?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isPinned?: boolean;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
}

interface GroupDiscussionViewProps {
  groupId: string;
  posts: GroupPost[];
  isAdmin: boolean;
  isJoined: boolean;
  onCreatePost: (content: string) => void;
  onLikePost: (postId: string) => void;
  onPinPost: (postId: string) => void;
  onJoinGroup?: () => void;
}

const GroupDiscussionView: React.FC<GroupDiscussionViewProps> = ({
  groupId,
  posts,
  isAdmin,
  isJoined,
  onCreatePost,
  onLikePost,
  onPinPost,
  onJoinGroup
}) => {
  const [newPost, setNewPost] = useState('');

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    onCreatePost(newPost);
    setNewPost('');
  };

  const sortedPosts = [...posts].sort((a, b) => 
    a.isPinned && !b.isPinned ? -1 : !a.isPinned && b.isPinned ? 1 : 0
  );

  return (
    <div className="space-y-6">
      {/* Create Post */}
      {isJoined && (
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={getSafeImage('AVATARS', 7)} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write something to the group..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="resize-none border-0 focus-visible:ring-0 p-0 dark:bg-transparent dark:text-white"
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t dark:border-gray-700">
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 dark:text-gray-300"
                      onClick={() => toast.info('Photo/video upload coming soon')}
                    >
                      <Image className="w-4 h-4 mr-1" />
                      <span className="text-xs">Photo/Video</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 dark:text-gray-300"
                      onClick={() => toast.info('Tag people feature coming soon')}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-xs">Tag People</span>
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Posts */}
      {sortedPosts.length > 0 ? (
        <div className="space-y-6">
          {sortedPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{post.author.name}</h3>
                        {post.author.isAdmin && (
                          <Badge variant="outline" className="text-xs dark:border-gray-600">Admin</Badge>
                        )}
                        {post.isPinned && (
                          <Badge variant="secondary" className="text-xs">
                            <Pin className="w-3 h-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="dark:text-gray-300">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-900 whitespace-pre-wrap dark:text-white">{post.content}</p>
                </div>
                
                {/* Post Media */}
                {post.media && post.media.length > 0 && (
                  <div className="w-full">
                    {post.media.map((media, index) => (
                      <div key={index} className="w-full">
                        {media.type === 'image' && (
                          <img
                            src={media.url}
                            alt="Post content"
                            className="w-full h-auto max-h-96 object-cover"
                          />
                        )}
                        {media.type === 'video' && (
                          <div className="relative">
                            <img
                              src={media.url}
                              alt="Video thumbnail"
                              className="w-full h-auto max-h-96 object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white ml-1">
                                  <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Post Stats */}
                <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-500 border-t border-b border-gray-100 dark:border-gray-700 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    {post.likes > 0 && (
                      <>
                        <div className="flex -space-x-1">
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <ThumbsUp className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
                      </>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <span>{post.comments} {post.comments === 1 ? 'comment' : 'comments'}</span>
                  </div>
                </div>
                
                {/* Post Actions */}
                <div className="px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      className={`flex items-center space-x-2 rounded-lg transition-colors ${
                        post.isLiked 
                          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30' 
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => onLikePost(post.id)}
                    >
                      <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">Like</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
                      onClick={() => toast.info('Comment feature coming soon')}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">Comment</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://facebook.com/groups/${groupId}/posts/${post.id}`);
                        toast.success('Post link copied to clipboard');
                      }}
                    >
                      <Share className="w-5 h-5" />
                      <span className="font-medium">Share</span>
                    </Button>
                  </div>
                  
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPinPost(post.id)}
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-300"
                    >
                      <Pin className={`w-5 h-5 ${post.isPinned ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No posts yet</h3>
            <p className="text-gray-500 mb-4 dark:text-gray-400">Be the first to start a discussion in this group!</p>
            {isJoined ? (
              <Button onClick={() => document.querySelector('textarea')?.focus()}>
                Create Post
              </Button>
            ) : (
              <Button onClick={() => onJoinGroup ? onJoinGroup() : toast.info('Join the group to post')}>
                Join Group to Post
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// MessageSquare icon component
const MessageSquare = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default GroupDiscussionView;