import { useAuth } from "@/contexts/AuthContext";
import { triggerEmergencyForUser } from "@/lib/triggerEmergency";
import { getGuardianChatId } from "@/lib/userProfile";
import { useEffect, useState } from "react";

export default function EmergencyButton() {
  const { user } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (user?.uid) {
        const saved = await getGuardianChatId(user.uid);
        setChatId(saved);
      }
    })();
  }, [user?.uid]);

  const trigger = async () => {
    setStatus(null); setBusy(true);
    try {
      if (!user?.uid) throw new Error("سجّل الدخول أولًا.");
      const res = await triggerEmergencyForUser({
        uid: user.uid,
        displayName: user.displayName,
        fallbackNote: "اختبار طوارئ من الإعدادات.",
      });
      if (!res.ok) throw new Error(res.error);
      setStatus("✅ أُرسل تنبيه الطوارئ");
    } catch (e: any) {
      setStatus("❌ " + (e?.message || "فشل إرسال التنبيه"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={trigger}
        disabled={busy}
        className={`px-4 py-2 rounded text-white ${busy ? "bg-red-400" : "bg-red-600 hover:bg-red-700"}`}
        title="إرسال تنبيه طوارئ"
      >
        {busy ? "جارِ الإرسال…" : "طوارئ 🚨"}
      </button>
      {status && <div className="text-sm">{status}</div>}
    </div>
  );
}


