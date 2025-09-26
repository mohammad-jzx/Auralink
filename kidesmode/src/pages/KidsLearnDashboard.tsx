import { BookOpen, Gamepad2, Settings, Users, Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Games } from '../kids/components/Games';
import { ParentPanel } from '../kids/components/ParentPanel';
import { Stories } from '../kids/components/Stories';
import { TabNav } from '../kids/components/TabNav';
import { useToast } from '../kids/components/ui/Toast';
import { KidsProvider, useKids } from '../kids/context/KidsContext';
import { setRTL } from '../lib/rtl';

const tabs = [
  { id: 'stories', label: 'قصصي', icon: <BookOpen size={20} /> },
  { id: 'games', label: 'ألعابي', icon: <Gamepad2 size={20} /> },
  { id: 'parent', label: 'لوحة وليّ الأمر', icon: <Users size={20} /> }
];

const KidsHeader: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { state } = useKids();

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px'
    };
    root.style.fontSize = fontSizes[fontSize as keyof typeof fontSizes] || '16px';

    // Apply contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [fontSize, highContrast]);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Welcome */}
          <div className="flex items-center gap-3">
            <div className="text-2xl">👋</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                مرحباً، {state.data.profile.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  {state.data.profile.points} نقطة
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-orange-500">🔥</span>
                  {state.data.profile.streak} يوم متتالي
                </span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="إعدادات سريعة"
            >
              <Settings size={20} />
            </button>

            {showSettings && (
              <div className="absolute left-0 top-full mt-2 bg-white border rounded-xl shadow-lg p-4 w-72 z-50">
                <h3 className="font-medium text-gray-900 mb-3">إعدادات سريعة</h3>
                
                <div className="space-y-4">
                  {/* Font Size */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">حجم الخط</label>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="small">صغير</option>
                      <option value="medium">متوسط</option>
                      <option value="large">كبير</option>
                      <option value="xlarge">كبير جداً</option>
                    </select>
                  </div>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">تباين عالي</label>
                    <button
                      onClick={() => setHighContrast(!highContrast)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        highContrast ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        highContrast ? 'translate-x-5' : 'translate-x-1'
                      } mt-1`} />
                    </button>
                  </div>

                  {/* Sound */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">الأصوات</label>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const KidsLearnContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stories');
  const { ToastContainer } = useToast();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'games':
        return <Games />;
      case 'stories':
        return <Stories />;
      case 'parent':
        return <ParentPanel />;
      default:
        return <Stories />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <KidsHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Tab Navigation */}
        <TabNav
          tabs={tabs}
          activeId={activeTab}
          onChange={setActiveTab}
          className="sticky top-20 z-30"
        />

        {/* Tab Content */}
        <div 
          role="tabpanel" 
          id={`panel-${activeTab}`}
          className="focus:outline-none"
          tabIndex={-1}
        >
          {renderTabContent()}
        </div>
      </main>

      <ToastContainer />
    </div>
  );
};

export const KidsLearnDashboard: React.FC = () => {
  useEffect(() => {
    // Set RTL layout for the kids learning module
    setRTL(true);
    
    // Cleanup function to reset RTL when component unmounts
    return () => {
      setRTL(false);
    };
  }, []);

  return (
    <KidsProvider>
      <div dir="rtl" lang="ar">
        <KidsLearnContent />
      </div>
    </KidsProvider>
  );
};