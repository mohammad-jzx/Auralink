import { useAuth } from "@/contexts/AuthContext";
import { getGuardianChatId, setGuardianChatId } from "@/lib/userProfile";
import { useEffect, useState } from "react";

export default function AskChatIdOnce() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    (async () => {
      if (!user?.uid) return;
      const existing = await getGuardianChatId(user.uid);
      if (!existing) setShow(true);
    })();
  }, [user?.uid]);

  if (!show) return null;

  const save = async () => {
    const v = value.trim();
    if (!v) return;
    await setGuardianChatId(user!.uid, v);
    setShow(false);
  };

  const openTelegramBot = () => {
    try {
      const bot = "AuraAuthBot";
      const tgDeep = `tg://resolve?domain=${bot}`;
      const webUrl = `https://t.me/${bot}`;
      // Attempt to open Telegram app
      window.location.href = tgDeep;
      // Fallback to web after a brief delay
      setTimeout(() => {
        window.open(webUrl, "_blank", "noopener,noreferrer");
      }, 300);
    } catch {
      // No-op
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl space-y-3">
        <h3 className="text-lg font-semibold">إدخال Telegram Chat ID</h3>
        <p className="text-sm opacity-70">
          أدخل رقم Telegram Chat ID لوليّ الأمر (مثال: 1146575775 للخاص أو -4933018475 للمجموعة).
        </p>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="123456789 أو -123456789"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputMode="numeric"
          pattern="[0-9-]*"
        />
        <div className="flex items-center justify-between gap-2">
          <button onClick={openTelegramBot} className="px-3 py-2 rounded bg-emerald-600 text-white">
            فتح بوت التلغرام (@AuraAuthBot)
          </button>
          <div className="flex gap-2">
          <button onClick={() => setShow(false)} className="px-3 py-2 rounded bg-slate-200">لاحقًا</button>
          <button onClick={save} className="px-3 py-2 rounded bg-blue-600 text-white">حفظ</button>
          </div>
        </div>
      </div>
    </div>
  );
}


