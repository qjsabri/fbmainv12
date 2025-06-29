import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, Globe, Lock, Eye, MoreHorizontal, MessageSquare, Calendar, FileText, Info, Bell, BellOff, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateGroup from './CreateGroup';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { toast } from 'sonner';
import GroupDiscussionView from './GroupDiscussionView';
import GroupMembersView from './GroupMembersView';
import GroupEventsView from './GroupEventsView';
import GroupFilesView from './GroupFilesView';
import GroupAboutView from './GroupAboutView';

interface Group {
  id: string;
  name: string;
  description: string;
  image: string;
  members: number;
  privacy: 'public' | 'private';
  isJoined: boolean;
  category: string;
  lastActivity: string;
  isAdmin?: boolean;
  isMuted?: boolean;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  isOnline: boolean;
}

interface GroupPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isAdmin?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isPinned?: boolean;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
}

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

interface GroupFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  avatar?: string;
}

const GroupsTab = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'React Developers Community',
      description: 'A community for React developers to share knowledge and help each other.',
      image: MOCK_IMAGES.POSTS[0],
      members: 15420,
      privacy: 'public',
      isJoined: true,
      category: 'Technology',
      lastActivity: '2 hours ago',
      isAdmin: true
    },
    {
      id: '2',
      name: 'Local Photography Club',
      description: 'Share your best shots and learn from fellow photographers in our area.',
      image: getSafeImage('POSTS', 2),
      members: 890,
      privacy: 'public',
      isJoined: false,
      category: 'Photography',
      lastActivity: '5 hours ago'
    },
    {
      id: '3',
      name: 'Hiking Adventures',
      description: 'For outdoor enthusiasts who love hiking and exploring nature trails.',
      image: getSafeImage('POSTS', 3),
      members: 2340,
      privacy: 'private',
      isJoined: true,
      category: 'Outdoors',
      lastActivity: '1 day ago',
      isMuted: true
    },
    {
      id: '4',
      name: 'Book Club',
      description: 'Monthly book discussions and recommendations for avid readers.',
      image: getSafeImage('POSTS', 4),
      members: 567,
      privacy: 'public',
      isJoined: true,
      category: 'Books & Literature',
      lastActivity: '3 days ago'
    },
    {
      id: '5',
      name: 'Startup Founders',
      description: 'A private group for startup founders to network and share experiences.',
      image: getSafeImage('POSTS', 5),
      members: 1230,
      privacy: 'private',
      isJoined: false,
      category: 'Business',
      lastActivity: '2 days ago'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isGroupDetailOpen, setIsGroupDetailOpen] = useState(false);
  const [activeGroupTab, setActiveGroupTab] = useState('discussion');
  const [isLoading, setIsLoading] = useState(true);
  const [groupPosts, setGroupPosts] = useState<GroupPost[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupEvents, setGroupEvents] = useState<GroupEvent[]>([]);
  const [groupFiles, setGroupFiles] = useState<GroupFile[]>([]);

  const categories = ['All', 'Technology', 'Photography', 'Outdoors', 'Books & Literature', 'Business', 'Design', 'Sports', 'Food', 'Travel'];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Load group data when a group is selected
  useEffect(() => {
    if (selectedGroup) {
      setIsLoading(true);
      
      // Simulate API call to load group data
      setTimeout(() => {
        // Generate mock posts
        const mockPosts: GroupPost[] = [
          {
            id: '1',
            author: {
              id: 'user1',
              name: 'Sarah Johnson',
              avatar: MOCK_IMAGES.AVATARS[0],
              isAdmin: true
            },
            content: 'Welcome to our group! Feel free to introduce yourself and share your React projects.',
            timestamp: '2 days ago',
            likes: 24,
            comments: 8,
            isPinned: true
          },
          {
            id: '2',
            author: {
              id: 'user2',
              name: 'Mike Chen',
              avatar: MOCK_IMAGES.AVATARS[1]
            },
            content: 'Just launched my new React project! Check it out: https://example.com/project',
            timestamp: '1 day ago',
            likes: 15,
            comments: 5,
            media: [
              {
                type: 'image',
                url: MOCK_IMAGES.POSTS[1]
              }
            ]
          },
          {
            id: '3',
            author: {
              id: 'user3',
              name: 'Emma Wilson',
              avatar: getSafeImage('AVATARS', 2)
            },
            content: 'Has anyone worked with React Query? I\'m trying to implement infinite scrolling and could use some advice.',
            timestamp: '12 hours ago',
            likes: 7,
            comments: 12
          }
        ];
        
        // Generate mock members
        const mockMembers: GroupMember[] = [
          {
            id: 'user1',
            name: 'Sarah Johnson',
            avatar: MOCK_IMAGES.AVATARS[0],
            role: 'admin',
            joinedAt: 'Jan 2022',
            isOnline: true
          },
          {
            id: 'user2',
            name: 'Mike Chen',
            avatar: MOCK_IMAGES.AVATARS[1],
            role: 'moderator',
            joinedAt: 'Mar 2022',
            isOnline: false
          },
          {
            id: 'user3',
            name: 'Emma Wilson',
            avatar: getSafeImage('AVATARS', 2),
            role: 'member',
            joinedAt: 'Apr 2022',
            isOnline: true
          },
          {
            id: 'user4',
            name: 'David Kim',
            avatar: getSafeImage('AVATARS', 3),
            role: 'member',
            joinedAt: 'Jun 2022',
            isOnline: true
          },
          {
            id: 'user5',
            name: 'Lisa Wang',
            avatar: getSafeImage('AVATARS', 4),
            role: 'member',
            joinedAt: 'Aug 2022',
            isOnline: false
          }
        ];
        
        // Generate mock events
        const mockEvents: GroupEvent[] = [
          {
            id: 'event1',
            title: 'React Meetup',
            date: '2024-04-15',
            time: '18:00',
            location: 'Tech Hub, San Francisco',
            description: 'Monthly meetup to discuss the latest in React development.',
            attendees: 18,
            isGoing: true,
            organizer: {
              name: 'Sarah Johnson',
              avatar: MOCK_IMAGES.AVATARS[0]
            }
          },
          {
            id: 'event2',
            title: 'Workshop: Advanced React Patterns',
            date: '2024-04-22',
            time: '14:00',
            location: 'Online (Zoom)',
            description: 'Learn advanced React patterns and best practices from industry experts.',
            attendees: 45,
            isGoing: false,
            organizer: {
              name: 'Mike Chen',
              avatar: MOCK_IMAGES.AVATARS[1]
            }
          }
        ];
        
        // Generate mock files
        const mockFiles: GroupFile[] = [
          {
            id: 'file1',
            name: 'React Best Practices 2024.pdf',
            type: 'document',
            size: '2.4 MB',
            uploadedBy: 'Sarah Johnson',
            uploadedAt: '3 days ago',
            url: '#',
            avatar: MOCK_IMAGES.AVATARS[0]
          },
          {
            id: 'file2',
            name: 'Project Demo.mp4',
            type: 'video',
            size: '24.8 MB',
            uploadedBy: 'Mike Chen',
            uploadedAt: '1 day ago',
            url: '#',
            avatar: MOCK_IMAGES.AVATARS[1]
          },
          {
            id: 'file3',
            name: 'UI Design Mockup.png',
            type: 'image',
            size: '1.2 MB',
            uploadedBy: 'Emma Wilson',
            uploadedAt: '12 hours ago',
            url: MOCK_IMAGES.POSTS[1],
            avatar: getSafeImage('AVATARS', 2)
          }
        ];
        
        setGroupPosts(mockPosts);
        setGroupMembers(mockMembers);
        setGroupEvents(mockEvents);
        setGroupFiles(mockFiles);
        setIsLoading(false);
      }, 1000);
    }
  }, [selectedGroup]);

  const handleJoinGroup = (groupId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, isJoined: !group.isJoined }
        : group
    ));
    
    const group = groups.find(g => g.id === groupId);
    if (group) {
      toast.success(group.isJoined ? `Left ${group.name}` : `Joined ${group.name}`);
    }
  };

  const handleMuteGroup = (groupId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, isMuted: !group.isMuted }
        : group
    ));
    
    const group = groups.find(g => g.id === groupId);
    if (group) {
      toast.success(group.isMuted ? `Unmuted ${group.name}` : `Muted ${group.name}`);
    }
  };

  const handleCreateGroup = (groupData: { name: string; description: string; privacy: 'public' | 'private'; category: string; }) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      ...groupData,
      image: MOCK_IMAGES.POSTS[Math.floor(Math.random() * MOCK_IMAGES.POSTS.length)],
      members: 1,
      isJoined: true,
      lastActivity: 'Just now',
      isAdmin: true,
    };
    setGroups(prevGroups => [newGroup, ...prevGroups]);
    setIsCreateModalOpen(false);
    toast.success(`Group "${groupData.name}" created successfully!`);
    setActiveTab('joined');
  };

  const handleViewGroup = (group: Group) => {
    navigate(`/groups/${group.id}`);
  };

  const handleCreatePost = (content: string) => {
    if (!selectedGroup) return;
    
    const newPost: GroupPost = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        name: 'John Doe',
        avatar: getSafeImage('AVATARS', 7)
      },
      content,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      isLiked: false
    };
    
    setGroupPosts([newPost, ...groupPosts]);
    toast.success('Post created successfully');
  };

  const handleLikePost = (postId: string) => {
    setGroupPosts(groupPosts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handlePinPost = (postId: string) => {
    setGroupPosts(groupPosts.map(post => 
      post.id === postId 
        ? { ...post, isPinned: !post.isPinned }
        : post
    ));
    
    const post = groupPosts.find(p => p.id === postId);
    if (post) {
      toast.success(post.isPinned ? 'Post unpinned' : 'Post pinned to the top');
    }
  };

  const handleCreateEvent = (event: Omit<GroupEvent, 'id' | 'attendees' | 'isGoing'>) => {
    const newEvent: GroupEvent = {
      id: Date.now().toString(),
      ...event,
      attendees: 1,
      isGoing: true,
      organizer: {
        name: 'John Doe',
        avatar: getSafeImage('AVATARS', 7)
      }
    };
    
    setGroupEvents([newEvent, ...groupEvents]);
    toast.success('Event created successfully');
  };

  const handleAttendEvent = (eventId: string) => {
    setGroupEvents(groupEvents.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            isGoing: !event.isGoing,
            attendees: event.isGoing ? event.attendees - 1 : event.attendees + 1
          }
        : event
    ));
    
    const event = groupEvents.find(e => e.id === eventId);
    if (event) {
      toast.success(event.isGoing ? 'You\'re no longer attending' : 'You\'re now attending');
    }
  };

  const handleUploadFile = () => {
    toast.info('File upload feature coming soon');
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const joinedGroups = groups.filter(group => group.isJoined);
  const suggestedGroups = groups.filter(group => !group.isJoined);

  return (
    <div className="w-full">
      <div className="container-responsive mx-auto py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groups</h1>
            <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Group</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All Groups</TabsTrigger>
              <TabsTrigger value="joined">Your Groups ({joinedGroups.length})</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {isLoading ? (
                // Loading skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-32 bg-gray-200 animate-pulse dark:bg-gray-700"></div>
                      <CardContent className="p-4">
                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2 dark:bg-gray-700"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-3 dark:bg-gray-700"></div>
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-4 dark:bg-gray-700"></div>
                        <div className="h-8 w-full bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer" onClick={() => handleViewGroup(group)}>
                      <div className="relative h-32 sm:h-36">
                        <img
                          src={group.image}
                          alt={group.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          {group.privacy === 'private' ? (
                            <Badge variant="secondary" className="bg-black/70 text-white dark:bg-black/90">
                              <Lock className="w-3 h-3 mr-1" />
                              Private
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-black/70 text-white dark:bg-black/90">
                              <Globe className="w-3 h-3 mr-1" />
                              Public
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1 dark:text-white">{group.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2 dark:text-gray-400">{group.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{group.members.toLocaleString()} members</span>
                            </div>
                            <span>{group.lastActivity}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant={group.isJoined ? "outline" : "default"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinGroup(group.id);
                            }}
                            className="flex-1 dark:border-gray-600"
                          >
                            {group.isJoined ? 'Leave Group' : 'Join Group'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewGroup(group);
                            }}
                            className="dark:border-gray-600 dark:text-gray-200"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {group.isJoined && (
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMuteGroup(group.id);
                              }}
                              className="dark:border-gray-600 dark:text-gray-200"
                            >
                              {group.isMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No groups found</h3>
                  <p className="text-gray-500 mb-6 dark:text-gray-400">
                    {searchTerm 
                      ? `No results for "${searchTerm}"`
                      : "Try selecting a different category or create your own group."}
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="joined" className="space-y-6">
              {isLoading ? (
                // Loading skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-32 bg-gray-200 animate-pulse dark:bg-gray-700"></div>
                      <CardContent className="p-4">
                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2 dark:bg-gray-700"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-3 dark:bg-gray-700"></div>
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-4 dark:bg-gray-700"></div>
                        <div className="h-8 w-full bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : joinedGroups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {joinedGroups.map((group) => (
                    <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer" onClick={() => handleViewGroup(group)}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={group.image}
                            alt={group.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate dark:text-white">{group.name}</h3>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">{group.members.toLocaleString()} members</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs dark:border-gray-600">{group.category}</Badge>
                              {group.isMuted && (
                                <Badge variant="outline" className="text-xs dark:border-gray-600">
                                  <BellOff className="w-3 h-3 mr-1" />
                                  Muted
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="touch-target dark:text-gray-300">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1 h-9" onClick={(e) => {
                            e.stopPropagation();
                            handleViewGroup(group);
                          }}>View Group</Button>
                          <Button size="sm" variant="outline" className="flex-1 h-9 dark:border-gray-600 dark:text-gray-200" onClick={(e) => e.stopPropagation()}>Post</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">You haven't joined any groups yet</h3>
                  <p className="text-gray-500 mb-6 dark:text-gray-400">Join groups to connect with people who share your interests.</p>
                  <Button onClick={() => setActiveTab('discover')}>
                    Discover Groups
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="discover" className="space-y-6">
              {isLoading ? (
                // Loading skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-24 bg-gray-200 animate-pulse dark:bg-gray-700"></div>
                      <CardContent className="p-4">
                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2 dark:bg-gray-700"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-3 dark:bg-gray-700"></div>
                        <div className="h-8 w-full bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : suggestedGroups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suggestedGroups.map((group) => (
                    <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer" onClick={() => handleViewGroup(group)}>
                      <div className="h-24">
                        <img
                          src={group.image}
                          alt={group.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2 line-clamp-1 dark:text-white">{group.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2 dark:text-gray-400">{group.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3 dark:text-gray-400">
                            <span>{group.members.toLocaleString()} members</span>
                            <Badge variant="outline" className="dark:border-gray-600">{group.category}</Badge>
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinGroup(group.id);
                          }}
                          size="sm"
                          className="w-full mt-auto"
                        >
                          Join Group
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No suggested groups</h3>
                  <p className="text-gray-500 mb-6 dark:text-gray-400">
                    {searchTerm 
                      ? `No results for "${searchTerm}"`
                      : "We'll show you group suggestions based on your interests."}
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <CreateGroup 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={handleCreateGroup}
      />

      {/* Group Detail Dialog */}
      <Dialog open={isGroupDetailOpen} onOpenChange={setIsGroupDetailOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-4 border-b sticky top-0 bg-white z-10 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedGroup?.image}
                  alt={selectedGroup?.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <DialogTitle className="text-xl flex items-center space-x-2">
                    <span>{selectedGroup?.name}</span>
                    {selectedGroup?.privacy === 'private' && (
                      <Lock className="w-4 h-4 text-gray-500" />
                    )}
                  </DialogTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedGroup?.members.toLocaleString()} members • {selectedGroup?.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selectedGroup?.isJoined && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMuteGroup(selectedGroup.id)}
                    className="dark:border-gray-600 dark:text-gray-200"
                  >
                    {selectedGroup.isMuted ? <BellOff className="w-4 h-4 mr-1" /> : <Bell className="w-4 h-4 mr-1" />}
                    {selectedGroup.isMuted ? 'Unmute' : 'Mute'}
                  </Button>
                )}
                <Button
                  variant={selectedGroup?.isJoined ? "outline" : "default"}
                  size="sm"
                  onClick={() => selectedGroup && handleJoinGroup(selectedGroup.id)}
                  className="dark:border-gray-600"
                >
                  {selectedGroup?.isJoined ? 'Leave' : 'Join'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsGroupDetailOpen(false)}
                  className="dark:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            <Tabs value={activeGroupTab} onValueChange={setActiveGroupTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="discussion" className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Discussion</span>
                </TabsTrigger>
                <TabsTrigger value="members" className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Members</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Events</span>
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Files</span>
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center space-x-1">
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">About</span>
                </TabsTrigger>
              </TabsList>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin dark:border-gray-700"></div>
                </div>
              ) : (
                <>
                  <TabsContent value="discussion">
                    <GroupDiscussionView 
                      groupId={selectedGroup?.id || ''}
                      posts={groupPosts}
                      isAdmin={selectedGroup?.isAdmin || false}
                      isJoined={selectedGroup?.isJoined || false}
                      onCreatePost={handleCreatePost}
                      onLikePost={handleLikePost}
                      onPinPost={handlePinPost}
                    />
                  </TabsContent>
                  
                  <TabsContent value="members">
                    <GroupMembersView 
                      members={groupMembers}
                      totalMembers={selectedGroup?.members || 0}
                      isAdmin={selectedGroup?.isAdmin || false}
                      onInviteMembers={() => toast.info('Invite members feature coming soon')}
                      onManageRoles={() => toast.info('Manage roles feature coming soon')}
                    />
                  </TabsContent>
                  
                  <TabsContent value="events">
                    <GroupEventsView 
                      events={groupEvents}
                      isJoined={selectedGroup?.isJoined || false}
                      onCreateEvent={handleCreateEvent}
                      onAttendEvent={handleAttendEvent}
                    />
                  </TabsContent>
                  
                  <TabsContent value="files">
                    <GroupFilesView 
                      files={groupFiles}
                      isJoined={selectedGroup?.isJoined || false}
                      onUploadFile={handleUploadFile}
                    />
                  </TabsContent>
                  
                  <TabsContent value="about">
                    <GroupAboutView 
                      group={{
                        id: selectedGroup?.id || '',
                        name: selectedGroup?.name || '',
                        description: selectedGroup?.description || '',
                        privacy: selectedGroup?.privacy || 'public',
                        members: selectedGroup?.members || 0,
                        category: selectedGroup?.category || '',
                        rules: [
                          'Be respectful and kind to other members',
                          'No spam or self-promotion',
                          'Stay on topic and keep discussions relevant',
                          'No hate speech or offensive content'
                        ],
                        createdAt: 'January 15, 2022'
                      }}
                      isAdmin={selectedGroup?.isAdmin || false}
                    />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupsTab;