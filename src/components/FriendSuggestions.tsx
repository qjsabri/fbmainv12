import React, { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface SuggestedPerson {
  id: string;
  name: string;
  avatar: string;
  mutualFriends?: number;
  workplace?: string;
  school?: string;
  reason?: string;
}

const FriendSuggestions = () => {
  const [suggestions, setSuggestions] = useState<SuggestedPerson[]>([
    {
      id: 'user-1',
      name: 'Alex Rodriguez',
      avatar: getSafeImage('AVATARS', 5),
      mutualFriends: 5,
      workplace: 'Tech Corp',
      school: 'MIT',
      reason: 'Based on mutual friends'
    },
    {
      id: 'user-2',
      name: 'Lisa Wang',
      avatar: getSafeImage('AVATARS', 4),
      mutualFriends: 2,
      workplace: 'Design Studio',
      school: 'RISD',
      reason: 'From your school'
    },
    {
      id: 'user-3',
      name: 'James Wilson',
      avatar: getSafeImage('AVATARS', 7),
      mutualFriends: 8,
      workplace: 'Marketing Agency',
      school: 'UCLA',
      reason: 'People you may know'
    }
  ]);

  const handleAddFriend = (id: string, name: string) => {
    setSuggestions(suggestions.filter(person => person.id !== id));
    toast.success(`Friend request sent to ${name}`);
  };

  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold flex items-center">
          <Users className="w-5 h-5 mr-2" />
          <span>People You May Know</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-2">
          {suggestions.map((person) => (
            <div key={person.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg dark:hover:bg-gray-800">
              <div className="flex items-center space-x-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={person.avatar} />
                  <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm dark:text-white">{person.name}</p>
                  {person.mutualFriends && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{person.mutualFriends} mutual friends</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleAddFriend(person.id, person.name)}
                className="bg-blue-600 hover:bg-blue-700 h-8"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                <span className="text-xs">Add</span>
              </Button>
            </div>
          ))}
          {suggestions.length === 0 && (
            <div className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
              No more suggestions right now.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendSuggestions;