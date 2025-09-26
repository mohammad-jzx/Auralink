'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SignSequenceItem } from '@/lib/signs';

interface SignSequencePlayerProps {
  sequence: SignSequenceItem[];
  onSequenceComplete?: () => void;
  autoPlay?: boolean;
}

export default function SignSequencePlayer({ 
  sequence, 
  onSequenceComplete,
  autoPlay = true 
}: SignSequencePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPosters, setGeneratedPosters] = useState<Record<number, string>>({});

  const currentItem = sequence[currentIndex];

  // Preload all videos and generate posters from first frame
  useEffect(() => {
    if (sequence.length === 0) return;

    let cancelled = false;

    const preloadVideos = async () => {
      setIsLoading(true);
      try {
        const preloadPromises = sequence.map((item, index) => {
          if (!item.video) return Promise.resolve();
          
          return new Promise<void>((resolve) => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.muted = true;
            video.src = item.video;

            const cleanup = () => {
              video.oncanplaythrough = null;
              video.onloadeddata = null;
              video.onerror = null;
            };
            
            const tryCapturePoster = () => {
              try {
                const canvas = document.createElement('canvas');
                // 4:3 aspect thumbnail
                canvas.width = 160;
                canvas.height = 120;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  const dataUrl = canvas.toDataURL('image/webp');
                  if (!cancelled) {
                    setGeneratedPosters(prev => ({ ...prev, [index]: dataUrl }));
                  }
                }
              } catch (e) {
                // Ignore capture errors (e.g., CORS)
              }
            };
            
            video.oncanplaythrough = () => {
              tryCapturePoster();
              cleanup();
              resolve();
              video.remove();
            };

            // Fallback in case canplaythrough doesn't fire
            video.onloadeddata = () => {
              tryCapturePoster();
            };
            
            video.onerror = () => {
              cleanup();
              resolve();
              video.remove();
            };
            
            video.load();
          });
        });

        await Promise.allSettled(preloadPromises);
      } catch (error) {
        console.warn('Some videos failed to preload:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    preloadVideos();
    return () => { cancelled = true; };
  }, [sequence]);

  // Handle video end and advance to next
  const handleVideoEnd = useCallback(() => {
    if (currentIndex < sequence.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
      onSequenceComplete?.();
    }
  }, [currentIndex, sequence.length, onSequenceComplete]);

  // Play current video
  const playCurrentVideo = useCallback(async () => {
    if (!videoRef.current || !currentItem?.video) {
      console.log('No video ref or current item:', { videoRef: !!videoRef.current, currentItem });
      return;
    }

    try {
      setError(null);
      const video = videoRef.current;
      
      console.log('Setting video src:', currentItem.video);
      video.src = currentItem.video;
      video.currentTime = 0;
      
      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        const onCanPlay = () => {
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          resolve(true);
        };
        
        const onError = (e: Event) => {
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          reject(new Error('Video failed to load'));
        };
        
        video.addEventListener('canplay', onCanPlay);
        video.addEventListener('error', onError);
        
        // Load the video
        video.load();
      });
      
      console.log('Video loaded, attempting to play');
      await video.play();
      setIsPlaying(true);
      console.log('Video playing successfully');
    } catch (error) {
      console.error('Failed to play video:', error);
      setError('فشل في تشغيل الفيديو');
      setIsPlaying(false);
    }
  }, [currentItem]);

  // Auto-play when currentIndex changes
  useEffect(() => {
    if (autoPlay && currentItem?.video && !isLoading) {
      playCurrentVideo();
    }
  }, [currentIndex, currentItem, autoPlay, isLoading, playCurrentVideo]);

  // Reset player when sequence changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setError(null);
    setGeneratedPosters({});
  }, [sequence]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      playCurrentVideo();
    }
  };

  const skipTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  }, []);

  if (sequence.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد إشارات لعرضها
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-black rounded-lg overflow-hidden shadow-lg mb-6">
        <video
          ref={videoRef}
          className="w-full aspect-video"
          muted
          playsInline
          controls
          preload="metadata"
          onEnded={handleVideoEnd}
          onError={() => setError('حدث خطأ في تشغيل الفيديو')}
        />
        
        {isLoading && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="text-white text-lg">جاري التحميل...</div>
          </div>
        )}
        
        {error && (
          <div 
            className="absolute inset-0 bg-red-900 bg-opacity-50 flex items-center justify-center"
          >
            <div className="text-white text-center">
              <div className="text-lg mb-2">خطأ</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}
        
        {!isLoading && !error && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
          >
            {!isPlaying && (
              <div 
                className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center"
              >
                <svg className="w-10 h-10 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            )}
          </button>
        )}
        
        <div 
          className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm"
        >
          {currentItem?.label || ''}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3 text-right">تسلسل الإشارات</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sequence.map((item, index) => {
            const displayPoster = generatedPosters[index] || item.poster || '';
            return (
              <div
                key={index}
                className={`flex-shrink-0 cursor-pointer transition-all ${
                  index === currentIndex 
                    ? 'ring-2 ring-blue-500 ring-offset-2' 
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
                onClick={() => skipTo(index)}
              >
                <div className="relative">
                  {displayPoster ? (
                    <img
                      src={displayPoster}
                      alt={item.label}
                      className="w-20 h-16 object-cover rounded border-2 border-gray-200"
                    />
                  ) : (
                    <div 
                      className="w-20 h-16 bg-gray-200 rounded border-2 border-gray-200 flex items-center justify-center"
                    >
                      <span className="text-gray-500 text-xs text-center px-1">
                        {item.label}
                      </span>
                    </div>
                  )}
                  
                  {index === currentIndex && isPlaying && (
                    <div 
                      className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"
                    />
                  )}
                  
                  {!item.video && (
                    <div 
                      className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"
                    />
                  )}
                </div>
                
                <div 
                  className="text-xs text-gray-600 mt-1 text-center max-w-20 truncate"
                >
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => skipTo(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          السابق
        </button>
        
        <button
          onClick={togglePlay}
          disabled={!currentItem?.video}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
        </button>
        
        <button
          onClick={() => skipTo(Math.min(sequence.length - 1, currentIndex + 1))}
          disabled={currentIndex === sequence.length - 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          التالي
        </button>
      </div>

      <div 
        className="mt-4 text-center text-sm text-gray-600"
      >
        {currentIndex + 1} من {sequence.length}
      </div>
    </div>
  );
}
