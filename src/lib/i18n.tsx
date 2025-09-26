import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type Language = 'ar' | 'en';

type Dictionary = Record<string, string>;

const dicts: Record<Language, Dictionary> = {
  ar: {
    'nav.learning': 'التعلم التفاعلي',
    'nav.liveTranslate': 'الترجمة الحية',
    'nav.eyeTracking': 'تتبع العين',
    'nav.forum': 'المنتدى',
    'nav.emergency': 'الطوارئ',
    'nav.settings': 'الإعدادات',
    'common.startNow': 'ابدأ الآن',
    'placeholder.comingSoon': 'قريباً...',
    'actions.backHome': 'العودة إلى الصفحة الرئيسية',
    'pages.education.title': 'التعليم',
    'pages.education.desc': 'دروس تفاعلية ومواد شاملة لتعلّم لغة الإشارة.',
  },
  en: {
    'nav.learning': 'Interactive Learning',
    'nav.liveTranslate': 'Live Translation',
    'nav.eyeTracking': 'Eye Tracking',
    'nav.forum': 'Forum',
    'nav.emergency': 'Emergency',
    'nav.settings': 'Settings',
    'common.startNow': 'Start Now',
    'placeholder.comingSoon': 'Coming soon...',
    'actions.backHome': 'Back to Home',
    'pages.education.title': 'Education',
    'pages.education.desc': 'Interactive lessons and comprehensive materials to learn sign language',
  },
};

type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateText: (text: string) => Promise<string>;
  translateMany: (texts: string[]) => Promise<string[]>;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const LANG_KEY = 'auralink.lang';
const LANG_KEY_ALIAS = 'lang';

const cacheKey = (lang: Language, text: string) => `${lang}::${text}`;

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ar';
    try {
      const saved = (localStorage.getItem(LANG_KEY) as Language | null) ?? (localStorage.getItem(LANG_KEY_ALIAS) as Language | null);
      return saved ?? 'ar';
    } catch {
      return 'ar';
    }
  });

  const cacheRef = useRef(new Map<string, string>());

  const applyLanguageAttributes = useCallback((lang: Language) => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    html.lang = lang;
    html.dir = dir;
    if (document.body) {
      document.body.dir = dir;
    }
  }, []);

  useEffect(() => {
    applyLanguageAttributes(language);
  }, [language, applyLanguageAttributes]);

  const persistLanguage = useCallback((lang: Language) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LANG_KEY, lang);
      localStorage.setItem(LANG_KEY_ALIAS, lang);
    } catch {
      // ignore storage errors (e.g., private mode)
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState((current) => {
      if (current === lang) return current;
      persistLanguage(lang);
      applyLanguageAttributes(lang);
      return lang;
    });
  }, [persistLanguage, applyLanguageAttributes]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (event: StorageEvent) => {
      if (event.key === LANG_KEY || event.key === LANG_KEY_ALIAS) {
        const value = (event.newValue as Language | null) ?? 'ar';
        setLanguage(value);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [setLanguage]);

  const t = useCallback((key: string) => {
    const dict = dicts[language];
    if (dict && key in dict) return dict[key];
    const fallback = dicts.ar?.[key];
    return fallback ?? key;
  }, [language]);

  const translateMany = useCallback(async (texts: string[]): Promise<string[]> => {
    if (texts.length === 0) return [];
    if (language === 'ar') return texts;

    const results = new Array<string>(texts.length);
    const uncachedIndices: number[] = [];

    texts.forEach((text, index) => {
      const key = cacheKey(language, text);
      const cached = cacheRef.current.get(key);
      if (cached !== undefined) {
        results[index] = cached;
      } else {
        uncachedIndices.push(index);
      }
    });

    if (uncachedIndices.length > 0) {
      const payload = uncachedIndices.map((idx) => texts[idx]);
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: payload, target: language }),
        });
        if (response.ok) {
          const data = (await response.json()) as { translations?: string[] };
          const translated = Array.isArray(data.translations) ? data.translations : payload;
          uncachedIndices.forEach((idx, translatedIdx) => {
            const original = texts[idx];
            const result = translated[translatedIdx] ?? original;
            const key = cacheKey(language, original);
            cacheRef.current.set(key, result);
            results[idx] = result;
          });
        } else {
          uncachedIndices.forEach((idx) => {
            results[idx] = texts[idx];
          });
        }
      } catch {
        uncachedIndices.forEach((idx) => {
          results[idx] = texts[idx];
        });
      }
    }

    for (let i = 0; i < texts.length; i += 1) {
      if (!results[i]) {
        results[i] = texts[i];
      }
    }

    return results;
  }, [language]);

  const translateText = useCallback(async (text: string) => {
    const [result] = await translateMany([text]);
    return result ?? text;
  }, [translateMany]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    translateText,
    translateMany,
  }), [language, setLanguage, t, translateText, translateMany]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export type TranslationBundle<T extends Record<string, string>> = T;

export function useTranslationBundle<T extends Record<string, string>>(bundle: T): T {
  const { language, translateMany } = useI18n();
  const entries = useMemo(() => Object.entries(bundle), [bundle]);
  const [translated, setTranslated] = useState(bundle);

  useEffect(() => {
    if (language === 'ar') {
      setTranslated(bundle);
      return;
    }

    let cancelled = false;
    const run = async () => {
      const values = entries.map(([, value]) => value);
      const results = await translateMany(values);
      if (cancelled) return;
      const mapped = entries.reduce<Record<string, string>>((acc, [key], index) => {
        acc[key] = results[index] ?? bundle[key];
        return acc;
      }, {});
      setTranslated(mapped as T);
    };

    run().catch(() => {
      if (!cancelled) {
        setTranslated(bundle);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [language, translateMany, entries, bundle]);

  return language === 'ar' ? bundle : translated;
}

