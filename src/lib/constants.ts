// Application constants and configuration
export const APP_CONFIG = {
  name: 'Facebook Clone',
  version: '2.0.1',
  description: 'High-performance social media platform',
  author: 'Social Media Team',
  
  // Performance settings
  POSTS_PER_PAGE: 10,
  INFINITE_SCROLL_THRESHOLD: 100,
  DEBOUNCE_DELAY: 200,
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  
  // UI settings
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
  
  // Feature flags
  FEATURES: {
    VIRTUAL_SCROLLING: true,
    INFINITE_SCROLL: true,
    REAL_TIME_UPDATES: true,
    OFFLINE_SUPPORT: false,
    ANALYTICS: true,
    STORIES: true,
    LIVE_CHAT: true,
    ACTIVITY_FEED: true,
    TRENDING_TOPICS: true,
    LIVE_STREAMING: true,
    ADVANCED_SEARCH: true,
    EVENT_CALENDAR: true,
    REELS: true,
    MARKETPLACE: true,
    GROUPS: true,
    FRIEND_SUGGESTIONS: true,
    WEATHER_WIDGET: true,
    POLLS: true,
    MEMORIES: true,
    GAMING: true,
    SAVED_ITEMS: true,
    PAGES: true
  }
} as const;

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  PROFILE: '/profile',
  FRIENDS: '/friends',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  WATCH: '/watch',
  MARKETPLACE: '/marketplace',
  GROUPS: '/groups',
  EVENTS: '/events',
  SAVED: '/saved',
  MEMORIES: '/memories',
  SETTINGS: '/settings',
  GAMING: '/gaming',
  SEARCH: '/search',
  PAGES: '/pages',
  RECENT: '/recent',
  REELS: '/reels',
  WEATHER: '/weather',
  DATING: '/dating',
  JOBS: '/jobs',
  BUSINESS: '/business',
  LIVE: '/live'
} as const;

export const STORAGE_KEYS = {
  LAST_REELS_OPEN: 'lastReelsOpen',
  REEL_LIKES: 'reelLikes',
  SAVED_REELS: 'savedReels',
  SAVED_POSTS: 'savedPosts',
  WATCH_HISTORY: 'watchHistory',
  THEME: 'theme',
  EVENTS_VIEW_PREFERENCE: 'eventsViewPreference',
  SAVED_ITEMS: 'savedItems',
  SAVED_VIEW_MODE: 'savedViewMode',
  USER_STORIES: 'userStories',
  POLL_VOTES: 'pollVotes'
} as const;

export const MOCK_IMAGES = {
  AVATARS: [
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=400&h=400&fit=crop&crop=face',
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400&h=400&fit=crop&crop=face',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=400&h=400&fit=crop&crop=face',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=400&h=400&fit=crop&crop=face',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=400&h=400&fit=crop&crop=face',
    'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=400&h=400&fit=crop&crop=face',
    'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=400&h=400&fit=crop&crop=face'
  ],
  POSTS: [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=800&h=600&fit=crop',
    'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=800&h=600&fit=crop',
    'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?w=800&h=600&fit=crop',
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=800&h=600&fit=crop'
  ],
  COVERS: [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=1200&h=400&fit=crop',
    'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=1200&h=400&fit=crop',
    'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?w=1200&h=400&fit=crop'
  ],
  EVENTS: [
    'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?w=800&h=600&fit=crop',
    'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=800&h=600&fit=crop'
  ]
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  SHARE: 'share',
  FRIEND_REQUEST: 'friend_request',
  MESSAGE: 'message',
  MENTION: 'mention',
  EVENT: 'event',
  BIRTHDAY: 'birthday'
} as const;

export const POST_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  LINK: 'link',
  POLL: 'poll',
  EVENT: 'event',
  LIVE: 'live'
} as const;

export const PRIVACY_SETTINGS = {
  PUBLIC: 'public',
  FRIENDS: 'friends',
  FRIENDS_EXCEPT: 'friends_except',
  SPECIFIC_FRIENDS: 'specific_friends',
  ONLY_ME: 'only_me'
} as const;

// Helper function to safely access MOCK_IMAGES arrays
export const getSafeImage = (type: 'AVATARS' | 'POSTS' | 'COVERS' | 'EVENTS', index: number): string => {
  const fallbackImages = {
    AVATARS: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=400&h=400&fit=crop&crop=face',
    POSTS: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=800&h=600&fit=crop',
    COVERS: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=1200&h=400&fit=crop',
    EVENTS: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?w=800&h=600&fit=crop'
  };
  
  if (!MOCK_IMAGES || !MOCK_IMAGES[type] || !Array.isArray(MOCK_IMAGES[type])) {
    return fallbackImages[type];
  }
  
  const array = MOCK_IMAGES[type];
  if (index < 0 || index >= array.length) {
    return array[0] || fallbackImages[type];
  }
  
  return array[index] || fallbackImages[type];
};