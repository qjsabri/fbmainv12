import React from 'react';
import { UserPlus, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import GraduationCap from '@/components/ui/GraduationCap';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface FriendRequest {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  time: string;
  location?: string;
  school?: string;
}

const FriendRequests: React.FC = () => {
  const [requests, setRequests] = React.useState<FriendRequest[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=400&h=400&fit=crop&crop=face',
      mutualFriends: 3,
      time: '2 hours ago',
      location: 'San Francisco, CA',
      school: 'Stanford University'
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400&h=400&fit=crop&crop=face',
      mutualFriends: 7,
      time: '1 day ago',
      location: 'Seattle, WA',
      school: 'University of Washington'
    }
  ]);

  const handleAcceptRequest = (id: string, name: string) => {
    toast.success(`You are now friends with ${name}`);
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleDeclineRequest = (id: string, _name: string) => {
    toast.info('Friend request declined');
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-base font-semibold">Friend Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-6">
            <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No friend requests</h3>
            <p className="text-gray-500 text-sm">When people send you friend requests, they'll appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Friend Requests</span>
            <Badge>{requests.length}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg hover:shadow-md transition-all p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={request.avatar} />
                  <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{request.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {request.mutualFriends > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {request.mutualFriends} mutual friends
                      </Badge>
                    )}
                    {request.location && (
                      <Badge variant="outline" className="text-xs flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {request.location}
                      </Badge>
                    )}
                    {request.school && (
                      <Badge variant="outline" className="text-xs flex items-center">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        {request.school}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{request.time}</p>
                </div>
              </div>
              <div className="flex items-center justify-end mt-3 gap-2">
                <Button 
                  onClick={() => handleAcceptRequest(request.id, request.name)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleDeclineRequest(request.id, request.name)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {requests.length > 0 && (
            <Button variant="ghost" size="sm" className="text-blue-600 w-full mt-1">
              See all {requests.length} requests
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendRequests;