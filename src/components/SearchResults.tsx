import React, { useState, useEffect } from 'react';
import { Search, Users, Video, Image, Hash, MapPin, Calendar, Check, Filter, Globe, Bookmark, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams } from 'react-router-dom';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimeAgo } from '@/lib/utils';
import { toast } from 'sonner';

interface SearchResult {
  id: string;
  type: 'people' | 'posts' | 'videos' | 'photos' | 'pages' | 'groups' | 'events' | 'marketplace';
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  verified?: boolean;
  mutualFriends?: number;
  timestamp?: string;
  location?: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  tags?: string[];
  isSaved?: boolean;
  isLiked?: boolean;
  creator?: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  price?: string;
  date?: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const _type = searchParams.get('type') || 'all';
  const dateRange = searchParams.get('date') || 'any';
  const location = searchParams.get('location') || '';
  const author = searchParams.get('author') || '';
  
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  type SortByType = 'relevance' | 'recent' | 'popular';
  const [sortBy, setSortBy] = useState<SortByType>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCreator, setFilterCreator] = useState(false);
  const [filterSaved, setFilterSaved] = useState(false);
  const [filterLiked, setFilterLiked] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      
      // Simulate API call to search
      setTimeout(() => {
        const mockResults = generateMockResults(query, _type);
        setResults(mockResults);
        setIsLoading(false);
      }, 1000);
    } else {
      setResults([]);
    }
  }, [query, _type, dateRange, location, author]);

  // Filter and sort results
  useEffect(() => {
    let filtered = [...results];
    
    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(result => result.type === activeTab);
    }
    
    // Apply filters
    if (filterCreator && author) {
      filtered = filtered.filter(result => result.creator?.name.toLowerCase().includes(author.toLowerCase()));
    }
    
    if (filterSaved) {
      filtered = filtered.filter(result => result.isSaved);
    }
    
    if (filterLiked) {
      filtered = filtered.filter(result => result.isLiked);
    }
    
    if (filterVerified) {
      filtered = filtered.filter(result => result.verified);
    }
    
    // Apply sorting
    if (sortBy === 'recent') {
      filtered.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => {
        const engA = a.engagement ? a.engagement.likes + a.engagement.comments : 0;
        const engB = b.engagement ? b.engagement.likes + b.engagement.comments : 0;
        return engB - engA;
      });
    }
    
    setFilteredResults(filtered);
  }, [results, activeTab, sortBy, filterCreator, filterSaved, filterLiked, filterVerified, author]);

  const generateMockResults = (query: string, _type: string): SearchResult[] => {
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'people',
        title: 'Sarah Johnson',
        subtitle: 'Software Engineer at Tech Corp',
        image: MOCK_IMAGES.AVATARS[0],
        verified: true,
        mutualFriends: 12,
        location: 'San Francisco, CA'
      },
      {
        id: '2',
        type: 'posts',
        title: 'Amazing React development tips for 2024',
        subtitle: 'Posted by Mike Chen',
        description: 'Just discovered these amazing React techniques that have boosted my productivity. Check out these tips that will change how you build components!',
        image: MOCK_IMAGES.POSTS[0],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        engagement: {
          likes: 245,
          comments: 48,
          shares: 12
        },
        tags: ['React', 'WebDevelopment', 'JavaScript', 'Programming', 'Frontend'],
        creator: {
          name: 'Mike Chen',
          avatar: MOCK_IMAGES.AVATARS[1],
          verified: false
        },
        isLiked: true
      },
      {
        id: '3',
        type: 'videos',
        title: 'Tech Conference 2024 Highlights',
        subtitle: 'Tech Events Inc',
        image: MOCK_IMAGES.POSTS[1],
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        engagement: {
          likes: 890,
          comments: 132,
          shares: 67
        },
        creator: {
          name: 'Tech Events Inc',
          avatar: getSafeImage('AVATARS', 2),
          verified: true
        },
        isSaved: true
      },
      {
        id: '4',
        type: 'groups',
        title: 'React Developers Community',
        subtitle: '15.2K members',
        image: getSafeImage('POSTS', 2),
        tags: ['React', 'JavaScript', 'WebDevelopment']
      },
      {
        id: '5',
        type: 'pages',
        title: 'Tech News Daily',
        subtitle: '2.5M followers',
        image: getSafeImage('POSTS', 3),
        verified: true,
        description: 'Your daily source for tech news, reviews, and insights.'
      },
      {
        id: '6',
        type: 'events',
        title: 'JavaScript Conference 2024',
        subtitle: 'March 25, 2024',
        image: getSafeImage('POSTS', 4),
        location: 'San Francisco, CA',
        date: '2024-03-25T09:00:00.000Z',
        description: 'Join us for the biggest JavaScript conference of the year featuring talks from industry experts.'
      },
      {
        id: '7',
        type: 'marketplace',
        title: 'MacBook Pro M3 - Excellent Condition',
        subtitle: 'Electronics',
        image: getSafeImage('POSTS', 5),
        price: '$1,499',
        location: 'San Jose, CA',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '8',
        type: 'photos',
        title: 'Tech Conference Booth',
        subtitle: 'Album: Work Events 2024',
        image: getSafeImage('POSTS', 2),
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        creator: {
          name: 'Emma Wilson',
          avatar: getSafeImage('AVATARS', 2)
        },
        engagement: {
          likes: 56,
          comments: 4,
          shares: 0
        }
      }
    ];
    
    // For demo purposes, make sure results always relate to the search query
    return mockResults.map(result => {
      // Add the query to title or description for demo purposes
      const r = { ...result };
      if (!r.title.toLowerCase().includes(query.toLowerCase())) {
        r.description = `Related to "${query}": ` + (r.description || r.title);
      }
      return r;
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'people': return <Users className="w-4 h-4" />;
      case 'posts': return <Hash className="w-4 h-4" />;
      case 'videos': return <Video className="w-4 h-4" />;
      case 'photos': return <Image className="w-4 h-4" />;
      case 'events': return <Calendar className="w-4 h-4" />;
      case 'groups': return <Users className="w-4 h-4" />;
      case 'pages': return <Globe className="w-4 h-4" />;
      case 'marketplace': return <Tag className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getTypeBadgeStyle = (type: string): string => {
    switch (type) {
      case 'people': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'posts': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'videos': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'photos': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'events': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'groups': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'pages': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'marketplace': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleAction = (action: string, result: SearchResult) => {
    toast.success(`${action} ${result.title}`);
    
    // Update state for some actions
    if (action === 'Save') {
      setResults(results.map(r => 
        r.id === result.id ? { ...r, isSaved: !r.isSaved } : r
      ));
    } else if (action === 'Like') {
      setResults(results.map(r => 
        r.id === result.id ? { 
          ...r, 
          isLiked: !r.isLiked, 
          engagement: r.engagement ? {
            ...r.engagement,
            likes: r.isLiked ? r.engagement.likes - 1 : r.engagement.likes + 1
          } : undefined
        } : r
      ));
    }
  };

  const getResultCounts = () => {
    const counts = results.reduce((acc, result) => {
      acc[result.type] = (acc[result.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const counts = getResultCounts();

  if (!query) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">Search Facebook</h2>
          <p className="text-gray-500 dark:text-gray-400">Find people, posts, photos, and more</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
          Search results for "{query}"
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">{results.length} results found</p>
          
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={(value: SortByType) => setSortBy(value)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="filter-creator"
                  checked={filterCreator}
                  onChange={() => setFilterCreator(!filterCreator)} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:text-blue-400"
                />
                <label htmlFor="filter-creator" className="flex items-center text-sm dark:text-gray-200">
                  <Users className="w-4 h-4 mr-1 text-blue-500" />
                  <span>By Creator: {author || 'Any'}</span>
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="filter-saved"
                  checked={filterSaved}
                  onChange={() => setFilterSaved(!filterSaved)} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:text-blue-400"
                />
                <label htmlFor="filter-saved" className="flex items-center text-sm dark:text-gray-200">
                  <Bookmark className="w-4 h-4 mr-1 text-purple-500" />
                  <span>Only Saved Items</span>
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="filter-liked"
                  checked={filterLiked}
                  onChange={() => setFilterLiked(!filterLiked)} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:text-blue-400"
                />
                <label htmlFor="filter-liked" className="flex items-center text-sm dark:text-gray-200">
                  <Heart className="w-4 h-4 mr-1 text-red-500" />
                  <span>Only Liked Items</span>
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="filter-verified"
                  checked={filterVerified}
                  onChange={() => setFilterVerified(!filterVerified)} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:text-blue-400"
                />
                <label htmlFor="filter-verified" className="flex items-center text-sm dark:text-gray-200">
                  <Check className="w-4 h-4 mr-1 text-blue-500" />
                  <span>Verified Only</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="all">All ({results.length})</TabsTrigger>
          <TabsTrigger value="people">People ({counts.people || 0})</TabsTrigger>
          <TabsTrigger value="posts">Posts ({counts.posts || 0})</TabsTrigger>
          <TabsTrigger value="videos">Videos ({counts.videos || 0})</TabsTrigger>
          <TabsTrigger value="photos">Photos ({counts.photos || 0})</TabsTrigger>
          <TabsTrigger value="groups">Groups ({counts.groups || 0})</TabsTrigger>
          <TabsTrigger value="pages">Pages ({counts.pages || 0})</TabsTrigger>
          <TabsTrigger value="events">Events ({counts.events || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-lg dark:bg-gray-700"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4 dark:bg-gray-700"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 dark:bg-gray-700"></div>
                        <div className="h-4 bg-gray-300 rounded w-full dark:bg-gray-700"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <AnimatePresence>
              <div className="space-y-4">
                {filteredResults.map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="relative flex-shrink-0">
                            <img
                              src={result.image}
                              alt={result.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 dark:bg-gray-800">
                              {getTypeIcon(result.type)}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900 line-clamp-1 dark:text-white">{result.title}</h3>
                              {result.verified && (
                                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                              <Badge 
                                className={`text-xs capitalize ${getTypeBadgeStyle(result.type)}`}
                              >
                                {result.type}
                              </Badge>
                              {result.isSaved && (
                                <Badge variant="outline" className="text-xs">Saved</Badge>
                              )}
                            </div>
                            
                            {result.subtitle && (
                              <p className="text-sm text-gray-600 mb-1 dark:text-gray-400">{result.subtitle}</p>
                            )}
                            
                            {result.description && (
                              <p className="text-sm text-gray-700 mb-2 line-clamp-2 dark:text-gray-300">{result.description}</p>
                            )}
                            
                            <div className="flex items-center flex-wrap gap-2 mt-1">
                              {result.mutualFriends && (
                                <Badge variant="outline" className="text-xs flex items-center space-x-1 dark:border-gray-600">
                                  <Users className="w-3 h-3" />
                                  <span>{result.mutualFriends} mutual friends</span>
                                </Badge>
                              )}
                              
                              {result.timestamp && (
                                <Badge variant="outline" className="text-xs dark:border-gray-600">
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{formatTimeAgo(result.timestamp)}</span>
                                </Badge>
                              )}
                              
                              {result.location && (
                                <Badge variant="outline" className="text-xs flex items-center space-x-1 dark:border-gray-600">
                                  <MapPin className="w-3 h-3" />
                                  <span>{result.location}</span>
                                </Badge>
                              )}
                              
                              {result.engagement && (
                                <Badge variant="outline" className="text-xs dark:border-gray-600">
                                  <Heart className="w-3 h-3 mr-1" />
                                  <span>{result.engagement.likes}</span>
                                </Badge>
                              )}
                              
                              {result.price && (
                                <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                  {result.price}
                                </Badge>
                              )}
                              
                              {result.date && (
                                <Badge variant="outline" className="text-xs dark:border-gray-600">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  <span>{new Date(result.date).toLocaleDateString()}</span>
                                </Badge>
                              )}
                              
                              {result.tags && result.tags.length > 0 && (
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Hash className="w-3 h-3" />
                                  <div className="flex flex-wrap gap-1">
                                    {result.tags.slice(0, 3).map((tag, i) => (
                                      <span key={i} className="text-blue-600 dark:text-blue-400">
                                        #{tag}
                                      </span>
                                    ))}
                                    {result.tags.length > 3 && (
                                      <span className="text-gray-500 dark:text-gray-400">
                                        +{result.tags.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            {result.type === 'people' && (
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  className="text-xs h-8 px-3"
                                  onClick={() => handleAction('Add', result)}
                                >
                                  Add Friend
                                </Button>
                              </div>
                            )}
                            
                            {(result.type === 'posts' || result.type === 'videos' || result.type === 'photos') && (
                              <div className="flex space-x-2">
                                <Button
                                  variant={result.isLiked ? "default" : "outline"}
                                  size="sm"
                                  className="text-xs h-8 px-3"
                                  onClick={() => handleAction('Like', result)}
                                >
                                  <Heart className={`w-3 h-3 mr-1 ${result.isLiked ? 'fill-white' : ''}`} />
                                  Like
                                </Button>
                                <Button
                                  variant={result.isSaved ? "default" : "outline"}
                                  size="sm"
                                  className="text-xs h-8 px-3"
                                  onClick={() => handleAction('Save', result)}
                                >
                                  <Bookmark className={`w-3 h-3 mr-1 ${result.isSaved ? 'fill-white' : ''}`} />
                                  {result.isSaved ? 'Saved' : 'Save'}
                                </Button>
                              </div>
                            )}
                            
                            {(result.type === 'groups' || result.type === 'pages') && (
                              <Button 
                                size="sm" 
                                className="text-xs h-8 px-3"
                                onClick={() => handleAction('Join', result)}
                              >
                                Join
                              </Button>
                            )}
                            
                            {result.type === 'events' && (
                              <Button 
                                size="sm" 
                                className="text-xs h-8 px-3"
                                onClick={() => handleAction('Interested', result)}
                              >
                                Interested
                              </Button>
                            )}
                            
                            {result.type === 'marketplace' && (
                              <Button 
                                size="sm" 
                                className="text-xs h-8 px-3"
                                onClick={() => handleAction('View', result)}
                              >
                                View Item
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No {activeTab === 'all' ? '' : activeTab} results found</h3>
              <p className="text-gray-500 mb-6 dark:text-gray-400">
                Try searching for something else or check your spelling
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setActiveTab('all')}>
                  View All Results
                </Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  Go Back
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Tag icon component
const Tag = ({ className }: { className?: string }) => (
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
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

// Clock icon component
const Clock = ({ className }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default SearchResults;