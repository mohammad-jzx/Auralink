import React, { useEffect, useRef, useState } from 'react';
import { useYouTubePlayer } from '../../hooks/useYouTubePlayer';

interface YTIframePlayerProps {
  mode: 'items' | 'playlist';
  videoId?: string;
  playlistId?: string;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
  onProgress?: (currentTime: number, duration: number) => void;
  className?: string;
}

export const YTIframePlayer: React.FC<YTIframePlayerProps> = ({
  mode,
  videoId,
  playlistId,
  onReady,
  onStateChange,
  onProgress,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const playerId = useRef(`yt-player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const {
    ready,
    player,
    currentTime,
    duration,
    isPlaying,
    isMuted,
    initializePlayer,
    play,
    pause,
    togglePlayPause,
    nextVideo,
    seekTo,
    toggleMute
  } = useYouTubePlayer({
    onReady: () => {
      setLoading(false);
      setError(null);
      onReady?.();
    },
    onStateChange,
    onProgress
  });

  // Initialize player based on mode
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = ''; // Clear any existing content

    if (mode === 'playlist' && playlistId) {
      // Playlist mode - use embedded iframe
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/videoseries?list=${playlistId}&enablejsapi=1&origin=${window.location.origin}&rel=0&modestbranding=1`;
      iframe.title = 'YouTube playlist player';
      iframe.className = 'w-full h-full';
      iframe.allow = 'autoplay; encrypted-media';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.onload = () => {
        setLoading(false);
        setError(null);
        onReady?.();
      };
      iframe.onerror = () => {
        setError('فشل في تحميل قائمة التشغيل');
        setLoading(false);
      };
      
      container.appendChild(iframe);
    } else if (mode === 'items' && videoId) {
      // Items mode - use YouTube Player API
      const playerDiv = document.createElement('div');
      playerDiv.id = playerId.current;
      playerDiv.className = 'w-full h-full';
      container.appendChild(playerDiv);

      // Wait for YouTube API to be ready
      const checkAPI = () => {
        if (window.YT && window.YT.Player) {
          initializePlayer(playerId.current, videoId, {
            playerVars: {
              autoplay: 0,
              controls: 1,
              modestbranding: 1,
              rel: 0
            }
          });
        } else {
          setTimeout(checkAPI, 100);
        }
      };
      
      checkAPI();
    }
  }, [mode, videoId, playlistId, initializePlayer, onReady]);

  // Expose player methods via ref
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    play,
    pause,
    togglePlayPause,
    nextVideo,
    seekTo,
    toggleMute,
    ready,
    isPlaying,
    isMuted,
    currentTime,
    duration
  }));

  return (
    <div className={`relative bg-gray-100 rounded-xl overflow-hidden ${className}`}>
      <div 
        ref={containerRef}
        className="w-full h-full min-h-[300px]"
      />
      
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل الفيديو...</p>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Global YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
