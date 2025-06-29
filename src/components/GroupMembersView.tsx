import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, MoreHorizontal, Shield, Crown, Settings, Users } from 'lucide-react';
import { toast } from 'sonner';

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  isOnline: boolean;
}

interface GroupMembersViewProps {
  members: GroupMember[];
  totalMembers: number;
  isAdmin: boolean;
  onInviteMembers: () => void;
  onManageRoles: () => void;
}

const GroupMembersView: React.FC<GroupMembersViewProps> = ({
  members,
  totalMembers,
  isAdmin,
  onInviteMembers,
  onManageRoles
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const admins = members.filter(m => m.role === 'admin');
  const moderators = members.filter(m => m.role === 'moderator');
  const regularMembers = members.filter(m => m.role === 'member');

  const handleMemberAction = (memberId: string, action: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      toast.success(`${action} ${member.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold dark:text-white">Members ({totalMembers.toLocaleString()})</h2>
        {isAdmin && (
          <div className="flex space-x-2">
            <Button onClick={onInviteMembers}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
            <Button variant="outline" onClick={onManageRoles} className="dark:border-gray-600 dark:text-gray-200">
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <select
          value={selectedRole || ''}
          onChange={(e) => setSelectedRole(e.target.value || null)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">All Roles</option>
          <option value="admin">Admins</option>
          <option value="moderator">Moderators</option>
          <option value="member">Members</option>
        </select>
      </div>

      {/* Admins Section */}
      {(selectedRole === null || selectedRole === 'admin') && admins.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-500" />
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {admins
                .filter(admin => admin.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg dark:bg-yellow-900/20">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={admin.avatar} />
                        <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 dark:text-white">{admin.name}</p>
                          <Badge className="bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Admin</Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Joined {admin.joinedAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Moderators Section */}
      {(selectedRole === null || selectedRole === 'moderator') && moderators.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-500" />
              Moderators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moderators
                .filter(mod => mod.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((moderator) => (
                  <div key={moderator.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={moderator.avatar} />
                        <AvatarFallback>{moderator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 dark:text-white">{moderator.name}</p>
                          <Badge className="bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Moderator</Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Joined {moderator.joinedAt}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="dark:text-gray-300"
                        onClick={() => handleMemberAction(moderator.id, 'Manage role for')}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regular Members Section */}
      {(selectedRole === null || selectedRole === 'member') && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-500" />
              Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {regularMembers.filter(member => member.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {regularMembers
                  .filter(member => member.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg dark:hover:bg-gray-800">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Joined {member.joinedAt}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="dark:text-gray-300"
                          onClick={() => handleMemberAction(member.id, 'Manage role for')}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">No members found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {filteredMembers.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No members found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? `No results for "${searchQuery}"` : "No members match the selected filters."}
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupMembersView;