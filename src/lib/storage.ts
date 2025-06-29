// Storage utilities with error handling and expiration support
interface StorageOptions {
  expiry?: number; // Expiry in milliseconds
}

interface StorageValue<T> {
  value: T;
  expiry?: number; // Timestamp when value expires
}

export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue || null;
      
      const data: StorageValue<T> = JSON.parse(item);
      
      // Check if value has expired
      if (data.expiry && Date.now() > data.expiry) {
        localStorage.removeItem(key);
        return defaultValue || null;
      }
      
      return data.value;
    } catch (_error) {
      console.error(`Error getting item "${key}" from localStorage:`, error);
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T, options: StorageOptions = {}): void => {
    if (typeof window === 'undefined') return;
    try {
      const data: StorageValue<T> = {
        value
      };
      
      // Add expiry if provided
      if (options.expiry) {
        data.expiry = Date.now() + options.expiry;
      }
      
      localStorage.setItem(key, JSON.stringify(data));
    } catch (_error) {
      console.error(`Error setting item "${key}" in localStorage:`, error);
      
      // If storage is full, try to clear some space
      if (error instanceof DOMException && (
        // everything except Firefox
        error.code === 22 ||
        // Firefox
        error.code === 1014 ||
        // test name field for quota exceeded error
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      )) {
        // Try to clean up expired items first
        cleanupExpiredItems();
        
        // Try again
        try {
          const data: StorageValue<T> = { value };
          if (options.expiry) {
            data.expiry = Date.now() + options.expiry;
          }
          
          localStorage.setItem(key, JSON.stringify(data));
        } catch {
          // If still fails, give up
          console.error('Storage still full after cleanup');
        }
      }
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (_error) {
      console.error(`Error removing item "${key}" from localStorage:`, error);
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (_error) {
      console.error('Error clearing localStorage:', error);
    }
  },
  
  // Add items to session storage (cleared when tab closes)
  setSession: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(key, JSON.stringify({ value }));
    } catch (_error) {
      console.error(`Error setting item "${key}" in sessionStorage:`, error);
    }
  },
  
  // Get items from session storage
  getSession: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return defaultValue || null;
      
      const data = JSON.parse(item);
      return data.value;
    } catch {
      return defaultValue || null;
    }
  }
};

// Helper to clean up expired items to free space
const cleanupExpiredItems = () => {
  if (typeof window === 'undefined') return;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const data = JSON.parse(item);
          if (data.expiry && Date.now() > data.expiry) {
            localStorage.removeItem(key);
          }
        }
      } catch {
        // Ignore errors for individual items
      }
    }
  }
};

// Safe JSON parse
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch (_error) {
    console.warn('Failed to parse JSON', error);
    return fallback;
  }
};