import { useEffect, useState } from "react"
import { ThemeProvider } from "./theme-provider"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only mounting on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with the same structure during SSR
    return <div className="contents">{children}</div>
  }

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem 
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}