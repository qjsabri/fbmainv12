import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import PageContent from '@/components/PageContent';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MOCK_IMAGES } from '@/lib/constants';

const PageDetail = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const [page, setPage] = useState<{
    id: string;
    name: string;
    category: string;
    followers: number;
    likes: number;
    verified: boolean;
    coverImage: string;
    profileImage: string;
    about: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock page data
        const mockPage = {
          id: pageId || 'tech-company',
          name: 'Tech Innovations Inc.',
          category: 'Technology Company',
          description: 'Leading the way in innovative technology solutions for businesses and consumers.',
          avatar: MOCK_IMAGES.AVATARS[0],
          cover: MOCK_IMAGES.POSTS[0],
          followers: 25600,
          isVerified: true,
          isFollowing: false,
          website: 'https://techinnovations.example.com',
          location: 'San Francisco, CA',
          phone: '+1 (555) 123-4567',
          email: 'contact@techinnovations.example.com',
          founded: 'January 2015',
          about: `Tech Innovations Inc. is a leading technology company specializing in cutting-edge software solutions and digital transformation services.

Founded in 2015, we've been at the forefront of technological advancement, helping businesses of all sizes leverage the power of technology to grow and succeed.

Our mission is to make advanced technology accessible to everyone and create solutions that make a positive impact on people's lives.`,
          hours: {
            'Monday': '9:00 AM - 5:00 PM',
            'Tuesday': '9:00 AM - 5:00 PM',
            'Wednesday': '9:00 AM - 5:00 PM',
            'Thursday': '9:00 AM - 5:00 PM',
            'Friday': '9:00 AM - 5:00 PM',
            'Saturday': 'Closed',
            'Sunday': 'Closed'
          }
        };
        
        setPage(mockPage);
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('Failed to load page data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPage();
  }, [pageId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-red-600 mb-4 dark:text-red-400">Error Loading Page</h2>
          <p className="text-gray-600 mb-6 dark:text-gray-300">{error || 'Page not found'}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <PageHeader page={page} />
      <div className="mt-6">
        <PageContent page={page} />
      </div>
    </div>
  );
};

export default PageDetail;