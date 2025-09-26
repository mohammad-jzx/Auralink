import { TextTranslationServiceClient } from '@google-cloud/translate';
import { GoogleAuth } from 'google-auth-library';

type TargetLang = 'ar' | 'en';

function buildClient() {
  const saJson = process.env.TRANSLATE_SA_JSON;
  if (saJson) {
    const credentials = JSON.parse(saJson);
    const auth = new GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/cloud-translation'] });
    return new TextTranslationServiceClient({ auth });
  }
  // Fallback to GOOGLE_APPLICATION_CREDENTIALS file path if provided
  return new TextTranslationServiceClient();
}

const client = buildClient();

export async function translateText(q: string | string[], target: TargetLang): Promise<string | string[]> {
  const contents = Array.isArray(q) ? q : [q];
  if (contents.length === 0) return Array.isArray(q) ? [] : '';

  // Project detection from credentials/env
  // The v3 client can infer project ID via ADC; if not, allow explicit env.
  const [projectId] = await client.getProjectId();
  const parent = `projects/${projectId}/locations/global`;

  const [response] = await client.translateText({
    parent,
    targetLanguageCode: target,
    contents,
    mimeType: 'text/plain',
  });

  const translations = (response.translations ?? []).map((t) => t.translatedText ?? '');
  if (Array.isArray(q)) return translations;
  return translations[0] ?? '';
}















