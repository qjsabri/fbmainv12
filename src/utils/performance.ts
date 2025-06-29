// Performance optimization utilities
import { debounce } from '@/lib/utils';

// Code splitting utility with dynamic imports
export const loadComponent = async (componentPath: string) => {
  try {
    const module = await import(/* @vite-ignore */ componentPath);
    return module.default || module;
  } catch (_error) {
    console.error(`Failed to load component: ${componentPath}`, _error);
    throw _error;
  }
};

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

// Re-export debounce from utils for convenience
export { debounce } from '@/lib/utils';

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

// Critical CSS inlining
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const dnsPrefetch = [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com'
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
    'https://fonts.gstatic.com'
  ];
  
  preconnect.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Service worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (_error) {
      console.error('Service Worker registration failed:', _error);
    }
  }
};

// Web Vitals monitoring
export const measureWebVitals = () => {
  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }
  
  // First Input Delay
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', (entry as PerformanceEntry & { processingStart: number }).processingStart - entry.startTime);
      });
    });
    observer.observe({ entryTypes: ['first-input'] });
  }
};

// Image optimization
export const optimizeImage = (src: string, width?: number, height?: number, quality: number = 80) => {
  // This would typically integrate with an image optimization service
  // For now, we'll return the original src with potential query parameters
  const url = new URL(src, window.location.origin);
  
  if (width) url.searchParams.set('w', width.toString());
  if (height) url.searchParams.set('h', height.toString());
  url.searchParams.set('q', quality.toString());
  
  return url.toString();
};

// Critical resource loading
export const loadCriticalResources = () => {
  // Preload critical fonts
  preloadResource('/fonts/inter-var.woff2', 'font');
  
  // Add resource hints
  addResourceHints();
  
  // Register service worker
  registerServiceWorker();
  
  // Start measuring web vitals
  measureWebVitals();
};

// Export all utilities
export default {
  loadComponent,
  preloadResource,
  createImageObserver,
  debounce,
  monitorMemoryUsage,
  measurePerformance,
  analyzeBundleChunks,
  inlineCriticalCSS,
  addResourceHints,
  registerServiceWorker,
  measureWebVitals,
  optimizeImage,
  loadCriticalResources
};