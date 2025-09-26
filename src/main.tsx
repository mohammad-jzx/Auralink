import { AuthProvider } from '@/contexts/AuthContext';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize theme before React renders
(() => {
  try {
    const stored = localStorage.getItem('theme') || localStorage.getItem('auralink.theme');
    const isDark = stored === 'dark';
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } catch {
    // no-op
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
