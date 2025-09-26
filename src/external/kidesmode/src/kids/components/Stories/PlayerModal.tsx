import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '../ui/Modal';
import { VideoList } from './VideoList';
import { YTIframePlayer } from './YTIframePlayer';

interface VideoItem {
  videoId: string;
  title: string;
  thumbUrl?: string;
}

interface PlayerModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'items' | 'playlist';
  playlistId: string;
  playlistTitle?: string;
  items?: VideoItem[];
  onResume?: (playlistId: string, index: number, time: number) => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  open,
  onClose,
  mode,
  playlistId,
  playlistTitle = 'قائمة التشغيل',
  items = [],
  onResume
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [resumeData, setResumeData] = useState<{index: number; time: number} | null>(null);
  
  const playerRef = useRef<any>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const lastSaveTimeRef = useRef(0);

  // Load saved progress on open
  useEffect(() => {
    if (open && mode === 'items' && items.length > 0) {
      const saved = localStorage.getItem(`yt_progress_${playlistId}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.index < items.length) {
            setResumeData(data);
            setShowResumePrompt(true);
          }
        } catch (e) {
          console.warn('Failed to parse saved progress:', e);
        }
      }
    }
  }, [open, mode, playlistId, items.length]);

  // Save progress periodically
  const saveProgress = useCallback(() => {
    if (mode === 'items' && items.length > 0 && currentTime > 0) {
      const now = Date.now();
      if (now - lastSaveTimeRef.current > 5000) { // Save every 5 seconds
        const progress = {
          index: currentIndex,
          time: currentTime,
          timestamp: now
        };
        localStorage.setItem(`yt_progress_${playlistId}`, JSON.stringify(progress));
        lastSaveTimeRef.current = now;
      }
    }
  }, [mode, playlistId, currentIndex, currentTime, items.length]);

  useEffect(() => {
    saveProgress();
  }, [saveProgress]);

  // Handle resume prompt
  const handleResume = () => {
    if (resumeData) {
      setCurrentIndex(resumeData.index);
      setShowResumePrompt(false);
      onResume?.(playlistId, resumeData.index, resumeData.time);
    }
  };

  const handleStartFromBeginning = () => {
    setCurrentIndex(0);
    setShowResumePrompt(false);
    setResumeData(null);
    localStorage.removeItem(`yt_progress_${playlistId}`);
  };

  // Player event handlers
  const handlePlayerReady = () => {
    console.log('Player ready');
  };

  const handleStateChange = (state: number) => {
    // YouTube Player States: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    setIsPlaying(state === 1);
  };

  const handleProgress = (time: number, total: number) => {
    setCurrentTime(time);
    setDuration(total);
  };

  // Navigation controls
  const nextVideo = () => {
    if (mode === 'items' && currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevVideo = () => {
    if (mode === 'items' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const selectVideo = (index: number) => {
    if (mode === 'items') {
      setCurrentIndex(index);
    }
  };

  // Progress bar controls
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    // Note: Seeking would need to be implemented via YouTube API
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't interfere with form inputs
      }

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          // Toggle play/pause would go here
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevVideo();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextVideo();
          break;
        case 'j':
        case 'J':
          e.preventDefault();
          // Seek backward 10s would go here
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          // Seek forward 10s would go here
          break;
        case 'k':
        case 'K':
          e.preventDefault();
          // Toggle play/pause would go here
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setIsMuted(!isMuted);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, isMuted]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentItem = mode === 'items' ? items[currentIndex] : null;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Resume Prompt */}
      {showResumePrompt && resumeData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" dir="rtl">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">متابعة من حيث توقفت؟</h3>
            <p className="text-gray-600 mb-6">
              تم العثور على تقدم سابق في هذا الفيديو. هل تريد المتابعة من حيث توقفت؟
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResume}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                متابعة
              </button>
              <button
                onClick={handleStartFromBeginning}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                من البداية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Modal */}
      <Modal
        isOpen={open}
        onClose={onClose}
        className="max-w-7xl w-full max-h-[95vh]"
      >
        <div className="flex flex-col h-full" dir="rtl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{playlistTitle}</h2>
              {mode === 'items' && items.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    الشريحة {currentIndex + 1} / {items.length}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              aria-label="إغلاق المشغل"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            {/* Player Section */}
            <div className="flex-1 flex flex-col lg:w-[70%]">
              {/* Current Video Title (Items mode only) */}
              {mode === 'items' && currentItem && (
                <div className="p-4 border-b bg-gray-50">
                  <h3 
                    className="text-lg font-bold text-gray-900 line-clamp-2"
                    aria-live="polite"
                  >
                    {currentItem.title}
                  </h3>
                </div>
              )}

              {/* Video Player */}
              <div className="flex-1 p-6">
                <YTIframePlayer
                  mode={mode}
                  videoId={currentItem?.videoId}
                  playlistId={playlistId}
                  onReady={handlePlayerReady}
                  onStateChange={handleStateChange}
                  onProgress={handleProgress}
                  className="aspect-video"
                />
              </div>

              {/* Controls */}
              <div className="p-6 border-t bg-gray-50">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    ref={progressRef}
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    aria-label="شريط التقدم"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-4">
                  {/* Previous */}
                  <button
                    onClick={prevVideo}
                    disabled={mode === 'items' && currentIndex === 0}
                    className="p-3 rounded-full bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    aria-label="الفيديو السابق"
                  >
                    <SkipBack size={20} />
                  </button>

                  {/* Play/Pause */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>

                  {/* Next */}
                  <button
                    onClick={nextVideo}
                    disabled={mode === 'items' && currentIndex === items.length - 1}
                    className="p-3 rounded-full bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    aria-label="الفيديو التالي"
                  >
                    <SkipForward size={20} />
                  </button>

                  {/* Mute/Unmute */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 rounded-full bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>

              </div>
            </div>

            {/* Video List Sidebar (Items mode only) */}
            {mode === 'items' && items.length > 0 && (
              <div className="lg:w-[30%] border-l bg-white">
                <VideoList
                  items={items}
                  activeIndex={currentIndex}
                  onSelect={selectVideo}
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
