import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { APP_CONFIG } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Performance utilities
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number = APP_CONFIG.DEBOUNCE_DELAY
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Format utilities
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return diffInSeconds <= 5 ? 'now' : `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w`;
  
  // More precise month/year formatting
  const months = Math.floor(diffInSeconds / 2592000);
  if (months < 12) return `${months}mo`;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years}y`;
};

export const formatDate = (date: string | Date, options: Intl.DateTimeFormatOptions = {}): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  
  return new Date(date).toLocaleDateString(undefined, { ...defaultOptions, ...options });
};

export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Error handling
export const handleError = (error: unknown, context?: string): void => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Error in ${context || 'application'}:`, message);
};

// Performance monitoring
export const performanceMonitor = {
  marks: new Map<string, number>(),
  
  mark: (name: string): void => {
    if (typeof performance !== 'undefined' && performance && performance.mark) {
      performance.mark(name);
    }
    
    performanceMonitor.marks.set(name, performance.now());
  },
  
  measure: (name: string, startMark: string, endMark?: string): number => {
    if (typeof performance !== 'undefined' && performance && performance.measure && performance.getEntriesByName) {
      try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name);
        return entries.length > 0 ? entries[0].duration : 0;
      } catch (e) {
        console.warn('Performance measurement error:', e);
      }
    }
    
    // Fallback to our own implementation
    const start = performanceMonitor.marks.get(startMark) || 0;
    const end = endMark ? (performanceMonitor.marks.get(endMark) || performance.now()) : performance.now();
    return end - start;
  },
  
  clearMarks: (): void => {
    if (typeof performance !== 'undefined' && performance && performance.clearMarks) {
      performance.clearMarks();
    }
    
    performanceMonitor.marks.clear();
  }
};

// Image optimization
export const optimizeImageUrl = (url: string, width?: number, height?: number): string => {
  if (!url || typeof url !== 'string') return url;
  
  // Only optimize Pexels images
  if (!url.includes('pexels.com')) return url;
  
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('fit', 'crop');
  params.set('auto', 'format');
  params.set('q', '80'); // Add quality parameter for better optimization
  
  // Check if URL already has parameters
  if (url.includes('?')) {
    return `${url}&${params.toString()}`;
  }
  
  return `${url}?${params.toString()}`;
};

// Generate random ID
export const generateId = (prefix = ''): string => {
  return `${prefix}${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
};

// Memory management
export const cleanupResources = (refs: React.MutableRefObject<unknown>) => {
  // Clean up any resources that need manual freeing
  if (refs.current) {
    try {
      // Clean up object URLs
      if (typeof refs.current === 'string' && refs.current.startsWith('blob:')) {
        URL.revokeObjectURL(refs.current);
      }
      
      // If it's an array, clean up each item
      if (Array.isArray(refs.current)) {
        refs.current.forEach(item => {
          if (typeof item === 'string' && item.startsWith('blob:')) {
            URL.revokeObjectURL(item);
          }
        });
      }
      
      // If it's a record/object, clean up each value
      if (typeof refs.current === 'object' && refs.current !== null) {
        Object.values(refs.current).forEach(value => {
          if (typeof value === 'string' && value.startsWith('blob:')) {
            URL.revokeObjectURL(value as string);
          }
        });
      }
    } catch (err) {
      console.error("Error cleaning up resources:", err);
    }
    
    // Clear the ref
    refs.current = null;
  }
};

// Safely parse JSON with error handling
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.warn('Failed to parse JSON', e);
    return fallback;
  }
};
