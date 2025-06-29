import React, { useState, useEffect } from 'react';
import { Bell, Settings, X, Heart, MessageCircle, Users, Clock, Check, Filter, Calendar, Flag, Gift } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'friend_request' | 'event' | 'mention' | 'birthday' | 'memory' | 'tag' | 'group_invite';
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
  isActionable?: boolean;
  action?: string;
  targetId?: string;
  targetType?: string;
  targetTitle?: string;
}

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading notifications
    const loadNotifications = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNotifications([
        {
          id: '1',
          type: 'like',
          user: {
            id: 'user1',
            name: 'Sarah Johnson',
            avatar: MOCK_IMAGES.AVATARS[0]
          },
          content: 'liked your photo',
          timestamp: '5m ago',
          isRead: false,
          targetId: 'post1',
          targetType: 'post',
          targetTitle: 'Sunset photo'
        },
        {
          id: '2',
          type: 'comment',
          user: {
            id: 'user2',
            name: 'Mike Chen',
            avatar: MOCK_IMAGES.AVATARS[1]
          },
          content: 'commented on your post: "Great work!"',
          timestamp: '15m ago',
          isRead: false,
          targetId: 'post2',
          targetType: 'post',
          targetTitle: 'React project'
        },
        {
          id: '3',
          type: 'friend_request',
          user: {
            id: 'user3',
            name: 'Emma Wilson',
            avatar: getSafeImage('AVATARS', 2)
          },
          content: 'sent you a friend request',
          timestamp: '1h ago',
          isRead: false,
          isActionable: true,
          action: 'friend_request'
        },
        {
          id: '4',
          type: 'event',
          user: {
            id: 'user4',
            name: 'David Kim',
            avatar: getSafeImage('AVATARS', 3)
          },
          content: 'invited you to an event: "Tech Meetup 2024"',
          timestamp: '3h ago',
          isRead: true,
          isActionable: true,
          action: 'event_invite',
          targetId: 'event1',
          targetType: 'event',
          targetTitle: 'Tech Meetup 2024'
        },
        {
          id: '5',
          type: 'birthday',
          user: {
            id: 'user5',
            name: 'Lisa Wang',
            avatar: getSafeImage('AVATARS', 4)
          },
          content: 'has a birthday today',
          timestamp: '5h ago',
          isRead: true
        },
        {
          id: '6',
          type: 'tag',
          user: {
            id: 'user6',
            name: 'Alex Rodriguez',
            avatar: getSafeImage('AVATARS', 5)
          },
          content: 'tagged you in a post',
          timestamp: '1d ago',
          isRead: true,
          targetId: 'post3',
          targetType: 'post',
          targetTitle: 'Group photo'
        },
        {
          id: '7',
          type: 'group_invite',
          user: {
            id: 'user7',
            name: 'Jessica Park',
            avatar: getSafeImage('AVATARS', 6)
          },
          content: 'invited you to join the group "Web Developers"',
          timestamp: '2d ago',
          isRead: true,
          isActionable: true,
          action: 'group_invite',
          targetId: 'group1',
          targetType: 'group',
          targetTitle: 'Web Developers'
        }
      ]);
      
      setIsLoading(false);
    };
    
    loadNotifications();
    
    // Set up interval to check for new notifications
    const interval = setInterval(() => {
      // Simulate new notification with 20% chance
      if (Math.random() < 0.2) {
        const types = ['like', 'comment', 'friend_request', 'event', 'mention', 'tag', 'group_invite'];
        const randomType = types[Math.floor(Math.random() * types.length)] as 'like' | 'comment' | 'friend_request' | 'event' | 'mention' | 'tag' | 'group_invite';
        const randomUser = Math.floor(Math.random() * 7);
        
        const newNotification: Notification = {
          id: `new-${Date.now()}`,
          type: randomType,
          user: {
            id: `user${randomUser + 1}`,
            name: ['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Kim', 'Lisa Wang', 'Alex Rodriguez', 'Jessica Park'][randomUser],
            avatar: MOCK_IMAGES.AVATARS[randomUser]
          },
          content: getRandomContent(randomType),
          timestamp: 'Just now',
          isRead: false,
          isActionable: randomType === 'friend_request' || randomType === 'event' || randomType === 'group_invite',
          action: randomType === 'friend_request' ? 'friend_request' : 
                 randomType === 'event' ? 'event_invite' : 
                 randomType === 'group_invite' ? 'group_invite' : undefined
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getRandomContent = (type: string): string => {
    switch (type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your photo';
      case 'friend_request':
        return 'sent you a friend request';
      case 'event':
        return 'invited you to an event';
      case 'mention':
        return 'mentioned you in a comment';
      case 'tag':
        return 'tagged you in a photo';
      case 'group_invite':
        return 'invited you to join a group';
      default:
        return 'interacted with your content';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'friend_request': return <Users className="w-4 h-4 text-green-500" />;
      case 'event': return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'birthday': return <Gift className="w-4 h-4 text-pink-500" />;
      case 'memory': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'tag': return <Flag className="w-4 h-4 text-indigo-500" />;
      case 'group_invite': return <Users className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const handleAction = (notification: Notification) => {
    if (!notification.isActionable) return;
    
    switch (notification.action) {
      case 'friend_request':
        toast.success(`Friend request from ${notification.user.name} accepted`);
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
        break;
      case 'event_invite':
        toast.success(`You're going to ${notification.targetTitle || 'the event'}`);
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        );
        break;
      case 'group_invite':
        toast.success(`You've joined ${notification.targetTitle || 'the group'}`);
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        );
        break;
      default:
        handleMarkAsRead(notification.id);
    }
  };

  const handleRemove = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.info('Notification removed');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread'
      ? notifications.filter(n => !n.isRead)
      : notifications.filter(n => n.type === activeTab);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Notifications
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-red-500">{unreadCount}</Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="mr-1 h-4 w-4" />
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && <Badge className="ml-1">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="friend_request">Friends</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
        </TabsList>
        
        <CardContent className="p-0">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4 p-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex space-x-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-300 rounded-full dark:bg-gray-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/4 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 dark:bg-gray-700"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredNotifications.map(notification => (
                  <motion.div 
                    key={notification.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-start p-3 border-b hover:bg-gray-50 cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    } dark:hover:bg-gray-800 dark:border-gray-700`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="relative mr-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 dark:bg-gray-800">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm dark:text-gray-200">
                          <span className="font-medium">{notification.user.name}</span>
                          {' '}{notification.content}
                        </p>
                        {!notification.isRead && (
                          <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                        )}
                      </div>
                      
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-gray-500 mr-1 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{notification.timestamp}</span>
                      </div>
                      
                      {notification.isActionable && (
                        <div className="flex mt-2 space-x-2">
                          <Button 
                            size="sm" 
                            className="h-8 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(notification);
                            }}
                          >
                            {notification.action === 'friend_request' ? 'Accept' : 'View'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs dark:border-gray-600 dark:text-gray-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(notification.id);
                            }}
                          >
                            {notification.action === 'friend_request' ? 'Decline' : 'Dismiss'}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2 h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(notification.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <Bell className="h-12 w-12 text-gray-300 mb-4 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 mb-1 dark:text-gray-200">No notifications</h3>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {activeTab === 'unread' 
                  ? "You're all caught up!" 
                  : activeTab !== 'all'
                    ? `No ${activeTab.replace('_', ' ')} notifications`
                    : "When you get notifications, they'll show up here"}
              </p>
            </div>
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default NotificationsCenter;