import React, { useState, useEffect, useCallback } from 'react';
import { Search, Tag, Filter, Grid, List, ChevronDown, ChevronUp, MapPin, Heart, Share, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/ui/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Spinner from '@/components/ui/Spinner';
import { MOCK_IMAGES } from '@/lib/constants';
import { toast } from 'sonner';
import { formatTimeAgo } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  category: string;
  condition: string;
  description: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    isVerified: boolean;
  };
  createdAt: Date;
  isSaved: boolean;
  isFeatured?: boolean;
  tags: string[];
  distance?: string; // in miles/km
}

const EnhancedMarketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'price_low' | 'price_high' | 'popular'>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [distance, setDistance] = useState<number>(50);
  const [condition, setCondition] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const categories = [
    'all', 'electronics', 'furniture', 'clothing', 'vehicles', 'real estate', 
    'toys', 'books', 'sports', 'home', 'garden', 'pets', 'collectibles'
  ];
  
  const conditionOptions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  // Load products - simulate API call
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockProducts: Product[] = [
        {
          id: '1',
          title: 'MacBook Pro 13" M2 - Excellent Condition',
          price: '$1,299',
          location: 'San Francisco, CA',
          image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'electronics',
          condition: 'Like New',
          description: 'Selling my MacBook Pro M2 13-inch model. Purchased in 2023, excellent condition with minimal use. Comes with original charger and box.',
          seller: {
            id: 'user1',
            name: 'Sarah Johnson',
            avatar: MOCK_IMAGES.AVATARS[0],
            rating: 4.9,
            isVerified: true
          },
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          isSaved: false,
          isFeatured: true,
          tags: ['apple', 'laptop', 'macbook'],
          distance: '2.5 mi'
        },
        {
          id: '2',
          title: 'Modern Leather Sofa - Brown',
          price: '$850',
          location: 'Oakland, CA',
          image: 'https://images.pexels.com/photos/6489107/pexels-photo-6489107.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'furniture',
          condition: 'Good',
          description: 'Beautiful brown leather sofa in good condition. Some minor wear but still looks great. Must pick up - no delivery available.',
          seller: {
            id: 'user2',
            name: 'Mike Chen',
            avatar: MOCK_IMAGES.AVATARS[1],
            rating: 4.7,
            isVerified: false
          },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          isSaved: true,
          tags: ['furniture', 'sofa', 'leather'],
          distance: '5.8 mi'
        },
        {
          id: '3',
          title: 'Mountain Bike - Trek Marlin 7',
          price: '$550',
          location: 'Berkeley, CA',
          image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'sports',
          condition: 'Good',
          description: 'Trek Marlin 7 mountain bike. 2020 model in good condition. Recently tuned up and ready to ride. Perfect for trails or commuting.',
          seller: {
            id: 'user3',
            name: 'Emma Wilson',
            avatar: MOCK_IMAGES.AVATARS[2],
            rating: 4.8,
            isVerified: true
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          isSaved: false,
          tags: ['bike', 'cycling', 'outdoor'],
          distance: '7.2 mi'
        },
        {
          id: '4',
          title: 'iPhone 14 Pro Max - 256GB',
          price: '$899',
          location: 'San Jose, CA',
          image: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'electronics',
          condition: 'New',
          description: 'Brand new, sealed iPhone 14 Pro Max with 256GB storage. Space gray color. Unlocked for all carriers.',
          seller: {
            id: 'user4',
            name: 'David Kim',
            avatar: MOCK_IMAGES.AVATARS[3],
            rating: 4.5,
            isVerified: true
          },
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          isSaved: false,
          isFeatured: true,
          tags: ['apple', 'smartphone', 'iphone'],
          distance: '15.3 mi'
        },
        {
          id: '5',
          title: 'Vintage Record Collection',
          price: '$220',
          location: 'San Francisco, CA',
          image: 'https://images.pexels.com/photos/1337078/pexels-photo-1337078.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'collectibles',
          condition: 'Good',
          description: 'Collection of 30+ vintage vinyl records from the 70s and 80s. Mostly rock and jazz. Great condition considering their age.',
          seller: {
            id: 'user5',
            name: 'Lisa Wang',
            avatar: MOCK_IMAGES.AVATARS[4],
            rating: 4.6,
            isVerified: false
          },
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          isSaved: false,
          tags: ['vinyl', 'music', 'vintage'],
          distance: '1.7 mi'
        }
      ];
      
      setProducts(mockProducts);
      setIsLoading(false);
    };
    
    fetchProducts();
  }, []);

  // Filter products based on search, category, and other filters
  const filteredProducts = useCallback(() => {
    return products.filter(product => {
      // Search term matching
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Category matching
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      // Price range matching
      const productPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
      const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
      
      // Condition matching
      const matchesCondition = condition.length === 0 || condition.includes(product.condition);
      
      // Distance matching
      const productDistance = parseFloat(product.distance?.replace(/[^0-9.]/g, '') || '0');
      const matchesDistance = productDistance <= distance;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesCondition && matchesDistance;
    });
  }, [products, searchTerm, selectedCategory, priceRange, condition, distance]);

  // Sort products
  const sortedProducts = useCallback(() => {
    return [...filteredProducts()].sort((a, b) => {
      if (sortBy === 'price_low') {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
        return priceA - priceB;
      } else if (sortBy === 'price_high') {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
        return priceB - priceA;
      } else if (sortBy === 'popular') {
        return b.seller.rating - a.seller.rating;
      } else {
        // Recent by default
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  }, [filteredProducts, sortBy]);

  const handleToggleSaved = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, isSaved: !p.isSaved } : p
    ));
    
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(product.isSaved 
        ? `Removed from saved items` 
        : `Saved to your items`
      );
    }
  };

  const handleContact = (product: Product) => {
    setSelectedProduct(product);
    toast.success(`Messaging ${product.seller.name} about ${product.title}`);
  };

  const handleShare = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      navigator.clipboard.writeText(`Check out this ${product.title} for ${product.price} on Facebook Marketplace`);
      toast.success('Copied listing to clipboard');
    }
  };

  // Function to format price (just for display)
  const formatPrice = (price: string) => {
    return price;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Searching for "${searchTerm}"`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 5000]);
    setDistance(50);
    setCondition([]);
    setSortBy('recent');
    toast.info('Filters cleared');
  };

  return (
    <div className="container-responsive mx-auto py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
            <p className="text-gray-600 dark:text-gray-300">Buy and sell items in your local community</p>
          </div>
          <Button onClick={() => setActiveTab('sell')} className="w-full sm:w-auto">
            <Tag className="w-4 h-4 mr-2" />
            Sell Something
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search Marketplace"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Search</Button>
              <Button 
                variant={showFilters ? "default" : "outline"} 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
            </div>
          </form>
          
          {/* Expanded Filters */}
          {showFilters && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Filters</h3>
                  <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    Clear All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Sort By</label>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Condition</label>
                    <div className="flex flex-wrap gap-2">
                      {conditionOptions.map(option => (
                        <Button
                          key={option}
                          variant={condition.includes(option) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setCondition(prev => 
                              prev.includes(option) 
                                ? prev.filter(o => o !== option)
                                : [...prev, option]
                            );
                          }}
                          className="text-xs h-8"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Category Pills */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin pb-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs whitespace-nowrap"
              >
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="selling">Selling</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 dark:bg-gray-700"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3 dark:bg-gray-700"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedProducts().length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedProducts().map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <OptimizedImage
                          src={product.image}
                          alt={product.title}
                          className="w-full h-48 object-cover"
                          aspectRatio="auto"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant={product.isFeatured ? 'default' : 'secondary'} className={`${product.isFeatured ? 'bg-blue-500' : ''}`}>
                            {product.isFeatured ? 'Featured' : product.condition}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSaved(product.id);
                          }}
                          className={`absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-black/60 dark:hover:bg-black/80 ${
                            product.isSaved ? 'text-red-500' : 'text-gray-600'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${product.isSaved ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-1 dark:text-white">{formatPrice(product.price)}</h3>
                        <h4 className="font-medium text-sm line-clamp-1 mb-1 dark:text-gray-100">{product.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mb-3 dark:text-gray-400">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{product.location}</span>
                          {product.distance && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{product.distance}</span>
                            </>
                          )}
                        </div>
                        <div className="flex justify-between mt-3">
                          <Button 
                            variant="default"
                            size="sm"
                            className="flex-1 mr-2"
                            onClick={() => handleContact(product)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare(product.id)}
                            className="dark:border-gray-600 dark:text-gray-200"
                          >
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedProducts().map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="relative md:w-1/4 h-48 md:h-auto">
                            <OptimizedImage
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover rounded-lg"
                              aspectRatio="auto"
                            />
                            <div className="absolute top-2 left-2">
                              <Badge variant={product.isFeatured ? 'default' : 'secondary'} className={`${product.isFeatured ? 'bg-blue-500' : ''}`}>
                                {product.isFeatured ? 'Featured' : product.condition}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl mb-1 dark:text-white">{formatPrice(product.price)}</h3>
                            <h4 className="font-medium text-lg mb-2 dark:text-gray-100">{product.title}</h4>
                            <div className="flex items-center text-sm text-gray-500 mb-2 dark:text-gray-400">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{product.location}</span>
                              {product.distance && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span>{product.distance}</span>
                                </>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2 dark:text-gray-300">{product.description}</p>
                            <div className="flex items-center mb-4">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={product.seller.avatar} />
                                <AvatarFallback>{product.seller.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600 dark:text-gray-300">{product.seller.name}</span>
                              {product.seller.isVerified && (
                                <span className="ml-1 text-blue-500">✓</span>
                              )}
                              <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                                {formatTimeAgo(product.createdAt.toISOString())}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm"
                                className="flex-1"
                                onClick={() => handleContact(product)}
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Message Seller
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleSaved(product.id)}
                                className={product.isSaved ? 'text-red-500 border-red-500' : 'dark:border-gray-600 dark:text-gray-200'}
                              >
                                <Heart className={`h-4 w-4 mr-2 ${product.isSaved ? 'fill-current' : ''}`} />
                                {product.isSaved ? 'Saved' : 'Save'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleShare(product.id)}
                                className="dark:border-gray-600 dark:text-gray-200"
                              >
                                <Share className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No products found</h3>
                <p className="text-gray-500 mb-6 dark:text-gray-400">
                  {searchTerm 
                    ? `No results for "${searchTerm}"`
                    : selectedCategory !== 'all'
                      ? `No products found in the "${selectedCategory}" category`
                      : "Try adjusting your filters or search term"}
                </p>
                <Button onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">Your Saved Items</h3>
              <p className="text-gray-500 mb-6 dark:text-gray-400">
                Items you save will appear here
              </p>
              <Button onClick={() => setActiveTab('browse')}>
                Browse Marketplace
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="selling">
            <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <Store className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">Your Listings</h3>
              <p className="text-gray-500 mb-6 dark:text-gray-400">
                You don't have any active listings yet
              </p>
              <Button onClick={() => setActiveTab('sell')}>
                Create Listing
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="sell">
            <Card>
              <CardHeader>
                <CardTitle>Sell an Item</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Title</label>
                    <Input placeholder="What are you selling?" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Price</label>
                    <Input placeholder="$0.00" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Category</label>
                    <Select defaultValue={categories[0]}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== 'all').map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Condition</label>
                    <Select defaultValue={conditionOptions[0]}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionOptions.map(condition => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Description</label>
                    <textarea 
                      className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                      rows={4}
                      placeholder="Describe what you're selling"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Photos</label>
                    <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg dark:border-gray-600">
                      <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4 dark:text-gray-600" />
                      <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Drag and drop photos here, or click to browse</p>
                      <Button variant="outline" className="dark:border-gray-600 dark:text-gray-200">
                        Add Photos
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t dark:border-gray-700">
                    <Button className="w-full">
                      Create Listing
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Icon components
const Bookmark = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const Store = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
    <path d="M18 12v0a2 2 0 0 1-2-2V7" />
    <path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
    <path d="M10 12v0a2 2 0 0 1-2-2V7" />
    <path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export default EnhancedMarketplace;