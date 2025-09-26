import React, { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  Download, 
  Settings, 
  Shield, 
  TrendingUp,
  Award,
  BookOpen,
  Gamepad2
} from 'lucide-react';
import { ProgressRing } from './ui/ProgressRing';
import { useKids } from '../context/KidsContext';
import { useToast } from './ui/Toast';

export const ParentPanel: React.FC = () => {
  const [dailyLimit, setDailyLimit] = useState(30);
  const [schoolMode, setSchoolMode] = useState(false);
  const { state } = useKids();
  const { showToast } = useToast();

  const handleExportData = () => {
    const exportData = {
      profile: state.data.profile,
      progress: state.data.progress,
      exportDate: new Date().toISOString(),
      learnedWords: state.data.dictionary.filter(word => 
        state.data.progress.learnedWordIds.includes(word.id)
      )
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `تقرير_${state.data.profile.name}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('تم تحميل التقرير بنجاح', 'success');
  };

  const totalMinutesThisWeek = state.data.progress.weeklyMinutes.reduce((sum, minutes) => sum + minutes, 0);
  const averageDaily = Math.round(totalMinutesThisWeek / 7);
  const learnedWordsCount = state.data.progress.learnedWordIds.length;
  const totalGamesPlayed = state.data.progress.games.reduce((sum, game) => sum + game.plays, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">لوحة وليّ الأمر</h2>
        <p className="text-gray-600">متابعة تقدم {state.data.profile.name}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white text-center">
          <Award className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{state.data.profile.points}</div>
          <div className="text-blue-100 text-sm">النقاط الكلية</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{learnedWordsCount}</div>
          <div className="text-green-100 text-sm">كلمة تعلمها</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white text-center">
          <Gamepad2 className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{totalGamesPlayed}</div>
          <div className="text-purple-100 text-sm">مرة لعب</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{state.data.profile.streak}</div>
          <div className="text-orange-100 text-sm">يوم متتالي</div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 size={20} />
          النشاط الأسبوعي (دقائق)
        </h3>
        
        <div className="flex items-end justify-between gap-2 h-32 mb-4">
          {state.data.progress.weeklyMinutes.map((minutes, index) => {
            const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
            const height = (minutes / Math.max(...state.data.progress.weeklyMinutes)) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs text-gray-600">{minutes}</div>
                <div 
                  className="w-full bg-blue-500 rounded-t transition-all duration-500 min-h-[4px]"
                  style={{ height: `${height || 5}%` }}
                />
                <div className="text-xs text-gray-500 text-center">
                  {dayNames[index]}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{totalMinutesThisWeek}</div>
            <div className="text-sm text-gray-600">دقائق هذا الأسبوع</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{averageDaily}</div>
            <div className="text-sm text-gray-600">متوسط يومي</div>
          </div>
        </div>
      </div>

      {/* Games Performance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-lg font-bold text-gray-900 mb-4">أداء الألعاب</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {state.data.progress.games.map((game) => (
            <div key={game.id} className="text-center">
              <ProgressRing
                progress={(game.bestScore / 100) * 100}
                size={120}
                color={game.id === 'match' ? '#3B82F6' : '#10B981'}
                className="mb-3"
              >
                <div className="text-center">
                  <div className="text-xl font-bold">{game.bestScore}</div>
                  <div className="text-xs text-gray-500">أفضل نتيجة</div>
                </div>
              </ProgressRing>
              
              <h4 className="font-medium text-gray-900">
                {game.id === 'match' ? 'مطابقة الكلمات' : 'انقر الكلمة'}
              </h4>
              <p className="text-sm text-gray-600">{game.plays} مرة لعب</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Settings size={20} />
          إعدادات الاستخدام
        </h3>

        {/* Daily Time Limit */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock size={16} />
            الحد الأقصى للاستخدام اليومي (دقائق)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="flex-1"
            />
            <div className="text-lg font-bold text-blue-600 w-12 text-center">
              {dailyLimit}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            سيتم تذكير الطفل عند الوصول للحد المحدد
          </p>
        </div>

        {/* School Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} />
            <div>
              <div className="font-medium text-gray-900">وضع المدرسة</div>
              <div className="text-sm text-gray-600">يعطّل الألعاب ويركز على التعلم</div>
            </div>
          </div>
          <button
            onClick={() => setSchoolMode(!schoolMode)}
            className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              schoolMode ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            aria-label={schoolMode ? 'إيقاف وضع المدرسة' : 'تفعيل وضع المدرسة'}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              schoolMode ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>

      {/* Export Data */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">تحميل التقرير</h3>
        <p className="text-gray-600 mb-4">
          احصل على تقرير شامل عن تقدم طفلك
        </p>
        <button
          onClick={handleExportData}
          className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors min-h-[44px]"
        >
          <Download size={20} />
          تحميل تقرير JSON
        </button>
      </div>
    </div>
  );
};