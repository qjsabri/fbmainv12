import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Share, Bell, BellOff, MoreHorizontal, MapPin, Link, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface PageHeaderProps {
  page: {
    id: string;
    name: string;
    category: string;
    description: string;
    avatar: string;
    cover: string;
    followers: number;
    isVerified: boolean;
    isFollowing: boolean;
    website?: string;
    location?: string;
    phone?: string;
    email?: string;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ page }) => {
  const [isFollowing, setIsFollowing] = React.useState(page.isFollowing);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? `Unfollowed ${page.name}` : `Following ${page.name}`);
  };

  const handleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
    toast.success(isNotificationsEnabled 
      ? `Notifications turned off for ${page.name}` 
      : `Notifications turned on for ${page.name}`);
  };

  const handleMessage = () => {
    toast.info(`Opening message to ${page.name}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out ${page.name} on Facebook: https://facebook.com/pages/${page.id}`);
    toast.success('Page link copied to clipboard');
  };

  return (
    <div className="space-y-4">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={page.cover}
          alt={`${page.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Page Info */}
      <div className="relative px-4 sm:px-6 -mt-16 sm:-mt-20">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white rounded-full dark:border-gray-800">
              <AvatarImage src={page.avatar} />
              <AvatarFallback className="text-2xl">{page.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{page.name}</h1>
                {page.isVerified && (
                  <Badge className="bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                <Badge variant="outline" className="text-sm dark:border-gray-600">
                  {page.category}
                </Badge>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{page.followers.toLocaleString()} followers</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-gray-600 dark:text-gray-400">
                {page.website && (
                  <div className="flex items-center">
                    <Link className="w-4 h-4 mr-1" />
                    <a href={page.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {page.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {page.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{page.location}</span>
                  </div>
                )}
                {page.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    <a href={`tel:${page.phone}`} className="hover:underline">
                      {page.phone}
                    </a>
                  </div>
                )}
                {page.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    <a href={`mailto:${page.email}`} className="hover:underline">
                      {page.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              <Button 
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                className={isFollowing ? "bg-gray-100" : ""}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              
              {isFollowing && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNotifications}
                  className={isNotificationsEnabled ? "bg-gray-100" : ""}
                >
                  {isNotificationsEnabled ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <BellOff className="h-4 w-4" />
                  )}
                </Button>
              )}
              
              <Button variant="outline" onClick={handleMessage}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              
              <Button variant="outline" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Users icon component
const Users = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default PageHeader;