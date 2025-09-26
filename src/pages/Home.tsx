import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Section } from '@/components/Section';
import { useTranslationBundle } from '@/lib/i18n';
import {
  MessageSquare,
  GraduationCap,
  Users,
  AlertTriangle,
  Zap,
  Hand,
  Volume2,
  Clock,
  Shield,
  Target,
  TrendingUp,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'الترجمة الصوتية الفورية',
    description:
      'حوّل الكلام إلى نص وإشارات في ثوانٍ مع خوارزميات دقيقة تدعم جميع أطراف المحادثة.',
    href: '/live-translate',
  },
  {
    icon: GraduationCap,
    title: 'تعلم تفاعلي للغة الإشارة',
    description:
      'دروس ومسارات تدريبية مصنفة حسب المستوى تساعدك على إتقان لغة الإشارة خطوة بخطوة.',
    href: '/learning/interactive-lessons',
  },
  {
    icon: Users,
    title: 'مجتمع داعم وفعّال',
    description:
      'انضم إلى متعلمين وخبراء يشاركون التجارب والنصائح ويعملون معاً لبناء تواصل شامل.',
    href: '/forum',
  },
  {
    icon: AlertTriangle,
    title: 'مركز الطوارئ',
    description:
      'احصل على قنوات مساعدة فورية وأدلة إرشادية للتعامل مع الحالات الحرجة بلغة الإشارة.',
    href: '/emergency',
  },
];

const steps = [
  {
    number: '01',
    title: 'أنشئ حساب Auralink الخاص بك',
    description:
      'قم بالتسجيل أو تسجيل الدخول لاستكشاف خدمات الترجمة المباشرة والمحتوى التعليمي الكامل.',
  },
  {
    number: '02',
    title: 'خصّص تجربتك بحسب احتياجاتك',
    description:
      'اختر بين الترجمة الحية، الدروس التفاعلية، تتبع العين أو أدوات المجتمع، وكلها متاحة في لوحة واحدة.',
  },
  {
    number: '03',
    title: 'ابدأ التواصل بثقة',
    description:
      'استفد من الواجهة السهلة والموارد الفورية لتقديم تجربة مترجم محترفة في أي ظرف.',
  },
];

const whyPoints = [
  { icon: Zap, text: 'منصة شاملة تجمع الترجمة، التدريب، وأدوات المجتمع في مكان واحد.' },
  { icon: Clock, text: 'تجربة سريعة تعمل مباشرة من المتصفح دون الحاجة إلى تثبيت إضافات.' },
  { icon: Target, text: 'واجهات قابلة للتخصيص تدعم احتياجات الوصول المختلفة.' },
  { icon: Shield, text: 'دعم فني ومجتمعي مستمر لضمان استمرارية التعلم.' },
];

const stats = [
  { label: 'متوسط زمن الاستجابة للترجمة', value: 'أقل من 0.5 ثانية' },
  { label: 'نسبة دقة نظام الترجمة', value: '95%' },
  { label: 'عدد المسارات التعليمية المتاحة', value: '12 مساراً' },
  { label: 'عدد المستخدمين المستفيدين', value: '50,000+' },
];

const faqs = [
  {
    question: 'كيف تساعد Auralink في الترجمة الفورية؟',
    answer:
      'يوفر محرك الترجمة الحية تحويل الصوت إلى نص وإشارات مع اقتراحات ذكية لضمان دقة أعلى أثناء الحوار.',
  },
  {
    question: 'هل المنصة مناسبة للمدارس والمؤسسات؟',
    answer:
      'نعم، تدعم Auralink تكامل المناهج وإدارة المتعلمين مع خيارات تخصيص تلائم المعلمين والجهات الرسمية.',
  },
  {
    question: 'هل أحتاج خبرة مسبقة في لغة الإشارة لاستخدام المنصة؟',
    answer:
      'لا، تبدأ الرحلة بدروس مصورة وتمارين تفاعلية للمبتدئين وتتابع تقدمك حتى الوصول إلى مستويات متقدمة.',
  },
  {
    question: 'كيف أتابع آخر التحديثات والميزات؟',
    answer:
      'انضم إلى المنتدى أو فعّل الإشعارات البريدية لتصلك تحديثات أسبوعية حول التحسينات والموارد الجديدة.',
  },
];

export function Home() {
  const featureBundle = useMemo(() => {
    const bundle: Record<string, string> = {};
    features.forEach((feature, idx) => {
      bundle[`feature-${idx}-title`] = feature.title;
      bundle[`feature-${idx}-description`] = feature.description;
    });
    return bundle;
  }, []);
  const featureTexts = useTranslationBundle(featureBundle);
  const translatedFeatures = useMemo(() => (
    features.map((feature, idx) => ({
      ...feature,
      title: featureTexts[`feature-${idx}-title`],
      description: featureTexts[`feature-${idx}-description`],
    }))
  ), [featureTexts]);

  const stepBundle = useMemo(() => {
    const bundle: Record<string, string> = {};
    steps.forEach((step, idx) => {
      bundle[`step-${idx}-title`] = step.title;
      bundle[`step-${idx}-description`] = step.description;
    });
    return bundle;
  }, []);
  const stepTexts = useTranslationBundle(stepBundle);
  const translatedSteps = useMemo(() => (
    steps.map((step, idx) => ({
      ...step,
      title: stepTexts[`step-${idx}-title`],
      description: stepTexts[`step-${idx}-description`],
    }))
  ), [stepTexts]);

  const whyBundle = useMemo(() => {
    const bundle: Record<string, string> = {};
    whyPoints.forEach((point, idx) => {
      bundle[`why-${idx}`] = point.text;
    });
    return bundle;
  }, []);
  const whyTexts = useTranslationBundle(whyBundle);
  const translatedWhyPoints = useMemo(() => (
    whyPoints.map((point, idx) => ({
      ...point,
      text: whyTexts[`why-${idx}`],
    }))
  ), [whyTexts]);

  const statsBundle = useMemo(() => {
    const bundle: Record<string, string> = {};
    stats.forEach((stat, idx) => {
      bundle[`stat-${idx}-label`] = stat.label;
      bundle[`stat-${idx}-value`] = stat.value;
    });
    return bundle;
  }, []);
  const statsTexts = useTranslationBundle(statsBundle);
  const translatedStats = useMemo(() => (
    stats.map((stat, idx) => ({
      ...stat,
      label: statsTexts[`stat-${idx}-label`],
      value: statsTexts[`stat-${idx}-value`],
    }))
  ), [statsTexts]);

  const faqBundle = useMemo(() => {
    const bundle: Record<string, string> = {};
    faqs.forEach((faq, idx) => {
      bundle[`faq-${idx}-question`] = faq.question;
      bundle[`faq-${idx}-answer`] = faq.answer;
    });
    return bundle;
  }, []);
  const faqTexts = useTranslationBundle(faqBundle);
  const translatedFaqs = useMemo(() => (
    faqs.map((faq, idx) => ({
      question: faqTexts[`faq-${idx}-question`],
      answer: faqTexts[`faq-${idx}-answer`],
    }))
  ), [faqTexts]);

  const pageTextsBundle = useMemo(() => ({
    heroHeading: 'تواصل بثقة مع مترجم لغة الإشارة المدعوم بالذكاء الاصطناعي:',
    heroHighlight: 'Auralink تجمع بين الصوت، النص، والإشارة',
    heroParagraph:
      'توفر Auralink مجموعة متكاملة من أدوات الترجمة والتعلم لدعم الأفراد والمؤسسات في بناء تجارب تواصل شاملة وسهلة الاستخدام.',
    heroPrimaryCta: 'ابدأ الترجمة الآن',
    heroSecondaryCta: 'استكشف البرامج التعليمية',
    heroBadge: 'جلسة مباشرة',
    heroBadgeStatus: 'جارٍ البث',
    heroCardBody: 'النظام يحوّل الكلام إلى لغة إشارة ويقترح ردوداً نصية فورية.',
    heroCardPrompt: 'رسالة مترجمة الآن:',
    heroCardQuote: '"شكراً لانضمامك إلينا اليوم، نحن هنا لأي مساعدة!"',
    featuresTitle: 'مزايا Auralink الأساسية',
    featuresSubtitle:
      'كل ما تحتاجه للترجمة الفورية، التدريب التفاعلي، وبناء مجتمع متعاون في مكان واحد.',
    featuresLink: 'تعرف على المزيد',
    stepsTitle: 'كيف تعمل المنصة؟',
    stepsSubtitle: 'ابدأ خلال دقائق مع خطوات إعداد بسيطة وواضحة.',
    whyHeading: 'لماذا يثق المستخدمون بـ Auralink؟',
    statsTitle: 'أرقام تبرز قيمة المنصة',
    statsFooter: 'تعتمد هذه الإحصاءات على آخر قياسات الأداء والتفاعل.',
    ctaHeading: 'ابدأ رحلتك مع لغة الإشارة اليوم',
    ctaText:
      'سواء كنت متعلماً جديداً أو محترفاً يدعم الآخرين، تمنحك Auralink الأدوات اللازمة لتجربة تواصل أكثر شمولاً للجميع.',
    ctaButton: 'ابدأ مغامرتك الآن',
    faqHeading: 'الأسئلة الشائعة',
    faqSubtitle: 'إجابات سريعة عن أكثر التساؤلات التي تصلنا من مجتمع المستخدمين.',
  }), []);
  const pageTexts = useTranslationBundle(pageTextsBundle);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Section className="pt-8 md:pt-16 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent dark:from-dark-900 dark:via-dark-800 dark:to-transparent">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 dark:text-white leading-tight">
                {pageTexts.heroHeading}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-accent block">
                  {pageTexts.heroHighlight}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                {pageTexts.heroParagraph}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 rounded-2xl"
              >
                <Link to="/live-translate" className="flex items-center gap-2">
                  {pageTexts.heroPrimaryCta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-2xl border-2 hover:bg-gray-50"
              >
                <Link to="/learning/interactive-lessons" className="flex items-center gap-2">
                  {pageTexts.heroSecondaryCta}
                  <GraduationCap className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Illustration Card */}
          <div className="lg:flex justify-center">
            <Card className="w-full max-w-md bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="rounded-full">
                      {pageTexts.heroBadge}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-500">{pageTexts.heroBadgeStatus}</span>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                      <Hand className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{pageTexts.heroCardBody}</p>
                  </div>

                  {/* Waveform mockup */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-t from-primary to-accent rounded-full animate-pulse"
                          style={{
                            width: '4px',
                            height: `${Math.random() * 32 + 8}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">{pageTexts.heroCardPrompt}</p>
                      <p className="font-medium">{pageTexts.heroCardQuote}</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Volume2 className="w-6 h-6 text-accent animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Key Features */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-4">
            {pageTexts.featuresTitle}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {pageTexts.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {translatedFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.href}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-dark-800 rounded-2xl overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-dark-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                    <Link
                      to={feature.href}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      {pageTexts.featuresLink}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* How It Works */}
      <Section className="bg-gray-50 dark:bg-dark-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-4">
            {pageTexts.stepsTitle}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {pageTexts.stepsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {translatedSteps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="text-center space-y-6">
                <div className="relative">
                  <Badge
                    variant="secondary"
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-primary to-accent text-white border-0"
                  >
                    {step.number}
                  </Badge>
                  {index < translatedSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 right-0 transform translate-x-full">
                      <ArrowRight className="w-8 h-8 text-gray-300 translate-x-8" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-dark-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Why Auralink */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-6">
                {pageTexts.whyHeading}
              </h2>
              <div className="space-y-4">
                {translatedWhyPoints.map((point, index) => {
                  const Icon = point.icon;
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-lg text-gray-700">{point.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <Card className="bg-white dark:bg-dark-800 border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-6 text-center">
                  {pageTexts.statsTitle}
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {translatedStats.map((stat, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className="text-2xl font-bold text-primary">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    {pageTexts.statsFooter}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primary to-accent text-white">
        <div className="text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            {pageTexts.ctaHeading}
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            {pageTexts.ctaText}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white dark:bg-dark-800 text-primary hover:bg-gray-50 text-lg px-8 py-6 rounded-2xl"
          >
            <Link to="/live-translate" className="flex items-center gap-2">
              {pageTexts.ctaButton}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-4">
              {pageTexts.faqHeading}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {pageTexts.faqSubtitle}
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {translatedFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white dark:bg-dark-800 border border-gray-200 rounded-2xl px-6 data-[state=open]:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="text-right hover:no-underline py-6">
                  <span className="text-lg font-medium text-dark-900 dark:text-white">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>
    </div>
  );
}
