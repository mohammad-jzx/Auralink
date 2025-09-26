'use client'

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Header() {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    // يمكن إضافة منطق إضافي هنا عند تغيير حالة التوجل
    console.log('Toggle state:', !isToggled);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">أ</span>
              </div>
              <h1 className="mr-3 text-xl font-bold text-gray-900">نظام الإشارات العربية</h1>
            </motion.div>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center space-x-3 space-x-reverse"
            >
              <span className="text-sm font-medium text-gray-700">وضع التطبيق</span>
              
              {/* Modern Toggle Button */}
              <button
                onClick={handleToggle}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isToggled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                aria-label="Toggle application mode"
              >
                <motion.span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
                    isToggled ? 'translate-x-8' : 'translate-x-1'
                  }`}
                  layout
                />
                
                {/* Toggle Icons */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-between px-2"
                  initial={false}
                >
                  <motion.span
                    className="text-xs text-gray-400"
                    animate={{ opacity: isToggled ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    🌙
                  </motion.span>
                  <motion.span
                    className="text-xs text-blue-600"
                    animate={{ opacity: isToggled ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ☀️
                  </motion.span>
                </motion.div>
              </button>
            </motion.div>

            {/* Status Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <div className={`w-2 h-2 rounded-full ${
                isToggled ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <span className="text-xs text-gray-600">
                {isToggled ? 'مفعل' : 'عادي'}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
