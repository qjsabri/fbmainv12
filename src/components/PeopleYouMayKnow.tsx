import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useSendFriendRequest } from '@/hooks/useFriends';
import { Users, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';

interface SuggestedPerson {
  id: string;
  full_name: string;
  avatar_url: string;
}

const PeopleYouMayKnow = () => {
  const sendRequestMutation = useSendFriendRequest();
  
  // Mock suggestions data
  const suggestions: SuggestedPerson[] = [
    {
      id: 'user_5',
      full_name: 'Alex Rodriguez',
      avatar_url: getSafeImage('AVATARS', 5)
    },
    {
      id: 'user_6',
      full_name: 'Jessica Park',
      avatar_url: getSafeImage('AVATARS', 6)
    },
    {
      id: 'user_7',
      full_name: 'Robert Smith',
      avatar_url: getSafeImage('AVATARS', 7)
    }
  ];

  const handleSendRequest = (addresseeId: string, name: string) => {
    sendRequestMutation.mutate({ addresseeId });
    toast.success(`Friend request sent to ${name}`);
  };

  if (suggestions.length === 0) {
    return null;
  }

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
            <div key={person.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg dark:bg-gray-800">
              <div className="flex items-center space-x-2 min-w-0">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={person.avatar_url} />
                  <AvatarFallback>{person.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate dark:text-white">{person.full_name || 'Unknown User'}</p>
                  <p className="text-xs text-gray-500 truncate dark:text-gray-400">Suggested friend</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleSendRequest(person.id, person.full_name)}
                disabled={sendRequestMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 h-8 flex-shrink-0"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                <span className="text-xs">Add</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeopleYouMayKnow;