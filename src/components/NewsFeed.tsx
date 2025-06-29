import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContextType';
import { Post } from '@/types';
import CreatePost from './posts/CreatePost';
import PostCard from './posts/PostCard';
import Stories from './Stories';
import ReelsCarousel from './ReelsCarousel';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import NewsFeedSkeleton from './NewsFeedSkeleton';
import StoriesSkeleton from './StoriesSkeleton';
import { AlertCircle, RefreshCw, MessageCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_IMAGES } from '@/lib/constants';
import { toast } from 'sonner';
import NewsFeedTabs from './NewsFeedTabs';
import NewsFeedFilters from './NewsFeedFilters';
import LazyComponent from './ui/LazyComponent';

const NewsFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNewPosts, setHasNewPosts] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('foryou');
  const [sortBy, setSortBy] = useState('recent');
  const [isStoriesLoading, setIsStoriesLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCreator, setFilterCreator] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterLiked, setFilterLiked] = useState(false);
  const [filterSaved, setFilterSaved] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const fetchPosts = useCallback((pageNum: number, filter = activeTab, sort = sortBy) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call with filtering
    setTimeout(() => {
      try {
        let mockPosts = generateMockPosts(pageNum, 5, filter);
        
        // Apply additional filters
        if (filterCreator) {
          mockPosts = mockPosts.filter(post => 
            post.profiles?.full_name?.toLowerCase().includes(filterCreator.toLowerCase())
          );
        }
        
        if (typeof filterDateRange === 'object' && filterDateRange.start && filterDateRange.end) {
          mockPosts = mockPosts.filter(post => {
            const postDate = new Date(post.created_at);
            return postDate >= filterDateRange.start && postDate <= filterDateRange.end;
          });
        }
        
        // Apply sorting
        if (sort === 'most_recent') {
          mockPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (sort === 'most_relevant') {
          mockPosts.sort((a, b) => (b.likes_count + b.comments_count) - (a.likes_count + a.comments_count));
        }
        
        if (pageNum === 1) {
          setPosts(mockPosts);
        } else {
          setPosts(prev => [...prev, ...mockPosts]);
        }
        
        setHasMore(mockPosts.length === 5);
      } catch (err) {
        setError('Failed to load posts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 800);
  }, [activeTab, sortBy, filterCreator, filterDateRange]);

  const loadMorePosts = useCallback(() => {
    if (isLoading) return;
    // Prevent loading more if already reached the end
    if (!hasMore) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, activeTab, sortBy);
  }, [page, fetchPosts, activeTab, sortBy, isLoading, hasMore]);

  useEffect(() => {
    // Fetch initial posts and simulate stories loading
    fetchPosts(1, activeTab, sortBy);
    const timer = setTimeout(() => setIsStoriesLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [fetchPosts, activeTab, sortBy]);
  
  // Load more posts when scrolling to the bottom
  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      // Debounce loadMore to prevent multiple calls
      const timer = setTimeout(() => {
        loadMorePosts();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [inView, isLoading, hasMore, loadMorePosts]);

  // Simulate new posts notification
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && !hasNewPosts) {
        setHasNewPosts(true);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [hasNewPosts]);

  const handleRefresh = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    setPage(1);
    fetchPosts(1, activeTab, sortBy);
    setHasNewPosts(false);
    toast.success('Feed updated with new posts');
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setPage(1);
    fetchPosts(1, newTab, sortBy);
  };
  
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setPage(1);
    fetchPosts(1, activeTab, newSort);
  };
  
  const handleCreatePost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    toast.success('Post created successfully!');
  };

  const handleApplyFilters = () => {
    setPage(1);
    // Reset states before fetching to avoid stale data
    setPosts([]);
    setHasMore(true);
    fetchPosts(1, activeTab, sortBy);
    toast.success('Filters applied');
  };

  const handleClearFilters = () => {
    setFilterCreator('');
    setFilterDateRange('all');
    setFilterLocation('');
    setFilterLiked(false);
    setFilterSaved(false);
    setPage(1);
    fetchPosts(1, activeTab, sortBy);
    toast.info('Filters cleared');
  };
  
  // Generate mock posts
  const generateMockPosts = useCallback((pageNum: number, count: number, filter = 'foryou') => {
    const startIndex = (pageNum - 1) * count;
    const posts = [];
    
    const contents = [
      'Just finished building an amazing React application! The satisfaction of seeing your code come to life is unmatched. 🚀 #ReactJS #WebDevelopment',
      'Beautiful sunset from my evening walk. Sometimes you need to step away from the screen and enjoy nature! 🌅',
      'Excited to share my latest project! Working on a social media platform with some amazing features. Can\'t wait to show you all what we\'ve been building! 💻✨',
      'Had an incredible day at the tech conference! So many inspiring talks and amazing people. The future of technology looks bright! 🌟',
      'Weekend coding session complete! There\'s something magical about solving complex problems with elegant code. #CodeLife #Programming',
      'Just discovered this amazing new library that makes development so much easier. Love how the tech community constantly innovates! 🔧',
      'Reflecting on the journey so far. Every challenge has been a learning opportunity. Grateful for this amazing community! 🙏',
      'Late night debugging session turned into a breakthrough moment. Sometimes the best solutions come when you least expect them! 💡',
      'Coffee and code - the perfect combination for a productive morning! ☕️ What\'s your favorite coding fuel?',
      'Deployed my first full-stack application today! The feeling of seeing your work live on the internet is incredible! 🌐',
      'Learning something new every day in this field. Today it was about advanced React patterns and I\'m mind blown! 🤯',
      'Team collaboration at its finest! Just wrapped up an amazing sprint with the most talented developers. 👥',
      'Open source contribution feels so rewarding. Giving back to the community that has given me so much! 🌍',
      'Debugging is like being a detective in a crime movie where you are also the murderer. But when you find the bug... 🕵️‍♂️',
      'The best part about being a developer? Every day brings new challenges and opportunities to grow! 📈'
    ];

    // Apply filter logic
    let filteredContents = [...contents];
    if (filter === 'photos') {
      // Only posts with images
      filteredContents = filteredContents.slice(0, 5);
    } else if (filter === 'videos') {
      // Only posts with videos (mock)
      filteredContents = filteredContents.slice(5, 8);
    } else if (filter === 'popular') {
      // Popular posts have more engagement
      filteredContents = filteredContents.slice(8, 12);
    }

    // Generate exactly the requested number of posts
    for (let i = 0; i < count; i++) {
      const postIndex = startIndex + i;
      const contentIndex = postIndex % filteredContents.length;
      const content = filteredContents[contentIndex];
      
      const hasImage = filter === 'photos' ? true : filter === 'videos' ? false : Math.random() > 0.4; // 60% chance of having an image
      const image = hasImage ? MOCK_IMAGES.POSTS[postIndex % MOCK_IMAGES.POSTS.length] : undefined;
      
      // Random reactions for some posts
      const hasReactions = Math.random() > 0.3;
      const reactions = hasReactions ? {
        '👍': Math.floor(Math.random() * 50),
        '❤️': Math.floor(Math.random() * 30),
        '😆': Math.floor(Math.random() * 20),
        '😮': Math.floor(Math.random() * 10),
        '😢': Math.floor(Math.random() * 5),
        '😡': Math.floor(Math.random() * 3)
      } : undefined;
      
      // Random feelings for some posts
      const hasFeelings = Math.random() > 0.8;
      const feelings = ["😊 happy", "😢 sad", "😍 loved", "😎 cool", "🤔 thoughtful"];
      const feeling = hasFeelings ? feelings[Math.floor(Math.random() * feelings.length)] : undefined;
      
      // Random location for some posts
      const hasLocation = Math.random() > 0.8;
      const locations = ["San Francisco, CA", "New York, NY", "Los Angeles, CA", "Seattle, WA", "Chicago, IL"];
      const location = hasLocation ? locations[Math.floor(Math.random() * locations.length)] : undefined;

      // Random poll for some posts
      const isPoll = Math.random() > 0.9;
      const pollOptions = isPoll ? [
        'What do you think about this new feature?',
        'Love it!',
        'It\'s okay',
        'Not a fan',
        'No opinion'
      ] : undefined;

      const pollVotes = isPoll ? {
        0: Math.floor(Math.random() * 50) + 10,
        1: Math.floor(Math.random() * 30) + 5,
        2: Math.floor(Math.random() * 20) + 3,
        3: Math.floor(Math.random() * 10)
      } : undefined;

      const authorIndex = postIndex % MOCK_IMAGES.AVATARS.length;
      posts.push({
        id: `post_${postIndex + 1}`,
        user_id: `user_${authorIndex}`,
        content: `${content} (Post #${postIndex + 1})`,
        image_url: image,
        created_at: new Date(Date.now() - (postIndex * 15 * 60 * 1000)).toISOString(),
        updated_at: new Date(Date.now() - (postIndex * 15 * 60 * 1000)).toISOString(),
        profiles: {
          id: `user_${authorIndex}`,
          full_name: ['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Kim', 'Lisa Wang', 'Alex Rodriguez', 'Jessica Park'][authorIndex],
          avatar_url: MOCK_IMAGES.AVATARS[authorIndex]
        },
        likes_count: Math.floor(Math.random() * 500) + 10,
        comments_count: Math.floor(Math.random() * 100) + 2,
        user_has_liked: Math.random() > 0.7,
        reactions,
        feeling,
        location,
        isPoll,
        pollOptions,
        pollVotes
      });
    }

    return posts;
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 max-w-xl mx-auto">
      <div className="space-y-4">
        {isStoriesLoading ? <StoriesSkeleton /> : <Stories />}
        
        <CreatePost onCreatePost={handleCreatePost} />
        
        {/* Reels Carousel - Lazy loaded */}
        <LazyComponent loadingStrategy="viewport">
          <ReelsCarousel />
        </LazyComponent>
        
        {/* Feed Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full overflow-x-auto scrollbar-thin">
            <NewsFeedTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button 
              size="sm" 
              className="text-xs dark:border-gray-700 dark:text-gray-300"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <NewsFeedFilters
            creator={filterCreator}
            setCreator={setFilterCreator}
            dateRange={filterDateRange}
            setDateRange={setFilterDateRange}
            location={filterLocation}
            setLocation={setFilterLocation}
            liked={filterLiked}
            setLiked={setFilterLiked}
            saved={filterSaved}
            setSaved={setFilterSaved}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        )}
        
        {/* New posts notification */}
        <AnimatePresence>
          {hasNewPosts && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="sticky top-16 z-10 flex justify-center"
            >
              <Button 
                onClick={handleRefresh}
                variant="default" 
                size="sm" 
                className="inline-flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New posts available
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main content */}
        <div className="space-y-4">
          {isLoading && posts.length === 0 ? (
            <NewsFeedSkeleton />
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm card-responsive text-center dark:bg-gray-800">
              <div className="p-6">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2 dark:text-gray-200">Unable to load posts</h3>
                <p className="text-gray-600 mb-4 dark:text-gray-400">There was an error loading the posts. Please try again.</p>
                <Button 
                  onClick={handleRefresh} 
                  className="inline-flex items-center space-x-2 dark:border-gray-700 dark:text-gray-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  <span>Try Again</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Posts List */}
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {posts.map((post, index) => (
                    <motion.div
                      key={`${post.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="w-full"
                    >
                      <PostCard post={post} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-center items-center py-4">
                  <LoadingSpinner size="md" />
                </div>
              )}
              
              {/* Empty state for filtered results */}
              {!isLoading && posts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-lg shadow-sm card-responsive text-center p-6 dark:bg-gray-800"
                >
                  <div className="text-gray-500 dark:text-gray-400">
                    <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 dark:text-white">No posts found</h3>
                    <p className="mb-4">No posts match your current filters.</p>
                    <Button 
                      onClick={handleClearFilters} 
                      variant="outline"
                      className="dark:border-gray-700 dark:text-gray-300"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {/* End of feed indicator */}
              {!isLoading && !hasMore && posts.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm card-responsive text-center border-gray-100 bg-gray-50 p-4 dark:bg-gray-800 dark:border-gray-700">
                  <div className="text-gray-500 dark:text-gray-400 px-2 py-3">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">You're all caught up!</p>
                    <p className="text-xs mt-1 px-2">Check back later for new posts from your friends.</p>
                  </div>
                </div>
              )}
              
              {/* Intersection observer target */}
              <div ref={ref} className="h-20 -mt-10" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;