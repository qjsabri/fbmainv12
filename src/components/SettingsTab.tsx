import React, { useState } from 'react';
import { User, Bell, Shield, Eye, Smartphone, HelpCircle, LogOut, Globe } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccessibleButton from './AccessibleButton';
import { toast } from 'sonner';
import { useIsMobile, useIsTablet } from '@/hooks/use-device';
import { MOCK_IMAGES } from '@/lib/constants';

const SettingsTab = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    messages: true,
    comments: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    messageRequests: 'friends',
    activityStatus: true
  });

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software developer passionate about creating amazing experiences.',
    location: 'New York, NY'
  });

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
    toast.success(`${type} notifications ${value ? 'enabled' : 'disabled'}`);
  };

  const handlePrivacyChange = (type: string, value: string | boolean) => {
    setPrivacy(prev => ({ ...prev, [type]: value }));
    toast.success(`Privacy setting updated: ${type}`);
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  const handleSavePrivacy = () => {
    toast.success('Privacy settings updated!');
  };

  const handleLogout = () => {
    toast.info('Logging out...');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requested. This action cannot be undone.');
  };

  return (
    <div className="w-full">
      <div className="container-responsive mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>

          {/* Mobile/Tablet View: Tabs at the top */}
          {(isMobile || isTablet) && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Desktop View: Settings Navigation */}
            {!isMobile && !isTablet && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <nav className="space-y-1">
                      <AccessibleButton
                        variant={activeTab === 'profile' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left h-10"
                        onClick={() => setActiveTab('profile')}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </AccessibleButton>
                      <AccessibleButton
                        variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left h-10"
                        onClick={() => setActiveTab('notifications')}
                      >
                        <Bell className="w-4 h-4 mr-3" />
                        Notifications
                      </AccessibleButton>
                      <AccessibleButton
                        variant={activeTab === 'privacy' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left h-10"
                        onClick={() => setActiveTab('privacy')}
                      >
                        <Shield className="w-4 h-4 mr-3" />
                        Privacy & Security
                      </AccessibleButton>
                      <AccessibleButton
                        variant={activeTab === 'mobile' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left h-10"
                        onClick={() => setActiveTab('mobile')}
                      >
                        <Smartphone className="w-4 h-4 mr-3" />
                        Mobile
                      </AccessibleButton>
                      <AccessibleButton
                        variant={activeTab === 'help' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left h-10"
                        onClick={() => setActiveTab('help')}
                      >
                        <HelpCircle className="w-4 h-4 mr-3" />
                        Help & Support
                      </AccessibleButton>
                    </nav>
                  </CardContent>
                </Card>

                {/* Account Actions Card */}
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </Button>
                    <Button
                      onClick={handleDeleteAccount}
                      variant="destructive"
                      className="w-full justify-start"
                    >
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Content */}
            <div className={`space-y-6 ${(isMobile || isTablet) ? 'col-span-1' : 'lg:col-span-2'}`}>
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Profile Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <Avatar className="w-20 h-20 mx-auto sm:mx-0">
                        <AvatarImage src={MOCK_IMAGES.AVATARS[0]} />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" className="sm:self-end">
                        Change Photo
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => handleProfileChange('location', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="w-5 h-5" />
                      <span>Notification Preferences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notif" className="mb-1 block">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive updates via email</p>
                        </div>
                        <Switch
                          id="email-notif"
                          checked={notifications.email}
                          onCheckedChange={(checked) => 
                            handleNotificationChange('email', checked)
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notif" className="mb-1 block">Push Notifications</Label>
                          <p className="text-sm text-gray-500">Receive push notifications</p>
                        </div>
                        <Switch
                          id="push-notif"
                          checked={notifications.push}
                          onCheckedChange={(checked) => 
                            handleNotificationChange('push', checked)
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="messages-notif" className="mb-1 block">Message Notifications</Label>
                          <p className="text-sm text-gray-500">Get notified of new messages</p>
                        </div>
                        <Switch
                          id="messages-notif"
                          checked={notifications.messages}
                          onCheckedChange={(checked) => 
                            handleNotificationChange('messages', checked)
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="comments-notif" className="mb-1 block">Comment Notifications</Label>
                          <p className="text-sm text-gray-500">Get notified of comments on your posts</p>
                        </div>
                        <Switch
                          id="comments-notif"
                          checked={notifications.comments}
                          onCheckedChange={(checked) => 
                            handleNotificationChange('comments', checked)
                          }
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveNotifications} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                      Save Notifications
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Privacy & Security</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-1 block">Profile Visibility</Label>
                        <Select 
                          value={privacy.profileVisibility} 
                          onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center space-x-2">
                                <Globe className="w-4 h-4" />
                                <span>Public</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="friends">Friends Only</SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>Private</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">Who can see your profile information</p>
                      </div>
                      
                      <div>
                        <Label className="mb-1 block">Message Requests</Label>
                        <Select 
                          value={privacy.messageRequests} 
                          onValueChange={(value) => handlePrivacyChange('messageRequests', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="friends">Friends Only</SelectItem>
                            <SelectItem value="none">No One</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">Who can send you message requests</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="activity-status" className="mb-1 block">Show Activity Status</Label>
                          <p className="text-sm text-gray-500">Let others see when you're online</p>
                        </div>
                        <Switch
                          id="activity-status"
                          checked={privacy.activityStatus}
                          onCheckedChange={(checked) => 
                            handlePrivacyChange('activityStatus', checked)
                          }
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleSavePrivacy} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                      Save Privacy Settings
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Mobile Settings */}
              {activeTab === 'mobile' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Smartphone className="w-5 h-5" />
                      <span>Mobile Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">Configure your mobile app preferences and notifications.</p>
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Mobile settings coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Help & Support */}
              {activeTab === 'help' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <HelpCircle className="w-5 h-5" />
                      <span>Help & Support</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">Get help with your account or report issues.</p>
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Help center coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mobile/Tablet View: Account Actions at the bottom */}
              {(isMobile || isTablet) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-3">
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out
                      </Button>
                      <Button
                        onClick={handleDeleteAccount}
                        variant="destructive"
                        className="w-full justify-start"
                      >
                        Delete Account
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Account deletion is permanent and cannot be undone. All your data will be lost.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;