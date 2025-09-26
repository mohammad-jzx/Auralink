// Simple translation helper using Google Cloud Translation v3 with a service account
// Reads credentials from localStorage key 'auralink.translationApi' (populated in Settings)

type TranslateRequest = {
  text: string;
  targetLanguageCode: string; // e.g., 'ar' or 'en'
  sourceLanguageCode?: string;
};

async function getAccessTokenFromServiceAccount(sa: any): Promise<string | null> {
  try {
    // Use OAuth 2.0 Service Account JWT flow
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claim = {
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-translation',
      aud: sa.token_uri,
      exp: now + 3600,
      iat: now,
    };
    const base64url = (obj: object) =>
      btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const encHeader = base64url(header);
    const encClaim = base64url(claim);
    const unsigned = `${encHeader}.${encClaim}`;
    const subtle = (window.crypto as Crypto).subtle;
    // Convert PEM private key to CryptoKey
    const pem = sa.private_key as string;
    const pemBody = pem.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replace(/\s+/g, '');
    const keyData = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
    const key = await subtle.importKey('pkcs8', keyData, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    const sigBuf = await subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
    const signature = btoa(String.fromCharCode(...new Uint8Array(sigBuf))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const jwt = `${unsigned}.${signature}`;
    const res = await fetch(sa.token_uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

export async function translateText({ text, targetLanguageCode, sourceLanguageCode }: TranslateRequest): Promise<string> {
  try {
    const raw = localStorage.getItem('auralink.translationApi');
    if (!raw) return text;
    const sa = JSON.parse(raw);
    const token = await getAccessTokenFromServiceAccount(sa);
    if (!token) return text;
    const projectId = sa.project_id;
    const url = `https://translation.googleapis.com/v3/projects/${projectId}/locations/global:translateText`;
    const body = {
      contents: [text],
      targetLanguageCode,
      sourceLanguageCode,
      mimeType: 'text/plain',
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) return text;
    const data = await res.json();
    const translated = data.translations?.[0]?.translatedText;
    return translated ?? text;
  } catch {
    return text;
  }
}




