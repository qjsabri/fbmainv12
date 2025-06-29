import React, { useState, useEffect } from 'react';
import { Store, Tag, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  image: string;
  location: string;
  category: string;
  isNew: boolean;
  description: string;
  seller: {
    name: string;
    avatar: string;
  };
  condition: string;
}

const MarketplaceWidget = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    // Initialize with mock items
    const mockItems: MarketplaceItem[] = [
      {
        id: '1',
        title: 'MacBook Pro 13" M2',
        price: '$1,200',
        image: MOCK_IMAGES.POSTS[0],
        location: 'San Francisco, CA',
        category: 'Electronics',
        isNew: true,
        description: 'Excellent condition MacBook Pro with M2 chip. Barely used, comes with original charger.',
        seller: {
          name: 'Sarah Johnson',
          avatar: MOCK_IMAGES.AVATARS[0]
        },
        condition: 'Like New'
      },
      {
        id: '2',
        title: 'Vintage Leather Sofa',
        price: '$800',
        image: getSafeImage('POSTS', 2),
        location: 'Oakland, CA',
        category: 'Furniture',
        isNew: false,
        description: 'Beautiful vintage leather sofa in good condition. Perfect for living room.',
        seller: {
          name: 'Mike Chen',
          avatar: MOCK_IMAGES.AVATARS[1]
        },
        condition: 'Good'
      },
      {
        id: '3',
        title: 'Mountain Bike - Like New',
        price: '$350',
        image: getSafeImage('POSTS', 3),
        location: 'San Jose, CA',
        category: 'Sports',
        isNew: true,
        description: 'Mountain bike in excellent condition. Only used a few times.',
        seller: {
          name: 'Emma Wilson',
          avatar: getSafeImage('AVATARS', 2)
        },
        condition: 'Like New'
      }
    ];
    
    setItems(mockItems);
  }, []);

  const handleViewItem = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setIsItemDialogOpen(true);
  };

  const handleViewAll = () => {
    navigate('/marketplace');
  };

  const handleMessageSeller = () => {
    if (!selectedItem) return;
    
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    toast.success(`Message sent to ${selectedItem.seller.name}`);
    setMessageText('');
    setIsMessageDialogOpen(false);
    setIsItemDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <div className="flex items-center">
              <Store className="w-5 h-5 mr-2" />
              <span>Marketplace</span>
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
                onClick={() => handleViewItem(item)}
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {item.isNew && (
                    <Badge className="absolute top-0 left-0 text-xs bg-green-500 text-white">New</Badge>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate dark:text-gray-100">{item.title}</h4>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{item.price}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1 dark:text-gray-400">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
                <Badge variant="outline" className="h-fit text-xs dark:border-gray-600">{item.category}</Badge>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-blue-600 dark:text-blue-400 dark:border-gray-600"
              onClick={handleViewAll}
            >
              <Tag className="w-4 h-4 mr-2" />
              Sell Something
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Item Detail Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title || 'Marketplace Item'}</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title} 
                className="w-full h-auto rounded-lg object-cover"
              />
              
              <div>
                <p className="text-xl font-bold text-blue-600">{selectedItem.price}</p>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{selectedItem.location}</span>
              </div>
              
              <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">{selectedItem.description}</p>
              
              <div className="pt-4 border-t dark:border-gray-700">
                <h3 className="font-semibold mb-2 dark:text-white">Seller Information</h3>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedItem.seller.avatar} />
                    <AvatarFallback>{selectedItem.seller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium dark:text-white">{selectedItem.seller.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member since 2022</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t dark:border-gray-700">
                <h3 className="font-semibold mb-2 dark:text-white">Item Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Category</p>
                    <p className="dark:text-white">{selectedItem.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Condition</p>
                    <p className="dark:text-white">{selectedItem.condition}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setIsItemDialogOpen(false);
                    setIsMessageDialogOpen(true);
                  }}
                >
                  Message Seller
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    navigate('/marketplace');
                    setIsItemDialogOpen(false);
                  }}
                  className="dark:border-gray-600 dark:text-gray-200"
                >
                  View in Marketplace
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Message {selectedItem?.seller.name}</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.title} 
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-medium dark:text-white">{selectedItem.title}</h3>
                  <p className="text-blue-600 font-bold">{selectedItem.price}</p>
                </div>
              </div>
              
              <Textarea
                placeholder={`Hi ${selectedItem.seller.name}, I'm interested in your "${selectedItem.title}". Is this still available?`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsMessageDialogOpen(false)}
                  className="dark:border-gray-600 dark:text-gray-200"
                >
                  Cancel
                </Button>
                <Button onClick={handleMessageSeller}>
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MarketplaceWidget;