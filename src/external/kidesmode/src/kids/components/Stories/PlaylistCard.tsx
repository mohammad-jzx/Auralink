import { Play } from 'lucide-react';
import React from 'react';

interface PlaylistCardProps {
  title: string;
  subtitle?: string;
  count?: number;
  thumbUrl?: string;
  onOpen: () => void;
  accent?: 'green' | 'blue';
  loading?: boolean;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  title,
  subtitle,
  count,
  thumbUrl,
  onOpen,
  accent = 'green',
  loading = false
}) => {
  const accentColors = {
    green: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
    blue: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <div 
      className="rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.01] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`فتح قائمة التشغيل: ${title}`}
    >
      {/* Cover */}
      <div className="aspect-[16/9] relative bg-gray-100">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          </div>
        ) : (
          <>
            {thumbUrl && (
              <img
                src={thumbUrl}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            
            {/* Play Button */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
                <Play size={32} className="text-white" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
          {title}
        </h3>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-gray-600 line-clamp-1">
            {subtitle}
          </p>
        )}

        {/* Badges Row */}
        {count !== undefined && count > 0 && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {count} شرائح
            </span>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onOpen}
          disabled={loading}
          className={`w-full mt-3 rounded-xl py-3 font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed ${accentColors[accent]}`}
          aria-label={`ابدأ القصة: ${title}`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              جاري التحميل...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              ابدأ القصة
              <Play size={16} />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
