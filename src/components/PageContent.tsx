import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Image, Video, Calendar, MapPin, Users, Globe, Link, Mail, Phone, Info, Flag, Star } from 'lucide-react';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { toast } from 'sonner';
import CreatePost from './posts/CreatePost';
import PostCard from './posts/PostCard';

interface PageContentProps {
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
    founded?: string;
    about?: string;
    hours?: {
      [key: string]: string;
    };
  };
}

const PageContent: React.FC<PageContentProps> = ({ page }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([
    {
      id: 'page-post-1',
      user_id: page.id,
      content: 'We\'re excited to announce our latest product launch! Stay tuned for more details coming soon. #innovation #technology',
      image_url: MOCK_IMAGES.POSTS[0],
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      profiles: {
        id: page.id,
        full_name: page.name,
        avatar_url: page.avatar
      },
      likes_count: 45,
      comments_count: 12,
      user_has_liked: false
    },
    {
      id: 'page-post-2',
      user_id: page.id,
      content: 'Thank you to everyone who attended our webinar yesterday! We had a great turnout and some excellent questions. The recording will be available on our website next week.',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      profiles: {
        id: page.id,
        full_name: page.name,
        avatar_url: page.avatar
      },
      likes_count: 32,
      comments_count: 8,
      user_has_liked: true
    }
  ]);

  const [events] = useState([
    {
      id: 'event-1',
      title: 'Product Launch Webinar',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Online',
      attendees: 156,
      image: MOCK_IMAGES.EVENTS[0]
    },
    {
      id: 'event-2',
      title: 'Customer Appreciation Day',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'San Francisco, CA',
      attendees: 89,
      image: MOCK_IMAGES.EVENTS[1]
    }
  ]);

  const [photos] = useState([
    MOCK_IMAGES.POSTS[0],
    MOCK_IMAGES.POSTS[1],
    getSafeImage('POSTS', 2),
    getSafeImage('POSTS', 3),
    getSafeImage('POSTS', 4),
      getSafeImage('POSTS', 5)
  ]);

  const handleCreatePost = (newPost) => {
    const pagePost = {
      ...newPost,
      id: `page-post-${Date.now()}`,
      user_id: page.id,
      profiles: {
        id: page.id,
        full_name: page.name,
        avatar_url: page.avatar
      },
      likes_count: 0,
      comments_count: 0,
      user_has_liked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setPosts([pagePost, ...posts]);
    toast.success('Post created on page');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="more">More</TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-6">
          <CreatePost onCreatePost={handleCreatePost} />
          
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">This page hasn't posted any content yet.</p>
                <Button>Create First Post</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <p className="text-gray-700 whitespace-pre-line">{page.about || page.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="space-y-2">
                    {page.website && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Link className="w-5 h-5 text-gray-500" />
                        <a href={page.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {page.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    {page.email && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <a href={`mailto:${page.email}`} className="text-blue-600 hover:underline">
                          {page.email}
                        </a>
                      </div>
                    )}
                    {page.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <a href={`tel:${page.phone}`} className="text-blue-600 hover:underline">
                          {page.phone}
                        </a>
                      </div>
                    )}
                    {page.location && (
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span>{page.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Additional Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <span>Category: {page.category}</span>
                    </div>
                    {page.founded && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span>Founded: {page.founded}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-5 h-5 text-gray-500" />
                      <span>{page.followers.toLocaleString()} followers</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {page.hours && (
                <div>
                  <h4 className="font-medium mb-3">Business Hours</h4>
                  <div className="space-y-1">
                    {Object.entries(page.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="font-medium">{day}</span>
                        <span>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t flex justify-between">
                <Button variant="outline" onClick={() => toast.info('Report feature coming soon')}>
                  <Flag className="w-4 h-4 mr-2" />
                  Report Page
                </Button>
                <Button variant="outline" onClick={() => toast.info('Rating feature coming soon')}>
                  <Star className="w-4 h-4 mr-2" />
                  Rate Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Photos</h3>
                <Button variant="outline" size="sm">
                  <Image className="w-4 h-4 mr-2" />
                  Add Photos
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={photo} 
                      alt={`Page photo ${index + 1}`} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
              
              {photos.length === 0 && (
                <div className="text-center py-8">
                  <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos yet</h3>
                  <p className="text-gray-500 mb-4">This page hasn't uploaded any photos yet.</p>
                  <Button>Upload First Photo</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>
              
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="sm:w-48 h-32 rounded-lg overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{event.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} people going</span>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm">Interested</Button>
                          <Button variant="outline" size="sm">Share</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming events</h3>
                  <p className="text-gray-500 mb-4">This page hasn't created any events yet.</p>
                  <Button>Create First Event</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* More Tab */}
        <TabsContent value="more">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Videos</h3>
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No videos yet</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Community</h3>
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No community posts yet</p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Page Transparency</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">About this Page</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          This page was created on {page.founded || 'January 1, 2022'}. It's managed by page administrators from {page.location || 'United States'}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageContent;