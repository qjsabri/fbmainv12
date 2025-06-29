import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Star, Plus, Search, MoreHorizontal, Globe, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import CreatePage from './CreatePage';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';

interface Page {
  id: number;
  name: string;
  category: string;
  followers: string;
  avatar: string;
  verified: boolean;
  isFollowing: boolean;
  description?: string;
}

const PagesTab = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pages, setPages] = useState<Page[]>([
    {
      id: 1,
      name: 'Tech News Daily',
      category: 'News & Media',
      followers: '2.5M',
      avatar: MOCK_IMAGES.POSTS[0],
      verified: true,
      isFollowing: true,
      description: 'Your daily source for the latest technology news, reviews, and insights.'
    },
    {
      id: 2,
      name: 'Design Inspiration',
      category: 'Art & Design',
      followers: '1.8M',
      avatar: MOCK_IMAGES.POSTS[1],
      verified: true,
      isFollowing: false,
      description: 'Showcasing beautiful design work from around the world to inspire creatives.'
    },
    {
      id: 3,
      name: 'Startup Central',
      category: 'Business',
      followers: '950K',
      avatar: getSafeImage('POSTS', 2),
      verified: false,
      isFollowing: true,
      description: 'Resources, news and community for entrepreneurs and startup founders.'
    },
    {
      id: 4,
      name: 'Healthy Living',
      category: 'Health & Wellness',
      followers: '1.2M',
      avatar: getSafeImage('POSTS', 3),
      verified: true,
      isFollowing: false,
      description: 'Tips, recipes, and advice for a healthier lifestyle.'
    },
    {
      id: 5,
      name: 'Travel Adventures',
      category: 'Travel',
      followers: '3.1M',
      avatar: getSafeImage('POSTS', 4),
      verified: true,
      isFollowing: true,
      description: 'Discover amazing destinations and travel tips from around the world.'
    },
    {
      id: 6,
      name: 'Gaming Universe',
      category: 'Gaming',
      followers: '4.5M',
      avatar: getSafeImage('POSTS', 5),
      verified: true,
      isFollowing: false,
      description: 'The latest news, reviews, and discussions about video games.'
    }
  ]);

  const categories = [
    'All', 
    'News & Media', 
    'Art & Design', 
    'Business', 
    'Health & Wellness', 
    'Travel', 
    'Gaming', 
    'Education', 
    'Entertainment'
  ];

  const handlePageAction = (action: string, pageId: number) => {
    if (action === 'Visited') {
      // Navigate to page detail view
      navigate(`/pages/${pageId}`);
    } else if (action === 'Followed' || action === 'Unfollowed') {
      setPages(prevPages => 
        prevPages.map(page => 
          page.id === pageId 
            ? { ...page, isFollowing: !page.isFollowing }
            : page
        )
      );
      console.log(`${action} page ${pageId}`);
    }
  };

  const handleCreatePage = () => {
    setIsCreateModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Page search performed
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredPages = pages.filter(page =>
    (page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === 'All' || page.category === selectedCategory)
  );

  return (
    <div className="w-full">
      <div className="container-responsive mx-auto py-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white p-4 sm:p-6 mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <Flag className="w-6 h-6 sm:w-8 sm:h-8" />
              <h1 className="text-2xl sm:text-3xl font-bold">Pages</h1>
            </div>
            <p className="text-base sm:text-lg opacity-90">
              Discover and follow your favorite pages
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            <Button onClick={handleCreatePage} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Page</span>
            </Button>
          </div>

          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-2 scrollbar-thin">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {filteredPages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPages.map((page) => (
                <Card 
                  key={page.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer"
                  onClick={() => navigate(`/pages/${page.id}`)}
                >
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage src={page.avatar} />
                        <AvatarFallback>{page.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 truncate">{page.name}</h3>
                          {page.verified && (
                            <Badge variant="info" size="sm">✓</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{page.category}</p>
                        <p className="text-xs text-gray-400">{page.followers} followers</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="touch-target"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add menu functionality here if needed
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    {page.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                        {page.description}
                      </p>
                    )}
                    <div className="flex space-x-2 mt-auto">
                      <Button
                        variant={page.isFollowing ? "outline" : "default"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePageAction(page.isFollowing ? 'Unfollowed' : 'Followed', page.id);
                        }}
                        className="flex-1 h-9"
                      >
                        {page.isFollowing ? (
                          <>
                            <Star className="w-4 h-4 mr-1 fill-current text-blue-600" />
                            Following
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 mr-1" />
                            Follow
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePageAction('Visited', page.id);
                        }}
                        className="h-9"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Visit</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Flag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No pages found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? `No results for "${searchQuery}"`
                  : selectedCategory !== 'All'
                    ? `No pages found in the "${selectedCategory}" category`
                    : "No pages available at the moment"}
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
                <Button onClick={handleCreatePage}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Page
                </Button>
              </div>
            </div>
          )}

          {filteredPages.length > 0 && (
            <Card className="mt-8">
              <CardHeader className="p-4">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">About Pages</h3>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Create a Page</h4>
                    <p className="text-gray-600">
                      Pages help businesses, brands, and organizations connect with people.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Manage Your Pages</h4>
                    <p className="text-gray-600">
                      Create posts, respond to comments, and view insights.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Discover Pages</h4>
                    <p className="text-gray-600">
                      Follow pages to see updates in your feed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <CreatePage 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default PagesTab;