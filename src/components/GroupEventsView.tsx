import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Calendar, MapPin, Users, Plus, Filter, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface GroupEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  attendees: number;
  isGoing?: boolean;
  organizer?: {
    name: string;
    avatar: string;
  };
}

interface GroupEventsViewProps {
  events: GroupEvent[];
  isJoined: boolean;
  onCreateEvent: (event: Omit<GroupEvent, 'id' | 'attendees' | 'isGoing'>) => void;
  onAttendEvent: (eventId: string) => void;
}

const GroupEventsView: React.FC<GroupEventsViewProps> = ({
  events,
  isJoined,
  onCreateEvent,
  onAttendEvent
}) => {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    onCreateEvent({
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      description: newEvent.description
    });
    
    setIsCreateEventOpen(false);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: ''
    });
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold dark:text-white">Upcoming Events</h2>
        {isJoined && (
          <Button onClick={() => setIsCreateEventOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <Button variant="outline" size="icon" className="dark:border-gray-600 dark:text-gray-200">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white">{event.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} {event.attendees === 1 ? 'person' : 'people'} going</span>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-gray-700 mt-2 dark:text-gray-300">{event.description}</p>
                    )}
                  </div>
                  
                  {isJoined && (
                    <Button
                      variant={event.isGoing ? "default" : "outline"}
                      onClick={() => onAttendEvent(event.id)}
                      className="w-full dark:border-gray-600"
                    >
                      {event.isGoing ? 'Going' : 'Attend'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No upcoming events</h3>
            <p className="text-gray-500 mb-4 dark:text-gray-400">
              {searchQuery 
                ? `No events matching "${searchQuery}"`
                : "There are no scheduled events in this group yet."}
            </p>
            {isJoined && (
              <Button onClick={() => setIsCreateEventOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Event Dialog */}
      <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Event Title</label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="What's your event called?"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Date</label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Time</label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Location</label>
              <Input
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                placeholder="Where is your event?"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Description (Optional)</label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Tell people about your event"
                rows={3}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateEventOpen(false)}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateEvent}
                disabled={!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location}
              >
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupEventsView;