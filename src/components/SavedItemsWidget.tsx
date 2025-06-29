import React, { useState, useEffect } from 'react';
import { Bookmark, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_IMAGES, STORAGE_KEYS } from '@/lib/constants';
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
      
      // Get saved posts
      const savedPosts = storage.get<string[]>(STORAGE_KEYS.SAVED_POSTS, []);
      
      // Get saved items from storage
      const savedItems = storage.get<SavedItem[]>(STORAGE_KEYS.SAVED_ITEMS, []);
      
      // Combine saved posts with saved items
      let allItems: SavedItem[] = [...(savedItems || [])];
      
      // Add saved posts if they're not already in the saved items
      if (savedPosts && savedPosts.length > 0) {
        const existingPostIds = new Set(allItems.filter(item => item.type === 'post').map(item => item.originalId));
        
        // Add posts that aren't already in the saved items
        savedPosts.forEach(postId => {
          if (!existingPostIds.has(postId)) {
            allItems.push({
              id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              originalId: postId,
              type: 'post',
              title: `Saved Post #${postId}`,
              savedDate: new Date().toISOString(),
              collection: 'posts',
              description: 'A post you saved for later',
              image: `https://images.pexels.com/photos/${1000000 + parseInt(postId.replace(/\D/g, '') || '0') % 10000}/pexels-photo-${1000000 + parseInt(postId.replace(/\D/g, '') || '0') % 10000}.jpeg?w=800&h=600&fit=crop`
            });
          }
        });
      }
      
      // If still no items, create mock data
      if (allItems.length === 0) {
        allItems = [
          {
            id: '1',
            originalId: 'post_1',
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
            savedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
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
        
        // Save mock data to storage
        storage.set(STORAGE_KEYS.SAVED_ITEMS, allItems);
      }
      
      // Sort by date (newest first) and take only the most recent items (up to 3)
      const sortedItems = allItems.sort((a, b) => 
        new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
      ).slice(0, 3);
      
      setItems(sortedItems);
      setIsLoading(false);
    };
    
    loadSavedItems();
  }, []);

  const handleViewItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      if (item.type === 'post' && item.originalId) {
        // Navigate to the post in the feed
        navigate(`/?post=${item.originalId}`);
        return;
      }
      
      if (item.url) {
        window.open(item.url, '_blank');
      } else {
        toast.info(`Viewing saved item: ${item.title}`);
      }
    }
  };

  const handleViewAll = () => {
    navigate('/saved');
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'post': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'video': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'event': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'marketplace': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'article': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'photo': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'link': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <Bookmark className="w-5 h-5 mr-2" />
            <span>Saved Items</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) return null;

  return (
    <Card>
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
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors dark:hover:bg-gray-700"
              onClick={() => handleViewItem(item.id)}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center dark:bg-gray-700">
                  <Bookmark className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                    <span className="capitalize">{item.type}</span>
                  </Badge>
                  {item.url && (
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  )}
                  {item.isFavorite && (
                    <Heart className="w-3 h-3 text-red-500 fill-current" />
                  )}
                </div>
                <h4 className="font-medium text-sm text-gray-900 truncate mt-1 dark:text-gray-100">{item.title}</h4>
                <div className="flex items-center space-x-1 mt-1">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Saved {formatTimeAgo(item.savedDate)}</p>
                </div>
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-blue-600 dark:text-blue-400 dark:border-gray-600"
            onClick={handleViewAll}
          >
            View All Saved Items
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Heart icon component
const Heart = ({ className }: { className?: string }) => (
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
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

// Helper function to format time ago
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

export default SavedItemsWidget;