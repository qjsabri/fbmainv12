import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  isGoing: boolean;
  organizer: {
    name: string;
    avatar: string;
  };
  image: string;
  category?: string;
}

const EventsWidget = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from storage or use mock data
  useEffect(() => {
    const savedEvents = storage.get<Event[]>('events_widget_data');
    
    if (savedEvents && savedEvents.length > 0) {
      setEvents(savedEvents);
    } else {
      // Initialize with mock events
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Tech Meetup 2024',
          date: 'Jun 20',
          time: '7:00 PM',
          location: 'Downtown Conference Center',
          attendees: 45,
          isGoing: true,
          organizer: {
            name: 'Tech Community',
            avatar: MOCK_IMAGES.AVATARS[0]
          },
          image: MOCK_IMAGES.POSTS[0],
          category: 'Technology'
        },
        {
          id: '2',
          title: 'Photography Workshop',
          date: 'Jun 25',
          time: '2:00 PM',
          location: 'Art Studio',
          attendees: 12,
          isGoing: false,
          organizer: {
            name: 'Photo Club',
            avatar: MOCK_IMAGES.AVATARS[1]
          },
          image: MOCK_IMAGES.POSTS[1],
          category: 'Arts'
        },
        {
          id: '3',
          title: 'Summer Music Festival',
          date: 'Jul 15',
          time: '12:00 PM',
          location: 'Central Park',
          attendees: 1200,
          isGoing: false,
          organizer: {
            name: 'City Events',
            avatar: getSafeImage('AVATARS', 2)
          },
          image: getSafeImage('POSTS', 2),
          category: 'Music'
        }
      ];
      
      setEvents(mockEvents);
      storage.set('events_widget_data', mockEvents);
    }
  }, []);

  // Save events to storage when they change
  useEffect(() => {
    if (events.length > 0) {
      storage.set('events_widget_data', events);
    }
  }, [events]);

  const handleEventAction = (eventId: string, action: 'attend' | 'interested') => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isGoing: action === 'going' ? !event.isGoing : event.isGoing }
        : event
    ));
    
    toast.success(`Event status updated`);
  };

  const handleViewAll = () => {
    navigate('/events');
  };

  return (
    <Card className="hidden lg:block">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>Upcoming Events</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleViewAll}
            className="text-blue-600 text-xs dark:text-blue-400"
          >
            See All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow dark:border-gray-700">
              <div className="flex space-x-3">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate dark:text-white">{event.title}</h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1 dark:text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1 dark:text-gray-400">
                    <Users className="w-3 h-3" />
                    <span>{event.attendees} going</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={event.organizer.avatar} />
                    <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{event.organizer.name}</span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant={event.isGoing ? "default" : "outline"}
                    onClick={() => handleEventAction(event.id, 'going')}
                    className="text-xs h-6 px-2 dark:border-gray-600"
                  >
                    {event.isGoing ? 'Going' : 'Join'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEventAction(event.id, 'interested')}
                    className="text-xs h-6 px-2 dark:border-gray-600"
                  >
                    Interested
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-3 text-blue-600 dark:text-blue-400"
          onClick={handleViewAll}
        >
          See all events
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventsWidget;