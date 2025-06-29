import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Spinner from './Spinner';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  lazy?: boolean;
  loadingMode?: 'spinner' | 'blur' | 'skeleton' | 'none';
  placeholderColor?: string;
}

const OptimizedImage = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ 
    src, 
    alt = '', 
    fallback = 'https://via.placeholder.com/400',
    aspectRatio = 'auto',
    objectFit = 'cover',
    quality = 90,
    lazy = true,
    loadingMode = 'spinner',
    placeholderColor = '#f3f4f6', 
    className,
    ...props 
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
    
    useEffect(() => {
      // Reset state when src changes
      setIsLoading(true);
      setError(false);
      
      // Update source
      setImageSrc(src);
    }, [src]);

    // Determine aspect ratio
    const aspectRatioClass = {
      'square': 'aspect-square',
      'video': 'aspect-video',
      'portrait': 'aspect-[3/4]',
      'wide': 'aspect-[16/9]',
      'auto': ''
    }[aspectRatio];

    // Determine object fit
    const objectFitClass = {
      'cover': 'object-cover',
      'contain': 'object-contain',
      'fill': 'object-fill',
      'none': 'object-none',
      'scale-down': 'object-scale-down'
    }[objectFit];

    // Handle loading complete
    const handleLoad = () => {
      setIsLoading(false);
    };

    // Handle loading error
    const handleError = () => {
      console.warn(`Failed to load image: ${src}`);
      setIsLoading(false);
      setError(true);
      setImageSrc(fallback);
    };

    return (
      <div className={cn(
        "relative overflow-hidden",
        aspectRatioClass,
        className
      )}>
        {/* Loading indicator */}
        {isLoading && loadingMode === 'spinner' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Spinner size="md" color="blue" />
          </div>
        )}

        {/* Skeleton loading state */}
        {isLoading && loadingMode === 'skeleton' && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}

        {/* Blur loading state (empty div with background color) */}
        {isLoading && loadingMode === 'blur' && (
          <div 
            className="absolute inset-0 blur-sm" 
            style={{ backgroundColor: placeholderColor }}
          />
        )}

        {/* Actual image */}
        <img
          ref={ref}
          src={imageSrc}
          alt={alt}
          className={cn(
            objectFitClass,
            "w-full h-full transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
        
        {/* Error fallback */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-sm text-gray-400 dark:text-gray-500">
            {alt || 'Image failed to load'}
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

export { OptimizedImage };
export type { ImageProps };