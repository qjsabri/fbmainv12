import React, { useState } from 'react';
import { Clock, Star, Filter, Search, Calendar, MessageCircle, Share, ThumbsUp, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatTimeAgo } from '@/lib/utils';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { useIsMobile } from '@/hooks/use-device';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    type: 'user' | 'page';
  };
  content: string;
  timestamp: string;
  engagement: { 
    likes: number; 
    comments: number; 
    shares: number;
  };
  image?: string;
  category?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const RecentTab = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Tech Insider',
        avatar: MOCK_IMAGES.AVATARS[0],
        verified: true,
        type: 'page'
      },
      content: 'Breaking: New AI breakthrough announced at tech conference. This could revolutionize how we interact with technology in our daily lives.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      engagement: { likes: 234, comments: 45, shares: 12 },
      image: MOCK_IMAGES.POSTS[0],
      category: 'Technology',
      isLiked: false,
      isBookmarked: true
    },
    {
      id: '2',
      author: {
        name: 'Design Studio',
        avatar: MOCK_IMAGES.AVATARS[1],
        verified: false,
        type: 'page'
      },
      content: 'Just launched our new design system. Check it out! We\'ve been working on this for months and are excited to share it with the community.',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      engagement: { likes: 156, comments: 23, shares: 8 },
      image: MOCK_IMAGES.POSTS[1],
      category: 'Design',
      isLiked: true,
      isBookmarked: false
    },
    {
      id: '3',
      author: {
        name: 'Sarah Johnson',
        avatar: getSafeImage('AVATARS', 2),
        verified: false,
        type: 'user'
      },
      content: 'Just finished my first marathon! 26.2 miles of pure determination. Thanks to everyone who supported me along the way!',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      engagement: { likes: 342, comments: 78, shares: 14 },
      image: getSafeImage('POSTS', 2),
      category: 'Personal',
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '4',
      author: {
        name: 'Startup Founders',
        avatar: getSafeImage('AVATARS', 3),
        verified: true,
        type: 'page'
      },
      content: 'Funding alert: Local startup secures $5M in Series A funding to expand their innovative platform.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      engagement: { likes: 89, comments: 12, shares: 34 },
      category: 'Business',
      isLiked: false,
      isBookmarked: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const isMobile = useIsMobile();

  const categories = ['All', 'Technology', 'Design', 'Business', 'Personal', 'Entertainment', 'Health'];

  const handlePostInteraction = (action: 'like' | 'comment' | 'share' | 'bookmark', postId: string) => {
    if (action === 'like') {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              engagement: { 
                ...post.engagement, 
                likes: post.isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1 
              }
            }
          : post
      ));
    } else if (action === 'bookmark') {
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
      ));
    }
    // Post action performed
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search performed
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'recent': {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      case 'popular': {
        return (b.engagement.likes + b.engagement.comments) - (a.engagement.likes + a.engagement.comments);
      }
      case 'trending': {
        const hoursA = (Date.now() - new Date(a.timestamp).getTime()) / (1000 * 60 * 60);
        const hoursB = (Date.now() - new Date(b.timestamp).getTime()) / (1000 * 60 * 60);
        const scoreA = (a.engagement.likes + a.engagement.comments) / Math.max(1, hoursA);
        const scoreB = (b.engagement.likes + b.engagement.comments) / Math.max(1, hoursB);
        return scoreB - scoreA;
      }
      default: {
        return 0;
      }
    }
  });

  return (
    <div className="w-full">
      <div className="container-responsive mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white p-4 sm:p-6 mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
              <h1 className="text-xl sm:text-3xl font-bold">Most Recent</h1>
            </div>
            <p className="text-base sm:text-lg opacity-90">
              Latest posts and updates from your network
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search recent posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-2 scrollbar-thin">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 truncate">{post.author.name}</h3>
                            {post.author.verified && (
                              <Badge variant="info" size="sm">✓</Badge>
                            )}
                            {post.author.type === 'page' && (
                              <Badge variant="outline" size="sm" className="text-xs">Page</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-xs text-gray-500">{formatTimeAgo(post.timestamp)}</p>
                            {post.category && (
                              <Badge variant="outline" size="sm" className="text-xs">{post.category}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="px-4 pb-3">
                      <p className="text-gray-900 text-responsive-base">{post.content}</p>
                    </div>

                    {post.image && (
                      <div className="w-full">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      </div>
                    )}

                    <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-500 border-t border-b border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4 text-blue-500" />
                          <span>{post.engagement.likes}</span>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <span>{post.engagement.comments} comments</span>
                        <span>{post.engagement.shares} shares</span>
                      </div>
                    </div>

                    <div className="px-4 py-2 flex flex-wrap sm:flex-nowrap gap-2 justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handlePostInteraction('like', post.id)}
                        className={`flex-1 h-9 ${post.isLiked ? 'text-blue-600 bg-blue-50' : ''}`}
                      >
                        <ThumbsUp className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-responsive-sm">Like</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handlePostInteraction('comment', post.id)}
                        className="flex-1 h-9"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-responsive-sm">Comment</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handlePostInteraction('share', post.id)}
                        className="flex-1 h-9"
                      >
                        <Share className="w-4 h-4 mr-1" />
                        <span className="text-responsive-sm">Share</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handlePostInteraction('bookmark', post.id)}
                        className={`h-9 ${isMobile ? 'flex-1' : ''} ${post.isBookmarked ? 'text-yellow-600' : ''}`}
                      >
                        <Star className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                        {isMobile && <span className="ml-1 text-responsive-sm">Save</span>}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No recent posts found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery 
                      ? `No results for "${searchQuery}"`
                      : selectedCategory !== 'All'
                        ? `No posts found in the "${selectedCategory}" category`
                        : "Check back later for new posts from your network"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {searchQuery && (
                      <Button variant="outline" onClick={() => setSearchQuery('')}>
                        Clear Search
                      </Button>
                    )}
                    {selectedCategory !== 'All' && (
                      <Button variant="outline" onClick={() => setSelectedCategory('All')}>
                        Show All Categories
                      </Button>
                    )}
                    <Button>
                      Create a Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {sortedPosts.length > 0 && (
            <Card className="mt-8">
              <CardHeader className="p-4">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Today</h4>
                    <p className="text-gray-600">
                      {sortedPosts.filter(p => new Date(p.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length} new posts
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">This Week</h4>
                    <p className="text-gray-600">
                      {sortedPosts.filter(p => new Date(p.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} posts in your network
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Trending Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Technology</Badge>
                      <Badge variant="outline">Design</Badge>
                      <Badge variant="outline">Business</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTab;