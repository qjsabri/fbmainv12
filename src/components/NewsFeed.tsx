import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Stories from '@/components/Stories';
import NewsFeedTabs from '@/components/NewsFeedTabs';
import NewsFeedFilters from '@/components/NewsFeedFilters';
import NewsFeedSkeleton from '@/components/NewsFeedSkeleton';
import StoriesSkeleton from '@/components/StoriesSkeleton';
import PostCard from '@/components/posts/PostCard';
import CreatePost from '@/components/posts/CreatePost';
import ReelsCarousel from '@/components/ReelsCarousel';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';
import { MOCK_IMAGES } from '@/lib/constants';
import ReactionPicker from '@/components/ReactionPicker';

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  } | null;
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
  reactions?: Record<string, number>;
  feeling?: string;
  location?: string;
  tagged_friends?: string[];
  privacy?: string;
  is_live?: boolean;
  isPoll?: boolean;
  pollOptions?: string[];
  pollVotes?: Record<string, number>;
}

const NewsFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('foryou');
  const [creator, setCreator] = useState('');
  const [dateRange, setDateRange] = useState('any');
  const [location, setLocation] = useState('');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [page, setPage] = useState(1);
  
  // Reference to sentinel for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });
  
  const timeoutRef = useRef<number | null>(null);
  
  // Fetch initial posts
  useEffect(() => {
    fetchPosts();
  }, []);
  
  // Fetch more posts when scrolling to sentinel
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading]);
  
  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const fetchPosts = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API delay
    timeoutRef.current = window.setTimeout(() => {
      // Generate mock posts
      const mockPosts: Post[] = Array.from({ length: 5 }, (_, index) => {
        const hasImage = Math.random() > 0.3;
        const hasGif = !hasImage && Math.random() > 0.7;
        const hasPoll = !hasImage && !hasGif && Math.random() > 0.8;
        
        const mockPost: Post = {
          id: `post-${Date.now()}-${index}`,
          user_id: `user-${index % 5}`,
          content: hasGif 
            ? `Check out this cool GIF! [GIF: ${MOCK_IMAGES.POSTS[index % MOCK_IMAGES.POSTS.length]}]` 
            : `This is post #${page * 10 + index} with some interesting content about ${['technology', 'travel', 'food', 'sports', 'music'][index % 5]}.`,
          image_url: hasImage ? MOCK_IMAGES.POSTS[index % MOCK_IMAGES.POSTS.length] : undefined,
          created_at: new Date(Date.now() - index * 1000 * 60 * 60).toISOString(),
          updated_at: new Date(Date.now() - index * 1000 * 60 * 60).toISOString(),
          profiles: {
            id: `profile-${index % 5}`,
            full_name: ['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Kim', 'Lisa Wang'][index % 5],
            avatar_url: MOCK_IMAGES.AVATARS[index % MOCK_IMAGES.AVATARS.length]
          },
          likes_count: Math.floor(Math.random() * 100),
          comments_count: Math.floor(Math.random() * 20),
          user_has_liked: Math.random() > 0.7
        };
        
        // Add poll data for some posts
        if (hasPoll) {
          const pollQuestions = [
            "What's your favorite programming language?",
            "What's the best way to learn web development?",
            "Which framework do you prefer?",
            "What's your preferred work environment?",
            "How many hours do you code each day?"
          ];
          
          const pollOptions = [
            [pollQuestions[index % 5], "JavaScript", "Python", "Java", "C++", "Ruby"],
            [pollQuestions[index % 5], "Online courses", "Books", "Documentation", "Building projects"],
            [pollQuestions[index % 5], "React", "Vue", "Angular", "Svelte"],
            [pollQuestions[index % 5], "Office", "Remote", "Hybrid", "Cafe"],
            [pollQuestions[index % 5], "1-2", "3-5", "6-8", "8+"]
          ];
          
          mockPost.isPoll = true;
          mockPost.pollOptions = pollOptions[index % 5];
        }
        
        // Add extra details randomly
        if (Math.random() > 0.7) {
          mockPost.feeling = ['happy', 'excited', 'thankful', 'blessed', 'loved'][Math.floor(Math.random() * 5)];
        }
        
        if (Math.random() > 0.8) {
          mockPost.location = ['San Francisco, CA', 'New York, NY', 'Chicago, IL', 'Seattle, WA', 'Boston, MA'][Math.floor(Math.random() * 5)];
        }
        
        return mockPost;
      });
      
      setPosts(prev => [...prev, ...mockPosts]);
      setPage(prev => prev + 1);
      setHasMore(page < 5); // Limit to 5 pages for demo
      setIsLoading(false);
    }, 1000);
  }, [page]);
  
  const loadMore = () => {
    if (!hasMore || isLoading) return;
    fetchPosts();
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPosts([]);
    setPage(1);
    setHasMore(true);
    
    // Fetch new posts
    setTimeout(() => {
      fetchPosts();
    }, 100);
    
    toast.info(`Switched to ${tab} feed`);
  };
  
  const applyFilters = () => {
    // Apply filters logic
    setPosts([]);
    setPage(1);
    setHasMore(true);
    
    // Fetch filtered posts
    toast.info('Filters applied');
    setTimeout(() => {
      fetchPosts();
    }, 100);
  };
  
  const clearFilters = () => {
    setCreator('');
    setDateRange('any');
    setLocation('');
    setLiked(false);
    setSaved(false);
    
    // Reset posts
    setPosts([]);
    setPage(1);
    setHasMore(true);
    
    toast.success('Filters cleared');
    setTimeout(() => {
      fetchPosts();
    }, 100);
  };
  
  const handleCreatePost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    toast.success('Post created successfully!');
  };

  return (
    <div className="news-feed-container">
      <div className="max-w-xl mx-auto">
        {/* Stories */}
        <div className="mb-4">
          {isLoading && page === 1 ? <StoriesSkeleton /> : <Stories />}
        </div>
        
        {/* Create Post */}
        <div className="mb-4">
          <CreatePost onCreatePost={handleCreatePost} />
        </div>
        
        {/* Reels */}
        <div className="mb-4">
          <ReelsCarousel />
        </div>
        
        {/* News Feed Tabs */}
        <div className="mb-4">
          <NewsFeedTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        
        {/* Filters */}
        <div className="mb-4">
          <NewsFeedFilters 
            creator={creator}
            setCreator={setCreator}
            dateRange={dateRange}
            setDateRange={setDateRange}
            location={location}
            setLocation={setLocation}
            liked={liked}
            setLiked={setLiked}
            saved={saved}
            setSaved={setSaved}
            onApply={applyFilters}
            onClear={clearFilters}
          />
        </div>
        
        {/* Posts */}
        <div className="space-y-4">
          {isLoading && page === 1 ? (
            <NewsFeedSkeleton />
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
          
          {/* Loading more spinner */}
          {isLoading && page > 1 && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          )}
          
          {/* Load more sentinel */}
          {hasMore && !isLoading && (
            <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Loading more posts...</span>
            </div>
          )}
          
          {/* End of feed */}
          {!hasMore && !isLoading && (
            <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">You've reached the end of your feed.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setHasMore(true);
                  setPage(1);
                  setPosts([]);
                  fetchPosts();
                }}
                className="mt-2 dark:border-gray-700 dark:text-gray-300"
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;