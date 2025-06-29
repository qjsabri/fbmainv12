import React, { useState } from 'react';
import PostCard from '@/components/posts/PostCard';
import Stories from '@/components/Stories';
import CreatePost from '@/components/posts/CreatePost';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MOCK_IMAGES } from '@/lib/constants';

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
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user_id: 'user-1',
      content: 'Just shared a new photo from my recent trip! Check it out 📸',
      image_url: MOCK_IMAGES.POSTS[0],
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      profiles: {
        id: 'user-1',
        full_name: 'Sarah Johnson',
        avatar_url: MOCK_IMAGES.AVATARS[0]
      },
      likes_count: 42,
      comments_count: 12,
      user_has_liked: false
    },
    {
      id: '2',
      user_id: 'user-2',
      content: 'Had an amazing time at the tech conference today! So many great speakers and insights.',
      image_url: MOCK_IMAGES.POSTS[1],
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      profiles: {
        id: 'user-2',
        full_name: 'Mike Chen',
        avatar_url: MOCK_IMAGES.AVATARS[1]
      },
      likes_count: 28,
      comments_count: 8,
      user_has_liked: true
    }
  ]);

  const handleCreatePost = (newPost: any) => {
    const post: Post = {
      id: `post-${Date.now()}`,
      user_id: 'current-user',
      content: newPost.content,
      image_url: newPost.image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        id: 'current-user',
        full_name: 'You',
        avatar_url: MOCK_IMAGES.AVATARS[7]
      },
      likes_count: 0,
      comments_count: 0,
      user_has_liked: false
    };
    
    setPosts([post, ...posts]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto pt-4">
      <div className="space-y-4">
        <Stories />
        <Card>
          <CardContent className="p-4">
            <CreatePost onCreatePost={handleCreatePost} />
          </CardContent>
        </Card>
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">No posts yet. Create your first post!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;