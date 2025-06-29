import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Globe, Lock,  Bell, BellOff, UserPlus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MOCK_IMAGES } from '@/lib/constants';
import GroupDiscussionView from '@/components/GroupDiscussionView';
import GroupMembersView from '@/components/GroupMembersView';
import GroupEventsView from '@/components/GroupEventsView';
import GroupFilesView from '@/components/GroupFilesView';
import GroupAboutView from '@/components/GroupAboutView';

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

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('discussion');

  useEffect(() => {
    if (!groupId) {
      setError('Group ID not provided');
      setLoading(false);
      return;
    }

    // Simulate API call to fetch group data
    const fetchGroup = async () => {
      try {
        setLoading(true);
        
        // Mock group data - in a real app, this would be an API call
        const mockGroups: Group[] = [
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
            name: 'Photography Enthusiasts',
            description: 'Share your best shots and learn from fellow photographers.',
            image: MOCK_IMAGES.POSTS[1],
            members: 8934,
            privacy: 'public',
            isJoined: false,
            category: 'Arts & Photography',
            lastActivity: '1 hour ago'
          },
          {
            id: '3',
            name: 'Local Food Lovers',
            description: 'Discover the best local restaurants and share your food experiences.',
            image: MOCK_IMAGES.POSTS[2],
            members: 5672,
            privacy: 'private',
            isJoined: true,
            category: 'Food & Dining',
            lastActivity: '30 minutes ago'
          }
        ];

        const foundGroup = mockGroups.find(g => g.id === groupId);
        
        if (!foundGroup) {
          setError('Group not found');
        } else {
          setGroup(foundGroup);
        }
      } catch (err) {
        setError('Failed to load group');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const handleJoinGroup = () => {
    if (!group) return;
    
    setGroup(prev => prev ? { ...prev, isJoined: !prev.isJoined } : null);
    toast.success(group.isJoined ? `Left ${group.name}` : `Joined ${group.name}`);
  };

  const handleMuteGroup = () => {
    if (!group) return;
    
    setGroup(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null);
    toast.success(group.isMuted ? `Unmuted ${group.name}` : `Muted ${group.name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading group...</p>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Group Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'The group you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => navigate('/groups')}>Back to Groups</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/groups')}
                className="dark:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Groups
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-4">
            <img
              src={group.image}
              alt={group.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
                {group.privacy === 'private' && (
                  <Lock className="w-5 h-5 text-gray-500" />
                )}
                {group.privacy === 'public' && (
                  <Globe className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{group.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {group.members.toLocaleString()} members
                </span>
                <Badge variant="outline" className="dark:border-gray-600">{group.category}</Badge>
                <span>Active {group.lastActivity}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {group.isJoined && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMuteGroup}
                  className="dark:border-gray-600 dark:text-gray-200"
                >
                  {group.isMuted ? <BellOff className="w-4 h-4 mr-1" /> : <Bell className="w-4 h-4 mr-1" />}
                  {group.isMuted ? 'Unmute' : 'Mute'}
                </Button>
              )}
              <Button
                variant={group.isJoined ? "outline" : "default"}
                onClick={handleJoinGroup}
                className={group.isJoined ? "dark:border-gray-600 dark:text-gray-200" : ""}
              >
                {group.isJoined ? (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Joined
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Group
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" className="dark:text-gray-300">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 dark:bg-gray-800">
            <TabsTrigger value="discussion" className="dark:data-[state=active]:bg-gray-700">Discussion</TabsTrigger>
            <TabsTrigger value="members" className="dark:data-[state=active]:bg-gray-700">Members</TabsTrigger>
            <TabsTrigger value="events" className="dark:data-[state=active]:bg-gray-700">Events</TabsTrigger>
            <TabsTrigger value="files" className="dark:data-[state=active]:bg-gray-700">Files</TabsTrigger>
            <TabsTrigger value="about" className="dark:data-[state=active]:bg-gray-700">About</TabsTrigger>
          </TabsList>

          <TabsContent value="discussion" className="mt-6">
            <GroupDiscussionView 
              groupId={group?.id || ''}
              posts={[]}
              isAdmin={group?.isAdmin || false}
              isJoined={group?.isJoined || false}
              onCreatePost={(content) => {
                toast.success('Post created successfully!');
              }}
              onLikePost={(postId) => {
                toast.success('Post liked!');
              }}
              onPinPost={(postId) => {
                toast.success('Post pinned!');
              }}
              onJoinGroup={handleJoinGroup}
            />
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <GroupMembersView 
              members={[]}
              totalMembers={group?.members || 0}
              isAdmin={group?.isAdmin || false}
              onInviteMembers={() => {
                toast.success('Invite sent!');
              }}
              onManageRoles={() => {
                toast.success('Role updated!');
              }}
            />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <GroupEventsView 
              events={[]}
              isJoined={group?.isJoined || false}
              onCreateEvent={(event) => {
                toast.success('Event created successfully!');
              }}
              onAttendEvent={(eventId) => {
                toast.success('Event attendance updated!');
              }}
            />
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <GroupFilesView 
              files={[]}
              isJoined={group?.isJoined || false}
              onUploadFile={() => {
                toast.success('File uploaded successfully!');
              }}
            />
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <GroupAboutView 
              group={{
                id: group?.id || '',
                name: group?.name || '',
                description: group?.description || '',
                privacy: group?.privacy || 'public',
                members: group?.members || 0,
                category: group?.category || ''
              }}
              isAdmin={group?.isAdmin || false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GroupDetail;