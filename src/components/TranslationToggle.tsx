import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface TranslationToggleProps {
  isLiveTranslation?: boolean;
  onToggle?: (isLiveTranslation: boolean) => void;
  className?: string;
  onNavigateOn?: () => void;
  onNavigateOff?: () => void;
}

export function TranslationToggle({
  isLiveTranslation = true,
  onToggle,
  className = "",
  onNavigateOn,
  onNavigateOff,
}: TranslationToggleProps) {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggle = (checked: boolean) => {
    if (isTransitioning) return; // Prevent multiple clicks during transition
    
    setIsTransitioning(true);
    
    // Add smooth transition effect
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    document.body.style.opacity = '0.7';
    
    setTimeout(() => {
      if (onToggle) onToggle(checked);
      if (!checked) {
        if (onNavigateOff) onNavigateOff();
        else navigate('/texttovedio');
      } else if (onNavigateOn) {
        onNavigateOn();
      }
      
      // Restore opacity after navigation
      setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = '';
        setIsTransitioning(false);
      }, 100);
    }, 150);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {isTransitioning && (
        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
          <div className="w-2 h-2 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>جاري التبديل...</span>
        </div>
      )}
      <span className={`text-sm font-medium text-gray-700 dark:text-gray-200 toggle-transition ${isTransitioning ? 'opacity-60' : ''}`}>
        {isLiveTranslation ? 'الترجمة المباشرة' : 'التحويل بالإشارة'}
      </span>
      <label
        className={`relative inline-flex items-center ${isTransitioning ? 'cursor-wait' : 'cursor-pointer'}`}
        aria-label="تبديل الترجمة المباشرة أو التحويل بالإشارة"
      >
        <input
          type="checkbox"
          checked={isLiveTranslation}
          onChange={(e) => handleToggle(e.target.checked)}
          disabled={isTransitioning}
          className="sr-only peer"
        />
        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 toggle-transition ${isTransitioning ? 'opacity-60' : ''}`} />
        {isTransitioning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </label>
    </div>
  );
}















