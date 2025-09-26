import { useTranslationBundle } from '@/lib/i18n';
import { Users } from 'lucide-react';
import { PlaceholderPage } from './PlaceholderPage';

const forumTexts = {
  title: 'المنتدى',
  description: 'انضم إلى مجتمع داعم من المتعلمين والخبراء في لغة الإشارة',
};

export function Forum() {
  const texts = useTranslationBundle(forumTexts);

  return (
    <PlaceholderPage 
      title={texts.title}
      icon={Users}
      description={texts.description}
    />
  );
}