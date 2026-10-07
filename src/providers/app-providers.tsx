"use client"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/theme-provider"
import type { ReactNode } from "react"

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      {children}
      <Toaster position="top-right" closeButton />
    </ThemeProvider>
  )
}
