// YouTube service utilities with client-side caching

export interface PlaylistBrief {
  id: string;
  title: string;
  count: number;
  thumbUrl?: string;
}

export interface PlaylistItem {
  videoId: string;
  title: string;
  thumbUrl?: string;
  position: number;
}

export interface PlaylistItems {
  id: string;
  items: PlaylistItem[];
}

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Extract playlist ID from URL or return as-is
export const extractPlaylistId = (input: string): string => {
  const urlMatch = input.match(/[?&]list=([^&]+)/);
  return urlMatch ? urlMatch[1] : input;
};

// Versioned cache utilities with prefix
const PREFIX = "yt:v1:";

export const getCached = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(PREFIX + key);
    if (!cached) return null;
    
    const entry: CacheEntry<T> = JSON.parse(cached);
    const ttlMs = 12 * 60 * 60 * 1000; // 12 hours
    
    if (Date.now() - entry.timestamp > ttlMs) {
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    
    return entry.data;
  } catch (error) {
    console.warn('Failed to get cached data:', error);
    return null;
  }
};

export const setCached = <T>(key: string, value: T, ttlMs: number = 12 * 60 * 60 * 1000): void => {
  try {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now()
    };
    localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
};

export const getCachedValid = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const { v, exp } = JSON.parse(raw);
    if (Date.now() > exp) { 
      localStorage.removeItem(PREFIX + key); 
      return null; 
    }
    return v as T;
  } catch { 
    return null; 
  }
};

// Fetch playlist brief from server
export const fetchPlaylistBrief = async (id: string): Promise<PlaylistBrief> => {
  const cacheKey = `brief_${id}`;
  
  // Check cache first
  const cached = getCached<PlaylistBrief>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`/api/yt/playlist/${id}/brief`);
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const data = await response.json() as PlaylistBrief;
    setCached(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching playlist brief:', error);
    // Return fallback
    const fallback: PlaylistBrief = {
      id,
      title: "قائمة تشغيل",
      count: 0
    };
    return fallback;
  }
};

// Fetch playlist items from server
export const fetchPlaylistItems = async (id: string): Promise<PlaylistItem[]> => {
  const cacheKey = `items_${id}`;
  
  // Check cache first
  const cached = getCached<PlaylistItems>(cacheKey);
  if (cached) {
    return cached.items;
  }

  try {
    const response = await fetch(`/api/yt/playlist/${id}/items`);
    
    if (response.status === 204) {
      // No API key or no items - return empty array
      return [];
    }
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const data = await response.json() as PlaylistItems;
    setCached(cacheKey, data);
    return data.items;
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    return [];
  }
};

// YouTube IFrame Player API utilities
export const createYouTubeEmbedUrl = (videoId: string, autoplay: boolean = false): string => {
  const params = new URLSearchParams({
    enablejsapi: '1',
    origin: window.location.origin,
    rel: '0',
    modestbranding: '1'
  });
  
  if (autoplay) {
    params.set('autoplay', '1');
  }
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

export const createYouTubePlaylistEmbedUrl = (playlistId: string): string => {
  const params = new URLSearchParams({
    list: playlistId,
    enablejsapi: '1',
    origin: window.location.origin,
    rel: '0',
    modestbranding: '1'
  });
  
  return `https://www.youtube.com/embed/videoseries?${params.toString()}`;
};
