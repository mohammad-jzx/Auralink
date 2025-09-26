import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// In-memory cache for 12 hours
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

// Helper function to get cached data
const getCached = (key: string): any | null => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data;
  }
  cache.delete(key);
  return null;
};

// Helper function to set cached data
const setCached = (key: string, data: any): void => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Helper function to extract playlist ID from URL or return as-is
const extractPlaylistId = (input: string): string => {
  const urlMatch = input.match(/[?&]list=([^&]+)/);
  return urlMatch ? urlMatch[1] : input;
};

// GET /api/yt/playlist/:id/brief
router.get('/playlist/:id/brief', async (req, res) => {
  try {
    const playlistId = extractPlaylistId(req.params.id);
    const cacheKey = `brief_${playlistId}`;
    
    // Check cache first
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      // No API key - return fallback response (HTTP 200)
      const fallback = {
        id: playlistId,
        title: "قائمة تشغيل",
        count: 0
      };
      setCached(cacheKey, fallback);
      return res.status(200).json(fallback);
    }

    // Fetch playlist details from YouTube API
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`;
    const playlistResponse = await fetch(playlistUrl);
    
    if (!playlistResponse.ok) {
      throw new Error(`YouTube API error: ${playlistResponse.status}`);
    }
    
    const playlistData = await playlistResponse.json() as any;
    
    if (!playlistData.items || playlistData.items.length === 0) {
      throw new Error('Playlist not found');
    }

    const playlist = playlistData.items[0];
    const snippet = playlist.snippet;
    
    // Get video count
    const itemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=1&playlistId=${playlistId}&key=${apiKey}`;
    const itemsResponse = await fetch(itemsUrl);
    const itemsData = await itemsResponse.json() as any;
    const totalResults = itemsData.pageInfo?.totalResults || 0;

    const result = {
      id: playlistId,
      title: snippet.title,
      count: totalResults,
      thumbUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url
    };

    setCached(cacheKey, result);
    res.json(result);

  } catch (error) {
    console.error('Error fetching playlist brief:', error);
    res.status(500).json({
      error: 'Failed to fetch playlist details',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/yt/playlist/:id/items
router.get('/playlist/:id/items', async (req, res) => {
  try {
    const playlistId = extractPlaylistId(req.params.id);
    const cacheKey = `items_${playlistId}`;
    
    // Check cache first
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      // No API key - return 204 to signal fallback mode with no-store cache
      res.setHeader("Cache-Control", "no-store");
      return res.status(204).end();
    }

    // Fetch playlist items from YouTube API
    const itemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
    const itemsResponse = await fetch(itemsUrl);
    
    if (!itemsResponse.ok) {
      throw new Error(`YouTube API error: ${itemsResponse.status}`);
    }
    
    const itemsData = await itemsResponse.json() as any;
    
    if (!itemsData.items || itemsData.items.length === 0) {
      return res.status(204).send();
    }

    const items = itemsData.items.map((item: any, index: number) => {
      const snippet = item.snippet;
      const videoId = item.contentDetails?.videoId;
      
      return {
        videoId,
        title: snippet.title,
        thumbUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url,
        position: index + 1
      };
    });

    const result = {
      id: playlistId,
      items
    };

    setCached(cacheKey, result);
    res.json(result);

  } catch (error) {
    console.error('Error fetching playlist items:', error);
    res.status(500).json({
      error: 'Failed to fetch playlist items',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
