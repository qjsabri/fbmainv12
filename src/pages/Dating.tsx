import React, { useState, useEffect } from 'react';
import { Heart, X, Star, MessageCircle, MapPin, Calendar, Filter,  Shield, Camera, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MOCK_IMAGES } from '@/lib/constants';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface DatingProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  photos: string[];
  interests: string[];
  education?: string;
  work?: string;
  distance: number;
  verified: boolean;
  lastActive: string;
}

interface DatingConversation {
  id: string;
  matchId: string;
  matchName: string;
  matchPhoto: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const Dating: React.FC = () => {
  const [profiles, setProfiles] = useState<DatingProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('discover');
  const [matches, setMatches] = useState<DatingProfile[]>([]);
  const [conversations, setConversations] = useState<DatingConversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for dating profiles
    const mockProfiles: DatingProfile[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        age: 28,
        location: 'New York, NY',
        bio: 'Love hiking, coffee, and good conversations. Looking for someone genuine.',
        photos: [MOCK_IMAGES.PROFILE_1, MOCK_IMAGES.PROFILE_2],
        interests: ['Hiking', 'Coffee', 'Photography', 'Travel'],
        education: 'Columbia University',
        work: 'Marketing Manager',
        distance: 2,
        verified: true,
        lastActive: '2 hours ago'
      },
      {
        id: '2',
        name: 'Michael Chen',
        age: 32,
        location: 'Brooklyn, NY',
        bio: 'Foodie, runner, and dog lover. Always up for trying new restaurants.',
        photos: [MOCK_IMAGES.PROFILE_3, MOCK_IMAGES.PROFILE_4],
        interests: ['Running', 'Cooking', 'Dogs', 'Music'],
        education: 'NYU',
        work: 'Software Engineer',
        distance: 5,
        verified: false,
        lastActive: '1 day ago'
      }
    ];
    
    setProfiles(mockProfiles);
    setLoading(false);
  }, []);

  const handleLike = () => {
    if (currentIndex < profiles.length) {
      const likedProfile = profiles[currentIndex];
      setMatches(prev => [...prev, likedProfile]);
      toast.success(`It's a match with ${likedProfile.name}!`);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePass = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const currentProfile = profiles[currentIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Facebook Dating</h1>
        <p className="text-gray-600 dark:text-gray-400">Find meaningful connections</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="matches">Matches ({matches.length})</TabsTrigger>
          <TabsTrigger value="conversations">Chats</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === 'discover' && (
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <AnimatePresence>
              {currentProfile && (
                <motion.div
                  key={currentProfile.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative"
                >
                  <Card className="overflow-hidden">
                    <div className="relative h-96">
                      <img
                        src={currentProfile.photos[0]}
                        alt={currentProfile.name}
                        className="w-full h-full object-cover"
                      />
                      {currentProfile.verified && (
                        <Badge className="absolute top-4 right-4 bg-blue-600">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{currentProfile.name}, {currentProfile.age}</h3>
                        <span className="text-sm text-gray-500">{currentProfile.distance} miles away</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{currentProfile.location}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">{currentProfile.bio}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {currentProfile.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary">{interest}</Badge>
                        ))}
                      </div>
                      {currentProfile.education && (
                        <p className="text-sm text-gray-600 mb-1">🎓 {currentProfile.education}</p>
                      )}
                      {currentProfile.work && (
                        <p className="text-sm text-gray-600 mb-1">💼 {currentProfile.work}</p>
                      )}
                      <p className="text-xs text-gray-500">Active {currentProfile.lastActive}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            
            {currentProfile && (
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={handlePass}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-16 h-16 p-0"
                >
                  <X className="w-8 h-8 text-gray-600" />
                </Button>
                <Button
                  onClick={handleLike}
                  size="lg"
                  className="rounded-full w-16 h-16 p-0 bg-pink-600 hover:bg-pink-700"
                >
                  <Heart className="w-8 h-8 text-white" />
                </Button>
              </div>
            )}
            
            {currentIndex >= profiles.length && (
              <Card className="text-center p-8">
                <CardContent>
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold mb-2">No more profiles</h3>
                  <p className="text-gray-600">Check back later for new people to discover!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {matches.map((match) => (
            <Card key={match.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <img
                  src={match.photos[0]}
                  alt={match.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-3">
                <h4 className="font-semibold truncate">{match.name}</h4>
                <p className="text-sm text-gray-600 truncate">{match.location}</p>
              </CardContent>
            </Card>
          ))}
          {matches.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2">No matches yet</h3>
              <p className="text-gray-600">Start swiping to find your matches!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'conversations' && (
        <div className="space-y-4">
          {conversations.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2">No conversations yet</h3>
              <p className="text-gray-600">Start chatting with your matches!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dating Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age Range</label>
                <div className="flex items-center gap-4">
                  <span>18</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span>35</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Distance</label>
                <div className="flex items-center gap-4">
                  <span>1 mile</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span>50 miles</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Safety</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Show me on Facebook Dating</span>
                <Button variant="outline" size="sm">On</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Block contacts</span>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dating;