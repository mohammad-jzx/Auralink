import { Navigate, Route, Routes } from 'react-router-dom';
import { Providers } from './components/providers';
import './globals.css';

// Import all learning pages
import AdminSeedPage from './admin/seed/page';
import ChallengePage from './learning/challenge/page';
import DailyPage from './learning/daily/page';
import DictionaryPage from './learning/dictionary/page';
import InteractiveLessonPage from './learning/interactive-lessons/[lessonId]/page';
import InteractiveLessonsPage from './learning/interactive-lessons/page';
import KidsModePage from './learning/kids-mode/page';
import LearningPage from './learning/page';

function LearningApp() {
  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20 dark:from-dark-900 dark:via-dark-900 dark:to-dark-800">
        <Routes>
          <Route path="/" element={<LearningPage />} />
          <Route path="challenge" element={<ChallengePage />} />
          <Route path="daily" element={<DailyPage />} />
          <Route path="dictionary" element={<DictionaryPage />} />
          <Route path="interactive-lessons" element={<InteractiveLessonsPage />} />
          <Route path="interactive-lessons/:lessonId" element={<InteractiveLessonPage />} />
          <Route path="kids-mode" element={<KidsModePage />} />
          <Route path="admin/seed" element={<AdminSeedPage />} />
          {/* Redirect old routes */}
          <Route path="*" element={<Navigate to="/learning" replace />} />
        </Routes>
      </div>
    </Providers>
  );
}

export default LearningApp;
