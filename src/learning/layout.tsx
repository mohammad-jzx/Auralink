import { Providers } from "@/components/providers"
import { Cairo } from "next/font/google"
import type React from "react"
import "./globals.css"

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  display: "swap",
  variable: "--font-cairo",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
