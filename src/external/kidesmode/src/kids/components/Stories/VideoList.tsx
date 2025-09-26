import React, { useEffect, useRef } from 'react';

interface VideoItem {
  videoId: string;
  title: string;
  thumbUrl?: string;
}

interface VideoListProps {
  items: VideoItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const VideoList: React.FC<VideoListProps> = ({
  items,
  activeIndex,
  onSelect
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  // Scroll active item into view
  useEffect(() => {
    if (activeItemRef.current && listRef.current) {
      const container = listRef.current;
      const activeItem = activeItemRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      
      if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
        activeItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (index < items.length - 1) {
          onSelect(index + 1);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (index > 0) {
          onSelect(index - 1);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(index);
        break;
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>لا توجد فيديوهات متاحة</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-bold text-gray-900">قائمة الفيديوهات</h3>
        <p className="text-sm text-gray-600 mt-1">
          {items.length} فيديو
        </p>
      </div>
      
      <div 
        ref={listRef}
        className="flex-1 overflow-y-auto max-h-[60vh]"
        role="listbox"
        aria-label="قائمة الفيديوهات"
      >
        <div className="p-2 space-y-1">
          {items.map((item, index) => (
            <button
              key={item.videoId}
              ref={index === activeIndex ? activeItemRef : null}
              onClick={() => onSelect(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                index === activeIndex
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
              }`}
              role="option"
              aria-selected={index === activeIndex}
              aria-label={`تشغيل الفيديو: ${item.title}`}
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-16 h-12 bg-gray-200 rounded overflow-hidden">
                {item.thumbUrl ? (
                  <img
                    src={item.thumbUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">📹</span>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium line-clamp-2 leading-tight">
                  {item.title}
                </div>
                <div className="text-xs opacity-75 mt-1">
                  {index + 1} من {items.length}
                </div>
              </div>
              
              {/* Active Indicator */}
              {index === activeIndex && (
                <div className="flex-shrink-0 w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
