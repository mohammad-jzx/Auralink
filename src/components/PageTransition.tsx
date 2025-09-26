import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`page-transition ${isVisible ? 'page-transition-enter-active' : 'page-transition-enter'} ${className}`}
    >
      {children}
    </div>
  );
}
