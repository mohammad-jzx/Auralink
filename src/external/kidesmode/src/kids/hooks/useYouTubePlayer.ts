import { useCallback, useEffect, useRef, useState } from 'react';

interface YouTubePlayerState {
  ready: boolean;
  player: any;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isMuted: boolean;
}

interface UseYouTubePlayerOptions {
  onReady?: () => void;
  onStateChange?: (state: number) => void;
  onProgress?: (currentTime: number, duration: number) => void;
}

export const useYouTubePlayer = (options: UseYouTubePlayerOptions = {}) => {
  const [state, setState] = useState<YouTubePlayerState>({
    ready: false,
    player: null,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isMuted: false
  });

  const scriptLoadedRef = useRef(false);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load YouTube IFrame Player API
  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const loadScript = () => {
      if (window.YT && window.YT.Player) {
        scriptLoadedRef.current = true;
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        scriptLoadedRef.current = true;
      };
    };

    loadScript();
  }, []);

  // Initialize player
  const initializePlayer = useCallback((containerId: string, videoId: string, config: any = {}) => {
    if (!window.YT || !window.YT.Player) {
      console.warn('YouTube API not loaded yet');
      return;
    }

    if (playerRef.current) {
      playerRef.current.destroy();
    }

    const defaultConfig = {
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        enablejsapi: 1,
        origin: window.location.origin,
        ...config.playerVars
      },
      events: {
        onReady: (event: any) => {
          playerRef.current = event.target;
          setState(prev => ({
            ...prev,
            ready: true,
            player: event.target
          }));
          options.onReady?.();
        },
        onStateChange: (event: any) => {
          const isPlaying = event.data === window.YT.PlayerState.PLAYING;
          setState(prev => ({
            ...prev,
            isPlaying
          }));
          options.onStateChange?.(event.data);
        }
      }
    };

    new window.YT.Player(containerId, {
      ...defaultConfig,
      ...config,
      videoId
    });
  }, [options]);

  // Player controls
  const play = useCallback(() => {
    if (playerRef.current && state.ready) {
      playerRef.current.playVideo();
    }
  }, [state.ready]);

  const pause = useCallback(() => {
    if (playerRef.current && state.ready) {
      playerRef.current.pauseVideo();
    }
  }, [state.ready]);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const nextVideo = useCallback((videoId: string) => {
    if (playerRef.current && state.ready) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [state.ready]);

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current && state.ready) {
      playerRef.current.seekTo(seconds, true);
    }
  }, [state.ready]);

  const mute = useCallback(() => {
    if (playerRef.current && state.ready) {
      playerRef.current.mute();
      setState(prev => ({ ...prev, isMuted: true }));
    }
  }, [state.ready]);

  const unmute = useCallback(() => {
    if (playerRef.current && state.ready) {
      playerRef.current.unMute();
      setState(prev => ({ ...prev, isMuted: false }));
    }
  }, [state.ready]);

  const toggleMute = useCallback(() => {
    if (state.isMuted) {
      unmute();
    } else {
      mute();
    }
  }, [state.isMuted, mute, unmute]);

  // Progress tracking
  useEffect(() => {
    if (state.ready && state.isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          
          setState(prev => ({
            ...prev,
            currentTime,
            duration
          }));
          
          options.onProgress?.(currentTime, duration);
        }
      }, 1000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [state.ready, state.isPlaying, options]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    initializePlayer,
    play,
    pause,
    togglePlayPause,
    nextVideo,
    seekTo,
    mute,
    unmute,
    toggleMute
  };
};

// Global YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
