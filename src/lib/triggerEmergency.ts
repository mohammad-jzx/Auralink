import { buildEmergencyMessage, sendViaGasGet } from "@/lib/emergency";
import { getGuardianChatId } from "@/lib/userProfile";

export type TriggerResult = { ok: true } | { ok: false; error: string };

export async function triggerEmergencyForUser({
  uid,
  displayName,
  fallbackNote,
  note,
}: {
  uid: string;
  displayName?: string | null;
  fallbackNote?: string;
  note?: string;
}): Promise<TriggerResult> {
  try {
    const chatId = await getGuardianChatId(uid);
    if (!chatId) return { ok: false, error: "لا يوجد Chat ID محفوظ. اذهب إلى الإعدادات واحفظه أولًا." };

    // بناء الرسالة بالصيغة المطلوبة + محاولة تضمين الموقع الحالي
    let loc: { lat: number; lng: number } | null = null;
    if ("geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 8000 })
        );
        loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch {}
    }

    const html = await buildEmergencyMessage({
      name: displayName || "بدون اسم",
      note: (note?.trim() || fallbackNote || undefined),
      includeBattery: true,
      location: loc,
    });

    await sendViaGasGet({ chatId, text: html });

    return { ok: true };
  } catch (e: any) {
    const msg =
      e?.name === "AbortError"
        ? "انقطع الاتصال أثناء الإرسال. حاول مجددًا."
        : (e?.message || "تعذر إرسال رسالة الطوارئ.");
    return { ok: false, error: msg };
  }
}


