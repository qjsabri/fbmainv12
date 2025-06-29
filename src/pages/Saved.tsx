import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Grid, List, Filter, Search, Layers, Clock, Tag, Heart, MessageCircle, Share, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_IMAGES, STORAGE_KEYS } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { formatTimeAgo } from '@/lib/utils';
import { toast } from 'sonner';

interface SavedItem {
  id: string;
  type: 'post' | 'video' | 'article' | 'event' | 'marketplace' | 'photo' | 'link';
  title: string;
  content?: string;
  image?: string;
  savedDate: string;
  collection: string;
  url?: string;
  isFavorite?: boolean;
  creator?: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  originalDate?: string;
}

const Saved = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [collections, setCollections] = useState<string[]>(['All Saved', 'Articles', 'Videos', 'Posts', 'Marketplace']);

  // Load saved items from storage
  useEffect(() => {
    const loadSavedItems = () => {
      setIsLoading(true);
      
      // Get saved items from storage
      const savedItems = storage.get<SavedItem[]>(STORAGE_KEYS.SAVED_ITEMS);
      const savedPosts = storage.get<string[]>(STORAGE_KEYS.SAVED_POSTS, []);
      
      let allItems: SavedItem[] = [];
      
      if (savedItems && savedItems.length > 0) {
        allItems = [...savedItems];
      }
      
      // Add saved posts if they're not already in the items
      if (savedPosts && savedPosts.length > 0) {
        const existingIds = new Set(allItems.map(item => item.id));
        
        // Create saved item entries for posts
        const postItems: SavedItem[] = savedPosts
          .filter(id => !existingIds.has(id))
          .map(id => ({
            id,
            type: 'post',
            title: `Saved Post #${id}`,
            content: 'This is a saved post from your feed.',
            image: MOCK_IMAGES.POSTS[parseInt(id) % MOCK_IMAGES.POSTS.length],
            savedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            collection: 'Posts',
            creator: {
              name: ['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Kim'][parseInt(id) % 4],
              avatar: MOCK_IMAGES.AVATARS[parseInt(id) % MOCK_IMAGES.AVATARS.length],
              verified: Math.random() > 0.5
            },
            engagement: {
              likes: Math.floor(Math.random() * 500),
              comments: Math.floor(Math.random() * 100),
              shares: Math.floor(Math.random() * 50)
            },
            originalDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          }));
        
        allItems = [...allItems, ...postItems];
      }
      
      // If still no items, create mock data
      if (allItems.length === 0) {
        allItems = [
          {
            id: '1',
            type: 'post',
            title: 'Amazing React Development Tips',
            content: 'Here are some amazing tips for React development that will boost your productivity!',
            image: MOCK_IMAGES.POSTS[0],
            savedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            collection: 'Tech Tips',
            creator: {
              name: 'Sarah Johnson',
              avatar: MOCK_IMAGES.AVATARS[0],
              verified: true
            },
            engagement: {
              likes: 245,
              comments: 48,
              shares: 12
            },
            originalDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            type: 'video',
            title: 'How to Build a Social Media App',
            content: 'In this tutorial, I show you how to build a complete social media application from scratch.',
            image: MOCK_IMAGES.POSTS[1],
            savedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            collection: 'Videos',
            creator: {
              name: 'Mike Chen',
              avatar: MOCK_IMAGES.AVATARS[1],
              verified: false
            },
            engagement: {
              likes: 890,
              comments: 132,
              shares: 67
            },
            originalDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            type: 'article',
            title: 'The Future of Web Development',
            content: 'Exploring the upcoming trends and technologies that will shape the future of web development.',
            savedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            collection: 'Articles',
            url: 'https://example.com/article',
            creator: {
              name: 'Emma Wilson',
              avatar: MOCK_IMAGES.AVATARS[2],
              verified: true
            },
            originalDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '4',
            type: 'marketplace',
            title: 'MacBook Pro M3 - Excellent Condition',
            content: 'Selling my MacBook Pro M3 in excellent condition. Only used for 3 months.',
            image: MOCK_IMAGES.POSTS[3],
            savedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            collection: 'Marketplace',
            originalDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '5',
            type: 'event',
            title: 'Tech Conference 2024',
            content: 'Join us for the biggest tech conference of the year featuring the latest innovations in AI, blockchain, and more.',
            image: MOCK_IMAGES.POSTS[4],
            savedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            collection: 'Events',
            originalDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
      }
      
      // Save all items to storage
      storage.set(STORAGE_KEYS.SAVED_ITEMS, allItems);
      
      // Extract unique collections
      const uniqueCollections = ['All Saved', ...new Set(allItems.map(item => item.collection))];
      setCollections(uniqueCollections);
      
      setItems(allItems);
      setIsLoading(false);
    };
    
    loadSavedItems();
    
    // Load view mode preference
    const savedViewMode = storage.get<'grid' | 'list'>(STORAGE_KEYS.SAVED_VIEW_MODE);
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode preference
  useEffect(() => {
    storage.set(STORAGE_KEYS.SAVED_VIEW_MODE, viewMode);
  }, [viewMode]);

  const handleRemoveItem = (itemId: string) => {
    // Remove from state
    setItems(prev => prev.filter(item => item.id !== itemId));
    
    // Remove from storage
    const savedItems = storage.get<SavedItem[]>(STORAGE_KEYS.SAVED_ITEMS, []);
    const updatedItems = savedItems.filter(item => item.id !== itemId);
    storage.set(STORAGE_KEYS.SAVED_ITEMS, updatedItems);
    
    // If it's a post, also remove from saved posts
    const savedPosts = storage.get<string[]>(STORAGE_KEYS.SAVED_POSTS, []);
    if (savedPosts.includes(itemId)) {
      const updatedPosts = savedPosts.filter(id => id !== itemId);
      storage.set(STORAGE_KEYS.SAVED_POSTS, updatedPosts);
    }
    
    toast.success('Item removed from saved');
  };

  const handleToggleFavorite = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    ));
    
    // Update storage
    const savedItems = storage.get<SavedItem[]>(STORAGE_KEYS.SAVED_ITEMS, []);
    const updatedItems = savedItems.map(item => 
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    );
    storage.set(STORAGE_KEYS.SAVED_ITEMS, updatedItems);
    
    const item = items.find(i => i.id === itemId);
    toast.success(item?.isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleCreateCollection = () => {
    const newCollection = prompt('Enter collection name:');
    if (newCollection && !collections.includes(newCollection)) {
      setCollections([...collections, newCollection]);
      toast.success(`Collection "${newCollection}" created`);
    }
  };



  const handleShare = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      navigator.clipboard.writeText(`Check out this ${item.type}: ${item.title}`);
      toast.success('Link copied to clipboard');
    }
  };

  const handleItemClick = (item: SavedItem) => {
    // Navigate to the appropriate page based on item type
    switch (item.type) {
      case 'video':
        navigate(`/watch/${item.id}`);
        break;
      case 'post':
        navigate(`/post/${item.id}`);
        break;
      case 'article':
        navigate(`/article/${item.id}`);
        break;
      case 'event':
        navigate(`/events/${item.id}`);
        break;
      case 'marketplace':
        navigate(`/marketplace/${item.id}`);
        break;
      case 'photo':
        navigate(`/photo/${item.id}`);
        break;
      case 'link':
        // For external links, open in new tab
        if (item.url) {
          window.open(item.url, '_blank');
        } else {
          navigate(`/link/${item.id}`);
        }
        break;
      default:
        navigate(`/${item.type}/${item.id}`);
        break;
    }
  };

  // Filter items based on search, type, and collection
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.content?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCollection = selectedCollection === 'all' || selectedCollection === 'All Saved' || 
                             item.collection === selectedCollection;
    return matchesSearch && matchesType && matchesCollection;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
      case 'oldest':
        return new Date(a.savedDate).getTime() - new Date(b.savedDate).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return <Layers className="w-4 h-4 text-blue-500" />;
      case 'video': return <Play className="w-4 h-4 text-red-500" />;
      case 'article': return <FileText className="w-4 h-4 text-green-500" />;
      case 'event': return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'marketplace': return <Tag className="w-4 h-4 text-orange-500" />;
      case 'photo': return <Image className="w-4 h-4 text-pink-500" />;
      case 'link': return <Link className="w-4 h-4 text-indigo-500" />;
      default: return <Bookmark className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'post': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'video': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'article': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'event': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'marketplace': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'photo': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'link': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="w-full">
      <div className="container-responsive mx-auto py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Items</h1>
              <p className="text-gray-600 dark:text-gray-300">Organize and revisit content you've saved</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="dark:border-gray-600"
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="dark:border-gray-600"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button onClick={handleCreateCollection}>
                <Bookmark className="w-4 h-4 mr-2" />
                New Collection
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search saved items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] dark:bg-gray-700 dark:border-gray-600">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="type">Content Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Content Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="post">Posts</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                        <SelectItem value="article">Articles</SelectItem>
                        <SelectItem value="event">Events</SelectItem>
                        <SelectItem value="marketplace">Marketplace</SelectItem>
                        <SelectItem value="photo">Photos</SelectItem>
                        <SelectItem value="link">Links</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">Collection</label>
                    <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Select collection" />
                      </SelectTrigger>
                      <SelectContent>
                        {collections.map((collection) => (
                          <SelectItem key={collection} value={collection}>
                            {collection}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      className="w-full dark:border-gray-600 dark:text-gray-200"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedType('all');
                        setSelectedCollection('all');
                        setSortBy('recent');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All Saved</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {isLoading ? (
                // Loading skeleton
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                      <CardContent className="p-4">
                        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 dark:bg-gray-700"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded mb-3 dark:bg-gray-700"></div>
                        <div className="h-4 w-full bg-gray-200 rounded mb-4 dark:bg-gray-700"></div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between">
                            <div className="h-8 w-24 bg-gray-200 rounded dark:bg-gray-700"></div>
                            <div className="h-8 w-24 bg-gray-200 rounded dark:bg-gray-700"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : sortedItems.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {sortedItems.map((item) => (
                    <Card 
                      key={item.id} 
                      className={`overflow-hidden hover:shadow-lg transition-shadow h-full flex cursor-pointer ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row'}`}
                      onClick={() => handleItemClick(item)}
                    >
                      {item.image && (
                        <div className={`relative ${viewMode === 'grid' ? '' : 'md:w-1/3'}`}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className={`w-full ${viewMode === 'grid' ? 'h-48' : 'md:h-full h-48'} object-cover`}
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className={getTypeColor(item.type)}>
                              <span className="capitalize">{item.type}</span>
                            </Badge>
                          </div>
                          {item.isFavorite && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary" className="bg-white/90 dark:bg-black/70 dark:text-white">
                                <Heart className="w-3 h-3 mr-1 fill-red-500 text-red-500" />
                                Favorite
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <CardContent className={`p-4 flex-1 flex flex-col ${viewMode === 'grid' ? '' : 'md:p-6'}`}>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1 dark:text-white">
                            {item.title}
                          </h3>
                          
                          {item.creator && (
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={item.creator.avatar} />
                                <AvatarFallback>{item.creator.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{item.creator.name}</span>
                                {item.creator.verified && (
                                  <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center ml-1">
                                    <span className="text-white text-[6px]">✓</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {item.content && (
                            <p className="text-sm text-gray-700 mb-4 line-clamp-2 dark:text-gray-300">{item.content}</p>
                          )}
                          
                          <div className="flex items-center space-x-2 mb-4">
                            <Badge variant="outline" className="text-xs flex items-center space-x-1 dark:border-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>Saved {formatTimeAgo(item.savedDate)}</span>
                            </Badge>
                            
                            {item.originalDate && (
                              <Badge variant="outline" className="text-xs flex items-center space-x-1 dark:border-gray-600">
                                <Calendar className="w-3 h-3" />
                                <span>Posted {formatTimeAgo(item.originalDate)}</span>
                              </Badge>
                            )}
                            
                            <Badge variant="outline" className="text-xs dark:border-gray-600">
                              {item.collection}
                            </Badge>
                          </div>
                          
                          {item.engagement && (
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Heart className="w-3 h-3" />
                                <span>{item.engagement.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-3 h-3" />
                                <span>{item.engagement.comments}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Share className="w-3 h-3" />
                                <span>{item.engagement.shares}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2 mt-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(item.id);
                            }}
                            className="flex-1 dark:border-gray-600 dark:text-gray-200"
                          >
                            <Heart className={`w-4 h-4 mr-1 ${item.isFavorite ? 'fill-current text-red-500' : ''}`} />
                            {item.isFavorite ? 'Favorited' : 'Favorite'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(item.id);
                            }}
                            className="flex-1 dark:border-gray-600 dark:text-gray-200"
                          >
                            <Share className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(item.id);
                            }}
                            className="dark:border-gray-600 dark:text-gray-200"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                  <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No saved items</h3>
                  <p className="text-gray-500 mb-6 dark:text-gray-400">
                    {searchQuery 
                      ? `No results for "${searchQuery}"`
                      : selectedType !== 'all'
                        ? `No saved ${selectedType}s found`
                        : selectedCollection !== 'all' && selectedCollection !== 'All Saved'
                          ? `No items in "${selectedCollection}" collection`
                          : "You haven't saved any items yet"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {(searchQuery || selectedType !== 'all' || (selectedCollection !== 'all' && selectedCollection !== 'All Saved')) && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedType('all');
                          setSelectedCollection('all');
                        }}
                        className="dark:border-gray-600 dark:text-gray-200"
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button onClick={() => window.history.back()}>
                      Back to Feed
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              {isLoading ? (
                // Loading skeleton (same as above)
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                      <CardContent className="p-4">
                        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 dark:bg-gray-700"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded mb-3 dark:bg-gray-700"></div>
                        <div className="h-4 w-full bg-gray-200 rounded mb-4 dark:bg-gray-700"></div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between">
                            <div className="h-8 w-24 bg-gray-200 rounded dark:bg-gray-700"></div>
                            <div className="h-8 w-24 bg-gray-200 rounded dark:bg-gray-700"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  {sortedItems.filter(item => item.isFavorite).length > 0 ? (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                      {sortedItems.filter(item => item.isFavorite).map((item) => (
                        <Card 
                          key={item.id} 
                          className={`overflow-hidden hover:shadow-lg transition-shadow h-full flex cursor-pointer ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row'}`}
                          onClick={() => handleItemClick(item)}
                        >
                          {item.image && (
                            <div className={`relative ${viewMode === 'grid' ? '' : 'md:w-1/3'}`}>
                              <img
                                src={item.image}
                                alt={item.title}
                                className={`w-full ${viewMode === 'grid' ? 'h-48' : 'md:h-full h-48'} object-cover`}
                              />
                              <div className="absolute top-2 left-2">
                                <Badge className={getTypeColor(item.type)}>
                                  <span className="capitalize">{item.type}</span>
                                </Badge>
                              </div>
                              <div className="absolute top-2 right-2">
                                <Badge variant="secondary" className="bg-white/90 dark:bg-black/70 dark:text-white">
                                  <Heart className="w-3 h-3 mr-1 fill-red-500 text-red-500" />
                                  Favorite
                                </Badge>
                              </div>
                            </div>
                          )}
                          
                          <CardContent className={`p-4 flex-1 flex flex-col ${viewMode === 'grid' ? '' : 'md:p-6'}`}>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1 dark:text-white">
                                {item.title}
                              </h3>
                              
                              {item.creator && (
                                <div className="flex items-center space-x-2 mb-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={item.creator.avatar} />
                                    <AvatarFallback>{item.creator.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{item.creator.name}</span>
                                    {item.creator.verified && (
                                      <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center ml-1">
                                        <span className="text-white text-[6px]">✓</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {item.content && (
                                <p className="text-sm text-gray-700 mb-4 line-clamp-2 dark:text-gray-300">{item.content}</p>
                              )}
                              
                              <div className="flex items-center space-x-2 mb-4">
                                <Badge variant="outline" className="text-xs flex items-center space-x-1 dark:border-gray-600">
                                  <Clock className="w-3 h-3" />
                                  <span>Saved {formatTimeAgo(item.savedDate)}</span>
                                </Badge>
                                
                                {item.originalDate && (
                                  <Badge variant="outline" className="text-xs flex items-center space-x-1 dark:border-gray-600">
                                    <Calendar className="w-3 h-3" />
                                    <span>Posted {formatTimeAgo(item.originalDate)}</span>
                                  </Badge>
                                )}
                                
                                <Badge variant="outline" className="text-xs dark:border-gray-600">
                                  {item.collection}
                                </Badge>
                              </div>
                              
                              {item.engagement && (
                                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4 dark:text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Heart className="w-3 h-3" />
                                    <span>{item.engagement.likes}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MessageCircle className="w-3 h-3" />
                                    <span>{item.engagement.comments}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Share className="w-3 h-3" />
                                    <span>{item.engagement.shares}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex space-x-2 mt-auto">
                              <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(item.id);
                              }}
                              className="flex-1 dark:border-gray-600 dark:text-gray-200"
                            >
                              <Heart className="w-4 h-4 mr-1 fill-current text-red-500" />
                              Favorited
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(item.id);
                              }}
                              className="flex-1 dark:border-gray-600 dark:text-gray-200"
                            >
                              <Share className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveItem(item.id);
                              }}
                              className="dark:border-gray-600 dark:text-gray-200"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                      <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No favorite items</h3>
                      <p className="text-gray-500 mb-6 dark:text-gray-400">
                        Mark items as favorites to find them here
                      </p>
                      <Button onClick={() => setActiveTab('all')}>
                        View All Saved Items
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="collections" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.filter(c => c !== 'All Saved').map((collection) => {
                  const collectionItems = items.filter(item => item.collection === collection);
                  const itemCount = collectionItems.length;
                  const coverImage = collectionItems[0]?.image || MOCK_IMAGES.POSTS[0];
                  
                  return (
                    <Card key={collection} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative h-40">
                        <img
                          src={coverImage}
                          alt={collection}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white text-lg font-semibold">{collection}</h3>
                          <p className="text-white text-sm">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            {collectionItems.slice(0, 3).map((item, index) => (
                              <div key={index} className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                {item.image ? (
                                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    {getTypeIcon(item.type)}
                                  </div>
                                )}
                              </div>
                            ))}
                            {itemCount > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium dark:bg-gray-700 dark:text-white">
                                +{itemCount - 3}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCollection(collection)}
                            className="dark:border-gray-600 dark:text-gray-200"
                          >
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {/* Create new collection card */}
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={handleCreateCollection}>
                  <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bookmark className="w-16 h-16 text-white" />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-lg mb-2 dark:text-white">Create New Collection</h3>
                    <p className="text-gray-600 text-sm dark:text-gray-300">Organize your saved items into custom collections</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Icon components
const Play = ({ className }: { className?: string }) => (
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
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const Calendar = ({ className }: { className?: string }) => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const FileText = ({ className }: { className?: string }) => (
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
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const Image = ({ className }: { className?: string }) => (
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
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const Link = ({ className }: { className?: string }) => (
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
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export default Saved;