import { PageTransition } from '@/components/PageTransition';
import { TranslationToggle } from '@/components/TranslationToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { transcribeSpeech } from '@/lib/googleStt';
import { synthesizeSpeech } from '@/lib/googleTts';
import { useTranslationBundle } from '@/lib/i18n';
import {
  AlertCircle,
  CheckCircle2,
  Hand,
  Languages,
  Loader2,
  MessageSquare,
  Mic,
  Play,
  Sparkles,
  Square,
} from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const TextToVedioApp = lazy(() => import('@/texttovedio/AppHost'));
const SignLanguageDetectionApp = lazy(() => import('../../Sign-Language-detection-main/web/src/App.jsx'));

function SignLanguageDetectionInline() {
  useEffect(() => {
    import('../../Sign-Language-detection-main/web/src/App.css').catch(() => {});
  }, []);

  return <SignLanguageDetectionApp />;
}

function base64ToBlob(base64: string, contentType: string): Blob {
  const binary = atob(base64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    buffer[i] = binary.charCodeAt(i);
  }
  return new Blob([buffer], { type: contentType });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('تعذّر قراءة التسجيل الصوتي'));
      }
    };
    reader.onerror = () => reject(new Error('حدث خطأ أثناء قراءة التسجيل'));
    reader.readAsDataURL(blob);
  });
}

function mapMimeTypeToEncoding(mimeType?: string): 'WEBM_OPUS' | 'OGG_OPUS' | 'LINEAR16' | undefined {
  if (!mimeType) {
    return undefined;
  }
  if (mimeType.includes('webm')) {
    return 'WEBM_OPUS';
  }
  if (mimeType.includes('ogg')) {
    return 'OGG_OPUS';
  }
  if (mimeType.includes('wav') || mimeType.includes('x-wav')) {
    return 'LINEAR16';
  }
  return undefined;
}

const liveTranslateTexts = {
  pageTitle: 'الترجمة الحية',
  pageDescription: 'منصة موحّدة تجمع بين التحويل الصوتي والتحويل بالإشارة لتسهيل التواصل الفوري. اختر القسم المناسب لتجربة تحويل الكلام إلى نص أو العكس، أو تعرّف على خيارات تحويل لغة الإشارة إلى نص واضح.',
  speechConversionTitle: 'التحويل الصوتي',
  speechConversionDescription: 'استخدم هذا القسم لتحويل الكلام المنطوق إلى نص عربي قابل للتحرير أو توليد ملفات صوتية عربية واضحة.',
  speechToTextTitle: 'كلام إلى نص',
  speechToTextDescription: 'سجّل صوتك العربي وسيتم تفريغه فوراً مع عرض نسبة الثقة والتنبيهات المحتملة.',
  textToSpeechTitle: 'نص إلى كلام',
  textToSpeechDescription: 'أدخل النص العربي ليتم تحويله إلى ملف صوتي واضح وسهل الحفظ أو المشاركة.',
  usageSteps: 'خطوات الاستخدام',
  step1: 'اضغط زر التسجيل لبدء التعرف على الصوت.',
  step2: 'أوقف التسجيل وانتظر حتى تكتمل المعالجة.',
  startRecording: 'ابدأ التسجيل',
  stopRecording: 'إيقاف التسجيل',
  clearResult: 'مسح النتيجة',
  recordingInProgress: 'جارٍ التسجيل... اضغط «إيقاف التسجيل» عند الانتهاء.',
  processingRecording: 'جارٍ معالجة التسجيل...',
  outputText: 'النص الناتج',
  outputPlaceholder: 'سيظهر النص بعد إنهاء التسجيل ومعالجته.',
  estimatedAccuracy: 'دقة تقديرية:',
  textToConvert: 'النص المراد تحويله',
  textPlaceholder: 'اكتب النص العربي هنا...',
  convertToSpeech: 'حوّل النص إلى صوت',
  audioPreview: 'معاينة الصوت',
  browserNotSupported: 'متصفحك لا يدعم مشغل الصوت.',
  generalNotes: 'ملاحظات عامة',
  generalNotesDescription: 'تم تفعيل قسم التحويل الصوتي باستخدام ملفات الاعتماد speech-to-text.json و text-to-speach.json. بقية الأقسام تعمل كتجربة مصغّرة داخل الصفحة ويمكن توسيعها لاحقاً.',
};

export function LiveTranslate() {
  const texts = useTranslationBundle(liveTranslateTexts);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState('');
  const [transcriptionConfidence, setTranscriptionConfidence] = useState<number | null>(null);
  const [isLiveTranslation, setIsLiveTranslation] = useState(true);

  const handleToggleChange = (isLive: boolean) => {
    setIsLiveTranslation(isLive);
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {
        /* قد يفشل التشغيل التلقائي حسب إعدادات المتصفح */
      });
    }
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const handleResetTranscription = () => {
    setTranscribedText('');
    setTranscriptionConfidence(null);
    setSpeechError(null);
  };

  const processRecording = async (
    blob: Blob,
    info: { sampleRate?: number; mimeType?: string },
  ) => {
    if (!blob || blob.size === 0) {
      setSpeechError('التسجيل كان قصيراً للغاية، حاول مرة أخرى');
      return;
    }
    try {
      setIsTranscribing(true);
      setSpeechError(null);
      const base64DataUrl = await blobToBase64(blob);
      const base64Content = base64DataUrl.split(',')[1] ?? base64DataUrl;
      const result = await transcribeSpeech(base64Content, {
        encoding: mapMimeTypeToEncoding(info.mimeType) ?? 'WEBM_OPUS',
        sampleRateHertz: info.sampleRate,
        languageCode: 'ar-SA',
      });
      setTranscribedText(result.transcript);
      setTranscriptionConfidence(result.confidence ?? null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'تعذّر تحليل التسجيل الصوتي';
      setSpeechError(message);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleStartRecording = async () => {
    if (isRecording || isTranscribing) {
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setSpeechError('التسجيل غير مدعوم في هذا المتصفح');
      return;
    }
    try {
      setSpeechError(null);
      setTranscribedText('');
      setTranscriptionConfidence(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const preferredMimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
      ];
      const selectedMime = preferredMimeTypes.find((mime) => {
        try {
          return MediaRecorder.isTypeSupported(mime);
        } catch {
          return false;
        }
      });

      const recorder = selectedMime
        ? new MediaRecorder(stream, { mimeType: selectedMime })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      recorder.addEventListener('stop', async () => {
        const combinedBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        audioChunksRef.current = [];
        const audioTrack = stream.getAudioTracks()[0];
        const sampleRate = audioTrack?.getSettings()?.sampleRate;
        setIsRecording(false);
        await processRecording(combinedBlob, {
          sampleRate: sampleRate && Number.isFinite(sampleRate) ? sampleRate : undefined,
          mimeType: recorder.mimeType,
        });
        stopMediaStream();
        mediaRecorderRef.current = null;
      });

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      stopMediaStream();
      mediaRecorderRef.current = null;
      const domError = error as DOMException;
      if (domError?.name === 'NotAllowedError' || domError?.name === 'SecurityError') {
        setSpeechError('يرجى السماح للتطبيق باستخدام الميكروفون ثم المحاولة مرة أخرى');
      } else if (domError?.name === 'NotFoundError') {
        setSpeechError('لم يتم العثور على جهاز ميكروفون متاح للتسجيل');
      } else if (domError?.message) {
        setSpeechError(domError.message);
      } else {
        setSpeechError('تعذّر الوصول إلى الميكروفون');
      }
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) {
      return;
    }
    if (recorder.state !== 'inactive') {
      recorder.stop();
    }
    setIsRecording(false);
  };

  const handleTextToSpeech = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const audioContent = await synthesizeSpeech(textInput);
      const blob = base64ToBlob(audioContent, 'audio/mpeg');
      const url = URL.createObjectURL(blob);
      setAudioUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }
        return url;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء التحويل';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 dark:from-dark-900 dark:to-dark-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{texts.pageTitle}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {texts.pageDescription}
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-12">
          {/* التحويل الصوتي */}
          <div>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <TranslationToggle 
                  isLiveTranslation={isLiveTranslation}
                  onToggle={handleToggleChange}
                  className="scale-[1.2]"
                />
              </div>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                  <Mic className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{texts.speechConversionTitle}</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-right">
                {texts.speechConversionDescription}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="group relative h-full overflow-hidden border border-blue-100 dark:border-dark-700 bg-white/90 dark:bg-dark-800/90 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <CardHeader className="text-center space-y-4 pt-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
                    <Mic className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{texts.speechToTextTitle}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      {texts.speechToTextDescription}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-blue-100 dark:border-dark-700 bg-blue-50/80 dark:bg-dark-800/60 px-4 py-5 text-right">
                    <h3 className="mb-3 flex items-center justify-end gap-2 text-sm font-semibold text-blue-900">
                      <span>{texts.usageSteps}</span>
                      <Sparkles className="h-4 w-4" />
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li className="flex items-center justify-end gap-2">
                        <span>{texts.step1}</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </li>
                      <li className="flex items-center justify-end gap-2">
                        <span>{texts.step2}</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </li>
                    </ul>
                  </div>
                  {speechError && (
                    <div className="flex items-start justify-between gap-2 rounded-lg bg-red-50 dark:bg-red-900/30 px-3 py-2 text-right text-red-700 dark:text-red-300">
                      <p className="flex-1 text-sm">{speechError}</p>
                      <AlertCircle className="w-4 h-4 mt-0.5" />
                    </div>
                  )}
                    <div className="space-y-2 text-right">
                    <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-start">
                      <Button
                        className={`flex-1 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'}`}
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        disabled={isTranscribing}
                      >
                        {isRecording ? (
                          <Square className="w-4 h-4 ml-2" />
                        ) : (
                          <Mic className="w-4 h-4 ml-2" />
                        )}
                        {isRecording ? texts.stopRecording : texts.startRecording}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleResetTranscription}
                        disabled={isRecording || isTranscribing || (!transcribedText && !speechError)}
                        className="sm:w-auto dark:border-dark-600 dark:text-gray-100 dark:hover:bg-dark-700"
                      >
                        {texts.clearResult}
                      </Button>
                    </div>
                    {isRecording && (
                      <p className="text-xs text-amber-600">{texts.recordingInProgress}</p>
                    )}
                    {isTranscribing && (
                      <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span>{texts.processingRecording}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="stt-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-right">
                      {texts.outputText}
                    </label>
                    <textarea
                      id="stt-output"
                      value={transcribedText}
                      readOnly
                      placeholder={texts.outputPlaceholder}
                      className="w-full min-h-[140px] resize-y rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 px-4 py-3 text-right text-gray-800 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                    {transcriptionConfidence !== null && (
                      <p className="text-xs text-gray-500 text-right">
                        {texts.estimatedAccuracy} {(transcriptionConfidence * 100).toFixed(0)}%
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative h-full overflow-hidden border border-emerald-100 dark:border-dark-700 bg-white/90 dark:bg-dark-800/90 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <CardHeader className="text-center space-y-4 pt-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{texts.textToSpeechTitle}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      {texts.textToSpeechDescription}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label htmlFor="tts-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-right">
                      {texts.textToConvert}
                    </label>
                    <textarea
                      id="tts-input"
                      value={textInput}
                      onChange={(event) => {
                        setTextInput(event.target.value);
                        setErrorMessage(null);
                      }}
                      className="w-full min-h-[130px] resize-y rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 px-4 py-3 text-right text-gray-800 dark:text-gray-100 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder={texts.textPlaceholder}
                    />
                    {errorMessage ? (
                      <p className="text-sm text-red-600 dark:text-red-300 text-right">{errorMessage}</p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                        يتم الاعتماد على خدمة Google Text-to-Speech لإنتاج ملف MP3 جاهز للتنزيل.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                      onClick={handleTextToSpeech}
                      disabled={isLoading || !textInput.trim()}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 ml-2" />
                      )}
                      {texts.convertToSpeech}
                    </Button>
                  </div>
                  {audioUrl && (
                    <div className="rounded-lg bg-white dark:bg-dark-900 p-4 shadow-inner">
                      <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 text-right">{texts.audioPreview}</p>
                      <audio ref={audioRef} controls className="w-full">
                        <source src={audioUrl} type="audio/mpeg" />
                        {texts.browserNotSupported}
                      </audio>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* التحويل بالإشارة */}
          <div className="hidden">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">التحويل بالإشارة</h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-right">
                بعد تجربة التحويل الصوتي، يمكنك هنا تحويل الإشارات إلى كلام أو عرض الكلام على شكل فيديو بلغة الإشارة العربية.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="group relative h-full overflow-hidden border border-purple-100 dark:border-dark-700 bg-white/90 dark:bg-dark-800/90 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>
                <CardHeader className="text-center space-y-4 pt-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg transition-transform group-hover:scale-105">
                    <Hand className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">إشارة إلى كلام</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      اسمح للكاميرا بالتقاط حركة اليد وسيعمل النموذج المدمج على اقتراح الجملة المناسبة فوراً.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pb-8">
                  <div className="rounded-xl border border-purple-100 dark:border-dark-700 bg-purple-50/80 dark:bg-dark-800/60 px-4 py-5 text-right">
                    <h3 className="mb-3 flex items-center justify-end gap-2 text-sm font-semibold text-purple-900">
                      <span>خطوات سريعة</span>
                      <Sparkles className="h-4 w-4" />
                    </h3>
                    <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                      <li className="flex items-center justify-end gap-2">
                        <span>فعّل الكاميرا وابقَ داخل الإطار المحدد.</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </li>
                      <li className="flex items-center justify-end gap-2">
                        <span>تابع الجملة المقترحة وعدّل الحركة لتحسين النتيجة.</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </li>
                    </ul>
                  </div>
                  <div className="sign-detect-inline rounded-2xl border border-purple-100 dark:border-dark-700 bg-white/95 dark:bg-dark-900 shadow-inner overflow-hidden">
                    <style>{`
                      .sign-detect-inline .app-container { direction: rtl; }
                    `}</style>
                    <Suspense fallback={<div className="p-6 text-center text-sm text-gray-500">...جاري تحميل نموذج قراءة الإشارة</div>}>
                      <SignLanguageDetectionInline />
                    </Suspense>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    يعمل النموذج كما هو دون تعديل، وقد يحتاج للسماح باستخدام الكاميرا أو تشغيل خادمه الخاص.
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative h-full overflow-hidden border border-indigo-100 dark:border-dark-700 bg-white/90 dark:bg-dark-800/90 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                <CardHeader className="text-center space-y-4 pt-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-500 text-white shadow-lg transition-transform group-hover:scale-105">
                    <Languages className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">كلام إلى إشارة</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      استخدم أداة تحويل النص إلى فيديو لعرض الجمل العربية على هيئة فيديوهات بلغة الإشارة العربية.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pb-8">
                  <div className="texttov-inline rounded-2xl border border-indigo-100 dark:border-dark-700 bg-white/95 dark:bg-dark-900 shadow-inner">
                    <style>{`
                      .texttov-inline .texttov-host { min-height: auto; padding: 1.5rem 1rem; }
                      .texttov-inline .texttov-host .max-w-4xl { max-width: 100%; }
                    `}</style>
                    <Suspense fallback={<div className="p-6 text-center text-sm text-gray-500">...جاري تحميل أداة تحويل النص إلى إشارة</div>}>
                      <TextToVedioApp />
                    </Suspense>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    للوصول إلى التجربة الكاملة بملء الشاشة، استخدم الرابط «تحويل النص إلى فيديو» من شريط التنقل.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-8 border border-blue-100 dark:border-dark-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{texts.generalNotes}</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-right">
              {texts.generalNotesDescription}
            </p>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
