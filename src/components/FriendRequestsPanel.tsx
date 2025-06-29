import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useFriendRequests, useRespondToFriendRequest } from '@/hooks/useFriends';
import { UserPlus, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const FriendRequestsPanel = () => {
  const { data: requests, isLoading } = useFriendRequests();
  const respondMutation = useRespondToFriendRequest();

  const handleAccept = (requestId: string) => {
    respondMutation.mutate({ requestId, status: 'accepted' });
    toast.success('Friend request accepted');
  };

  const handleDecline = (requestId: string) => {
    respondMutation.mutate({ requestId, status: 'declined' });
    toast.info('Friend request declined');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-sm sm:text-base font-semibold flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            <span>Friend Requests{requests ? ` (${requests.length})` : ''}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <p className="text-gray-500 text-sm dark:text-gray-400">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-sm sm:text-base font-semibold flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            <span>Friend Requests{requests ? ` (${requests.length})` : ''}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <p className="text-gray-500 text-sm dark:text-gray-400">No pending friend requests</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-sm sm:text-base font-semibold flex items-center">
          <UserPlus className="w-5 h-5 mr-2" />
          <span>Friend Requests ({requests.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-2">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg dark:bg-gray-800">
              <div className="flex items-center space-x-2 min-w-0">
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                  <AvatarImage src={request.requester_profile?.avatar_url} />
                  <AvatarFallback>
                    {request.requester_profile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-gray-900 truncate dark:text-white">
                    {request.requester_profile?.full_name || 'Unknown User'}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate dark:text-gray-400">wants to be friends</p>
                </div>
              </div>
              <div className="flex space-x-1 flex-shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleAccept(request.id)}
                  disabled={respondMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDecline(request.id)}
                  disabled={respondMutation.isPending}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 dark:border-gray-600 dark:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendRequestsPanel;