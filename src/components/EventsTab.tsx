import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Star, Share, Plus, Search, Filter, ChevronDown, ChevronUp, Globe, UsersRound, Lock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: {
    name: string;
    avatar: string;
  };
  attendees: number;
  maxAttendees?: number;
  image: string;
  isGoing: boolean;
  isInterested: boolean;
  category: string;
  price?: string;
  privacy?: 'public' | 'friends' | 'private';
  recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  endDate?: string;
  tags?: string[];
}

const EventsTab = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrivacy, setSelectedPrivacy] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Load events from storage or initialize with mock data
  useEffect(() => {
    const savedEvents = storage.get<Event[]>('events_data');
    
    if (savedEvents && savedEvents.length > 0) {
      setEvents(savedEvents);
    } else {
      // Initialize with mock events
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Tech Conference 2024',
          description: 'Join us for the biggest tech conference of the year featuring latest innovations in AI, blockchain, and more.',
          date: '2024-06-15',
          time: '9:00 AM',
          location: 'San Francisco Convention Center',
          organizer: {
            name: 'Tech Events Inc',
            avatar: MOCK_IMAGES.AVATARS[0]
          },
          attendees: 1250,
          maxAttendees: 2000,
          image: MOCK_IMAGES.POSTS[0],
          isGoing: false,
          isInterested: true,
          category: 'Technology',
          price: '$199',
          privacy: 'public',
          tags: ['tech', 'ai', 'blockchain', 'conference']
        },
        {
          id: '2',
          title: 'Community Garden Cleanup',
          description: 'Help us clean and beautify our local community garden. Bring gloves and enthusiasm!',
          date: '2024-06-20',
          time: '10:00 AM',
          location: 'Central Community Garden',
          organizer: {
            name: 'Green Community',
            avatar: MOCK_IMAGES.AVATARS[1]
          },
          attendees: 45,
          image: getSafeImage('POSTS', 2),
          isGoing: true,
          isInterested: false,
          category: 'Community',
          price: 'Free',
          privacy: 'public',
          tags: ['community', 'garden', 'volunteer']
        },
        {
          id: '3',
          title: 'Weekly Book Club Meeting',
          description: 'Join us for our weekly book club discussion. This week we\'re discussing "The Midnight Library" by Matt Haig.',
          date: '2024-06-18',
          time: '7:00 PM',
          location: 'City Library, Meeting Room 3',
          organizer: {
            name: 'Book Lovers Club',
            avatar: getSafeImage('AVATARS', 2)
          },
          attendees: 18,
          image: getSafeImage('POSTS', 3),
          isGoing: false,
          isInterested: false,
          category: 'Education',
          price: 'Free',
          privacy: 'friends',
          recurring: 'weekly',
          tags: ['books', 'reading', 'discussion']
        },
        {
          id: '4',
          title: 'Summer Music Festival',
          description: 'Three days of amazing music featuring top artists from around the world. Food, drinks, and great vibes!',
          date: '2024-07-10',
          time: '12:00 PM',
          location: 'Golden Gate Park',
          organizer: {
            name: 'City Music Events',
            avatar: getSafeImage('AVATARS', 3)
          },
          attendees: 5000,
          maxAttendees: 10000,
          image: getSafeImage('POSTS', 4),
          isGoing: false,
          isInterested: true,
          category: 'Entertainment',
          price: '$75',
          privacy: 'public',
          tags: ['music', 'festival', 'summer', 'concert']
        },
        {
          id: '5',
          title: 'Yoga in the Park',
          description: 'Start your weekend with a relaxing yoga session in the park. All levels welcome!',
          date: '2024-06-22',
          time: '8:00 AM',
          location: 'Central Park, East Meadow',
          organizer: {
            name: 'Mindful Yoga',
            avatar: getSafeImage('AVATARS', 4)
          },
          attendees: 35,
          image: getSafeImage('POSTS', 5),
          isGoing: true,
          isInterested: false,
          category: 'Health',
          price: '$10',
          privacy: 'public',
          recurring: 'weekly',
          tags: ['yoga', 'fitness', 'wellness', 'outdoors']
        }
      ];
      
      setEvents(mockEvents);
      storage.set('events_data', mockEvents);
    }
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  // Save events to storage when they change
  useEffect(() => {
    if (events.length > 0) {
      storage.set('events_data', events);
    }
  }, [events]);

  const categories = ['All', 'Technology', 'Community', 'Education', 'Entertainment', 'Health', 'Business', 'Sports', 'Food', 'Arts'];
  const privacyOptions = ['All', 'Public', 'Friends', 'Private'];
  const dateOptions = ['All', 'Today', 'Tomorrow', 'This Week', 'This Weekend', 'Next Week', 'This Month'];

  const handleGoing = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            isGoing: !event.isGoing, 
            isInterested: false,
            attendees: event.isGoing ? event.attendees - 1 : event.attendees + 1
          }
        : event
    ));
    
    const event = events.find(e => e.id === eventId);
    if (event) {
      toast.success(event.isGoing ? 'You are no longer going to this event' : 'You are now going to this event');
    }
  };

  const handleInterested = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, isInterested: !event.isInterested, isGoing: false }
        : event
    ));
    
    const event = events.find(e => e.id === eventId);
    if (event) {
      toast.success(event.isInterested ? 'Removed from interested events' : 'Added to interested events');
    }
  };

  const handleShare = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      navigator.clipboard.writeText(`Check out this event: ${event.title} on ${event.date} at ${event.location}`);
      toast.success('Event details copied to clipboard');
    }
  };

  const handleCreateEvent = () => {
    setIsCreateModalOpen(true);
  };

  const handleSubmitEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      location: formData.get('location') as string,
      organizer: {
        name: 'You',
        avatar: getSafeImage('AVATARS', 7)
      },
      attendees: 1,
      image: MOCK_IMAGES.POSTS[Math.floor(Math.random() * MOCK_IMAGES.POSTS.length)],
      isGoing: true,
      isInterested: false,
      category: formData.get('category') as string,
      price: formData.get('price') as string || 'Free',
      privacy: formData.get('privacy') as 'public' | 'friends' | 'private',
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim())
    };
    
    setEvents([...events, newEvent]);
    setIsCreateModalOpen(false);
    toast.success('Event created successfully!');
  };

  // Filter events based on search, category, privacy, and date
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    
    const matchesPrivacy = selectedPrivacy === 'All' || 
                          (event.privacy && event.privacy.toLowerCase() === selectedPrivacy.toLowerCase());
    
    // Date filtering
    let matchesDate = true;
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7 - today.getDay());
    
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
    
    const thisWeekend = new Date(today);
    thisWeekend.setDate(today.getDate() + (6 - today.getDay()));
    
    const nextDay = new Date(thisWeekend);
    nextDay.setDate(thisWeekend.getDate() + 1);
    
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    switch (selectedDate) {
      case 'Today': {
        matchesDate = eventDate.toDateString() === today.toDateString();
        break;
      }
      case 'Tomorrow': {
        matchesDate = eventDate.toDateString() === tomorrow.toDateString();
        break;
      }
      case 'This Week': {
        matchesDate = eventDate >= today && eventDate < nextWeekStart;
        break;
      }
      case 'This Weekend': {
        matchesDate = eventDate.toDateString() === thisWeekend.toDateString() || 
                     eventDate.toDateString() === nextDay.toDateString();
        break;
      }
      case 'Next Week': {
        matchesDate = eventDate >= nextWeekStart && eventDate <= nextWeekEnd;
        break;
      }
      case 'This Month': {
        matchesDate = eventDate >= today && eventDate <= monthEnd;
        break;
      }
      default: {
        matchesDate = true;
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrivacy && matchesDate;
  });

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'popularity':
        return b.attendees - a.attendees;
      case 'price': {
        const aPrice = a.price === 'Free' ? 0 : parseFloat(a.price?.replace(/[^0-9.-]+/g, '') || '0');
        const bPrice = b.price === 'Free' ? 0 : parseFloat(b.price?.replace(/[^0-9.-]+/g, '') || '0');
        return aPrice - bPrice;
      }
      default:
        return 0;
    }
  });

  // Get privacy badge color
  const getPrivacyBadgeColor = (privacy?: string) => {
    switch(privacy) {
      case 'public': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'friends': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'private': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="w-full">
      <div className="container-responsive mx-auto py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
          <Button onClick={handleCreateEvent} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={showFilters ? "default" : "outline"} 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 dark:border-gray-600"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="dark:border-gray-600"
            >
              {viewMode === 'grid' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Privacy</label>
              <Select value={selectedPrivacy} onValueChange={setSelectedPrivacy}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Select privacy" />
                </SelectTrigger>
                <SelectContent>
                  {privacyOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option === 'All' ? option : (
                        <div className="flex items-center">
                          {option === 'Public' ? (
                            <Globe className="w-4 h-4 mr-2 text-green-500" />
                          ) : option === 'Friends' ? (
                            <UsersRound className="w-4 h-4 mr-2 text-blue-500" />
                          ) : (
                            <Lock className="w-4 h-4 mr-2 text-red-500" />
                          )}
                          <span>{option}</span>
                        </div>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Date</label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {dateOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Soonest)</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price">Price (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {isLoading ? (
          // Loading skeleton
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 dark:bg-gray-700"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
                      <div className="h-8 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedEvents.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {sortedEvents.map((event) => (
              <Card key={event.id} className={`overflow-hidden hover:shadow-lg transition-shadow h-full flex ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row'}`}>
                <div className={`relative ${viewMode === 'grid' ? '' : 'md:w-1/3'}`}>
                  <img
                    src={event.image}
                    alt={event.title}
                    className={`w-full ${viewMode === 'grid' ? 'h-48' : 'md:h-full h-48'} object-cover`}
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 dark:bg-black/70 dark:text-white">
                      {event.price}
                    </Badge>
                  </div>
                  
                  {event.privacy && (
                    <div className="absolute top-3 left-3">
                      <Badge className={getPrivacyBadgeColor(event.privacy)}>
                        {event.privacy === 'public' ? (
                          <Globe className="w-3 h-3 mr-1" />
                        ) : event.privacy === 'friends' ? (
                          <UsersRound className="w-3 h-3 mr-1" />
                        ) : (
                          <Lock className="w-3 h-3 mr-1" />
                        )}
                        {event.privacy}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className={`p-4 flex-1 flex flex-col ${viewMode === 'grid' ? '' : 'md:p-6'}`}>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 dark:text-gray-400">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.attendees} going
                          {event.maxAttendees && ` (${event.maxAttendees} max)`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={event.organizer.avatar} />
                        <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600 dark:text-gray-400">by {event.organizer.name}</span>
                    </div>
                    
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs dark:border-gray-600">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-auto">
                    <Button
                      size="sm"
                      variant={event.isGoing ? 'default' : 'outline'}
                      onClick={() => handleGoing(event.id)}
                      className="flex-1 dark:border-gray-600"
                    >
                      {event.isGoing ? 'Going' : 'Join'}
                    </Button>
                    <Button
                      size="sm"
                      variant={event.isInterested ? 'default' : 'outline'}
                      onClick={() => handleInterested(event.id)}
                      className="flex-1 dark:border-gray-600"
                    >
                      <Star className={`w-4 h-4 mr-1 ${event.isInterested ? 'fill-current' : ''}`} />
                      {event.isInterested ? 'Interested' : 'Maybe'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare(event.id)}
                      className="dark:border-gray-600"
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No events found</h3>
            <p className="text-gray-500 mb-4 dark:text-gray-400">Try adjusting your search or filters to find more events.</p>
            <Button onClick={handleCreateEvent}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        )}
      </div>
      
      {/* Create Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Event Title</label>
              <Input
                name="title"
                placeholder="What's your event called?"
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Description</label>
              <textarea
                name="description"
                placeholder="Tell people about your event"
                rows={3}
                className="w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Date</label>
                <Input
                  type="date"
                  name="date"
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Time</label>
                <Input
                  type="time"
                  name="time"
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  name="location"
                  placeholder="Where is your event?"
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Category</label>
                <Select name="category" defaultValue="Technology">
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'All').map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Privacy</label>
                <Select name="privacy" defaultValue="public">
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-green-500" />
                        <span>Public</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="friends">
                      <div className="flex items-center">
                        <UsersRound className="w-4 h-4 mr-2 text-blue-500" />
                        <span>Friends</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-red-500" />
                        <span>Private</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Price</label>
                <Input
                  name="price"
                  placeholder="Free or $XX"
                  defaultValue="Free"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Tags</label>
                <Input
                  name="tags"
                  placeholder="Comma separated tags"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">e.g., music, outdoors, networking</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="dark:border-gray-600 dark:text-gray-200">
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsTab;