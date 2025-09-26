import * as React from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: 'light' | 'dark';
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

const STORAGE_KEYS = ['auralink.theme', 'theme'] as const;

function resolveStoredTheme(defaultTheme: 'light' | 'dark', enableSystem: boolean): 'light' | 'dark' {
  if (typeof window === 'undefined') return defaultTheme;
  for (const key of STORAGE_KEYS) {
    try {
      const value = localStorage.getItem(key);
      if (value === 'dark' || value === 'light') {
        return value;
      }
    } catch {
      /* ignore storage read errors */
    }
  }
  if (enableSystem && typeof window.matchMedia === 'function') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) return 'dark';
  }
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  return defaultTheme;
}

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'light',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => resolveStoredTheme(defaultTheme, enableSystem));

  const applyTheme = React.useCallback((value: 'light' | 'dark') => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (value === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    if (attribute !== 'class') {
      root.setAttribute(attribute, value);
    }
    try {
      for (const key of STORAGE_KEYS) {
        localStorage.setItem(key, value);
      }
    } catch {
      /* ignore storage write errors */
    }
  }, [attribute]);

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleStorage = () => {
      setTheme((current) => {
        const next = resolveStoredTheme(defaultTheme, enableSystem);
        return next === current ? current : next;
      });
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('auralink:theme', handleStorage as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auralink:theme', handleStorage as EventListener);
    };
  }, [defaultTheme, enableSystem]);

  return (
    <div data-theme={theme} className="contents">
      {children}
    </div>
  );
}
