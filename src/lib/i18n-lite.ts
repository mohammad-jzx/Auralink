import { useSyncExternalStore } from 'react';

export type Lang = 'ar' | 'en';

let currentLang: Lang = 'ar';
const listeners = new Set<() => void>();

function notify() { listeners.forEach((l) => l()); }

export function getLang(): Lang { return currentLang; }

export function setLang(l: Lang) {
  if (currentLang === l) return;
  currentLang = l;
  try { localStorage.setItem('lang', l); } catch {}
  applyDir(l);
  notify();
}

export function useLang(): Lang {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => currentLang,
    () => currentLang
  );
}

export function applyDir(lang: Lang) {
  const html = document.documentElement;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  html.lang = lang;
}

export async function tAuto(text: string): Promise<string> {
  if (getLang() === 'ar') return text;
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, target: 'en' }),
    });
    const data = await res.json();
    return data.translations?.[0] ?? text;
  } catch {
    return text;
  }
}

export async function tBulk(texts: string[]): Promise<string[]> {
  if (getLang() === 'ar') return texts;
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: texts, target: 'en' }),
    });
    const data = await res.json();
    const out = data.translations as string[] | undefined;
    return Array.isArray(out) ? out : texts;
  } catch {
    return texts;
  }
}

// initialize from localStorage at import time
(() => {
  try {
    const saved = (localStorage.getItem('lang') as Lang | null) ?? 'ar';
    currentLang = saved;
    applyDir(saved);
  } catch {}
})();















