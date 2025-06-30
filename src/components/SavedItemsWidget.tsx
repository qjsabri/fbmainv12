import React, { useState, useEffect } from 'react';
import { Bookmark, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_IMAGES, STORAGE_KEYS, getSafeImage } from '@/lib/constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';

interface SavedItem {
  id: string;
  originalId?: string;
  type: 'post' | 'video' | 'article' | 'event' | 'marketplace' | 'photo' | 'link' | 'group';
  title: string;
  image?: string;
  savedDate: string;
  collection: string;
  url?: string;
  isFavorite?: boolean;
  description?: string;
}

const SavedItemsWidget = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved items from storage
  useEffect(() => {
    const loadSavedItems = () => {
      setIsLoading(true);
      
      // Get saved items from storage
      const savedItems = storage.get<SavedItem[]>(STORAGE_KEYS.SAVED_ITEMS);
      const savedPosts = storage.get<string[]>(STORAGE_KEYS.SAVED_POSTS, []);
      
      let allItems: SavedItem[] = [];
      
      if (savedItems && savedItems.length > 0) {
        allItems = [...savedItems];
      }
      
      // Add saved posts if they're not already in the items
      if (savedPosts && savedPosts.length > 0) {
        const existingIds = new Set(allItems.map(item => item.id));
        
        // Create saved item entries for posts
        const postItems: SavedItem[] = savedPosts
          .filter(id => !existingIds.has(id))
          .map(id => ({
            id,
            type: 'post',
            title: `Saved Post #${id}`,
            content: 'This is a saved post from your feed.',
            image: MOCK_IMAGES.POSTS[parseInt(id) % MOCK_IMAGES.POSTS.length],
            savedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            collection: 'Posts',
            creator: {
              name: ['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Kim'][parseInt(id) % 4],
              avatar: MOCK_IMAGES.AVATARS[parseInt(id) % MOCK_IMAGES.AVATARS.length],
              verified: Math.random() > 0.5
            }
          }));
        
        allItems = [...allItems, ...postItems];
      }
      
      // If still no items, create mock data
      if (allItems.length === 0) {
        allItems = [
          {
            id: '1',
            type: 'post',
            title: 'Amazing React Development Tips',
            image: MOCK_IMAGES.POSTS[0],
            savedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            collection: 'Tech Tips'
          },
          {
            id: '2',
            type: 'video',
            title: 'How to Build a Social Media App',
            image: MOCK_IMAGES.POSTS[1],
            savedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            collection: 'Videos'
          },
          {
            id: '3',
            type: 'article',
            title: 'The Future of Web Development',
            savedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            collection: 'Articles',
            url: 'https://example.com/article'
          }
        ];
      }
      
      // Save all items to storage
      storage.set(STORAGE_KEYS.SAVED_ITEMS, allItems);
      
      setItems(allItems);
      setIsLoading(false);
    };
    
    loadSavedItems();
  }, []);

  const handleViewItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      toast.success(`Viewing ${item.title}`);
    }
  };

  const handleViewAll = () => {
    navigate('/saved');
  };

  // Format time ago
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return diffInSeconds <= 5 ? 'now' : `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w`;
    
    // More precise month/year formatting
    const months = Math.floor(diffInSeconds / 2592000);
    if (months < 12) return `${months}mo`;
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years}y`;
  };

  if (isLoading) {
    return (
      <Card className="hidden lg:block">
        <CardHeader className="p-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <Bookmark className="w-5 h-5 mr-2" />
            <span>Saved Items</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-24 bg-gray-200 rounded mb-2 dark:bg-gray-700"></div>
            <div className="h-6 w-32 bg-gray-200 rounded dark:bg-gray-700"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) return null;

  return (
    <Card className="hidden lg:block">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <div className="flex items-center">
            <Bookmark className="w-5 h-5 mr-2" />
            <span>Saved Items</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleViewAll}
            className="text-blue-600 text-xs dark:text-blue-400"
          >
            See All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-3">
          {items.slice(0, 3).map((item) => (
            <div 
              key={item.id} 
              className="flex space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors dark:hover:bg-gray-700"
              onClick={() => handleViewItem(item.id)}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center dark:bg-gray-700">
                  <Bookmark className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate dark:text-gray-100">{item.title}</h4>
                <div className="flex items-center mt-1">
                  <Clock className="w-3 h-3 text-gray-500 mr-1 dark:text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Saved {formatTimeAgo(item.savedDate)}
                  </span>
                </div>
              </div>
              {item.url && (
                <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              )}
            </div>
          ))}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-blue-600 dark:text-blue-400"
            onClick={handleViewAll}
          >
            View All Saved Items
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedItemsWidget;