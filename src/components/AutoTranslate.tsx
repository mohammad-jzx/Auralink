import { useTranslationBundle } from '@/lib/i18n';
import { useMemo } from 'react';

interface AutoTranslateProps {
  text: string;
}

export function AutoTranslate({ text }: AutoTranslateProps) {
  const bundle = useMemo(() => ({ value: text }), [text]);
  const translated = useTranslationBundle(bundle);
  return <>{translated.value}</>;
}
