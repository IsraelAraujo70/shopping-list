import type { Metadata } from 'next'
import {
  ClerkProvider,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { ReduxProvider } from '@/lib/redux/provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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
        <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          "flex flex-col"
        )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto px-4 md:px-8 lg:px-12">
                  <div className="flex items-center gap-2">
                    <a href="/" className="flex items-center space-x-2">
                      <span className="font-bold text-lg">Shopping List</span>
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <nav>
                      <SignedOut>
                        <SignUpButton mode="modal">
                          <Button variant="default" size="default">
                            Sign Up
                          </Button>
                        </SignUpButton>
                      </SignedOut>
                      <SignedIn>
                        <UserButton
                          afterSignOutUrl="/"
                          appearance={{
                            elements: {
                              avatarBox: "w-9 h-9"
                            }
                          }}
                        />
                      </SignedIn>
                    </nav>
                  </div>
                </div>
              </header>
              <main className="flex-1">
                <div className="container max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-6">
                  <ReduxProvider>
                    {children}
                    <Toaster />
                  </ReduxProvider>
                </div>
              </main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}