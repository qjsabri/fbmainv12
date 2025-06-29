import React from 'react';

const StoriesSkeleton = () => {
  return (
    <div className="flex space-x-3 overflow-x-auto scrollbar-thin pb-2 px-1">
      {/* Create Story skeleton */}
      <div className="flex-shrink-0 w-28 h-48 bg-gray-200 rounded-lg animate-pulse dark:bg-gray-700" style={{willChange: 'opacity'}}></div>
      
      {/* Story items skeletons */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-28 h-48 bg-gray-200 rounded-lg animate-pulse dark:bg-gray-700" style={{willChange: 'opacity', animationDelay: `${i * 0.1}s`}}></div>
      ))}
    </div>
  );
};

export default StoriesSkeleton;