import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslationBundle } from '@/lib/i18n';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export function PlaceholderPage({ title, icon: Icon, description }: PlaceholderPageProps) {
  const staticBundle = useMemo(() => ({
    coming: 'قريباً...',
    back: 'العودة إلى الصفحة الرئيسية',
  }), []);
  const staticTexts = useTranslationBundle(staticBundle);

  const dynamicBundle = useMemo(() => ({
    title,
    description: description ?? '',
  }), [title, description]);
  const dynamicTexts = useTranslationBundle(dynamicBundle);

  const resolvedDescription = description ? dynamicTexts.description : undefined;

  return (
    <Section className="py-32">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="border border-blue-100 dark:border-dark-700 shadow-xl rounded-2xl bg-white dark:bg-dark-800">
          <CardContent className="p-12 space-y-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <Icon className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-dark-900 dark:text-white">
                {dynamicTexts.title}
              </h1>
              
              {resolvedDescription && (
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {resolvedDescription}
                </p>
              )}
              
              <div className="py-4">
                <p className="text-2xl font-medium text-gray-400 dark:text-gray-500">
                  {staticTexts.coming}
                </p>
              </div>
            </div>

            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 rounded-2xl">
              <Link to="/" className="flex items-center gap-2">
                {staticTexts.back}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
