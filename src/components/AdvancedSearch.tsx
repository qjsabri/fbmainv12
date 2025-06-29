import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Hash, ImageIcon, MapPin, Search, Users, Video, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Badge
} from '@/components/ui/badge';
import {
  Slider
} from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

interface SearchFilters {
  query: string;
  type: string;
  dateRange: string;
  location: string;
  author: string;
  timeRange?: [number, number]; // Hours ago
  hashtags?: string[];
  contentType?: string[];
}

interface RecentSearch {
  id: string;
  query: string;
  type: string;
  timestamp: Date;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    dateRange: 'any',
    location: '',
    author: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 24]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState('');
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [activeTab, setActiveTab] = useState('recent');
  const [trendingSearches] = useState([
    'New React features',
    'Tech conference 2024',
    'JavaScript tips',
    'Web development',
    'UI/UX design trends'
  ]);

  // Load recent searches from storage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string timestamps to Date objects
        const searches = parsed.map((search: Omit<RecentSearch, 'timestamp'> & { timestamp: string }) => ({
          ...search,
          timestamp: new Date(search.timestamp)
        }));
        setRecentSearches(searches);
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  const handleSearch = () => {
    // Add to recent searches if there's a query
    if (filters.query.trim()) {
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        query: filters.query,
        type: filters.type,
        timestamp: new Date()
      };
      
      const updatedSearches = [
        newSearch,
        ...recentSearches.filter(s => s.query !== filters.query).slice(0, 9) // Keep only 10 most recent
      ];
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
    }
    
    // Add additional filters when advanced is shown
    let searchFilters = { ...filters };
    if (showAdvanced) {
      searchFilters = {
        ...searchFilters,
        timeRange,
        hashtags,
        contentType: contentTypes
      };
    }
    
    onSearch(searchFilters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const addHashtag = () => {
    if (newHashtag && !hashtags.includes(newHashtag)) {
      setHashtags([...hashtags, newHashtag]);
      setNewHashtag('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const toggleContentType = (type: string) => {
    if (contentTypes.includes(type)) {
      setContentTypes(contentTypes.filter(t => t !== type));
    } else {
      setContentTypes([...contentTypes, type]);
    }
  };

  const handleRecentSearch = (search: RecentSearch) => {
    setFilters({
      ...filters,
      query: search.query,
      type: search.type
    });
    
    // Update timestamp
    const updatedSearches = recentSearches.map(s => 
      s.id === search.id ? { ...s, timestamp: new Date() } : s
    );
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
    
    // Trigger search
    onSearch({
      ...filters,
      query: search.query,
      type: search.type
    });
  };

  const removeRecentSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSearches = recentSearches.filter(s => s.id !== id);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.round(diffMs / 60000);
    
    if (diffMin < 60) {
      return `${diffMin}m ago`;
    } else if (diffMin < 1440) {
      return `${Math.round(diffMin / 60)}h ago`;
    } else {
      return `${Math.round(diffMin / 1440)}d ago`;
    }
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== 'all' && value !== 'any'
  ).length + (hashtags.length > 0 ? 1 : 0) + (contentTypes.length > 0 ? 1 : 0) + (timeRange[0] > 0 || timeRange[1] < 24 ? 1 : 0);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Advanced Search</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Search */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search for posts, people, pages, and more..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Content Type</label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="posts">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span>Posts</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="people">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>People</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pages">Pages</SelectItem>
                  <SelectItem value="groups">Groups</SelectItem>
                  <SelectItem value="events">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Events</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="videos">
                    <div className="flex items-center">
                      <Video className="w-4 h-4 mr-2" />
                      <span>Videos</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="photos">
                    <div className="flex items-center">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      <span>Photos</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Date Range</label>
              <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="City or region"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Author</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Posted by"
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Time Range (hours ago)</label>
              <div className="px-2">
                <Slider
                  value={timeRange}
                  onValueChange={setTimeRange}
                  min={0}
                  max={24}
                  step={1}
                  minStepsBetweenThumbs={1}
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Now</span>
                  <span>{timeRange[0]} - {timeRange[1]} hours</span>
                  <span>24h+</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Hashtags</label>
              <div className="flex space-x-2 mb-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Add hashtag"
                    value={newHashtag}
                    onChange={(e) => setNewHashtag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={addHashtag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>#{tag}</span>
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => removeHashtag(tag)} 
                    />
                  </Badge>
                ))}
                {hashtags.length === 0 && (
                  <span className="text-sm text-gray-500">No hashtags added</span>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Media Types</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'photo', label: 'Photos', icon: ImageIcon },
                  { id: 'video', label: 'Videos', icon: Video },
                  { id: 'text', label: 'Text Only', icon: BookOpen },
                  { id: 'poll', label: 'Polls', icon: BarChart },
                  { id: 'live', label: 'Live Videos', icon: Megaphone }
                ].map(type => (
                  <Button
                    key={type.id}
                    variant={contentTypes.includes(type.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleContentType(type.id)}
                    className="flex items-center space-x-1"
                  >
                    <type.icon className="w-4 h-4 mr-1" />
                    <span>{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-between">
              <Button variant="outline" onClick={() => {
                setFilters({
                  query: '',
                  type: 'all',
                  dateRange: 'any',
                  location: '',
                  author: ''
                });
                setTimeRange([0, 24]);
                setHashtags([]);
                setContentTypes([]);
              }}>
                Clear All Filters
              </Button>
              <Button onClick={handleSearch}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Search History and Suggestions */}
        <div className="pt-2 mt-2 border-t">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-3">
              <TabsTrigger value="recent">Recent Searches</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent">
              <div className="space-y-2">
                {recentSearches.length > 0 ? (
                  recentSearches.map((search) => (
                    <div 
                      key={search.id} 
                      className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-2 rounded-md cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700"
                      onClick={() => handleRecentSearch(search)}
                    >
                      <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium dark:text-gray-200">{search.query}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {search.type !== 'all' ? search.type : 'All content'} • {formatTimeAgo(search.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={(e) => removeRecentSearch(search.id, e)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No recent searches</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="trending">
              <div className="space-y-2">
                {trendingSearches.map((search, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 p-2 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={() => {
                      setFilters({...filters, query: search});
                      handleSearch();
                    }}
                  >
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center dark:bg-gray-700">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium dark:text-gray-200">{search}</p>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>Trending</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
            {filters.type !== 'all' && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <BookOpen className="w-3 h-3" />
                <span>{filters.type}</span>
              </Badge>
            )}
            {filters.dateRange !== 'any' && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{filters.dateRange}</span>
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{filters.location}</span>
              </Badge>
            )}
            {filters.author && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{filters.author}</span>
              </Badge>
            )}
            {(timeRange[0] > 0 || timeRange[1] < 24) && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{timeRange[0]}-{timeRange[1]}h</span>
              </Badge>
            )}
            {hashtags.length > 0 && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Tag className="w-3 h-3" />
                <span>{hashtags.length} hashtags</span>
              </Badge>
            )}
            {contentTypes.length > 0 && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Filter className="w-3 h-3" />
                <span>{contentTypes.length} types</span>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// BarChart icon component
function BarChart({ className }: { className?: string }) {
  return (
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
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
   </svg>
  );
}

// BookOpen icon component
function BookOpen({ className }: { className?: string }) {
  return (
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
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
  );
}

// Tag icon component
function Tag({ className }: { className?: string }) {
  return (
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
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
  );
}

// Clock icon component
function Clock({ className }: { className?: string }) {
  return (
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
}

// Megaphone icon component
function Megaphone({ className }: { className?: string }) {
  return (
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
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
  );
}

// TrendingUp icon component
function TrendingUp({ className }: { className?: string }) {
  return (
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
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
  );
}

export default AdvancedSearch;