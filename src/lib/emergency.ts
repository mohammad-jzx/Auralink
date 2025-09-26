import { GAS_EXEC_URL } from "./config";

const enc = (s: string) => encodeURIComponent(s);

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]!));
}

async function fetchWithTimeout(input: RequestInfo, init?: RequestInit, ms = 15000) {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(input, { ...init, signal: ctrl.signal }); } finally { clearTimeout(t); }
}

/** يبني نص الطوارئ بتنسيق HTML */
export async function buildEmergencyMessage({
  name, note, includeBattery, location,
}: {
  name?: string; note?: string; includeBattery?: boolean;
  location?: { lat: number; lng: number } | null;
}) {
  const time = new Date().toLocaleString(undefined, { hour12: false });

  let batteryLine = "";
  if (includeBattery) {
    if ((navigator as any).getBattery) {
      try {
        const bat = await (navigator as any).getBattery();
        const pct = Math.round(bat.level * 100);
        batteryLine = `\n🔋 <b>البطارية:</b> ${pct}%${bat.charging ? " (قيد الشحن)" : ""}`;
      } catch {
        batteryLine = `\n🔋 <b>البطارية:</b> غير متاح`;
      }
    } else {
      batteryLine = `\n🔋 <b>البطارية:</b> غير متاح`;
    }
  }

  let locationLine = "";
  if (location) {
    const { lat, lng } = location;
    locationLine = `\n📍 <b>الموقع:</b> <a href="https://maps.google.com/?q=${lat},${lng}">${lat.toFixed(6)},${lng.toFixed(6)}</a>`;
  } else {
    locationLine = `\n📍 <b>الموقع:</b> غير متاح`;
  }

  const who  = name ? `"<b>${escapeHtml(name)}</b>"` : "مستخدم";
  const noteLine = note ? `\n📝 <b>ملاحظة:</b> ${escapeHtml(note)}` : "";

  return (
    `🚨 <b>طوارئ – Auralink</b>\n` +
    `👤 <b>المُبلغ:</b> ${who}\n` +
    `🕒 <b>الوقت:</b> ${time}` +
    batteryLine +
    locationLine +
    `${noteLine}\n\nالرجاء الاستجابة فورًا.`
  );
}

/** يرسل رسالة طوارئ حقيقية عبر GAS → Telegram */
export async function sendRealEmergency({
  chatId, name, note, attachLocation = true, includeBattery = true,
}: {
  chatId: string; name?: string; note?: string;
  attachLocation?: boolean; includeBattery?: boolean;
}) {
  let loc: { lat: number; lng: number } | null = null;
  if (attachLocation && "geolocation" in navigator) {
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 8000 })
      );
      loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch {}
  }

  const text = await buildEmergencyMessage({ name, note, includeBattery, location: loc });

  // الإرسال عبر GET فقط لتجنب CORS
  const url = `${GAS_EXEC_URL}?chat_id=${enc(chatId)}&text=${enc(text)}`;
  if ((window as any).AURALINK_DEBUG) {
    try { console.log('[sendViaGasGet] host=', new URL(GAS_EXEC_URL).host); } catch {}
  }
  const r1 = await fetchWithTimeout(url, { method: "GET" });
  const t1 = await r1.text(); let j1: any = {}; try { j1 = JSON.parse(t1 || "{}"); } catch {}
  if (!r1.ok || !j1?.ok) throw new Error(`GAS GET failed: ${r1.status} ${t1 || r1.statusText}`);
  return j1;
}
 
// نسخة مختصرة للإرسال مع نص مخصص اختياريًا (متوافقة مع الاختبار من الإعدادات)
export async function sendEmergencyToTelegram({
  chatId,
  text,
  attachLocation = true,
  name,
  extraNote,
  includeBattery = true,
}: {
  chatId: string;
  text?: string;
  attachLocation?: boolean;
  name?: string;
  extraNote?: string;
  includeBattery?: boolean;
}) {
  let loc: { lat: number; lng: number } | null = null;
  if (attachLocation && "geolocation" in navigator) {
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 8000 })
      );
      loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch {}
  }
  const finalText = text || (await buildEmergencyMessage({ name, note: extraNote, includeBattery, location: loc }));
  const url = `${GAS_EXEC_URL}?chat_id=${enc(chatId)}&text=${enc(finalText)}`;
  if ((window as any).AURALINK_DEBUG) {
    try { console.log('[sendViaGasGet] host=', new URL(GAS_EXEC_URL).host); } catch {}
  }
  const r1 = await fetchWithTimeout(url, { method: "GET" });
  const t1 = await r1.text(); let j1: any = {}; try { j1 = JSON.parse(t1 || "{}"); } catch {}
  if (!r1.ok || !j1?.ok) throw new Error(`GAS GET failed: ${r1.status} ${t1 || r1.statusText}`);
  return j1;

}

// طبقة إرسال GET فقط حسب المتطلب
export async function sendViaGasGet(opts: { chatId: string; text: string }) {
  if (!GAS_EXEC_URL) throw new Error('VITE_GAS_EXEC_URL is missing');
  const url = `${GAS_EXEC_URL}?chat_id=${enc(opts.chatId)}&text=${enc(opts.text)}`;
  if ((window as any).AURALINK_DEBUG) {
    try { console.log('[sendViaGasGet] host=', new URL(GAS_EXEC_URL).host); } catch {}
  }
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GAS GET failed: ${res.status} ${body}`);
  }
}
