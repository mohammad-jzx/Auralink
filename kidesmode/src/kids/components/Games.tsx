import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, Trophy } from 'lucide-react';
import { useKids } from '../context/KidsContext';
import { useToast } from './ui/Toast';

interface Card {
  id: string;
  text: string;
  emoji: string;
  matched: boolean;
}

interface GameSession {
  score: number;
  level: number;
  timeLeft: number;
}

export const Games: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'match' | 'pop' | null>(null);
  const [matchCards, setMatchCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchSession, setMatchSession] = useState<GameSession>({ score: 0, level: 1, timeLeft: 60 });
  const [popWords, setPopWords] = useState<any[]>([]);
  const [popTarget, setPopTarget] = useState<string>('');
  const [popSession, setPopSession] = useState<GameSession>({ score: 0, level: 1, timeLeft: 45 });
  const [gameTimer, setGameTimer] = useState<NodeJS.Timeout | null>(null);

  const { state, addPoints, recordGamePlay } = useKids();
  const { showToast } = useToast();

  // Initialize Match & Sign Game
  const initMatchGame = () => {
    const shuffledWords = [...state.data.dictionary]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
    
    const gameCards = shuffledWords.map(word => ({
      id: word.id,
      text: word.text,
      emoji: word.emoji,
      matched: false
    }));

    setMatchCards([...gameCards, ...gameCards].sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchSession({ score: 0, level: 1, timeLeft: 60 });
    setActiveGame('match');
    
    startTimer('match');
  };

  // Initialize Pop the Word Game
  const initPopGame = () => {
    const words = state.data.dictionary.slice(0, 4);
    const target = words[Math.floor(Math.random() * words.length)];
    
    setPopWords(words);
    setPopTarget(target.text);
    setPopSession({ score: 0, level: 1, timeLeft: 45 });
    setActiveGame('pop');
    
    startTimer('pop');
  };

  const startTimer = (game: 'match' | 'pop') => {
    if (gameTimer) clearInterval(gameTimer);
    
    const timer = setInterval(() => {
      if (game === 'match') {
        setMatchSession(prev => {
          if (prev.timeLeft <= 1) {
            endGame('match', prev.score);
            return prev;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      } else {
        setPopSession(prev => {
          if (prev.timeLeft <= 1) {
            endGame('pop', prev.score);
            return prev;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }
    }, 1000);
    
    setGameTimer(timer);
  };

  const endGame = (game: 'match' | 'pop', score: number) => {
    if (gameTimer) {
      clearInterval(gameTimer);
      setGameTimer(null);
    }
    
    recordGamePlay(game, score);
    addPoints(score);
    setActiveGame(null);
    
    showToast(`انتهت اللعبة! نقاطك: ${score}`, score > 50 ? 'success' : 'info');
  };

  const handleMatchCardClick = (cardId: string) => {
    if (selectedCards.length >= 2 || selectedCards.includes(cardId)) return;
    
    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);
    
    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      const firstCard = matchCards.find(c => c.id === first);
      const secondCard = matchCards.find(c => c.id === second);
      
      if (firstCard && secondCard && firstCard.text === secondCard.text) {
        // Match!
        setTimeout(() => {
          setMatchCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, matched: true }
              : card
          ));
          setMatchSession(prev => ({ ...prev, score: prev.score + 10 }));
          setSelectedCards([]);
          showToast('أحسنت! 🎉', 'success');
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setSelectedCards([]);
          // Add shake animation class briefly
        }, 1000);
      }
    }
  };

  const handlePopWordClick = (word: string) => {
    if (word === popTarget) {
      setPopSession(prev => ({ ...prev, score: prev.score + 15 }));
      showToast('ممتاز! 🎯', 'success');
      
      // Generate new target
      const newTarget = popWords[Math.floor(Math.random() * popWords.length)];
      setPopTarget(newTarget.text);
    } else {
      showToast('حاول مرة أخرى', 'error');
    }
  };

  const resetGame = () => {
    if (gameTimer) {
      clearInterval(gameTimer);
      setGameTimer(null);
    }
    setActiveGame(null);
    setSelectedCards([]);
  };

  useEffect(() => {
    return () => {
      if (gameTimer) clearInterval(gameTimer);
    };
  }, [gameTimer]);

  if (!activeGame) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر لعبتك المفضلة</h2>
          <p className="text-gray-600">العب واتعلم واكسب النقاط!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Match & Sign Game */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-4">🧩</div>
            <h3 className="text-xl font-bold mb-2">مطابقة الكلمات</h3>
            <p className="text-blue-100 mb-6">
              اربط الكلمات مع بعضها البعض واكسب النقاط
            </p>
            <button
              onClick={initMatchGame}
              className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[44px]"
            >
              ابدأ اللعب
            </button>
          </div>

          {/* Pop the Word Game */}
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">انقر الكلمة</h3>
            <p className="text-green-100 mb-6">
              انقر على الكلمة الصحيحة قبل انتهاء الوقت
            </p>
            <button
              onClick={initPopGame}
              className="w-full bg-white text-green-600 font-bold py-3 px-6 rounded-xl hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 min-h-[44px]"
            >
              ابدأ اللعب
            </button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-500" size={20} />
            إحصائياتك
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {state.data.progress.games.map(game => (
              <div key={game.id} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{game.bestScore}</div>
                <div className="text-sm text-gray-600">أفضل نتيجة</div>
                <div className="text-xs text-gray-500">
                  {game.id === 'match' ? 'مطابقة الكلمات' : 'انقر الكلمة'} ({game.plays} مرة)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Match & Sign Game UI
  if (activeGame === 'match') {
    const allMatched = matchCards.every(card => card.matched);
    
    if (allMatched) {
      setTimeout(() => endGame('match', matchSession.score), 2000);
    }

    return (
      <div className="space-y-4">
        {/* Game Header */}
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{matchSession.score}</div>
              <div className="text-xs text-gray-500">النقاط</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{matchSession.timeLeft}</div>
              <div className="text-xs text-gray-500">ثانية</div>
            </div>
          </div>
          
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            aria-label="إنهاء اللعبة"
          >
            <RotateCcw size={16} />
            إنهاء
          </button>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {matchCards.map((card, index) => (
            <button
              key={`${card.id}-${index}`}
              onClick={() => handleMatchCardClick(`${card.id}-${index}`)}
              disabled={card.matched || selectedCards.length >= 2}
              className={`aspect-square rounded-xl border-2 transition-all duration-200 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                card.matched
                  ? 'bg-green-100 border-green-300 opacity-50'
                  : selectedCards.includes(`${card.id}-${index}`)
                  ? 'bg-blue-100 border-blue-500 scale-105'
                  : 'bg-white border-gray-300 hover:border-blue-300 hover:scale-[1.02]'
              }`}
              aria-label={`كارت ${card.text}`}
            >
              {card.matched || selectedCards.includes(`${card.id}-${index}`) ? (
                <div className="text-center">
                  <div className="text-2xl">{card.emoji}</div>
                  <div className="text-sm font-medium">{card.text}</div>
                </div>
              ) : (
                <div className="text-3xl">❓</div>
              )}
            </button>
          ))}
        </div>
        
        {allMatched && (
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-green-700">أحسنت!</h3>
            <p className="text-green-600">لقد أنهيت اللعبة بنجاح</p>
          </div>
        )}
      </div>
    );
  }

  // Pop the Word Game UI
  if (activeGame === 'pop') {
    return (
      <div className="space-y-4">
        {/* Game Header */}
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{popSession.score}</div>
              <div className="text-xs text-gray-500">النقاط</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{popSession.timeLeft}</div>
              <div className="text-xs text-gray-500">ثانية</div>
            </div>
          </div>
          
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            aria-label="إنهاء اللعبة"
          >
            <RotateCcw size={16} />
            إنهاء
          </button>
        </div>

        {/* Target Word */}
        <div className="text-center bg-yellow-100 rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">انقر على:</h3>
          <div className="text-3xl font-bold text-yellow-700">{popTarget}</div>
        </div>

        {/* Floating Words */}
        <div className="relative h-64 bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl overflow-hidden">
          {popWords.map((word, index) => (
            <button
              key={word.id}
              onClick={() => handlePopWordClick(word.text)}
              className="absolute bg-white border-2 border-blue-300 rounded-full px-4 py-2 shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 animate-bounce min-h-[44px]"
              style={{
                left: `${(index * 20) + 10}%`,
                top: `${(index * 30) + 20}%`,
                animationDelay: `${index * 0.5}s`,
                animationDuration: `${2 + index * 0.3}s`
              }}
              aria-label={`انقر كلمة ${word.text}`}
            >
              <div className="text-center">
                <div className="text-xl">{word.emoji}</div>
                <div className="text-sm font-medium">{word.text}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
};