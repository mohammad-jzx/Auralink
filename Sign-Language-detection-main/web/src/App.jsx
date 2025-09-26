import React, { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [currentSign, setCurrentSign] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [detectionHistory, setDetectionHistory] = useState([])

  // محاكاة تحديث البيانات (يمكن ربطها بالبيانات الفعلية لاحقاً)
  useEffect(() => {
    if (!isCameraOn) return

    const interval = setInterval(() => {
      const signs = ['Hello', 'I love you', 'No', 'Okay', 'Please', 'Thank you', 'Yes']
      const randomSign = signs[Math.floor(Math.random() * signs.length)]
      const newConfidence = Math.random() * 100
      
      setCurrentSign(randomSign)
      setConfidence(newConfidence)

      // إضافة النتيجة إلى التاريخ
      if (newConfidence > 50) { // فقط النتائج الموثوقة
        const newDetection = {
          id: Date.now(),
          sign: randomSign,
          confidence: newConfidence.toFixed(1),
          timestamp: new Date().toLocaleTimeString('ar-SA')
        }
        setDetectionHistory(prev => [newDetection, ...prev.slice(0, 9)]) // الاحتفاظ بـ 10 نتائج فقط
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isCameraOn])

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn)
    if (!isCameraOn) {
      setDetectionHistory([]) // مسح التاريخ عند تشغيل الكاميرا
    }
  }

  const clearHistory = () => {
    setDetectionHistory([])
  }

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <h1 className="app-title">
          نظام التعرف على لغة الإشارة
        </h1>
        <p className="app-subtitle">
          تقنية ذكية للتواصل مع الصم والبكم
        </p>
      </div>

      <div className="main-grid">
        
        {/* Main Video Section */}
        <div className="card video-section">
          <div className="video-controls-header">
            <div className="connection-status">
              <div className={`status-indicator ${isConnected ? 'connected' : ''}`} />
              <span className="status-text">
                {isConnected ? 'متصل' : 'غير متصل'}
              </span>
            </div>
            
            {/* زر تشغيل/إيقاف الكاميرا */}
            <button 
              className={`camera-toggle-btn ${isCameraOn ? 'camera-on' : 'camera-off'}`}
              onClick={toggleCamera}
            >
              {isCameraOn ? '🟢 إيقاف الكاميرا' : '🔴 تشغيل الكاميرا'}
            </button>
          </div>
          
          <div className="video-container">
            {isCameraOn ? (
              <img 
                className="video-stream"
                src="/video_feed" 
                alt="بث الفيديو المباشر"
                onLoad={() => setIsConnected(true)}
                onError={() => setIsConnected(false)}
              />
            ) : (
              <div className="camera-off-placeholder">
                <div className="camera-off-icon">📷</div>
                <p>الكاميرا متوقفة</p>
                <p>اضغط على زر التشغيل لبدء التعرف</p>
              </div>
            )}
            
            {/* Overlay for video info only */}
            {isCameraOn && (
              <div className="video-overlay">
                <div className="video-controls">
                  <span className="video-info">البث المباشر</span>
                </div>
              </div>
            )}
          </div>
          
          {/* أزرار التحكم الإضافية تحت الفيديو */}
          {isCameraOn && (
            <div className="additional-controls">
              <button className="control-btn">
                ⏸️ إيقاف مؤقت
              </button>
              <button className="control-btn">
                📷 التقاط صورة
              </button>
            </div>
          )}
        </div>


      </div>

      {/* Footer */}
      <div className="app-footer">
        <p>تم تطوير هذا النظام باستخدام تقنيات الذكاء الاصطناعي المتقدمة</p>
        <p>© 2024 نظام التعرف على لغة الإشارة - جميع الحقوق محفوظة</p>
      </div>
    </div>
  )
}


