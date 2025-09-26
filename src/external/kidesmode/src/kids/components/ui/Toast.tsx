import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 4000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-sm ${bgColors[type]}`}
        role="alert"
        aria-live="polite"
      >
        {icons[type]}
        <span className="text-sm font-medium text-gray-900 flex-1">
          {message}
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="إغلاق التنبيه"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Toast Provider Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: number;
    message: string;
    type: ToastType;
  }>>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const hideToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};