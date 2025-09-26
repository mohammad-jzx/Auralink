import { useTranslationBundle } from '@/lib/i18n';
import { GraduationCap } from 'lucide-react';
import { PlaceholderPage } from './PlaceholderPage';

const baseTexts = {
  title: 'التعليم',
  description:
    'دروس تفاعلية ومواد تعليمية منظمة لتعلّم لغة الإشارة وصقل مهارات التواصل خطوة بخطوة.',
};

export function Education() {
  const texts = useTranslationBundle(baseTexts);

  return (
    <PlaceholderPage
      title={texts.title}
      icon={GraduationCap}
      description={texts.description}
    />
  );
}
