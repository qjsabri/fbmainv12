import React, { useState } from 'react';
import { UserPlus, X, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { toast } from 'sonner';

interface FriendSuggestion {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  workplace?: string;
  school?: string;
  reason?: string;
}

const FriendSuggestions = () => {
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([
    {
      id: '1',
      name: 'Alex Rodriguez',
      avatar: getSafeImage('AVATARS', 5),
      mutualFriends: 5,
      workplace: 'Tech Corp',
      school: 'MIT',
      reason: 'Based on mutual friends'
    },
    {
      id: '2',
      name: 'Lisa Wang',
      avatar: getSafeImage('AVATARS', 4),
      mutualFriends: 2,
      workplace: 'Design Studio',
      school: 'RISD',
      reason: 'From your school'
    },
    {
      id: '3',
      name: 'James Wilson',
      avatar: getSafeImage('AVATARS', 7),
      mutualFriends: 8,
      workplace: 'Marketing Agency',
      school: 'UCLA',
      reason: 'People you may know'
    }
  ]);

  const handleAddFriend = (id: string) => {
    const person = suggestions.find(s => s.id === id);
    if (person) {
      toast.success(`Friend request sent to ${person.name}`);
    }
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const handleRemoveSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
    toast.info('Suggestion removed');
  };

  if (suggestions.length === 0) return null;

  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-sm sm:text-base font-semibold flex items-center justify-between">
          <div className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            <span>People You May Know</span>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 text-xs dark:text-blue-400">
            See All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-3">
          {suggestions.map((person) => (
            <div key={person.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors dark:hover:bg-gray-700">
              <div className="relative flex-shrink-0">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                  <AvatarImage src={person.avatar} />
                  <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white dark:ring-gray-800"></span>
              </div>
              <div className="flex-1 min-w-0 truncate">
                <h4 className="font-medium text-xs sm:text-sm text-gray-900 truncate dark:text-gray-100">{person.name}</h4>
                <div className="flex items-center text-[10px] sm:text-xs text-gray-500 mt-0.5 dark:text-gray-400">
                  <Users className="w-3 h-3 mr-1" />
                  <span className="truncate">{person.mutualFriends} mutual friends</span>
                </div>
                {person.reason && (
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate dark:text-gray-400">{person.reason}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1 ml-1">
                <Button
                  size="sm"
                  onClick={() => handleAddFriend(person.id)}
                  className="h-6 sm:h-8 px-2 sm:px-3 text-xs"
                >
                  <UserPlus className="w-3 h-3 mr-1" />
                  Add
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSuggestion(person.id)}
                  className="h-8"
                >
                  <X className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendSuggestions;