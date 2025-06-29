import React, { useState, useEffect } from 'react';
import { UserPlus, Search, MoreHorizontal, UserCheck, Phone, Video, Users, Star, Filter, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Briefcase from '@/components/ui/Briefcase';
import GraduationCap from '@/components/ui/GraduationCap';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { toast } from 'sonner';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  mutualFriends?: number;
  location?: string;
  workplace?: string;
  school?: string;
  bio?: string;
  isFavorite?: boolean;
}

interface FriendRequest {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  time: string;
  location?: string;
  school?: string;
}

interface SuggestedFriend {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  workplace?: string;
  school?: string;
  reason?: string;
}

const FriendsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('all');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const [friendRequests] = useState<FriendRequest[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: MOCK_IMAGES.AVATARS[0],
      mutualFriends: 3,
      time: '2 hours ago',
      location: 'San Francisco, CA',
      school: 'Stanford University'
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: MOCK_IMAGES.AVATARS[1],
      mutualFriends: 7,
      time: '1 day ago',
      location: 'Seattle, WA',
      school: 'University of Washington'
    },
    {
      id: '3',
      name: 'Jessica Park',
      avatar: getSafeImage('AVATARS', 6),
      mutualFriends: 2,
      time: '3 days ago',
      location: 'Los Angeles, CA',
      school: 'UCLA'
    }
  ]);

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Emma Wilson',
      avatar: getSafeImage('AVATARS', 2),
      isOnline: true,
      lastSeen: 'Active now',
      mutualFriends: 12,
      location: 'New York, NY',
      workplace: 'Design Studio',
      school: 'NYU',
      bio: 'Graphic designer and photography enthusiast',
      isFavorite: true
    },
    {
      id: '2',
      name: 'David Kim',
      avatar: getSafeImage('AVATARS', 3),
      isOnline: false,
      lastSeen: '2 hours ago',
      mutualFriends: 5,
      location: 'Chicago, IL',
      workplace: 'Tech Corp',
      school: 'University of Chicago',
      bio: 'Software engineer and coffee lover'
    },
    {
      id: '3',
      name: 'Lisa Wang',
      avatar: getSafeImage('AVATARS', 4),
      isOnline: true,
      lastSeen: 'Active now',
      mutualFriends: 8,
      location: 'Boston, MA',
      workplace: 'Medical Center',
      school: 'Harvard University',
      bio: 'Doctor and fitness enthusiast'
    },
    {
      id: '4',
      name: 'Robert Smith',
      avatar: getSafeImage('AVATARS', 5),
      isOnline: false,
      lastSeen: '1 day ago',
      mutualFriends: 3,
      location: 'San Francisco, CA',
      workplace: 'Finance Group',
      school: 'UC Berkeley',
      bio: 'Financial analyst and hiking enthusiast'
    }
  ]);

  const [suggestedFriends] = useState<SuggestedFriend[]>([
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
    },
    {
      id: '4',
      name: 'Maria Garcia',
      avatar: getSafeImage('AVATARS', 6),
      mutualFriends: 4,
      workplace: 'Healthcare Inc',
      school: 'Johns Hopkins',
      reason: 'From your workplace'
    }
  ]);

  const [favoriteCount, setFavoriteCount] = useState(1);

  useEffect(() => {
    // Update favorite count when friends change
    const count = friends.filter(friend => friend.isFavorite).length;
    setFavoriteCount(count);
  }, [friends]);



  const handleToggleFavorite = (id: string) => {
    setFriends(prev => prev.map(friend => 
      friend.id === id ? { ...friend, isFavorite: !friend.isFavorite } : friend
    ));
    
    const friend = friends.find(f => f.id === id);
    if (friend) {
      toast.success(friend.isFavorite 
        ? `${friend.name} removed from favorites` 
        : `${friend.name} added to favorites`);
    }
  };

  const handleMessage = (name: string) => {
    // Find the friend by name
    const friend = friends.find(f => f.name === name);
    if (friend) {
      // Dispatch a custom event to open the Messenger with this friend
      const event = new CustomEvent('openMessenger', { 
        detail: { 
          contact: {
            id: friend.id,
            name: friend.name,
            avatar: friend.avatar,
            isOnline: friend.isOnline,
            lastActive: friend.isOnline ? undefined : friend.lastSeen
          } 
        }
      });
      document.dispatchEvent(event);
      
      toast.success(`Opening chat with ${name}`);
    }
  };

  const handleCall = (name: string, type: 'audio' | 'video') => {
    toast.success(`Starting ${type} call with ${name}`);
  };

  const handleViewProfile = (friend: Friend) => {
    setSelectedFriend(friend);
    setIsProfileOpen(true);
  };

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filterLocation === 'all' || (friend.location && friend.location.toLowerCase().includes(filterLocation.toLowerCase()));
    return matchesSearch && matchesLocation;
  });

  const sortedFriends = [...filteredFriends].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'recent') {
      return a.isOnline === b.isOnline ? 0 : a.isOnline ? -1 : 1;
    } else if (sortBy === 'mutual') {
      return (b.mutualFriends || 0) - (a.mutualFriends || 0);
    }
    return 0;
  });

  const filteredRequests = friendRequests.filter(request => 
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuggestions = suggestedFriends.filter(suggestion => 
    suggestion.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteFriends = sortedFriends.filter(friend => friend.isFavorite);

  return (
    <div className="w-full">
      <div className="container-responsive mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Friends</h1>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeSection === 'requests' ? 'default' : 'outline'}
                onClick={() => setActiveSection('requests')}
                className="text-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Friend Requests ({friendRequests.length})
              </Button>
              <Button
                variant={activeSection === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveSection('all')}
                className="text-sm"
              >
                <Users className="w-4 h-4 mr-2" />
                All Friends ({friends.length})
              </Button>
              <Button
                variant={activeSection === 'favorites' ? 'default' : 'outline'}
                onClick={() => setActiveSection('favorites')}
                className="text-sm"
              >
                <Star className="w-4 h-4 mr-2" />
                Favorites ({favoriteCount})
              </Button>
              <Button
                variant={activeSection === 'suggestions' ? 'default' : 'outline'}
                onClick={() => setActiveSection('suggestions')}
                className="text-sm"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Suggestions
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="San Francisco">San Francisco</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="Chicago">Chicago</SelectItem>
                  <SelectItem value="Boston">Boston</SelectItem>
                  <SelectItem value="Seattle">Seattle</SelectItem>
                  <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Active</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="mutual">Mutual Friends</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="dark:border-gray-600 dark:text-gray-200">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {activeSection === 'requests' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Friend Requests</span>
                    <Badge variant="secondary">{friendRequests.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredRequests.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredRequests.map((request) => (
                        <Card key={request.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={request.avatar} />
                                <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold dark:text-white">{request.name}</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {request.mutualFriends > 0 && (
                                    <Badge variant="outline" className="text-xs dark:border-gray-600">
                                      <Users className="w-3 h-3 mr-1" />
                                      {request.mutualFriends} mutual friends
                                    </Badge>
                                  )}
                                  {request.location && (
                                    <Badge variant="outline" className="text-xs dark:border-gray-600">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {request.location}
                                    </Badge>
                                  )}
                                  {request.school && (
                                    <Badge variant="outline" className="text-xs dark:border-gray-600">
                                      <GraduationCap className="w-3 h-3 mr-1" />
                                      {request.school}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">{request.time}</p>
                              </div>
                              <div className="flex flex-wrap gap-2 justify-end">
                                <Button
                                  onClick={() => handleAcceptRequest(request.id, request.name)}
                                  className="min-w-[90px] h-9"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleDeclineRequest(request.id, request.name)}
                                  className="min-w-[90px] h-9 dark:border-gray-600 dark:text-gray-200"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">No friend requests</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          {searchTerm ? `No results for "${searchTerm}"` : "When people send you friend requests, they'll appear here."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'all' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>All Friends</span>
                    <Badge variant="secondary">{friends.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sortedFriends.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedFriends.map((friend) => (
                        <Card key={friend.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="relative">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={friend.avatar} />
                                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {friend.isOnline && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full dark:border-gray-800"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1">
                                  <h3 className="font-semibold text-gray-900 truncate dark:text-white">{friend.name}</h3>
                                  {friend.isFavorite && (
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">{friend.lastSeen}</p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="touch-target dark:hover:bg-gray-700"
                                onClick={() => handleViewProfile(friend)}
                              >
                                <MoreHorizontal className="w-4 h-4 dark:text-gray-400" />
                              </Button>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="flex-1 h-9"
                                onClick={() => handleMessage(friend.name)}
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Message
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0 dark:border-gray-600"
                                onClick={() => handleCall(friend.name, 'video')}
                              >
                                <Video className="w-4 h-4 dark:text-gray-400" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0 dark:border-gray-600"
                                onClick={() => handleToggleFavorite(friend.id)}
                              >
                                <Star className={`w-4 h-4 ${friend.isFavorite ? 'fill-current text-yellow-500' : 'dark:text-gray-400'}`} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">No friends found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          {searchTerm ? `No results for "${searchTerm}"` : "You haven't added any friends yet."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'favorites' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>Favorite Friends</span>
                    <Badge variant="secondary">{favoriteCount}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {favoriteFriends.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteFriends.map((friend) => (
                        <Card key={friend.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="relative">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={friend.avatar} />
                                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {friend.isOnline && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full dark:border-gray-800"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1">
                                  <h3 className="font-semibold text-gray-900 truncate dark:text-white">{friend.name}</h3>
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                </div>
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">{friend.lastSeen}</p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="touch-target dark:hover:bg-gray-700"
                                onClick={() => handleViewProfile(friend)}
                              >
                                <MoreHorizontal className="w-4 h-4 dark:text-gray-400" />
                              </Button>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="flex-1 h-9"
                                onClick={() => handleMessage(friend.name)}
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Message
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0 dark:border-gray-600"
                                onClick={() => handleCall(friend.name, 'video')}
                              >
                                <Video className="w-4 h-4 dark:text-gray-400" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0 dark:border-gray-600"
                                onClick={() => handleToggleFavorite(friend.id)}
                              >
                                <Star className="w-4 h-4 fill-current text-yellow-500" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">No favorite friends</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Add friends to your favorites for quick access
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'suggestions' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5" />
                    <span>People You May Know</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredSuggestions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredSuggestions.map((suggestion) => (
                        <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4 text-center">
                            <Avatar className="w-20 h-20 mx-auto mb-3">
                              <AvatarImage src={suggestion.avatar} />
                              <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold mb-1 dark:text-white">{suggestion.name}</h3>
                            
                            <div className="flex flex-wrap justify-center gap-2 mb-2">
                              {suggestion.mutualFriends > 0 && (
                                <Badge variant="outline" className="text-xs dark:border-gray-600">
                                  <Users className="w-3 h-3 mr-1" />
                                  {suggestion.mutualFriends} mutual
                                </Badge>
                              )}
                              {suggestion.workplace && (
                                <Badge variant="outline" className="text-xs dark:border-gray-600">
                                  <Briefcase className="w-3 h-3 mr-1" />
                                  {suggestion.workplace}
                                </Badge>
                              )}
                              {suggestion.school && (
                                <Badge variant="outline" className="text-xs dark:border-gray-600">
                                  <GraduationCap className="w-3 h-3 mr-1" />
                                  {suggestion.school}
                                </Badge>
                              )}
                            </div>
                            
                            {suggestion.reason && (
                              <p className="text-xs text-gray-500 mb-3 dark:text-gray-400">{suggestion.reason}</p>
                            )}
                            
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleAddFriend(suggestion.id, suggestion.name)}
                                className="flex-1 h-9"
                              >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add Friend
                              </Button>
                              <Button 
                                variant="outline" 
                                className="flex-1 h-9 dark:border-gray-600 dark:text-gray-200"
                              >
                                Remove
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">No suggestions found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          {searchTerm ? `No results for "${searchTerm}"` : "We'll show you friend suggestions here."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Friend Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-md dark:bg-gray-800">
          {selectedFriend && (
            <>
              <DialogHeader>
                <DialogTitle>Friend Profile</DialogTitle>
              </DialogHeader>
              
              <div className="text-center mb-4">
                <Avatar className="w-24 h-24 mx-auto mb-2">
                  <AvatarImage src={selectedFriend.avatar} />
                  <AvatarFallback>{selectedFriend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold dark:text-white">{selectedFriend.name}</h2>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <Badge variant={selectedFriend.isOnline ? "success" : "secondary"} className="text-xs">
                    {selectedFriend.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                  {selectedFriend.isFavorite && (
                    <Badge variant="outline" className="text-xs text-yellow-500 dark:border-yellow-500/30">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Favorite
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                {selectedFriend.bio && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedFriend.bio}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {selectedFriend.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="dark:text-gray-300">Lives in {selectedFriend.location}</span>
                    </div>
                  )}
                  {selectedFriend.workplace && (
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="dark:text-gray-300">Works at {selectedFriend.workplace}</span>
                    </div>
                  )}
                  {selectedFriend.school && (
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="dark:text-gray-300">Studied at {selectedFriend.school}</span>
                    </div>
                  )}
                  {selectedFriend.mutualFriends && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="dark:text-gray-300">{selectedFriend.mutualFriends} mutual friends</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => handleMessage(selectedFriend.name)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" onClick={() => handleCall(selectedFriend.name, 'video')} className="dark:border-gray-600 dark:text-gray-200">
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleToggleFavorite(selectedFriend.id)}
                    className="dark:border-gray-600 dark:text-gray-200"
                  >
                    <Star className={`w-4 h-4 mr-2 ${selectedFriend.isFavorite ? 'fill-current text-yellow-500' : ''}`} />
                    {selectedFriend.isFavorite ? 'Unfavorite' : 'Favorite'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCall(selectedFriend.name, 'audio')}
                    className="dark:border-gray-600 dark:text-gray-200"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
                
                <div className="border-t pt-4 mt-4 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="text-blue-600 dark:border-gray-600 dark:text-blue-400"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Block
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-600 dark:border-gray-600 dark:text-red-400"
                      onClick={() => handleRemoveFriend(selectedFriend.id, selectedFriend.name)}
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Unfriend
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FriendsTab;