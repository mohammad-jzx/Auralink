'use client'

import SignLanguageDetection from '@/components/SignLanguageDetection';
import SignSequencePlayer from '@/components/SignSequencePlayer';
import { isArabic } from '@/lib/arabic';
import { buildSignSequence, getExampleSentences, SignSequenceItem } from '@/lib/signs';
import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';

export default function CommunicationPage() {
  const [inputText, setInputText] = useState('');
  const [sequence, setSequence] = useState<SignSequenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const exampleSentences = getExampleSentences();

  // Handle toggle change
  const handleToggle = () => {
    setIsToggled(!isToggled);
    // إعادة تعيين الحالة عند التبديل
    setInputText('');
    setSequence([]);
    setError(null);
    setHasProcessed(false);
    setIsLoading(false);
    console.log('Toggle state:', !isToggled);
  };

  // Handle text input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setError(null);
  };

  // Process text and build sequence
  const handleProcessText = useCallback(async () => {
    if (!inputText.trim()) {
      setError('يرجى إدخال نص للتحويل');
      return;
    }

    if (!isArabic(inputText)) {
      setError('يرجى إدخال نص عربي صحيح');
      return;
    }

    console.log('Processing text:', inputText);
    setIsLoading(true);
    setError(null);
    setHasProcessed(false);

    try {
      const newSequence = await buildSignSequence(inputText);
      console.log('Built sequence:', newSequence);
      setSequence(newSequence);
      setHasProcessed(true);
      
      if (newSequence.length === 0) {
        setError('لم يتم العثور على إشارات مطابقة للنص المدخل');
      }
    } catch (err) {
      console.error('Failed to build sequence:', err);
      setError('حدث خطأ أثناء معالجة النص');
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  // Handle example sentence click
  const handleExampleClick = (example: string) => {
    setInputText(example);
    setError(null);
  };

  // Handle sequence completion
  const handleSequenceComplete = useCallback(() => {
    console.log('Sequence completed');
  }, []);

  // Handle key press in textarea
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleProcessText();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            نظام التواصل بلغة الإشارة
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اختر بين تحويل النص العربي إلى إشارات أو التعرف على الإشارات من الكاميرا
          </p>
        </motion.div>

        {/* Toggle Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-center mb-8 space-x-6 space-x-reverse">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-4 space-x-reverse"
              >
                <span className="text-lg font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full">
                  {isToggled ? 'نظام التعرف على لغة الإشارة' : 'نظام تحويل النص'}
                </span>
                
                {/* Modern Toggle Button */}
                <button
                  onClick={handleToggle}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-500 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:ring-offset-2 ${
                    isToggled ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50' : 'bg-gradient-to-r from-gray-300 to-gray-400'
                  }`}
                  aria-label="Toggle between text conversion and sign detection"
                >
                  <motion.span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-all duration-500 ease-in-out ${
                      isToggled ? 'translate-x-10' : 'translate-x-1'
                    }`}
                    layout
                  />
                  
                  {/* Toggle Icons */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-between px-3"
                    initial={false}
                  >
                    <motion.span
                      className="text-sm"
                      animate={{ opacity: isToggled ? 0 : 1, scale: isToggled ? 0.8 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      📝
                    </motion.span>
                    <motion.span
                      className="text-sm"
                      animate={{ opacity: isToggled ? 1 : 0, scale: isToggled ? 1 : 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      📷
                    </motion.span>
                  </motion.div>
                </button>
              </motion.div>
            </div>

            {/* Content based on toggle state */}
            {!isToggled ? (
              // Text Conversion System
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="mb-6">
                  <label htmlFor="text-input" className="block text-lg font-semibold text-gray-700 mb-3 text-right">
                    النص العربي
                  </label>
                  <textarea
                    id="text-input"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full h-40 px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 resize-none text-right text-lg transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    dir="rtl"
                  />
                  <div className="text-sm text-gray-500 mt-2 text-right">
                    اضغط Ctrl+Enter للتحويل السريع
                  </div>
                </div>

                {/* Example Sentences */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 text-right">أمثلة للاستخدام</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {exampleSentences.map((example, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleExampleClick(example)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                      >
                        {example}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Process Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleProcessText}
                    disabled={isLoading || !inputText.trim()}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        جاري المعالجة...
                      </div>
                    ) : (
                      'عرض الإشارة'
                    )}
                  </motion.button>
                </div>

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 rounded-2xl text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // Sign Language Detection System
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center py-12"
              >
                <div className="text-gray-600">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">📷</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">تم التبديل إلى نظام التعرف على لغة الإشارة</h3>
                  <p className="text-lg text-gray-600">سيتم عرض النظام أدناه مع واجهة عصرية وجميلة</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Results Section - Only show for text conversion */}
        {!isToggled && hasProcessed && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-right">
                النتيجة
              </h3>
              
              {sequence.length > 0 ? (
                <div>
                  {/* Sequence Summary */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-4 text-right">ملخص التسلسل</h4>
                    <div className="text-right text-gray-600 space-y-2">
                      <p>النص المدخل: <span className="font-bold text-blue-600">{inputText}</span></p>
                      <p>عدد الإشارات: <span className="font-bold text-purple-600">{sequence.length}</span></p>
                      <p>الإشارات: <span className="font-bold text-indigo-600">{sequence.map(s => s.label).join(' → ')}</span></p>
                    </div>
                  </div>

                  {/* Sign Player */}
                  <SignSequencePlayer
                    sequence={sequence}
                    onSequenceComplete={handleSequenceComplete}
                    autoPlay={true}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">❌</span>
                  </div>
                  <p className="text-lg">لم يتم العثور على إشارات مطابقة</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Sign Language Detection System - Show when toggled */}
        {isToggled && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <SignLanguageDetection />
          </motion.div>
        )}
      </main>
    </div>
  );
}

