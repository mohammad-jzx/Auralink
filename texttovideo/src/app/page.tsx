'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // إعادة توجيه مباشرة إلى صفحة التواصل
    router.replace('/communication')
  }, [router])

  // عرض رسالة تحميل بسيطة أثناء إعادة التوجيه
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30">
              <span className="text-6xl font-bold text-white">أ</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6"
          >
            نظام الإشارات العربية
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            تطبيق متقدم لتحويل النص العربي إلى إشارات لغة الإشارة والتعرف على الإشارات من الكاميرا
          </motion.p>

          {/* Loading Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full mx-auto"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </motion.div>

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 max-w-md mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 space-x-reverse">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-lg text-gray-700 font-medium">جاري التوجيه إلى قسم التواصل...</p>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: '📝', title: 'تحويل النص', desc: 'حول النص العربي إلى إشارات' },
              { icon: '📷', title: 'التعرف على الإشارات', desc: 'تعرف على الإشارات من الكاميرا' },
              { icon: '✨', title: 'واجهة عصرية', desc: 'تصميم جميل وسهل الاستخدام' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
