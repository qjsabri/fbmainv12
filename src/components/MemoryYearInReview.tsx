import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Share, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';



interface YearHighlight {
  id: string;
  type: 'photo' | 'post' | 'event' | 'friendship' | 'milestone';
  title: string;
  description: string;
  date: Date;
  image?: string;
  stats?: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }[];
}

interface YearInReview {
  year: number;
  highlights: YearHighlight[];
  stats: {
    posts: number;
    photos: number;
    friends: number;
    reactions: number;
    topLocation?: string;
  };
}

const MOCK_YEAR_IN_REVIEW: Record<number, YearInReview> = {
  2023: {
    year: 2023,
    highlights: [
      { id: 'h1', type: 'photo', title: 'Family Vacation', description: 'Trip to the Grand Canyon', date: new Date('2023-07-15'), image: MOCK_IMAGES.POSTS[0], stats: [{ label: 'Photos Taken', value: 120 }] },
      { id: 'h2', type: 'milestone', title: 'New Job', description: 'Started a new role at Tech Corp', date: new Date('2023-03-01'), image: MOCK_IMAGES.POSTS[1], stats: [{ label: 'Projects Completed', value: 5 }] },
    ],
    stats: { posts: 150, photos: 300, friends: 10, reactions: 1200, topLocation: 'Grand Canyon' }
  },
  2022: {
    year: 2022,
    highlights: [
      { id: 'h3', type: 'event', title: 'Music Festival', description: 'Attended the annual summer music fest', date: new Date('2022-08-20'), image: getSafeImage('POSTS', 2) },
    ],
    stats: { posts: 120, photos: 250, friends: 8, reactions: 950, topLocation: 'Austin, TX' }
  }
};

const MemoryYearInReview = () => {
  const [yearReviews] = useState<YearInReview[]>(Object.values(MOCK_YEAR_IN_REVIEW));
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear() - 1);
  // const [selectedYear] = useState<number>(new Date().getFullYear() - 1); // selectedYear is not used, currentYear is used instead
  const [currentReview, setCurrentReview] = useState<YearInReview | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch this data based on the selected year
    const yearData = MOCK_YEAR_IN_REVIEW[currentYear]; // Use currentYear instead of selectedYear
    setCurrentReview(yearData);
    setIsLoading(false); // Set loading to false after data is fetched
  }, [currentYear]);

  const handlePrevYear = () => {
    const availableYears = yearReviews.map(review => review.year);
    const currentIndex = availableYears.indexOf(currentYear);
    
    if (currentIndex < availableYears.length - 1) {
      setCurrentYear(availableYears[currentIndex + 1]);
      setCurrentSlide(0);
    }
  };

  const handleNextYear = () => {
    const availableYears = yearReviews.map(review => review.year);
    const currentIndex = availableYears.indexOf(currentYear);
    
    if (currentIndex > 0) {
      setCurrentYear(availableYears[currentIndex - 1]);
      setCurrentSlide(0);
    }
  };

  const handlePrevSlide = () => {
    const currentReview = yearReviews.find(review => review.year === currentYear);
    if (!currentReview) return;
    
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : currentReview.highlights.length - 1));
  };

  const handleNextSlide = () => {
    const currentReview = yearReviews.find(review => review.year === currentYear);
    if (!currentReview) return;
    
    setCurrentSlide(prev => (prev < currentReview.highlights.length - 1 ? prev + 1 : 0));
  };

  const handleShare = () => {
    toast.success(`Shared your ${currentYear} Year in Review!`);
  };

  const currentHighlight = currentReview?.highlights[currentSlide];

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6 dark:bg-gray-700"></div>
            <div className="h-64 bg-gray-300 rounded-lg mb-6 dark:bg-gray-700"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-2 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-4 dark:bg-gray-700"></div>
            <div className="flex justify-between">
              <div className="h-10 w-24 bg-gray-300 rounded dark:bg-gray-700"></div>
              <div className="h-10 w-24 bg-gray-300 rounded dark:bg-gray-700"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (yearReviews.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No Year in Review Available</h3>
            <p className="text-gray-500 mb-6 dark:text-gray-400">
              We don't have enough data to create a Year in Review yet. Keep sharing your moments!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Year Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={handlePrevYear}
          disabled={currentYear === Math.min(...yearReviews.map(r => r.year))}
          className="dark:border-gray-600 dark:text-gray-200"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {currentYear - 1}
        </Button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentYear} Year in Review</h2>
        <Button
          variant="outline"
          onClick={handleNextYear}
          disabled={currentYear === Math.max(...yearReviews.map(r => r.year))}
          className="dark:border-gray-600 dark:text-gray-200"
        >
          {currentYear + 1}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Year Stats */}
      {currentReview && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-gray-500 text-sm dark:text-gray-400">Posts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentReview.stats.posts}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm dark:text-gray-400">Photos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentReview.stats.photos}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm dark:text-gray-400">New Friends</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentReview.stats.friends}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm dark:text-gray-400">Reactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentReview.stats.reactions}</p>
              </div>
            </div>
            {currentReview.stats.topLocation && (
              <div className="mt-4 pt-4 border-t text-center dark:border-gray-700">
                <p className="text-gray-500 text-sm dark:text-gray-400">Top Location</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{currentReview.stats.topLocation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Highlights Carousel */}
      {currentHighlight && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {currentHighlight.image && (
                <div className="relative h-64 md:h-80">
                  <img
                    src={currentHighlight.image}
                    alt={currentHighlight.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                </div>
              )}
              
              {/* Navigation arrows */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-10 w-10 rounded-full p-0"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-10 w-10 rounded-full p-0"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              
              {/* Slide indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {currentReview?.highlights.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {currentHighlight.type.charAt(0).toUpperCase() + currentHighlight.type.slice(1)}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(currentHighlight.date, 'MMMM d, yyyy')}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">{currentHighlight.title}</h3>
              <p className="text-gray-700 mb-6 dark:text-gray-300">{currentHighlight.description}</p>
              
              {/* Stats */}
              {currentHighlight.stats && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentHighlight.stats.map((stat, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg dark:bg-gray-800">
                      <div className="flex items-center space-x-2 mb-1">
                        {stat.icon}
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleShare} className="dark:border-gray-600 dark:text-gray-200">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentSlide + 1} of {currentReview?.highlights.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemoryYearInReview;