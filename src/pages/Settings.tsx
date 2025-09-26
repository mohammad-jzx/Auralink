import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { emailSignIn, emailSignUp, googleSignIn, googleSignOut } from '@/lib/firebase';
import { useI18n, useTranslationBundle } from '@/lib/i18n';
import { logoutBackendSession, sendIdTokenToBackend } from '@/lib/session';
import { triggerEmergencyForUser } from '@/lib/triggerEmergency';
import { getGuardianChatId, setGuardianChatId } from '@/lib/userProfile';
import { Globe, Settings as SettingsIcon, SunMedium, Type } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type AppLanguage = 'ar' | 'en';

const THEME_KEY = 'auralink.theme';
const FONT_KEY = 'auralink.fontScale';
const TRANSLATION_API_KEY = 'auralink.translationApi';

const baseTexts = {
  pageHeading: 'الإعدادات',
  appearanceTitle: 'المظهر',
  appearanceDesc: 'تحكّم في تشغيل أو إيقاف الوضع الداكن لواجهة المنصة.',
  darkModeTitle: 'الوضع الداكن',
  darkModeDesc: 'فعّل أو عطّل الوضع الليلي لتجربة مريحة في الإضاءة المنخفضة.',
  darkModeAria: 'تبديل الوضع الداكن',
  langTitle: 'اللغة',
  langDesc: 'اختر لغة واجهة الاستخدام المفضلة لديك.',
  languageHeading: 'لغة التطبيق',
  languageDesc: 'حدد اللغة التي تود أن تظهر بها عناصر الواجهة.',
  languagePlaceholder: 'اختر اللغة',
  languageArabic: 'العربية',
  fontTitle: 'حجم الخط',
  fontDesc: 'اضبط حجم الخط ليناسب تفضيلاتك وراحة القراءة.',
  fontDescPrefix: 'الحجم الحالي:',
  translateTitle: 'إعدادات واجهة الترجمة',
  translateDesc: 'يتم حفظ بيانات واجهة الترجمة في التخزين المحلي عند توفرها.',
  translateBodyPrefix: 'يُحفظ المفتاح في التخزين المحلي تحت المعرّف',
  translateBodySuffix: 'للحفاظ على تفعيل خدمة الترجمة أثناء الجلسات.',
};

export function Settings() {
  const { language, setLanguage } = useI18n();
  const texts = useTranslationBundle(baseTexts);
  const { user, loading } = useAuth();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('theme') || localStorage.getItem(THEME_KEY);
      return savedTheme ? savedTheme === 'dark' : false;
    } catch {
      return false;
    }
  });

  const [fontScale, setFontScale] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(FONT_KEY);
      return saved ? Number(saved) : 100;
    } catch {
      return 100;
    }
  });

  const fontScaleLabel = useMemo(() => `${fontScale}%`, [fontScale]);

  useEffect(() => {
    const value = isDarkMode ? 'dark' : 'light';
    try {
      localStorage.setItem('theme', value);
      localStorage.setItem(THEME_KEY, value);
    } catch {
      // ignore storage write errors
    }
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.dispatchEvent(new CustomEvent('auralink:theme', { detail: { theme: value } }));
  }, [isDarkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(FONT_KEY, String(fontScale));
    } catch {
      // ignore storage write errors
    }
    const root = document.documentElement;
    root.style.fontSize = `${fontScale}%`;
  }, [fontScale]);

  useEffect(() => {
    (async () => {
      try {
        const existing = localStorage.getItem(TRANSLATION_API_KEY);
        if (existing) return;
        const res = await fetch('/translation-api.json');
        if (!res.ok) return;
        const data = await res.json();
        localStorage.setItem(TRANSLATION_API_KEY, JSON.stringify(data));
      } catch {
        // ignore fetch errors
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 dark:from-dark-900 dark:to-dark-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 bg-primary-500 rounded-full shadow-lg text-white">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{texts.pageHeading}</h1>
        </div>

        <div className="mb-6">
          {loading ? null : (
            <div className="flex items-center justify-between bg-white/90 dark:bg-dark-800/80 border border-blue-100 dark:border-dark-700 rounded-xl p-4">
              {user ? (
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName ?? 'User'} className="w-10 h-10 rounded-full" />
                  ) : null}
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{user.displayName ?? user.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">مسجل عبر Google</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300">لست مسجلاً الدخول</p>
              )}

              {user ? (
                <button
                  onClick={async () => {
                    await logoutBackendSession();
                    await googleSignOut();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  تسجيل الخروج
                </button>
              ) : (
                <button
                  onClick={async () => {
                    await googleSignIn();
                    await sendIdTokenToBackend();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  تسجيل الدخول باستخدام Google
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white/90 dark:bg-dark-800/80 border border-blue-100 dark:border-dark-700">
            <CardHeader>
              <CardTitle className="text-right">{texts.appearanceTitle}</CardTitle>
              <CardDescription className="text-right">{texts.appearanceDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300">
                    <SunMedium className="w-5 h-5" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{texts.darkModeTitle}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{texts.darkModeDesc}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                    aria-label={texts.darkModeAria}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-dark-800/80 border border-blue-100 dark:border-dark-700">
            <CardHeader>
              <CardTitle className="text-right">{texts.langTitle}</CardTitle>
              <CardDescription className="text-right">{texts.langDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{texts.languageHeading}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{texts.languageDesc}</p>
                  </div>
                </div>
                <div className="min-w-[180px] flex-shrink-0">
                  <Select value={language} onValueChange={(value) => setLanguage(value as AppLanguage)}>
                    <SelectTrigger className="text-right" aria-label={texts.langTitle}>
                      <SelectValue placeholder={texts.languagePlaceholder} />
                    </SelectTrigger>
                    <SelectContent align="end" className="text-right">
                      <SelectItem value="ar">{texts.languageArabic}</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email/Password Auth Tabs */}
          <Card className="bg-white/90 dark:bg-dark-800/80 border border-blue-100 dark:border-dark-700">
            <CardHeader>
              <CardTitle className="text-right">الدخول عبر البريد</CardTitle>
              <CardDescription className="text-right">إنشاء حساب أو تسجيل الدخول باستخدام البريد الإلكتروني</CardDescription>
            </CardHeader>
            <CardContent>
              {!user && (
                <div className="mb-4 flex items-center justify-center">
                  <button
                    onClick={async () => {
                      await googleSignIn();
                      await sendIdTokenToBackend();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    تسجيل الدخول باستخدام Google
                  </button>
                </div>
              )}
              <Tabs defaultValue="signup" className="w-full">
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger value="signup">إنشاء حساب بالبريد</TabsTrigger>
                  <TabsTrigger value="login">تسجيل الدخول بالبريد</TabsTrigger>
                </TabsList>

                <TabsContent value="signup">
                  <EmailSignUpForm />
                </TabsContent>
                <TabsContent value="login">
                  <EmailSignInForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-dark-800/80 border border-blue-100 dark:border-dark-700">
            <CardHeader>
              <CardTitle className="text-right">{texts.fontTitle}</CardTitle>
              <CardDescription className="text-right">{texts.fontDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300">
                    <Type className="w-5 h-5" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{texts.fontTitle}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {texts.fontDescPrefix} {fontScaleLabel}
                    </p>
                  </div>
                </div>
                <div className="flex-1 max-w-sm flex-shrink-0">
                  <Slider
                    value={[fontScale]}
                    onValueChange={(v) => setFontScale(v[0])}
                    min={80}
                    max={140}
                    step={5}
                    aria-label={texts.fontTitle}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-dark-800/80 border border-blue-100 dark:border-dark-700">
            <CardHeader>
              <CardTitle className="text-right">{texts.translateTitle}</CardTitle>
              <CardDescription className="text-right">{texts.translateDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-right">
                {texts.translateBodyPrefix}{' '}
                <code className="mx-1">{TRANSLATION_API_KEY}</code>{' '}
                {texts.translateBodySuffix}
              </p>
            </CardContent>
          </Card>

          {/* Emergency settings: Telegram Chat ID */}
          <Card className="bg-white/90 dark:bg-dark-800/80 border border-blue-100 dark:border-dark-700">
            <CardHeader>
              <CardTitle className="text-right">إعدادات الطوارئ (Telegram)</CardTitle>
              <CardDescription className="text-right">احفظ Chat ID لوليّ الأمر لتفعيل زر الطوارئ</CardDescription>
            </CardHeader>
            <CardContent>
              <TelegramSettingsBlock />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function TelegramSettingsBlock() {
  const { user } = useAuth();
  const [chatId, setChatId] = useState("");

  const [saveMsg, setSaveMsg] = useState<string|null>(null);
  const [saveErr, setSaveErr] = useState<string|null>(null);
  const [saving, setSaving] = useState(false);

  const [testMsg, setTestMsg] = useState<string|null>(null);
  const [testErr, setTestErr] = useState<string|null>(null);
  const [testing, setTesting] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        if (user?.uid) {
          const saved = await getGuardianChatId(user.uid);
          if (mounted.current && saved) setChatId(String(saved));
        }
      } catch (e:any) {
        if (mounted.current) setSaveErr(e?.message || "تعذّر التحميل");
      }
    })();
    return () => { mounted.current = false; };
  }, [user?.uid]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMsg(null); setSaveErr(null); setSaving(true);
    try {
      if (!navigator.onLine) throw new Error("لا يوجد اتصال بالإنترنت.");
      if (!user?.uid) throw new Error("سجّل الدخول أولًا.");

      const v = chatId.trim();
      if (!v) throw new Error("أدخل Telegram Chat ID.");

      console.log("[Save chatId] start", { uid: user.uid, chatId: v });

      // 1) حفظ
      await setGuardianChatId(user.uid, v);

      // 2) تأكيد القراءة مباشرة بعد الحفظ
      const confirmed = await getGuardianChatId(user.uid);
      console.log("[Save chatId] confirmed", { confirmed });

      if (confirmed !== v) {
        throw new Error("لم يتم تأكيد الحفظ (تباين بين القيمة المحفوظة والمقروءة).");
      }

      if (mounted.current) setSaveMsg("تم الحفظ ✅");
    } catch (e:any) {
      const code = e?.code || e?.name;
      const msg =
        code === "permission-denied"
          ? "صلاحيات Firestore غير كافية (قواعد الحماية)."
          : e?.message || "فشل الحفظ.";
      console.error("[Save chatId] error:", e);
      if (mounted.current) setSaveErr(msg);
    } finally {
      if (mounted.current) setSaving(false);
    }
  };

  const onTest = async () => {
    setTestMsg(null); setTestErr(null); setTesting(true);
    try {
      if (!user?.uid) throw new Error("سجّل الدخول أولًا.");
      const res = await triggerEmergencyForUser({
        uid: user.uid,
        displayName: user.displayName,
      });
      if (!res.ok) throw new Error(res.error);
      if (mounted.current) setTestMsg("تم إرسال رسالة الطوارئ ✅");
    } catch (e:any) {
      if (mounted.current) setTestErr(e?.message || "فشل الإرسال");
    } finally {
      if (mounted.current) setTesting(false);
    }
  };

  const openTelegramBot = () => {
    try {
      const bot = "AuraAuthBot";
      const tgDeep = `tg://resolve?domain=${bot}`;
      const webUrl = `https://t.me/${bot}`;
      window.location.href = tgDeep;
      setTimeout(() => {
        window.open(webUrl, "_blank", "noopener,noreferrer");
      }, 300);
    } catch {
      // ignore
    }
  };

  return (
    <form onSubmit={onSave} className="space-y-3 p-4 rounded-xl border bg-white/60 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold">(Telegram) إعدادات الطوارئ</h3>
        <p className="text-sm opacity-70">احفظ Chat ID لوليّ الأمر لتفعيل زر الطوارئ.</p>
      </div>

      <label className="block text-sm font-medium">Telegram Chat ID لوليّ الأمر</label>
      <input
        type="text"
        className="w-full border rounded px-3 py-2"
        placeholder="مثال: -4933018475 (مجموعة) أو 1146575775 (خاص)"
        value={chatId}
        onChange={(e) => setChatId(e.target.value)}
        inputMode="numeric"
        pattern="[0-9-]*"
      />

      <div className="flex items-center gap-3 flex-wrap">
        <button type="button" onClick={openTelegramBot}
          className="px-4 py-2 rounded text-white bg-emerald-600 hover:bg-emerald-700">
          فتح بوت التلغرام (@AuraAuthBot)
        </button>
        <button type="submit" disabled={saving}
          className={`px-4 py-2 rounded text-white ${saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} disabled:opacity-60`}>
          {saving ? "جارِ الحفظ..." : "حفظ"}
        </button>

        <button type="button" onClick={onTest} disabled={testing || !chatId.trim()}
          className={`px-4 py-2 rounded text-white ${testing ? "bg-slate-400" : "bg-slate-600 hover:bg-slate-700"} disabled:opacity-60`}>
          {testing ? "جارِ الإرسال..." : "إرسال طوارئ (تجربة)"}
        </button>

        {saveMsg && <span className="text-green-600 text-sm">{saveMsg}</span>}
        {saveErr && <span className="text-red-600 text-sm">{saveErr}</span>}
        {testMsg && <span className="text-green-600 text-sm">{testMsg}</span>}
        {testErr && <span className="text-red-600 text-sm">{testErr}</span>}
      </div>
    </form>
  );
}

function EmailSignUpForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);
        setError(null);
        try {
          await emailSignUp({ email, password, username });
          setStatus('تم إنشاء الحساب وتسجيل الدخول بنجاح');
          setUsername('');
          setEmail('');
          setPassword('');
        } catch (err: any) {
          setError(err?.message || 'حدث خطأ أثناء إنشاء الحساب');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="username">اسم المستخدم</Label>
        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="اسم المستخدم" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email-signup">البريد الإلكتروني</Label>
        <Input id="email-signup" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password-signup">كلمة المرور</Label>
        <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
      >
        {submitting ? 'جارٍ الإنشاء…' : 'إنشاء حساب'}
      </button>
      {status && <p className="text-sm text-green-600 mt-2">{status}</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </form>
  );
}

function EmailSignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);
        setError(null);
        try {
          await emailSignIn({ email, password });
          setStatus('تم تسجيل الدخول بنجاح');
          setEmail('');
          setPassword('');
        } catch (err: any) {
          setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="email-login">البريد الإلكتروني</Label>
        <Input id="email-login" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password-login">كلمة المرور</Label>
        <Input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? 'جارٍ الدخول…' : 'تسجيل الدخول'}
      </button>
      {status && <p className="text-sm text-green-600 mt-2">{status}</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </form>
  );
}
