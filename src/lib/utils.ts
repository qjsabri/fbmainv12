import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { APP_CONFIG } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Improved debounce function with proper typings
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
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

// Enhanced memoization for expensive calculations
export function memoize<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

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

// Enhanced formatTimeAgo with more accurate time representations
export const formatTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffInSeconds = Math.floor(diffMs / 1000);

  // Check if browser supports RelativeTimeFormat
  if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    
    if (diffInSeconds < 60) return diffInSeconds <= 5 ? 'now' : rtf.format(-Math.floor(diffInSeconds), 'second');
    if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    if (diffInSeconds < 604800) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 604800), 'week');
  
    // More precise month/year formatting
    const months = Math.floor(diffInSeconds / 2592000);
    if (months < 12) return rtf.format(-months, 'month');
  
    const years = Math.floor(months / 12);
    return rtf.format(-years, 'year');
  } else {
    // Fallback for browsers that don't support RelativeTimeFormat
    if (diffInSeconds < 60) return diffInSeconds <= 5 ? 'now' : `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
    
    // More precise month/year formatting
    const months = Math.floor(diffInSeconds / 2592000);
    if (months < 12) return `${months}mo ago`;
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}mo ago` : `${years}y ago`;
  }
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

// Image optimization
export const optimizeImageUrl = (url: string, width?: number, height?: number, quality: number = 80): string => {
  if (!url || typeof url !== 'string') return url;
  
  // Only optimize Pexels images
  if (!url.includes('pexels.com')) return url;
  
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('fit', 'crop');
  params.set('auto', 'format');
  params.set('q', quality.toString());
  
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