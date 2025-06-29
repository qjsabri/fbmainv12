import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const NewsFeedSkeleton = () => {
  return (
    <div className="space-y-4 will-change-opacity">
      {/* Create post skeleton */}
      <Card className="animate-pulse gpu-accelerated">
        <CardContent className="p-4">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700" style={{willChange: 'opacity'}}></div>
            <div className="flex-1 h-10 bg-gray-200 rounded-full dark:bg-gray-700" style={{willChange: 'opacity'}}></div>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t">
            <div className="w-24 h-8 bg-gray-200 rounded dark:bg-gray-700" style={{willChange: 'opacity', animationDelay: '0.1s'}}></div>
            <div className="w-24 h-8 bg-gray-200 rounded dark:bg-gray-700" style={{willChange: 'opacity', animationDelay: '0.2s'}}></div>
            <div className="w-24 h-8 bg-gray-200 rounded dark:bg-gray-700" style={{willChange: 'opacity', animationDelay: '0.3s'}}></div>
          </div>
        </CardContent>
      </Card>
      
      {/* Posts skeletons */}
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded dark:bg-gray-700"></div>
                <div className="h-3 w-24 bg-gray-200 rounded dark:bg-gray-700"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 w-full bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
            <div className="h-48 w-full bg-gray-200 rounded dark:bg-gray-700 mb-4"></div>
            <div className="flex space-x-4 p-4 border-t">
              <div className="h-8 w-16 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="h-8 w-20 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="h-8 w-16 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NewsFeedSkeleton;