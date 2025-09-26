import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/lib/i18n';
import { triggerEmergencyForUser } from '@/lib/triggerEmergency';
import {
    AlertTriangle,
    Eye,
    GraduationCap,
    Menu,
    MessageSquare,
    Settings,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

type NavItem = {
  href: string;
  icon: typeof GraduationCap;
  labelKey: keyof typeof NAV_KEYS;
};

const NAV_KEYS = {
  learning: 'nav.learning',
  liveTranslate: 'nav.liveTranslate',
  eyeTracking: 'nav.eyeTracking',
  forum: 'nav.forum',
  emergency: 'nav.emergency',
  settings: 'nav.settings',
} as const;

const navItems: NavItem[] = [
  { href: '/live-translate', labelKey: 'liveTranslate', icon: MessageSquare },
  { href: '/eye-tracking', labelKey: 'eyeTracking', icon: Eye },
  { href: '/learning', labelKey: 'learning', icon: GraduationCap },
  { href: '/forum', labelKey: 'forum', icon: Users },
  { href: '/settings', labelKey: 'settings', icon: Settings },
];

// Emergency button component
function EmergencyButton() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'cooldown'|'fail'>('idle');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    (async () => {
      // لم نعد بحاجة لجلب chatId هنا لأن الدالة الموحدة ستتحقق منه
    })();
  }, [user?.uid]);

  const onSend = async () => {
    setStatus('sending');
    if (!user?.uid) {
      setStatus('fail');
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
      return;
    }
    const res = await triggerEmergencyForUser({
      uid: user.uid,
      displayName: user.displayName,
      fallbackNote: 'تنبيه طوارئ من شريط التنقل.',
    });
    setStatus(res.ok ? 'ok' : 'fail');
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 3000);
  };

  return (
    <div className="relative">
      <button
        onClick={onSend}
        disabled={status === 'sending'}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <AlertTriangle className="w-4 h-4" />
        {status === 'sending' ? 'جارٍ الإرسال...' : '🚨 طوارئ'}
      </button>
      
      {showStatus && (
        <div className="absolute top-full right-0 mt-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap z-50">
          {status === 'ok' && (
            <div className="bg-green-100 text-green-800 border border-green-200">
              تم الإرسال ✅
            </div>
          )}
          {status === 'cooldown' && (
            <div className="bg-yellow-100 text-yellow-800 border border-yellow-200">
              انتظر قليلًا ⏳
            </div>
          )}
          {status === 'fail' && (
            <div className="bg-red-100 text-red-800 border border-red-200">
              تعذّر الإرسال أو لا يوجد Chat ID
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, language } = useI18n();

  const menuLabel = language === 'ar' ? '???????' : 'Menu';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-dark-800/90 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 ${
                    isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t(NAV_KEYS[item.labelKey])}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <EmergencyButton />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
            aria-label={menuLabel}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white dark:bg-dark-800">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-dark-700/70'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {t(NAV_KEYS[item.labelKey])}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700 space-y-3">
              <EmergencyButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
