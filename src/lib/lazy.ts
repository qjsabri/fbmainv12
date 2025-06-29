import { lazy } from 'react';

// Enhanced lazy loading helper with automatic retry
export function lazyLoad(importFn: () => Promise<any>, retries = 2, retryDelay = 1500) {
  return lazy(() => retry(importFn, retries, retryDelay));
}

// Helper function to retry imports if they fail
function retry(fn: () => Promise<any>, retriesLeft: number, interval: number): Promise<any> {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        if (retriesLeft === 0) {
          console.error('Failed to lazy load component after multiple attempts:', error);
          reject(error);
          return;
        }
        
        console.warn(`Failed to load chunk, retrying (${retriesLeft} retries left)...`);
        
        // Add exponential back-off
        setTimeout(() => {
          retry(fn, retriesLeft - 1, interval * 1.5)
            .then(resolve)
            .catch(reject);
        }, interval);
      });
  });
}

// Preload a component ahead of time (like for hover intent)
export function preloadComponent(importFn: () => Promise<any>) {
  return () => {
    // Start loading the component in the background
    importFn();
    // Return nothing - this is just to trigger the load
    return undefined;
  };
}

// Create component with error boundary
export function createErrorBoundaryComponent(
  importFn: () => Promise<any>,
  fallback: React.ReactNode
) {
  const LazyComponent = lazyLoad(importFn);
  
  return (props: any) => (
    <React.Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
}