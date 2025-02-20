import type { Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { ReduxProvider } from '@/lib/redux/provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shared Shopping List',
  description: 'Collaborative shopping list management for families and groups',
}

// Força renderização dinâmica
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            <ReduxProvider>
              {children}
              <Toaster />
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}