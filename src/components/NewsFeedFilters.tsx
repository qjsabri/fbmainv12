import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Users, MapPin, Filter, Heart, Bookmark, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface NewsFeedFiltersProps {
  creator: string;
  setCreator: (value: string) => void;
  dateRange: string | any;
  setDateRange: (value: any) => void;
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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center dark:text-white">
          <Filter className="mr-2 h-5 w-5" />
          Filter Posts
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            <Users className="w-4 h-4 inline mr-2" />
            By Creator
          </label>
          <Input
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            placeholder="Enter creator name"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date Range
          </label>
          <Select 
            value={typeof dateRange === 'string' ? dateRange : 'custom'} 
            onValueChange={setDateRange}
          >
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            <MapPin className="w-4 h-4 inline mr-2" />
            Location
          </label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Filter by location"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Content Filters
          </label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={liked} 
                onChange={() => setLiked(!liked)} 
                className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm flex items-center dark:text-gray-200">
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                Only show posts I've liked
              </span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={saved} 
                onChange={() => setSaved(!saved)} 
                className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm flex items-center dark:text-gray-200">
                <Bookmark className="w-4 h-4 mr-2 text-purple-500" />
                Only show posts I've saved
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t dark:border-gray-700">
          <Button 
            variant="outline" 
            onClick={onClear}
            className="dark:border-gray-600 dark:text-gray-200"
          >
            Clear All
          </Button>
          <Button onClick={onApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsFeedFilters;