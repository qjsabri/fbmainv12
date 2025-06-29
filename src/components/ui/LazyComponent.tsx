import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Spinner from './Spinner';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  loadDelay?: number;
  triggerOnce?: boolean;
  loadingStrategy?: 'eager' | 'lazy' | 'viewport' | 'delayed';
  className?: string;
  id?: string;
}

/**
 * LazyComponent delays rendering its children until the component is visible in the viewport.
 * Useful for optimizing initial page load by deferring non-critical UI.
 */
export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = <div className="flex justify-center items-center h-20"><Spinner size="md" color="blue" /></div>,
  threshold = 0.1,
  rootMargin = '100px',
  loadDelay = 0,
  triggerOnce = true,
  loadingStrategy = 'viewport',
  className,
  id
}) => {
  const [shouldRender, setShouldRender] = useState(loadingStrategy === 'eager');
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce
  });

  useEffect(() => {
    // Handle different loading strategies
    switch (loadingStrategy) {
      case 'eager':
        setShouldRender(true);
        break;
      case 'lazy':
        // Use requestIdleCallback if available, or setTimeout as fallback
        const idleCallback = 
          window.requestIdleCallback || 
          ((cb) => setTimeout(cb, 1));
        
        idleCallback(() => setShouldRender(true));
        break;
      case 'viewport':
        if (inView) {
          setShouldRender(true);
        }
        break;
      case 'delayed':
        if (inView) {
          const timer = setTimeout(() => {
            setShouldRender(true);
          }, loadDelay);
          return () => clearTimeout(timer);
        }
        break;
    }
  }, [inView, loadDelay, loadingStrategy]);

  return (
    <div ref={loadingStrategy === 'eager' ? undefined : ref} className={className} id={id}>
      {shouldRender ? children : fallback}
    </div>
  );
};

export default LazyComponent;