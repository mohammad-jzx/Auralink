import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'نظام الإشارات العربية',
  description: 'تطبيق لتحويل النص العربي إلى إشارات لغة الإشارة',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="arabic-text bg-gray-50">
        {children}
      </body>
    </html>
  )
}
