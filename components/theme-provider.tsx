"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ReactNode } from "react"

export function ThemeProvider({
  children,
  ...props
}: {
  children: ReactNode
  [key: string]: any
}) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark" {...props}>
      {children}
    </NextThemesProvider>
  )
}
