'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SidebarProvider } from '@/lib/hooks/use-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SessionProvider } from 'next-auth/react'
import { ModeProvider } from './mode'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <SessionProvider>
      <NextThemesProvider {...props}>
        <ModeProvider>
          <SidebarProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </SidebarProvider>
        </ModeProvider>
      </NextThemesProvider>
    </SessionProvider>
  )
}
