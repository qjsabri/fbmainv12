import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, User, Heart, Bookmark, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface NewsFeedFiltersProps {
  creator: string;
  setCreator: (value: string) => void;
  dateRange: string;
  setDateRange: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  liked: boolean;
  setLiked: (value: boolean) => void;
  saved: boolean;
  setSaved: (value: boolean) => void;
  onApply: () => void;
  onClear: () => void;
}

const NewsFeedFilters: React.FC<NewsFeedFiltersProps> = ({
  creator,
  setCreator,
  dateRange,
  setDateRange,
  location,
  setLocation,
  liked,
  setLiked,
  saved,
  setSaved,
  onApply,
  onClear
}) => {
  // Count active filters
  const activeFiltersCount = [
    creator !== '',
    dateRange !== 'all',
    location !== '',
    liked,
    saved
  ].filter(Boolean).length;

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm dark:text-white">Advanced Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} active</Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Creator</label>
            <div className="relative">
              <User className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder="Filter by creator name"
                className="pl-8 sm:pl-10 text-xs sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange} >
              <SelectTrigger className="text-xs sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent className="text-xs sm:text-sm">
                <SelectItem value="all">All Time</SelectItem>
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Filter by location"
                className="pl-10 text-xs sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-end space-x-4">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <input 
                type="checkbox" 
                id="liked-posts"
                checked={liked}
                onChange={(e) => setLiked(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:text-blue-400"
              />
              <label htmlFor="liked-posts" className="text-xs sm:text-sm dark:text-gray-200">
                Liked Posts
              </label>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <input 
                type="checkbox" 
                id="saved-posts"
                checked={saved}
                onChange={(e) => setSaved(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:text-blue-400"
              />
              <label htmlFor="saved-posts" className="text-xs sm:text-sm dark:text-gray-200">
                Saved Posts
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2 mt-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClear}
            className="text-xs dark:border-gray-600 dark:text-gray-200"
          >
            Clear Filters
          </Button>
          <Button size="sm" onClick={onApply} className="text-xs">
            Apply Filters
          </Button>
        </div>

        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400 self-center">Active filters:</span>
            
            {creator && (
              <Badge variant="outline" className="text-xs flex items-center space-x-1 dark:border-gray-600">
                <User className="w-3 h-3" />
                <span>{creator}</span>
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setCreator('')} />
              </Badge>
            )}
            
            {dateRange !== 'all' && (
              <Badge variant="outline" className="text-xs flex items-center space-x-1 dark:border-gray-600">
                <Calendar className="w-3 h-3" />
                <span>{dateRange}</span>
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setDateRange('all')} />
              </Badge>
            )}
            
            {location && (
              <Badge variant="outline" className="text-xs flex items-center space-x-1 dark:border-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{location}</span>
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setLocation('')} />
              </Badge>
            )}
            
            {liked && (
              <Badge variant="outline" className="text-xs flex items-center space-x-1 dark:border-gray-600">
                <Heart className="w-3 h-3" />
                <span>Liked</span>
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setLiked(false)} />
              </Badge>
            )}
            
            {saved && (
              <Badge variant="outline" className="text-xs flex items-center space-x-1 dark:border-gray-600">
                <Bookmark className="w-3 h-3" />
                <span>Saved</span>
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSaved(false)} />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsFeedFilters;