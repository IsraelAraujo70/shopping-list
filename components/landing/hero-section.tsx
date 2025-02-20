'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SignUpButton } from '@clerk/nextjs';

export function HeroSection() {
  const { user } = useUser();

  return (
    <section className={cn(
      "w-full py-12 md:py-24 lg:py-32",
      "bg-background"
    )}>
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className={cn(
          "flex flex-col items-center",
          "space-y-8 text-center"
        )}>
          <div className="space-y-4">
            <h1 className={cn(
              "text-3xl font-bold tracking-tighter",
              "sm:text-4xl md:text-5xl lg:text-6xl/none",
              "bg-gradient-to-r from-foreground to-foreground/80",
              "bg-clip-text text-transparent"
            )}>
              Simplified Shopping Lists
            </h1>
            <p className={cn(
              "mx-auto max-w-[700px]",
              "text-muted-foreground",
              "md:text-xl"
            )}>
              Create, share, and manage shopping lists with your family and friends. 
              Stay organized and never forget an item again.
            </p>
          </div>
          <div className="space-x-4">
            {user ? (
              <Button 
                asChild
                size="lg"
                className={cn(
                  "transition-all",
                  "hover:shadow-md",
                  "focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button 
                  size="lg"
                  className={cn(
                    "transition-all",
                    "hover:shadow-md",
                    "focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignUpButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 