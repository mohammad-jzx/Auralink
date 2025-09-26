import credentials from '../../text-to-speach.json';

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
  token_uri: string;
};

type TokenCache = {
  token: string;
  expiresAt: number;
};

const { client_email, private_key, token_uri } = credentials as ServiceAccountCredentials;

const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/cloud-platform';
const GOOGLE_TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';

const textEncoder = new TextEncoder();
let accessTokenCache: TokenCache | null = null;

function base64UrlEncode(input: string | Uint8Array): string {
  const bytes = typeof input === 'string' ? textEncoder.encode(input) : input;
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  return base64UrlEncode(new Uint8Array(buffer));
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s+/g, '');

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function createJwt(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: 'RS256',
    typ: 'JWT',
  } as const;

  const payload = {
    iss: client_email,
    scope: GOOGLE_SCOPE,
    aud: token_uri,
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const keyBuffer = pemToArrayBuffer(private_key);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    textEncoder.encode(signingInput),
  );

  const encodedSignature = arrayBufferToBase64Url(signature);
  return `${signingInput}.${encodedSignature}`;
}

async function getAccessToken(): Promise<string> {
  if (accessTokenCache && accessTokenCache.expiresAt > Date.now() + 60_000) {
    return accessTokenCache.token;
  }

  const assertion = await createJwt();
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const response = await fetch(token_uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error_description ?? data?.error ?? 'فشل طلب رمز الوصول';
    throw new Error(message);
  }

  const expiresInMs = (data.expires_in ?? 3600) * 1000;
  accessTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + expiresInMs,
  };

  return data.access_token as string;
}

export async function synthesizeSpeech(
  text: string,
  options?: {
    languageCode?: string;
    voiceName?: string;
    speakingRate?: number;
    pitch?: number;
  },
): Promise<string> {
  if (!text.trim()) {
    throw new Error('النص فارغ، أدخل نصاً أولاً');
  }

  const accessToken = await getAccessToken();

  const response = await fetch(GOOGLE_TTS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: options?.languageCode ?? 'ar-XA',
        name: options?.voiceName ?? 'ar-XA-Wavenet-A',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: options?.speakingRate ?? 1,
        pitch: options?.pitch ?? 0,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message ?? 'تعذّر تحويل النص إلى كلام';
    throw new Error(message);
  }

  if (!data.audioContent) {
    throw new Error('لم يتم استلام ملف صوتي');
  }

  return data.audioContent as string;
}
