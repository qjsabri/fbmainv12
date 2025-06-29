import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Smartphone, Laptop, Monitor, Link, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';

interface ConnectedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'browser' | 'tablet' | 'desktop';
  lastActive: string;
  location?: string;
  isCurrentDevice: boolean;
}

interface LinkedAccount {
  id: string;
  platform: 'instagram' | 'whatsapp' | 'messenger' | 'threads';
  username: string;
  avatar: string;
  isConnected: boolean;
}

const CrossPlatformIntegration = () => {
  const [devices, setDevices] = useState<ConnectedDevice[]>([
    {
      id: 'device1',
      name: 'iPhone 15 Pro',
      type: 'mobile',
      lastActive: 'Active now',
      location: 'San Francisco, CA',
      isCurrentDevice: false
    },
    {
      id: 'device2',
      name: 'Chrome on Windows',
      type: 'browser',
      lastActive: 'Active now',
      location: 'San Francisco, CA',
      isCurrentDevice: true
    },
    {
      id: 'device3',
      name: 'iPad Pro',
      type: 'tablet',
      lastActive: '2 hours ago',
      location: 'San Francisco, CA',
      isCurrentDevice: false
    }
  ]);

  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([
    {
      id: 'acct1',
      platform: 'instagram',
      username: 'user.name',
      avatar: getSafeImage('AVATARS', 0),
      isConnected: true
    },
    {
      id: 'acct2',
      platform: 'whatsapp',
      username: '+1 (555) 123-4567',
      avatar: getSafeImage('AVATARS', 1),
      isConnected: false
    },
    {
      id: 'acct3',
      platform: 'messenger',
      username: 'user.name',
      avatar: getSafeImage('AVATARS', 2),
      isConnected: true
    },
    {
      id: 'acct4',
      platform: 'threads',
      username: 'user.name',
      avatar: getSafeImage('AVATARS', 3),
      isConnected: false
    }
  ]);

  const [code, setCode] = useState('');

  const handleLogoutDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(device => device.id !== deviceId));
    toast.success('Device logged out successfully');
  };

  const handleConnectAccount = (accountId: string) => {
    setLinkedAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, isConnected: !account.isConnected }
        : account
    ));
    
    const account = linkedAccounts.find(a => a.id === accountId);
    if (account) {
      toast.success(account.isConnected 
        ? `${account.platform.charAt(0).toUpperCase() + account.platform.slice(1)} account disconnected` 
        : `${account.platform.charAt(0).toUpperCase() + account.platform.slice(1)} account connected`);
    }
  };

  const handleGenerateCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCode(newCode);
    toast.success('New code generated: ' + newCode);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="w-5 h-5 text-blue-500" />;
      case 'browser': return <Monitor className="w-5 h-5 text-green-500" />;
      case 'tablet': return <Tablet className="w-5 h-5 text-purple-500" />;
      case 'desktop': return <Laptop className="w-5 h-5 text-orange-500" />;
      default: return <Smartphone className="w-5 h-5" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'whatsapp': return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'messenger': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'threads': return <AtSign className="w-5 h-5 text-black dark:text-white" />;
      default: return <Link className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Connected Devices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  {getDeviceIcon(device.type)}
                  <div>
                    <p className="font-medium dark:text-white">
                      {device.name}
                      {device.isCurrentDevice && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Current</Badge>
                      )}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{device.lastActive}</span>
                      {device.location && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{device.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {!device.isCurrentDevice && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleLogoutDevice(device.id)}
                    className="dark:border-gray-600 dark:text-gray-200"
                  >
                    Log Out
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="pt-2 mt-2 border-t dark:border-gray-700">
            <Button 
              variant="outline"
              className="dark:border-gray-600 dark:text-gray-200"
              onClick={() => toast.info('Device management page coming soon')}
            >
              Manage All Devices
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Linked Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {linkedAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  {getPlatformIcon(account.platform)}
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={account.avatar} />
                    <AvatarFallback>{account.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium capitalize dark:text-white">{account.platform}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{account.username}</p>
                  </div>
                </div>
                
                <Button 
                  variant={account.isConnected ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleConnectAccount(account.id)}
                  className={account.isConnected ? "dark:border-gray-600 dark:text-gray-200" : ""}
                >
                  {account.isConnected ? (
                    <>
                      <X className="w-4 h-4 mr-1" />
                      Disconnect
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4 mr-1" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="pt-2 mt-2 border-t dark:border-gray-700">
            <Button 
              onClick={() => toast.info('Account linking page coming soon')}
            >
              Link Another Account
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pair New Device</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="bg-gray-50 p-6 rounded-lg inline-block dark:bg-gray-800">
              <div className="text-3xl font-mono font-bold mb-2 tracking-wider dark:text-white">
                {code || '------'}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enter this code on your new device</p>
            </div>
            
            <div className="mt-4">
              {code ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">Code expires in 10 minutes</p>
              ) : (
                <Button onClick={handleGenerateCode}>Generate Code</Button>
              )}
            </div>
          </div>
          
          <div className="pt-4 mt-4 border-t dark:border-gray-700">
            <div className="space-y-3">
              <p className="font-medium dark:text-white">Already have a code?</p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <Button 
                  onClick={() => toast.success('Device paired successfully')}
                  disabled={code.length !== 6}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Verify
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Icon components
const Tablet = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12" y2="18.01" />
  </svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const MessageSquare = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MessageCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const AtSign = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
  </svg>
);

export default CrossPlatformIntegration;