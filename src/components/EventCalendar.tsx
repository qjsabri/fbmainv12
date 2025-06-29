import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, MapPin, Clock, Users, Star, Share, Plus, Search, Filter, ChevronLeft, ChevronRight, X, Globe, UsersRound, Lock, Info, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { format, addMonths, subMonths, eachDayOfInterval, isSameDay, isSameMonth, isToday, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  type: 'personal' | 'public' | 'friend' | 'birthday' | 'reminder';
  color: string;
  attendees?: number;
  maxAttendees?: number;
  organizer?: {
    name: string;
    avatar: string;
  };
  description?: string;
  isGoing?: boolean;
  isInterested?: boolean;
  category?: string;
  price?: string;
  privacy?: 'public' | 'friends' | 'private';
  recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  endDate?: Date | null;
  url?: string;
  coverImage?: string;
}

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPrivacy, setFilterPrivacy] = useState('all');
  const [filterAttending, setFilterAttending] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);

  const categories = ['all', 'Technology', 'Birthday', 'Work', 'Community', 'Personal', 'Entertainment', 'Sports', 'Books', 'Education', 'Health'];

  // Load events from storage or initialize with mock data
  useEffect(() => {
    const savedEvents = storage.get<Event[]>('calendar_events');
    
    if (savedEvents && savedEvents.length > 0) {
      // Convert string dates back to Date objects
      const parsedEvents = savedEvents.map(event => ({
        ...event,
        date: new Date(event.date),
        endDate: event.endDate ? new Date(event.endDate) : null
      }));
      setEvents(parsedEvents);
    } else {
      // Initialize with mock events
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Tech Conference 2024',
          date: new Date(2024, 2, 15),
          time: '9:00 AM',
          location: 'Convention Center, San Francisco',
          type: 'public',
          color: 'bg-blue-500',
          attendees: 1250,
          maxAttendees: 2000,
          organizer: {
            name: 'Tech Events Inc',
            avatar: MOCK_IMAGES.AVATARS[0]
          },
          description: 'Join us for the biggest tech conference of the year featuring latest innovations in AI, blockchain, and more.',
          category: 'Technology',
          price: '$199',
          privacy: 'public',
          coverImage: MOCK_IMAGES.POSTS[0]
        },
        {
          id: '2',
          title: 'Sarah\'s Birthday Party',
          date: new Date(2024, 2, 20),
          time: '7:00 PM',
          location: 'Sarah\'s House',
          type: 'birthday',
          color: 'bg-pink-500',
          attendees: 25,
          organizer: {
            name: 'Sarah Johnson',
            avatar: MOCK_IMAGES.AVATARS[1]
          },
          description: 'Come celebrate Sarah\'s 25th birthday! Food, drinks, and good vibes.',
          category: 'Birthday',
          price: 'Free',
          privacy: 'friends'
        },
        {
          id: '3',
          title: 'Team Meeting',
          date: new Date(2024, 2, 22),
          time: '2:00 PM',
          location: 'Office Conference Room',
          type: 'personal',
          color: 'bg-purple-500',
          attendees: 12,
          organizer: {
            name: 'Work Team',
            avatar: MOCK_IMAGES.AVATARS[2]
          },
          description: 'Weekly team sync to discuss project progress and upcoming deadlines.',
          category: 'Work',
          privacy: 'private',
          recurring: 'weekly',
          endDate: new Date(2024, 5, 30)
        },
        {
          id: '4',
          title: 'Community Garden Cleanup',
          date: new Date(2024, 2, 18),
          time: '10:00 AM',
          location: 'Central Community Garden',
          type: 'public',
          color: 'bg-green-500',
          attendees: 45,
          maxAttendees: 100,
          organizer: {
            name: 'Green Community',
            avatar: getSafeImage('AVATARS', 3)
          },
          description: 'Help us clean and beautify our local community garden. Bring gloves and enthusiasm!',
          category: 'Community',
          price: 'Free',
          privacy: 'public'
        },
        {
          id: '5',
          title: 'Dentist Appointment',
          date: new Date(2024, 2, 25),
          time: '3:30 PM',
          location: 'Downtown Dental Clinic',
          type: 'reminder',
          color: 'bg-gray-500',
          category: 'Personal',
          privacy: 'private'
        }
      ];
      
      setEvents(mockEvents);
    }
  }, []);

  // Generate recurring events
  useEffect(() => {
    // Generate recurring events
    const today = new Date();
    const recurringEvents: Event[] = [];
    
    // Find events with recurring property
    const baseRecurringEvents = events.filter(event => event.recurring && event.endDate);
    
    baseRecurringEvents.forEach(baseEvent => {
      if (!baseEvent.recurring || !baseEvent.endDate) return;
      
      const startDate = new Date(baseEvent.date);
      const endDate = new Date(baseEvent.endDate);
      
      // Skip if end date is in the past
      if (endDate < today) return;
      
      // Generate recurring instances
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        // Skip the original event
        if (isSameDay(currentDate, startDate)) {
          // Move to next occurrence
          currentDate = getNextOccurrence(currentDate, baseEvent.recurring);
          continue;
        }
        
        // Create a new event instance
        const recurringEvent: Event = {
          ...baseEvent,
          id: `${baseEvent.id}-${currentDate.toISOString()}`,
          date: new Date(currentDate),
          isRecurring: true
        };
        
        recurringEvents.push(recurringEvent);
        
        // Move to next occurrence
        currentDate = getNextOccurrence(currentDate, baseEvent.recurring);
      }
    });
    
    // Add recurring events to the events array if they don't already exist
    if (recurringEvents.length > 0) {
      setEvents(prevEvents => {
        const existingEventIds = new Set(prevEvents.map(e => e.id));
        const newRecurringEvents = recurringEvents.filter(e => !existingEventIds.has(e.id));
        return [...prevEvents, ...newRecurringEvents];
      });
    }
  }, [events]);

  // Save events to storage when they change
  useEffect(() => {
    if (events.length > 0) {
      storage.set('calendar_events', events);
    }
  }, [events]);

  // Get next occurrence based on recurrence pattern
  const getNextOccurrence = (date: Date, recurrence: string): Date => {
    const nextDate = new Date(date);
    
    switch (recurrence) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    
    return nextDate;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        return subMonths(newDate, 1);
      } else {
        return addMonths(newDate, 1);
      }
    });
    setSelectedDate(null);
  };

  const handleEventAction = useCallback((eventId: string, action: 'going' | 'interested' | 'share' | 'remind' | 'cancel') => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    switch (action) {
      case 'going':
        setEvents(prev => prev.map(e => 
          e.id === eventId 
            ? { 
                ...e, 
                isGoing: !e.isGoing, 
                isInterested: false,
                attendees: e.isGoing ? (e.attendees || 0) - 1 : (e.attendees || 0) + 1 
              }
            : e
        ));
        toast.success(event.isGoing ? 'Removed from going' : 'Marked as going');
        break;
      case 'interested':
        setEvents(prev => prev.map(e => 
          e.id === eventId 
            ? { 
                ...e, 
                isInterested: !e.isInterested, 
                isGoing: false 
              }
            : e
        ));
        toast.success(event.isInterested ? 'Removed from interested' : 'Marked as interested');
        break;
      case 'share':
        navigator.clipboard.writeText(`Check out this event: ${event.title}`);
        toast.success('Event link copied to clipboard');
        break;
      case 'remind':
        toast.success('Reminder set for this event');
        break;
      case 'cancel':
        if (confirm('Are you sure you want to cancel your attendance?')) {
          setEvents(prev => prev.map(e => 
            e.id === eventId 
              ? { 
                  ...e, 
                  isGoing: false, 
                  isInterested: false,
                  attendees: e.isGoing ? (e.attendees || 0) - 1 : e.attendees
                }
              : e
          ));
          toast.success('You are no longer attending this event');
        }
        break;
    }
  }, [events]);

  const handleCreateNewEvent = (eventData: Event) => {
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: eventData.title,
      date: parseISO(eventData.date),
      time: eventData.time,
      location: eventData.location,
      type: 'personal',
      color: 'bg-blue-500',
      description: eventData.description,
      category: eventData.category || 'Personal',
      privacy: eventData.privacy || 'friends',
      isGoing: true,
      attendees: 1,
      organizer: {
        name: 'You',
        avatar: getSafeImage('AVATARS', 7)
      }
    };
    
    setEvents(prev => [...prev, newEvent]);
    setSelectedDate(newEvent.date);
    toast.success('Event created successfully!');
    setIsCreateModalOpen(false);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesPrivacy = filterPrivacy === 'all' || event.privacy === filterPrivacy;
    const matchesAttending = filterAttending === 'all' || 
                            (filterAttending === 'going' && event.isGoing) ||
                            (filterAttending === 'interested' && event.isInterested);
    return matchesSearch && matchesCategory && matchesPrivacy && matchesAttending;
  });

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date).filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
        const matchesPrivacy = filterPrivacy === 'all' || event.privacy === filterPrivacy;
        const matchesAttending = filterAttending === 'all' || 
                                (filterAttending === 'going' && event.isGoing) ||
                                (filterAttending === 'interested' && event.isInterested);
        return matchesSearch && matchesCategory && matchesPrivacy && matchesAttending;
      });
      const isToday = isSameDay(date, new Date());
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-800 ${
            isToday ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-800' : ''
          } ${isSelected ? 'bg-blue-100 border-blue-400 dark:bg-blue-900/30 dark:border-blue-700' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
            {day}
          </div>
          <div className="space-y-1 mt-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 ${event.color}`}
                title={`${event.title} - ${event.time}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate(date);
                }}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    // Get the start of the week (Sunday) for the current date
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDate.getDay());
    
    // Get days of the week
    const days = eachDayOfInterval({
      start: startDate,
      end: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6)
    });
    
    return (
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, _index) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b dark:text-gray-400 dark:border-gray-700">
            {day}
          </div>
        ))}
        
        {/* Day cells */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day).filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
            return matchesSearch && matchesCategory;
          });
          
          const isCurrentDay = isToday(day);
          const isSelected = selectedDate?.toDateString() === day.toDateString();
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div 
              key={index}
              className={`min-h-[150px] border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-800 ${
                isCurrentDay ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-800' : ''
              } ${isSelected ? 'bg-blue-100 border-blue-400 dark:bg-blue-900/30 dark:border-blue-700' : ''}
              ${!isCurrentMonth ? 'bg-gray-100 dark:bg-gray-800/30' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className={`text-sm font-medium ${
                isCurrentDay ? 'text-blue-600 dark:text-blue-400' : 
                !isCurrentMonth ? 'text-gray-400 dark:text-gray-500' : 
                'text-gray-900 dark:text-gray-100'
              }`}>
                {day.getDate()}
              </div>
              <div className="space-y-1 mt-2">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 ${event.color}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(day);
                    }}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div>{event.time}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayToShow = selectedDate || new Date();
    const dayEvents = getEventsForDate(dayToShow).filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    
    // Sort events by time
    dayEvents.sort((a, b) => {
      const timeA = a.time.includes('AM') ? 
        parseInt(a.time.split(':')[0]) : 
        parseInt(a.time.split(':')[0]) + 12;
      
      const timeB = b.time.includes('AM') ? 
        parseInt(b.time.split(':')[0]) : 
        parseInt(b.time.split(':')[0]) + 12;
      
      return timeA - timeB;
    });
    
    const timeSlots = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="flex flex-col">
        <div className="text-center p-2 font-medium text-lg mb-4 dark:text-white">
          {format(dayToShow, 'EEEE, MMMM d, yyyy')}
        </div>
        
        <div className="grid grid-cols-[80px_1fr] gap-0">
          {timeSlots.map(hour => {
            const displayHour = hour === 0 ? '12 AM' : 
                              hour < 12 ? `${hour} AM` : 
                              hour === 12 ? '12 PM' : 
                              `${hour - 12} PM`;
            
            const hourEvents = dayEvents.filter(event => {
              const eventHour = parseInt(event.time.split(':')[0]);
              const isPM = event.time.includes('PM');
              const eventHour24 = isPM && eventHour !== 12 ? eventHour + 12 : 
                                !isPM && eventHour === 12 ? 0 : eventHour;
              return eventHour24 === hour;
            });
            
            return (
              <React.Fragment key={hour}>
                <div className="border-t border-r border-gray-200 p-2 text-right text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  {displayHour}
                </div>
                <div className="border-t border-gray-200 p-2 min-h-[60px] dark:border-gray-700">
                  {hourEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`${event.color} text-white p-2 rounded mb-1 cursor-pointer`}
                      onClick={() => setSelectedDate(dayToShow)}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs">{event.time} • {event.location}</div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate).filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesPrivacy = filterPrivacy === 'all' || event.privacy === filterPrivacy;
    const matchesAttending = filterAttending === 'all' || 
                            (filterAttending === 'going' && event.isGoing) ||
                            (filterAttending === 'interested' && event.isInterested);
    return matchesSearch && matchesCategory && matchesPrivacy && matchesAttending;
  }) : [];

  // Get upcoming events (sorted by date)
  const upcomingEvents = [...filteredEvents]
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {format(currentDate, 'MMMM yyyy')}
                </span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')} className="dark:border-gray-600 dark:text-gray-200">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="dark:border-gray-600 dark:text-gray-200">
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')} className="dark:border-gray-600 dark:text-gray-200">
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Select value={viewMode} onValueChange={(value: 'month' | 'week' | 'day') => setViewMode(value)}>
                  <SelectTrigger className="w-[120px] dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button 
                variant={showFilters ? "default" : "outline"} 
                size="icon" 
                onClick={() => setShowFilters(!showFilters)}
                className="dark:border-gray-600"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">Category</label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">Privacy</label>
                  <Select value={filterPrivacy} onValueChange={setFilterPrivacy}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
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
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">Attending</label>
                  <Select value={filterAttending} onValueChange={setFilterAttending}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="going">Going</SelectItem>
                      <SelectItem value="interested">Interested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b dark:text-gray-400 dark:border-gray-700">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div ref={calendarRef} className="overflow-auto max-h-[600px]">
              {viewMode === 'month' && (
                <div className="grid grid-cols-7 gap-0">
                  {renderCalendarDays()}
                </div>
              )}
              
              {viewMode === 'week' && renderWeekView()}
              
              {viewMode === 'day' && renderDayView()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {selectedDate 
                  ? selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : 'Select a date'
                }
              </CardTitle>
              <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow dark:border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                        <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        
                        {event.attendees && (
                          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-3 h-3" />
                            <span>
                              {event.attendees} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} attending
                            </span>
                          </div>
                        )}
                        
                        {event.organizer && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={event.organizer.avatar} />
                              <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500 dark:text-gray-400">by {event.organizer.name}</span>
                          </div>
                        )}

                        {event.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2 dark:text-gray-300">{event.description}</p>
                        )}
                        
                        {event.recurring && (
                          <Badge variant="outline" className="mt-2 text-xs dark:border-gray-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            {event.recurring.charAt(0).toUpperCase() + event.recurring.slice(1)}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end space-y-1">
                        <Badge 
                          variant="outline" 
                          className={`${event.color} text-white border-transparent`}
                        >
                          {event.category}
                        </Badge>
                        {event.price && (
                          <Badge variant="secondary" className="text-xs">
                            {event.price}
                          </Badge>
                        )}
                        {event.privacy && (
                          <Badge variant="outline" className="text-xs dark:border-gray-600">
                            {event.privacy === 'public' ? (
                              <Globe className="w-3 h-3 mr-1" />
                            ) : event.privacy === 'friends' ? (
                              <UsersRound className="w-3 h-3 mr-1" />
                            ) : (
                              <Lock className="w-3 h-3 mr-1" />
                            )}
                            {event.privacy}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Event Actions */}
                    {event.type !== 'reminder' && (
                      <div className="flex space-x-2 mt-3 pt-3 border-t dark:border-gray-700">
                        <Button 
                          size="sm" 
                          variant={event.isGoing ? "default" : "outline"}
                          onClick={() => handleEventAction(event.id, 'going')}
                          className="flex-1 dark:border-gray-600"
                        >
                          {event.isGoing ? 'Going' : 'Join'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant={event.isInterested ? "default" : "outline"}
                          onClick={() => handleEventAction(event.id, 'interested')}
                          className="flex-1 dark:border-gray-600"
                        >
                          <Star className={`w-3 h-3 mr-1 ${event.isInterested ? 'fill-current' : ''}`} />
                          {event.isInterested ? 'Interested' : 'Maybe'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEventAction(event.id, 'share')}
                          className="dark:border-gray-600"
                        >
                          <Share className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    {event.type === 'reminder' && (
                      <div className="flex space-x-2 mt-3 pt-3 border-t dark:border-gray-700">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEventAction(event.id, 'remind')}
                          className="flex-1 dark:border-gray-600"
                        >
                          <Bell className="w-3 h-3 mr-1" />
                          Set Reminder
                        </Button>
                      </div>
                    )}
                    
                    {/* Cancel attendance option */}
                    {event.isGoing && (
                      <div className="mt-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEventAction(event.id, 'cancel')}
                          className="text-red-600 text-xs h-6 px-2 dark:text-red-400"
                        >
                          Cancel attendance
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50 dark:text-gray-600" />
                <p>No events for this date</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 dark:border-gray-600 dark:text-gray-200"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-2">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer dark:hover:bg-gray-800"
                    onClick={() => setSelectedDate(event.date)}
                  >
                    <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{event.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.date.toLocaleDateString()} at {event.time}
                      </p>
                    </div>
                    {event.isGoing && (
                      <Badge variant="secondary" className="text-xs">Going</Badge>
                    )}
                    {event.isInterested && (
                      <Badge variant="outline" className="text-xs dark:border-gray-600">Interested</Badge>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600 dark:text-blue-400">
                  View All Events
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <p className="text-sm">No upcoming events</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Event Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-500 text-white border-transparent">
                Technology
              </Badge>
              <Badge variant="outline" className="bg-pink-500 text-white border-transparent">
                Birthday
              </Badge>
              <Badge variant="outline" className="bg-purple-500 text-white border-transparent">
                Work
              </Badge>
              <Badge variant="outline" className="bg-green-500 text-white border-transparent">
                Community
              </Badge>
              <Badge variant="outline" className="bg-gray-500 text-white border-transparent">
                Personal
              </Badge>
              <Badge variant="outline" className="bg-indigo-500 text-white border-transparent">
                Books
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Create Event</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const eventData = {
                  title: formData.get('title') as string,
                  date: formData.get('date') as string,
                  time: formData.get('time') as string,
                  location: formData.get('location') as string,
                  description: formData.get('description') as string,
                  category: formData.get('category') as string,
                  privacy: formData.get('privacy') as string,
                };
                handleCreateNewEvent(eventData);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">Event Title</label>
                  <Input
                    name="title"
                    placeholder="What's your event called?"
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Date</label>
                    <Input
                      type="date"
                      name="date"
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      defaultValue={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
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
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Category</label>
                    <Select name="category" defaultValue="Personal">
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Privacy</label>
                    <Select name="privacy" defaultValue="friends">
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

                <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-900/20">
                  <div className="flex items-start space-x-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 dark:text-blue-400" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-300">Event Privacy</h4>
                      <p className="text-sm text-blue-700 mt-1 dark:text-blue-200">
                        Public events are visible to anyone, friends events are only visible to your friends, and private events are only visible to you and people you invite.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="dark:border-gray-600 dark:text-gray-200">
                    Cancel
                  </Button>
                  <Button type="submit">Create Event</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;