import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Globe, Lock, Calendar, Users, Settings, UserPlus, Flag, Info } from 'lucide-react';
import { toast } from 'sonner';

interface GroupAboutViewProps {
  group: {
    id: string;
    name: string;
    description: string;
    privacy: 'public' | 'private';
    members: number;
    category: string;
    rules?: string[];
    createdAt?: string;
  };
  isAdmin: boolean;
}

const GroupAboutView: React.FC<GroupAboutViewProps> = ({ group, isAdmin }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">About This Group</h2>
        <p className="text-gray-700 mb-6 dark:text-gray-300">{group.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 dark:text-white">Group Type</h3>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              {group.privacy === 'public' ? (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Public Group</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Private Group</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
              {group.privacy === 'public' 
                ? 'Anyone can see who\'s in the group and what they post.' 
                : 'Only members can see who\'s in the group and what they post.'}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 dark:text-white">Category</h3>
            <Badge className="dark:border-gray-600">{group.category}</Badge>
            <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
              Groups help you connect with others who share your interests.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 dark:text-white">History</h3>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Created on {group.createdAt || 'January 15, 2022'}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
              Group has been active for over 2 years
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 dark:text-white">Members</h3>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{group.members.toLocaleString()} members</span>
            </div>
            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
              Including 1 admin and 1 moderator
            </p>
          </div>
        </div>
        
        {group.rules && group.rules.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3 dark:text-white">Group Rules</h3>
            <div className="space-y-2">
              {group.rules.map((rule, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-blue-900/30">
                    <span className="text-blue-600 text-sm font-medium dark:text-blue-400">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isAdmin && (
          <div className="mt-6 pt-6 border-t dark:border-gray-700">
            <h3 className="font-semibold mb-3 dark:text-white">Admin Tools</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                className="dark:border-gray-600 dark:text-gray-200"
                onClick={() => toast.info('Group settings coming soon')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Group Settings
              </Button>
              <Button 
                variant="outline" 
                className="dark:border-gray-600 dark:text-gray-200"
                onClick={() => toast.info('Invite members feature coming soon')}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Members
              </Button>
              <Button 
                variant="outline" 
                className="dark:border-gray-600 dark:text-gray-200"
                onClick={() => toast.info('Manage reports feature coming soon')}
              >
                <Flag className="w-4 h-4 mr-2" />
                Manage Reports
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t dark:border-gray-700">
          <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-900/20">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 dark:text-blue-400" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-300">About Group Privacy</h4>
                <p className="text-sm text-blue-700 mt-1 dark:text-blue-200">
                  {group.privacy === 'public' 
                    ? 'Public groups are visible to anyone, and anyone can join or be added by a member.'
                    : 'Private groups are only visible to members. People must request to join or be added by an admin or member.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupAboutView;