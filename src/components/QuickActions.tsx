import React from 'react';
import { Plus, Camera, Video, Calendar, Users, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Plus,
      label: 'Create Post',
      color: 'text-blue-600',
      action: () => {
        navigate('/');
        toast.info('Create post');
      }
    },
    {
      icon: Camera,
      label: 'Add Photo',
      color: 'text-green-600',
      action: () => toast.info('Photo upload coming soon!')
    },
    {
      icon: Video,
      label: 'Go Live',
      color: 'text-red-600',
      action: () => toast.info('Live streaming coming soon!')
    },
    {
      icon: Calendar,
      label: 'Create Event',
      color: 'text-purple-600',
      action: () => {
        navigate('/events');
        toast.info('Create event');
      }
    },
    {
      icon: Users,
      label: 'Create Group',
      color: 'text-orange-600',
      action: () => {
        navigate('/groups');
        toast.info('Create group');
      }
    },
    {
      icon: Store,
      label: 'Sell Item',
      color: 'text-indigo-600',
      action: () => {
        navigate('/marketplace');
        toast.info('Create marketplace listing');
      }
    }
  ];

  return (
    <Card className="hidden lg:block">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={action.action}
              className={`h-auto py-2 flex-col gap-2 hover:bg-gray-50 dark:hover:bg-gray-800`}
            >
              <action.icon className={`w-5 h-5 ${action.color}`} />
              <span className="text-xs text-gray-700 dark:text-gray-300">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;