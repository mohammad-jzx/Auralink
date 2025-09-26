// feat(texttovedio): wire existing folder via AppHost and /texttovedio route
// feat(nav): add navbar link
// fix(styles): lazy-load texttovideo globals to avoid conflicts
// إذا ظهرت شاشة سوداء رغم “Video playing successfully” في Console:
// تأكد أن الملف موجود فعلاً في public/video وأن الاسم يطابق ما بعد الترميز.
// الفيديوهات بأسماء عربية تُستدعى عبر /video/<اسم>.mp4 بعد encodeURIComponent.
import { PageTransition } from '@/components/PageTransition';
import { TranslationToggle } from '@/components/TranslationToggle';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignLanguageDetection from '../../texttovideo/src/components/SignLanguageDetection';
import SignSequencePlayer from '../../texttovideo/src/components/SignSequencePlayer';
import { buildSignSequence, getExampleSentences } from '../../texttovideo/src/lib/signs';

export default function TextToVedioApp() {
  useEffect(() => {
    import('../../texttovideo/src/app/globals.css').catch(() => {});
  }, []);

  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sequence, setSequence] = useState<any[]>([]);
  const [hasProcessed, setHasProcessed] = useState(false);

  const examples = useMemo(() => getExampleSentences?.() ?? [], []);

  const handleProcess = useCallback(async () => {
    if (!inputText.trim()) {
      setError('يرجى إدخال نص للتحويل');
      return;
    }
    setIsLoading(true);
    setError(null);
    setHasProcessed(false);
    try {
      const raw = await buildSignSequence(inputText);
      const seq = (raw || []).map((item: any) => {
        if (item?.video) {
          try {
            const filenameWithExt = item.video.split('/').pop() || '';
            const base = filenameWithExt.replace(/\.[^/.]+$/, '');
            const encoded = encodeURIComponent(base);
            return { ...item, video: `/video/${encoded}.mp4` };
          } catch {
            return item;
          }
        }
        return item;
      });
      setSequence(seq);
      setHasProcessed(true);
      if (!seq || seq.length === 0) {
        setError('لم يتم العثور على إشارات مطابقة للنص المدخل');
      }
    } catch {
      setError('حدث خطأ أثناء معالجة النص');
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  return (
    <PageTransition>
      <div className="min-h-[60vh] py-8 px-4 texttov-host">
      <style>{`
        .texttov-host .relative.bg-black > button { background: transparent !important; pointer-events: none; }
        .texttov-host .relative.bg-black > button > div { display: none !important; }
      `}</style>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">نظام التواصل بلغة الإشارة</h1>
          <div className="flex justify-center mt-2 mb-2">
            <TranslationToggle
              isLiveTranslation={false}
              onToggle={() => {}}
              onNavigateOn={() => navigate('/live-translate')}
              className="scale-[1.2]"
            />
          </div>
          <p className="text-gray-600">اختر بين تحويل النص العربي إلى إشارات أو التعرف من الكاميرا</p>
        </div>

        {/* النص ← إشارات */}
        <div className="mb-12">
          <div className="mb-6">
            <label htmlFor="t2v-input" className="block text-right mb-2 font-medium">النص العربي</label>
            <textarea
              id="t2v-input"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setError(null);
              }}
              placeholder="اكتب رسالتك هنا..."
              className="w-full h-32 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-right"
              dir="rtl"
            />
            <div className="text-sm text-gray-500 mt-2 text-right">اختر مثالاً أو اضغط زر التحويل</div>
          </div>

          {Array.isArray(examples) && examples.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2 justify-center">
              {examples.slice(0, 6).map((ex: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(ex);
                    setError(null);
                  }}
                  className="px-3 py-2 text-sm rounded-full bg-primary text-white hover:opacity-90"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}

          <div className="text-center mb-8">
            <button
              onClick={handleProcess}
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-3 rounded-xl bg-primary text-white disabled:opacity-50"
            >
              {isLoading ? 'جاري المعالجة...' : 'عرض الإشارة'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
              {error}
            </div>
          )}

          {hasProcessed && sequence && sequence.length > 0 && (
            <div className="bg-white rounded-2zl p-4 shadow">
              <SignSequencePlayer sequence={sequence} onSequenceComplete={() => {}} autoPlay={true} />
            </div>
          )}
        </div>

        {/* التعرف بالكاميرا */}
        <div className="max-w-5xl mx-auto">
          <SignLanguageDetection />
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
