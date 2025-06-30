import React, { useState } from 'react';
import { Users, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface GroupSuggestion {
  id: string;
  name: string;
  image: string;
  members: number;
  category: string;
  isJoined: boolean;
  mutualMembers?: number;
  privacy: 'public' | 'private';
}

const GroupSuggestions = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<GroupSuggestion[]>([
    {
      id: '1',
      name: 'React Developers',
      image: MOCK_IMAGES.POSTS[0],
      members: 12500,
      category: 'Technology',
      isJoined: false,
      mutualMembers: 3,
      privacy: 'public'
    },
    {
      id: '2',
      name: 'Photography Enthusiasts',
      image: MOCK_IMAGES.POSTS[1],
      members: 8900,
      category: 'Photography',
      isJoined: false,
      mutualMembers: 5,
      privacy: 'public'
    },
    {
      id: '3',
      name: 'Hiking Adventures',
      image: getSafeImage('POSTS', 2),
      members: 5600,
      category: 'Outdoors',
      isJoined: false,
      mutualMembers: 2,
      privacy: 'private'
    }
  ]);

  const handleJoinGroup = (groupId: string) => {
    setSuggestions(prev => prev.map(group => 
      group.id === groupId ? { ...group, isJoined: !group.isJoined } : group
    ));
    
    const group = suggestions.find(g => g.id === groupId);
    if (group) {
      toast.success(group.isJoined ? `Left ${group.name}` : `Joined ${group.name}`);
    }
  };

  const handleViewAll = () => {
    navigate('/groups');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Card className="hidden lg:block">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            <span>Suggested Groups</span>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 text-xs dark:text-blue-400" onClick={handleViewAll}>
            See All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-3">
          {suggestions.map((group) => (
            <div key={group.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors dark:hover:bg-gray-700">
              <img
                src={group.image}
                alt={group.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate dark:text-gray-100">{group.name}</h4>
                <div className="flex items-center text-xs text-gray-500 mt-1 dark:text-gray-400">
                  <span>{formatNumber(group.members)} members</span>
                  {group.mutualMembers && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{group.mutualMembers} mutual members</span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs dark:border-gray-600">{group.category}</Badge>
                  <Badge variant="outline" className="text-xs dark:border-gray-600">
                    {group.privacy === 'public' ? 'Public' : 'Private'}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant={group.isJoined ? "outline" : "default"}
                onClick={() => handleJoinGroup(group.id)}
                className="h-8 min-w-20 dark:border-gray-600"
              >
                {group.isJoined ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Joined
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3 mr-1" />
                    Join
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupSuggestions;