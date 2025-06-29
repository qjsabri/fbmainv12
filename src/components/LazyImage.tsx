import React, { useState, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
  fallback?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  loadingIndicator?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt = '',
  className,
  fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%23d1d5db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"/%3E%3Ccircle cx="9" cy="9" r="2"/%3E%3Cpath d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/%3E%3C/svg%3E',
  aspectRatio = 'auto',
  loadingIndicator,
  onLoad,
  onError,
  placeholder,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const aspectRatioClasses = useMemo(() => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'video': return 'aspect-video';
      case 'portrait': return 'aspect-[3/4]';
      default: return '';
    }
  }, [aspectRatio]);

  const handleImageLoaded = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setError(true);
    onError?.();
  };

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div 
      ref={ref} 
      className={cn(
        "relative overflow-hidden", 
        aspectRatioClasses,
        className
      )}
    >
      {/* Placeholder or loading indicator */}
      {(!isLoaded || !inView) && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {loadingIndicator || (
            placeholder ? (
              <img 
                src={placeholder} 
                alt={alt} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin dark:border-gray-700"></div>
            )
          )}
        </div>
      )}

      {/* The actual image, only load when in view */}
      {inView && (
        <img
          src={error ? fallback : src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300 w-full h-full object-cover",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          onLoad={handleImageLoaded}
          onError={handleImageError}
          {...props}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <img 
            src={fallback} 
            alt={alt || "Failed to load image"} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default LazyImage;