import React, { useState, useEffect } from 'react';
import EventsTab from '@/components/EventsTab';
import EventCalendar from '@/components/EventCalendar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, List, Filter, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CreateEvent from '@/components/CreateEvent';
import { storage } from '@/lib/storage';

const Events = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [timeframe, setTimeframe] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load user preferences
  useEffect(() => {
    const savedView = storage.get<'list' | 'calendar'>('events_view_preference');
    if (savedView) {
      setView(savedView);
    }
  }, []);

  // Save user preferences
  useEffect(() => {
    storage.set('events_view_preference', view);
  }, [view]);

  const categories = [
    'All', 'Technology', 'Business', 'Education', 'Entertainment', 
    'Health', 'Sports', 'Food', 'Arts', 'Community', 'Other'
  ];

  const timeframes = [
    'All', 'Today', 'Tomorrow', 'This Week', 'This Weekend', 'Next Week', 'This Month'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
    // Event search performed
  };

  const handleCreateEvent = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="container-responsive mx-auto py-6">
        {/* Header with search and filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
            <div className="flex items-center space-x-2">
              <Tabs value={view} onValueChange={(value) => setView(value as 'list' | 'calendar')} className="hidden sm:block">
                <TabsList>
                  <TabsTrigger value="list" className="flex items-center space-x-2">
                    <List className="w-4 h-4" />
                    <span>List</span>
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Calendar</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={handleCreateEvent}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Button 
              variant={showFilters ? "default" : "outline"} 
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto w-full dark:border-gray-600"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <div className="sm:hidden">
              <Select value={view} onValueChange={(value) => setView(value as 'list' | 'calendar')}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">
                    <div className="flex items-center">
                      <List className="w-4 h-4 mr-2" />
                      <span>List</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="calendar">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Calendar</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4 dark:bg-gray-800">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Time Frame</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue placeholder="Select time frame" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCategory('All');
                    setTimeframe('All');
                    setSearchQuery('');
                  }}
                  className="mr-2 dark:border-gray-600 dark:text-gray-200"
                >
                  Clear Filters
                </Button>
                <Button>Apply Filters</Button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        {view === 'list' ? <EventsTab /> : <EventCalendar />}
      </div>

      {/* Create Event Modal */}
      <CreateEvent 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default Events;