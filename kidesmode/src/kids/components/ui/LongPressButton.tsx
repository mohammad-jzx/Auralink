import React, { useRef, useState, useCallback } from 'react';

interface LongPressButtonProps {
  onLongPress: () => void;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  duration?: number;
  disabled?: boolean;
  'aria-label'?: string;
}

export const LongPressButton: React.FC<LongPressButtonProps> = ({
  onLongPress,
  onClick,
  children,
  className = '',
  duration = 1000,
  disabled = false,
  'aria-label': ariaLabel
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPress = useCallback(() => {
    if (disabled) return;
    
    setIsPressed(true);
    timerRef.current = setTimeout(() => {
      onLongPress();
      setIsPressed(false);
    }, duration);
  }, [onLongPress, duration, disabled]);

  const endPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (isPressed && onClick) {
      onClick();
    }
    setIsPressed(false);
  }, [isPressed, onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      startPress();
    }
  }, [startPress]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      endPress();
    }
  }, [endPress]);

  return (
    <button
      className={`relative overflow-hidden transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {isPressed && (
        <div 
          className="absolute inset-0 bg-blue-200 animate-pulse"
          style={{
            animation: `longPressProgress ${duration}ms linear forwards`
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </button>
  );
};