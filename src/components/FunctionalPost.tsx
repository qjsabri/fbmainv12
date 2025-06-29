import React, { useState } from 'react';
import { MoreHorizontal, ThumbsUp, MessageCircle, Share, Bookmark } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FunctionalPostProps {
  post: {
    id: number;
    author: {
      name: string;
      avatar: string;
      verified: boolean;
    };
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    comments: number;
    shares: number;
  };
}

const FunctionalPost: React.FC<FunctionalPostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author.name}`,
        text: post.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };



  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                {post.author.verified && (
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-3">
          <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Post Image */}
        {post.image && (
          <div className="w-full">
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {/* Reaction Summary */}
        <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-500 border-b border-gray-100">
          <div className="flex items-center space-x-1">
            {likesCount > 0 && (
              <>
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <ThumbsUp className="w-3 h-3 text-white" />
                  </div>
                </div>
                <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
              </>
            )}
          </div>
          <div className="flex space-x-4">
            <span>{post.comments} {post.comments === 1 ? 'comment' : 'comments'}</span>
            <span>{post.shares} shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              className={`flex items-center space-x-2 rounded-lg transition-colors ${
                isLiked 
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={handleLike}
            >
              <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">Like</span>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center space-x-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Comment</span>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center space-x-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={handleShare}
            >
              <Share className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className={`${isSaved ? 'text-yellow-600' : 'text-gray-600'} hover:bg-gray-100`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunctionalPost;