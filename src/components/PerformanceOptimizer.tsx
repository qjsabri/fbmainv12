import React, { useRef, useState, useEffect } from 'react';
import { debounce } from '@/lib/utils';
import { loadCriticalResources } from '@/utils/performance';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  const isInitialRender = useRef(true);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memory: null as number | null,
    renderTime: 0,
    networkLatency: 0,
    resourcesLoaded: 0,
    resourcesTotal: 0
  });
  
  // Track initial page load performance
  useEffect(() => {
    if (isInitialRender.current) {
      // Mark the start of the app if not already marked
      if (typeof performance !== 'undefined' && performance.mark) {
        if (!performance.getEntriesByName('app-start').length) {
          performance.mark('app-start');
        }
      }
      
      // Load critical resources
      loadCriticalResources();
      
      // Wait for all resources to load
      window.addEventListener('load', () => {
        // Measure initial render time
        if (typeof performance !== 'undefined' && performance.measure) {
          try {
            if (!performance.getEntriesByName('initial-render').length) {
              performance.mark('app-loaded');
              performance.measure('initial-render', 'app-start', 'app-loaded');
            }
            
            const entries = performance.getEntriesByName('initial-render');
            if (entries.length > 0) {
              const renderTime = entries[0].duration;
              setPerformanceMetrics(prev => ({
                ...prev,
                renderTime
              }));
            }
          } catch (e) {
            console.warn('Could not measure performance:', e);
          }
        }
      });
      
      isInitialRender.current = false;
    }
    
    // Setup FPS measurement
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId: number;
    
    const measureFPS = () => {
      frameCount++;
      const now = performance.now();
      const elapsed = now - lastTime;
      
      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        
        // Get memory info if available (Chrome only)
        let memoryUsage = null;
        try {
          const memory = (performance as any).memory;
          if (memory) {
            memoryUsage = Math.round(memory.usedJSHeapSize / (1024 * 1024));
          }
        } catch (e) {
          // Memory API not available
        }
        
        setPerformanceMetrics(prev => ({
          ...prev,
          fps,
          memory: memoryUsage
        }));
        
        frameCount = 0;
        lastTime = now;
      }
      
      frameId = requestAnimationFrame(measureFPS);
    };
    
    // Start measuring FPS
    frameId = requestAnimationFrame(measureFPS);
    
    // Track network performance
    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Only process resource timing entries
          if (entry.entryType === 'resource') {
            setPerformanceMetrics(prev => ({
              ...prev,
              networkLatency: Math.max(prev.networkLatency, entry.duration),
              resourcesLoaded: prev.resourcesLoaded + 1,
              resourcesTotal: document.querySelectorAll('img, script, link, iframe').length
            }));
          }
        }
      });
      
      // Start observing resource timing entries
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('PerformanceObserver not supported', e);
    }
    
    // Optimize image loading
    const lazyLoadImages = debounce(() => {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              imageObserver.unobserve(img);
            }
          });
        });
        
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => imageObserver.observe(img));
      }
    }, 200);
    
    // Optimize scroll events
    const handleScroll = debounce(() => {
      lazyLoadImages();
    }, 100);
    
    // Optimize resize events
    const handleResize = debounce(() => {
      lazyLoadImages();
    }, 200);
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial load
    lazyLoadImages();
    
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, []);

  return <>{children}</>;
};

export default PerformanceOptimizer;