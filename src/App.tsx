import { I18nProvider } from '@/lib/i18n';
import { lazy, Suspense } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Layout } from './components/Layout';
import LearningApp from './learning/App';
import { Education } from './pages/Education';
import { Emergency } from './pages/Emergency';
import { Forum } from './pages/Forum';
import { Home } from './pages/Home';
import { LiveTranslate } from './pages/LiveTranslate';
import { Settings } from './pages/Settings';
import { WebGazer } from './pages/WebGazer';
const TextToVedioApp = lazy(() => import('@/texttovedio/AppHost'));

function App() {
  return (
    <Router>
      <I18nProvider>
        <div className="rtl">
          <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="education" element={<Education />} />
            <Route path="live-translate" element={<LiveTranslate />} />
            <Route path="eye-tracking" element={<WebGazer />} />
            <Route path="webgazer" element={<WebGazer />} />
            <Route
              path="texttovedio"
              element={
                <Suspense fallback={<div style={{ padding: 16 }}>\u2026\u062c\u0627\u0631\u064a \u062a\u062d\u0645\u064a\u0644 Text to Vedio</div>}>
                  <TextToVedioApp />
                </Suspense>
              }
            />
            <Route path="forum" element={<Forum />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/learning/*" element={
            <div className="min-h-screen flex flex-col bg-light text-gray-900 dark:bg-dark-900 dark:text-gray-100">
              <Header />
              <main className="flex-1">
                <LearningApp />
              </main>
            </div>
          } />
          {/* Redirect old learning routes */}
          <Route path="/interactive-lessons" element={<Navigate to="/learning/interactive-lessons" replace />} />
          <Route path="/interactive-lessons/*" element={<Navigate to="/learning/interactive-lessons" replace />} />
          <Route path="/challenge" element={<Navigate to="/learning/challenge" replace />} />
          <Route path="/dictionary" element={<Navigate to="/learning/dictionary" replace />} />
          </Routes>
        </div>
      </I18nProvider>
    </Router>
  );
}

export default App;



