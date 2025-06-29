// Performance optimization utilities
import { debounce } from '@/lib/utils';

// Preload critical resources
export const preloadResource = (href: string, as: string = 'script') => {
  if (typeof document === 'undefined') return; // Safety check for SSR
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Lazy load images with intersection observer
export const createImageObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach(callback);
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );
  }
  return null;
};

// Resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const dnsPrefetch = [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com',
    '//images.pexels.com'
  ];
  
  dnsPrefetch.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
  
  // Preconnect to critical origins
  const preconnect = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://images.pexels.com'
  ];
  
  preconnect.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Web Vitals monitoring
export const measureWebVitals = () => {
  // Largest Contentful Paint
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (err) {
      console.error('LCP observation error:', err);
    }
  }
  
  // First Input Delay
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fid = (entry as PerformanceEntry & { processingStart: number }).processingStart - entry.startTime;
          console.log('FID:', fid);
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (err) {
      console.error('FID observation error:', err);
    }
  }
};

// Critical resource loading
export const loadCriticalResources = () => {
  if (typeof window === 'undefined') return;
  
  // Mark navigation start for performance metrics
  if (window.performance?.mark) {
    performance.mark('app_navigation_start');
  }
  
  // Add resource hints
  addResourceHints();
  
  // Start measuring web vitals
  measureWebVitals();
  
  // Preload critical fonts
  preloadResource('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', 'style');

  // Prefetch important images
  ['/favicon.ico'].forEach(url => preloadResource(url, 'image'));
  
  // Mark app ready
  if (window.performance?.mark) {
    performance.mark('app_ready');
    try {
      performance.measure('app_initialization', 'app_navigation_start', 'app_ready');
      
      const entries = performance.getEntriesByName('app_initialization');
      if (entries.length) {
        console.info(`App initialization: ${entries[0].duration.toFixed(2)}ms`);
      }
    } catch (err) {
      console.warn('Error measuring performance:', err);
    }
  }
};