// Arabic text processing utilities

// Arabic stopwords
export const ARABIC_STOPWORDS = new Set([
  'من', 'في', 'على', 'الى', 'إلى', 'عن', 'هذا', 'هذه', 'ذلك', 'ثم', 'قد', 'ما', 'لا', 'لم', 'لن',
  'إن', 'أن', 'كان', 'كانت', 'هنا', 'هناك', 'حيث', 'كيف', 'متى', 'أين', 'لماذا', 'ماذا', 'منذ',
  'حتى', 'أي', 'أية', 'كل', 'بعض', 'أكثر', 'أقل', 'أكبر', 'أصغر', 'أحسن', 'أسوأ', 'أفضل',
  'أقرب', 'أبعد', 'أسرع', 'أبطأ', 'أقوى', 'أضعف', 'أطول', 'أقصر', 'أعرض', 'أضيق', 'أعلى',
  'أدنى', 'أمام', 'خلف', 'يمين', 'يسار', 'فوق', 'تحت', 'داخل', 'خارج', 'قريب', 'بعيد', 'جديد',
  'قديم', 'كبير', 'صغير', 'طويل', 'قصير', 'عريض', 'ضيق', 'عالي', 'منخفض', 'سريع', 'بطيء',
  'قوي', 'ضعيف', 'حار', 'بارد', 'نظيف', 'قذر', 'جميل', 'قبيح', 'مفيد', 'ضار', 'سهل', 'صعب',
  'ممكن', 'مستحيل', 'ضروري', 'اختياري', 'مهم', 'غير مهم', 'صحيح', 'خطأ', 'حقيقي', 'كاذب',
  'مفتوح', 'مغلق', 'ممتلئ', 'فارغ', 'مظلم', 'مضيء', 'هادئ', 'صاخب', 'ناعم', 'خشن', 'رطب',
  'جاف', 'ثقيل', 'خفيف', 'غالي', 'رخيص', 'غني', 'فقير', 'سعيد', 'حزين', 'مرح', 'جدي', 'لطيف',
  'قاسي', 'ذكي', 'غبي', 'متعلم', 'جاهل', 'ماهر', 'مبتدئ', 'محترف', 'هواة', 'مشهور', 'مجهول',
  'مقبول', 'مرفوض', 'محمود', 'مذموم', 'مشكور', 'مكروه', 'محبوب', 'مبغوض', 'مطلوب', 'غير مطلوب'
]);

// Arabic normalization function
export function normalizeArabic(text: string): string {
  return text
    // Remove diacritics
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
    // Normalize Alef variations
    .replace(/[أإآ]/g, 'ا')
    // Normalize Ya variations
    .replace(/[ى]/g, 'ي')
    // Normalize Ta Marbuta
    .replace(/[ة]/g, 'ه')
    // Normalize Hamza variations
    .replace(/[ؤئ]/g, 'ء')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    // Trim
    .trim();
}

// Split text into sentences
export function splitSentences(text: string): string[] {
  return text
    .split(/[.!؟…\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Tokenize text into words
export function tokenize(text: string): string[] {
  return text
    .split(/\s+/)
    .map(word => word.trim())
    .filter(word => word.length > 0);
}

// Light Arabic stemming
export function lightStem(word: string): string {
  let stemmed = word;
  
  // Remove common prefixes
  const prefixes = ['ال', 'و', 'ف', 'ب', 'ك', 'ل', 'لل'];
  for (const prefix of prefixes) {
    if (stemmed.startsWith(prefix) && stemmed.length > prefix.length + 1) {
      stemmed = stemmed.substring(prefix.length);
      break;
    }
  }
  
  // Remove common suffixes
  const suffixes = ['ات', 'ون', 'ين', 'ها', 'هم', 'كم', 'كن', 'ة', 'يه', 'ه'];
  for (const suffix of suffixes) {
    if (stemmed.endsWith(suffix) && stemmed.length > suffix.length + 1) {
      stemmed = stemmed.substring(0, stemmed.length - suffix.length);
      break;
    }
  }
  
  return stemmed;
}

// Pick keywords from tokens (remove stopwords, stem, dedupe)
export function pickKeywords(tokens: string[], max: number = 3): string[] {
  const keywords = new Set<string>();
  
  for (const token of tokens) {
    const normalized = normalizeArabic(token);
    if (normalized.length < 2) continue;
    
    if (ARABIC_STOPWORDS.has(normalized)) continue;
    
    const stemmed = lightStem(normalized);
    if (stemmed.length < 2) continue;
    
    keywords.add(stemmed);
    if (keywords.size >= max) break;
  }
  
  return Array.from(keywords);
}

// Build n-grams from tokens
export function buildNGrams(tokens: string[], maxN: number = 4): string[] {
  const ngrams: string[] = [];
  
  for (let n = maxN; n >= 1; n--) {
    for (let i = 0; i <= tokens.length - n; i++) {
      const ngram = tokens.slice(i, i + n).join(' ');
      ngrams.push(ngram);
    }
  }
  
  return ngrams;
}

// Check if text contains Arabic characters
export function isArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

// Clean and prepare text for processing
export function prepareText(text: string): string {
  return normalizeArabic(text)
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\sء]/g, '')
    .trim();
}
