import React, { useState, useMemo } from 'react';
import { Search, Volume2, Play } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useToast } from './ui/Toast';
import { useKids } from '../context/KidsContext';

export const AACBoard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const { state, markWordLearned, addPoints } = useKids();
  const { showToast } = useToast();

  const filteredDictionary = useMemo(() => {
    if (!searchTerm) return state.data.dictionary;
    
    return state.data.dictionary.filter(item =>
      item.text.includes(searchTerm) ||
      item.tags.some(tag => tag.includes(searchTerm))
    );
  }, [state.data.dictionary, searchTerm]);

  const handlePlayTTS = async (text: string, wordId: string) => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        
        speechSynthesis.speak(utterance);
        
        // Mark word as learned and add points
        if (!state.data.progress.learnedWordIds.includes(wordId)) {
          markWordLearned(wordId);
          addPoints(5);
          showToast('أحسنت! تعلمت كلمة جديدة', 'success');
        }
      } else {
        showToast('النطق الآلي غير متوفر في هذا المتصفح', 'info');
      }
    } catch (error) {
      showToast('حدث خطأ في تشغيل النطق', 'error');
    }
  };

  const handleShowSign = (word: any) => {
    setSelectedWord(word);
  };

  if (state.loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث عن الكلمات..."
          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
          dir="rtl"
        />
      </div>

      {/* Dictionary Grid */}
      {filteredDictionary.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDictionary.map((word) => {
            const isLearned = state.data.progress.learnedWordIds.includes(word.id);
            
            return (
              <div
                key={word.id}
                className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                  isLearned ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="text-center space-y-3">
                  <div className="text-4xl">{word.emoji}</div>
                  <h3 className="text-lg font-bold text-gray-900">{word.text}</h3>
                  
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handlePlayTTS(word.text, word.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[44px]"
                      aria-label={`نطق كلمة ${word.text}`}
                    >
                      <Volume2 size={16} />
                      <span>سماع</span>
                    </button>
                    
                    <button
                      onClick={() => handleShowSign(word)}
                      className="flex items-center gap-1 px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors min-h-[44px]"
                      aria-label={`عرض إشارة كلمة ${word.text}`}
                    >
                      <Play size={16} />
                      <span>إشارة</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 justify-center">
                    {word.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {isLearned && (
                    <div className="text-green-600 text-sm font-medium">
                      ✓ تم التعلم
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-600">
            جرب البحث بكلمة أخرى
          </p>
        </div>
      )}

      {/* Sign Video Modal */}
      <Modal
        isOpen={!!selectedWord}
        onClose={() => setSelectedWord(null)}
        title={selectedWord ? `إشارة كلمة: ${selectedWord.text}` : ''}
      >
        {selectedWord && (
          <div className="text-center space-y-4">
            <div className="text-6xl">{selectedWord.emoji}</div>
            <h3 className="text-2xl font-bold text-gray-900">{selectedWord.text}</h3>
            
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="text-gray-500 mb-4">
                <Play size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600">
                فيديو الإشارة سيكون متوفراً قريباً
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {selectedWord.video}
              </p>
            </div>
            
            <div className="text-lg font-medium text-gray-900 bg-gray-50 rounded-lg p-4">
              {selectedWord.text}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};