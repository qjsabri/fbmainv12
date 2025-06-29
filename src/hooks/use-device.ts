import { useState, useEffect, useMemo, useCallback } from 'react';
import { APP_CONFIG } from "@/lib/constants";

// Optimized mobile detection with reduced re-renders
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth < APP_CONFIG.MOBILE_BREAKPOINT : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Optimize with memoized value comparison
    const checkMobile = debounce(() => {
      const width = window.innerWidth;
      const currentValue = width < APP_CONFIG.MOBILE_BREAKPOINT;
      if (currentValue !== isMobile) {
        setIsMobile(currentValue);
      }
    }, 100); // Reduced debounce time for better responsiveness
    
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile]);

  return isMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = useState<boolean>(() => 
    typeof window !== 'undefined' ? 
    window.innerWidth >= APP_CONFIG.MOBILE_BREAKPOINT && 
    window.innerWidth < APP_CONFIG.DESKTOP_BREAKPOINT : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkTablet = () => {
      const width = window.innerWidth;
      const currentValue = width >= APP_CONFIG.MOBILE_BREAKPOINT && width < APP_CONFIG.DESKTOP_BREAKPOINT;
      if (currentValue !== isTablet) {
        setIsTablet(currentValue);
      }
    };
    
    const debouncedResize = debounce(checkTablet, 100);
    window.addEventListener("resize", debouncedResize);
    
    return () => window.removeEventListener("resize", debouncedResize);
  }, [isTablet]);

  return isTablet;
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth >= APP_CONFIG.DESKTOP_BREAKPOINT : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkDesktop = () => {
      const width = window.innerWidth;
      const currentValue = width >= APP_CONFIG.DESKTOP_BREAKPOINT;
      if (currentValue !== isDesktop) {
        setIsDesktop(currentValue);
      }
    };
    
    const debouncedResize = debounce(checkDesktop, 250);
    window.addEventListener("resize", debouncedResize);
    
    return () => window.removeEventListener("resize", debouncedResize);
  }, [isDesktop]);

  return isDesktop;
}

export function useViewportSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const handleResize = useCallback(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener("resize", debouncedResize);
    
    return () => window.removeEventListener("resize", debouncedResize);
  }, [handleResize]);
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);
  return size;
}

// Add debounce function to prevent excessive resize events
function debounce(func: Function, wait: number): (...args: any[]) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: any[]) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Returns the current device and orientation
export function useDevice() {
  const { width } = useViewportSize();
  
  return useMemo(() => {
    let device: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    
    if (width < APP_CONFIG.MOBILE_BREAKPOINT) {
      device = 'mobile';
    } else if (width < APP_CONFIG.DESKTOP_BREAKPOINT) {
      device = 'tablet';
    }
    
    return {
      device,
      isMobile: device === 'mobile',
      isTablet: device === 'tablet',
      isDesktop: device === 'desktop'
    };
  }, [width]);
}