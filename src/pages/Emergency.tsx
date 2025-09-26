import { useAuth } from '@/contexts/AuthContext';
import { sendEmergencyToTelegram } from '@/lib/emergency';
import { getGuardianChatId } from '@/lib/userProfile';
import { useEffect, useState } from 'react';

export function Emergency() {
  const { user } = useAuth();
  const [chatId, setChatId] = useState('');
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'cooldown'|'fail'>('idle');

  useEffect(() => {
    (async () => {
      if (user?.uid) {
        const saved = await getGuardianChatId(user.uid);
        if (saved) setChatId(saved);
      }
    })();
  }, [user?.uid]);

  const onSend = async () => {
    if (!chatId.trim()) return;
    setStatus('sending');
    try {
      await sendEmergencyToTelegram({ chatId, text: '🚨 طوارئ! الرجاء التواصل فورًا.', attachLocation: true });
      setStatus('ok');
    } catch (e: any) {
      setStatus(e?.message === 'COOLDOWN' ? 'cooldown' : 'fail');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">🚨 قسم الطوارئ (Telegram)</h1>
      <div className="text-sm opacity-75">
        احفظ أولًا <strong>Chat ID</strong> في الإعدادات ثم اضغط الزر أدناه عند الحاجة.
      </div>

      <button
        onClick={onSend}
        className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
        disabled={status === 'sending' || !chatId.trim()}
      >
        {status === 'sending' ? 'جارٍ الإرسال...' : '🚨 كبسة الطوارئ'}
      </button>

      {status === 'ok' && <div className="text-green-600">تم الإرسال ✅</div>}
      {status === 'cooldown' && <div className="text-yellow-600">انتظر قليلًا قبل إعادة المحاولة ⏳</div>}
      {status === 'fail' && <div className="text-red-600">تعذّر الإرسال، تحقّق من الإعدادات.</div>}
    </div>
  );
}