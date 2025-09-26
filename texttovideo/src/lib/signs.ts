import { normalizeArabic, tokenize, buildNGrams, ARABIC_STOPWORDS, lightStem, prepareText } from './arabic';
import { getAssetURL, preloadAssets } from './firebase';

export interface SignMapping {
  path: string;
  poster?: string;
  syn?: string[];
  pos?: string;
  prio?: number;
}

export interface SignSequenceItem {
  label: string;
  video: string;
  poster?: string;
  originalText: string;
}

export interface SignsMapping {
  [key: string]: SignMapping;
}

let mappingCache: SignsMapping | null = null;

export async function loadSignsMapping(): Promise<SignsMapping> {
  if (mappingCache) return mappingCache;
  try {
    const response = await fetch('/mapping.json');
    if (!response.ok) throw new Error(`Failed to load mapping: ${response.status}`);
    const data = await response.json();
    mappingCache = data as SignsMapping;
    return mappingCache;
  } catch (error) {
    console.error('Failed to load signs mapping:', error);
    return {};
  }
}

export function findBestMatch(text: string, mapping: SignsMapping): string | null {
  const cleaned = prepareText(text);
  const normalized = normalizeArabic(cleaned);
  
  if (mapping[normalized]) return normalized;
  
  // equality by normalized key
  for (const key of Object.keys(mapping)) {
    if (normalizeArabic(prepareText(key)) === normalized) return key;
  }
  
  const base = normalized.replace(/^ال/, '');
  const variations = [normalized, base, normalized.replace(/^أ|^إ|^آ/, 'ا'), base.replace(/^أ|^إ|^آ/, 'ا')];
  for (const v of variations) {
    if (mapping[v]) return v;
  }
  
  for (const [key, value] of Object.entries(mapping)) {
    const syns = (value.syn || []).map(s => normalizeArabic(prepareText(s)));
    if (syns.includes(normalized) || syns.includes(base)) return key;
  }
  
  for (const key of Object.keys(mapping)) {
    const k = normalizeArabic(prepareText(key));
    if (k.includes(normalized) || normalized.includes(k)) return key;
  }
  
  return null;
}

function strictFindMatch(text: string, mapping: SignsMapping): string | null {
  const cleaned = prepareText(text);
  const normalized = normalizeArabic(cleaned);
  if (mapping[normalized]) return normalized;
  for (const [key, value] of Object.entries(mapping)) {
    if (key === normalized) return key;
    if (value.syn && value.syn.map(normalizeArabic).includes(normalized)) return key;
  }
  return null;
}

async function buildSentenceSequence(originalSentence: string, normalizedSentence: string, mapping: SignsMapping): Promise<SignSequenceItem[]> {
  const sequence: SignSequenceItem[] = [];
  const originalTokens = tokenize(originalSentence);
  const normalizedTokens = tokenize(normalizedSentence);
  if (normalizedTokens.length === 0) return sequence;

  console.log('Processing sentence:', { original: originalSentence, normalized: normalizedSentence });
  console.log('Tokens:', { original: originalTokens, normalized: normalizedTokens });

  // Pass 1: strict phrase matching (e.g., "اهلا وسهلا") without partials
  const processed = new Set<number>();
  for (let length = Math.min(6, normalizedTokens.length); length >= 2; length--) {
    for (let i = 0; i <= normalizedTokens.length - length; i++) {
      // skip if any token in window already processed
      let overlap = false;
      for (let k = 0; k < length; k++) if (processed.has(i + k)) { overlap = true; break; }
      if (overlap) continue;

      const phraseNorm = normalizedTokens.slice(i, i + length).join(' ');
      const matchKey = strictFindMatch(phraseNorm, mapping);
      if (matchKey) {
        const signItem = mapping[matchKey];
        const label = originalTokens.slice(i, i + length).join(' ');
        const videoUrl = await getAssetURL(signItem.path);
        const posterUrl = signItem.poster ? await getAssetURL(signItem.poster) : undefined;
        sequence.push({ label, video: videoUrl, poster: posterUrl, originalText: label });
        for (let k = 0; k < length; k++) processed.add(i + k);
        i += length - 1; // jump over the matched window
      }
    }
  }

  // Pass 2: single-word matching for the rest
  const remainingOriginal: string[] = [];
  const remainingNormalized: string[] = [];
  const remainingIndices: number[] = [];
  for (let i = 0; i < normalizedTokens.length; i++) {
    if (!processed.has(i)) {
      remainingOriginal.push(originalTokens[i] ?? normalizedTokens[i]);
      remainingNormalized.push(normalizedTokens[i]);
      remainingIndices.push(i);
    }
  }

  // Process remaining tokens word-by-word
  for (let idx = 0; idx < remainingNormalized.length; idx++) {
    const tokNorm = remainingNormalized[idx];
    const tokOrig = remainingOriginal[idx];

    // Skip stopwords and very short tokens (unless they map to a known sign)
    const isStop = ARABIC_STOPWORDS.has(tokNorm);
    const hasDirectMap = !!mapping[tokNorm] || !!findBestMatch(tokNorm, mapping);
    if ((isStop && !hasDirectMap) || tokNorm.length < 2) {
      console.log(`Skipping token: "${tokNorm}" (stopword or too short)`);
      continue;
    }
    
    console.log(`Processing word: "${tokOrig}" (normalized: "${tokNorm}")`);
    
    // Try to find exact match first
    let matchKey = findBestMatch(tokNorm, mapping);
    
    // If no exact match, try to find partial matches
    if (!matchKey) {
      matchKey = findPartialMatch(tokNorm, mapping);
    }
    
    // If still no match, try with light stemming
    if (!matchKey) {
      const stemmed = lightStem(tokNorm);
      if (stemmed !== tokNorm) {
        console.log(`Trying stemmed version: "${stemmed}"`);
        matchKey = findBestMatch(stemmed, mapping);
        if (!matchKey) {
          matchKey = findPartialMatch(stemmed, mapping);
        }
      }
    }
    
    if (matchKey) {
      console.log(`Found match for "${tokOrig}": "${matchKey}"`);
      const signItem = mapping[matchKey];
      const videoUrl = await getAssetURL(signItem.path);
      const posterUrl = signItem.poster ? await getAssetURL(signItem.poster) : undefined;
      
      sequence.push({
        label: tokOrig,
        video: videoUrl,
        poster: posterUrl,
        originalText: tokOrig
      });
    } else {
      console.log(`No match found for "${tokOrig}", adding placeholder`);
      // Add placeholder for unmatched words
      sequence.push({
        label: tokOrig,
        video: '',
        poster: '',
        originalText: tokOrig
      });
    }
  }
  
  return sequence;
}

async function findPhraseMatches(originalSentence: string, normalizedSentence: string, mapping: SignsMapping): Promise<SignSequenceItem[]> {
  const matches: SignSequenceItem[] = [];
  const tokens = normalizedSentence.split(' ');
  
  // Try different phrase lengths (longest first)
  for (let length = Math.min(6, tokens.length); length >= 2; length--) {
    for (let i = 0; i <= tokens.length - length; i++) {
      const phrase = tokens.slice(i, i + length).join(' ');
      const matchKey = findBestMatch(phrase, mapping);
      
      if (matchKey) {
        console.log(`Found phrase match: "${phrase}" -> "${matchKey}"`);
        const signItem = mapping[matchKey];
        const videoUrl = await getAssetURL(signItem.path);
        const posterUrl = signItem.poster ? await getAssetURL(signItem.poster) : undefined;
        
        matches.push({
          label: phrase,
          video: videoUrl,
          poster: posterUrl,
          originalText: phrase
        });
        
        // If we found a good phrase match, return it (don't break into smaller parts)
        if (length >= 3) {
          return matches;
        }
      }
    }
  }
  
  return matches;
}

async function processWordsIndividually(originalTokens: string[], normalizedTokens: string[], mapping: SignsMapping): Promise<SignSequenceItem[]> {
  const sequence: SignSequenceItem[] = [];
  
  for (let i = 0; i < normalizedTokens.length; i++) {
    const tokNorm = normalizedTokens[i];
    const tokOrig = originalTokens[i] ?? tokNorm;
    
    // Skip stopwords and very short tokens
    if (ARABIC_STOPWORDS.has(tokNorm) || tokNorm.length < 2) {
      console.log(`Skipping token: "${tokNorm}" (stopword or too short)`);
      continue;
    }
    
    console.log(`Processing word: "${tokOrig}" (normalized: "${tokNorm}")`);
    
    // Try to find exact match first
    let matchKey = findBestMatch(tokNorm, mapping);
    
    // If no exact match, try to find partial matches
    if (!matchKey) {
      matchKey = findPartialMatch(tokNorm, mapping);
    }
    
    // If still no match, try with light stemming
    if (!matchKey) {
      const stemmed = lightStem(tokNorm);
      if (stemmed !== tokNorm) {
        console.log(`Trying stemmed version: "${stemmed}"`);
        matchKey = findBestMatch(stemmed, mapping);
        if (!matchKey) {
          matchKey = findPartialMatch(stemmed, mapping);
        }
      }
    }
    
    if (matchKey) {
      console.log(`Found match for "${tokOrig}": "${matchKey}"`);
      const signItem = mapping[matchKey];
      const videoUrl = await getAssetURL(signItem.path);
      const posterUrl = signItem.poster ? await getAssetURL(signItem.poster) : undefined;
      
      sequence.push({
        label: tokOrig,
        video: videoUrl,
        poster: posterUrl,
        originalText: tokOrig
      });
    } else {
      console.log(`No match found for "${tokOrig}", adding placeholder`);
      // Add placeholder for unmatched words
      sequence.push({
        label: tokOrig,
        video: '',
        poster: '',
        originalText: tokOrig
      });
    }
  }
  
  return sequence;
}

function findPartialMatch(text: string, mapping: SignsMapping): string | null {
  const normalized = normalizeArabic(text);
  
  // Try to find words that contain our text or are contained in our text
  for (const [key, value] of Object.entries(mapping)) {
    // Check if our text is part of the key
    if (key.includes(normalized) && key.length <= normalized.length + 3) {
      return key;
    }
    
    // Check if the key is part of our text
    if (normalized.includes(key) && key.length >= 2) {
      return key;
    }
  }
  
  return null;
}

export async function preloadSequenceAssets(sequence: SignSequenceItem[]): Promise<void> {
  const paths: string[] = [];
  for (const item of sequence) {
    if (item.video && !item.video.startsWith('http')) paths.push(item.video.replace(/^\//, ''));
    if (item.poster && !item.poster.startsWith('http')) paths.push(item.poster.replace(/^\//, ''));
  }
  if (paths.length > 0) await preloadAssets(paths);
}

export async function buildSignSequence(input: string): Promise<SignSequenceItem[]> {
  const mapping = await loadSignsMapping();
  const sequence: SignSequenceItem[] = [];
  if (!input.trim()) return sequence;

  const originalSentences = input.split(/[.!؟…\n]+/).filter(s => s.trim());

  for (const originalSentence of originalSentences) {
    const cleaned = prepareText(originalSentence);
    const normalizedSentence = normalizeArabic(cleaned);
    const sentenceSequence = await buildSentenceSequence(originalSentence, normalizedSentence, mapping);
    sequence.push(...sentenceSequence);
  }

  return sequence;
}

export function getExampleSentences(): string[] {
  return [
    'السلام عليكم',
    'قال صديقي شكراً',
    'أنا أزور الجامعة اليوم',
  ];
}

export function isValidSequenceItem(item: SignSequenceItem): boolean {
  return !!(item.video && item.video.trim());
}

export function getErrorMessage(item: SignSequenceItem): string {
  if (!item.video || !item.video.trim()) return `لا توجد إشارة مطابقة لكلمة "${item.originalText}"`;
  return '';
}
