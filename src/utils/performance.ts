// Performance optimization utilities
import { debounce } from '@/lib/utils';

// Preload critical resources
export const preloadResource = (href: string, as: string = 'script') => {
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

// Memory usage monitor
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    };
  }
  return null;
};

// Performance metrics
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Bundle analyzer for development
export const analyzeBundleChunks = () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const chunks = scripts
        .map(script => (script as HTMLScriptElement).src)
        .filter(src => src.includes('localhost'))
        .map(src => {
          const filename = src.split('/').pop() || '';
          return {
            name: filename,
            url: src
          };
        });
    
      console.table(chunks);
      return chunks;
    } catch (err) {
      console.error("Error analyzing bundle chunks:", err);
      return [];
    }
  }
  return [];
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
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.error('LCP observation error:', e);
    }
  }
  
  // First Input Delay
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fid = (entry as PerformanceEntry & { processingStart: number }).processingStart - entry.startTime;
          console.log('FID:', fid);
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.error('FID observation error:', e);
    }
  }
};

// Critical resource loading
export const loadCriticalResources = () => {
  // Add resource hints
  addResourceHints();
  
  // Start measuring web vitals
  measureWebVitals();
  
  // Preload critical fonts
  preloadResource('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', 'style');
};

// Export all utilities
export default {
  preloadResource,
  createImageObserver,
  debounce,
  monitorMemoryUsage,
  measurePerformance,
  analyzeBundleChunks,
  addResourceHints,
  measureWebVitals,
  loadCriticalResources
};