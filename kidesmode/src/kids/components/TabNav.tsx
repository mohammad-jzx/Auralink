import React, { useEffect, useRef } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabNavProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const TabNav: React.FC<TabNavProps> = ({ 
  tabs, 
  activeId, 
  onChange, 
  className = '' 
}) => {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeIndex = tabs.findIndex(tab => tab.id === activeId);
      let newIndex = activeIndex;

      switch (e.key) {
        case 'ArrowRight':
          newIndex = activeIndex > 0 ? activeIndex - 1 : tabs.length - 1; // RTL: right goes to previous
          break;
        case 'ArrowLeft':
          newIndex = activeIndex < tabs.length - 1 ? activeIndex + 1 : 0; // RTL: left goes to next
          break;
        case 'Home':
          newIndex = 0;
          break;
        case 'End':
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      onChange(tabs[newIndex].id);
      tabsRef.current[newIndex]?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tabs, activeId, onChange]);

  return (
    <nav 
      className={`flex bg-white rounded-2xl p-1 shadow-sm border ${className}`}
      role="tablist"
      aria-label="أقسام التعلم"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={el => tabsRef.current[index] = el}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            activeId === tab.id
              ? 'bg-blue-500 text-white shadow-md transform scale-[1.02]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          onClick={() => onChange(tab.id)}
          role="tab"
          aria-selected={activeId === tab.id}
          aria-controls={`panel-${tab.id}`}
          tabIndex={activeId === tab.id ? 0 : -1}
        >
          {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};