import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Friendship } from '@/types';
import { handleError } from '@/lib/utils';
import { MOCK_IMAGES } from '@/lib/constants';

// Mock friend requests data
const mockFriendRequests: Friendship[] = [
  {
    id: 'req_1',
    requester_id: 'user_7',
    addressee_id: 'current_user',
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    requester_profile: {
      id: 'user_7',
      full_name: 'Alex Rodriguez',
      avatar_url: MOCK_IMAGES.AVATARS[5]
    }
  },
  {
    id: 'req_2',
    requester_id: 'user_8',
    addressee_id: 'current_user',
    status: 'pending',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    requester_profile: {
      id: 'user_8',
      full_name: 'Jessica Park',
      avatar_url: MOCK_IMAGES.AVATARS[6]
    }
  }
];

// Mock friends data
const mockFriends: Friendship[] = [
  {
    id: 'friend_1',
    requester_id: 'current_user',
    addressee_id: 'user_1',
    status: 'accepted',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    addressee_profile: {
      id: 'user_1',
      full_name: 'Sarah Johnson',
      avatar_url: MOCK_IMAGES.AVATARS[0]
    }
  },
  {
    id: 'friend_2',
    requester_id: 'user_2',
    addressee_id: 'current_user',
    status: 'accepted',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    requester_profile: {
      id: 'user_2',
      full_name: 'Mike Chen',
      avatar_url: MOCK_IMAGES.AVATARS[1]
    }
  }
];

export const useFriendRequests = () => {
  return useQuery({
    queryKey: ['friend-requests'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockFriendRequests;
    }
  });
};

export const useFriends = () => {
  return useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockFriends;
    }
  });
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ addresseeId }: { addresseeId: string }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { addresseeId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
    },
    onError: (error) => {
      handleError(error, 'sendFriendRequest');
    }
  });
};

export const useRespondToFriendRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: 'accepted' | 'declined' }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { requestId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error) => {
      handleError(error, 'respondToFriendRequest');
    }
  });
};