'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SiteFooter() {
  return (
    <footer className={cn(
      "w-full border-t border-border/40",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className={cn(
        "container mx-auto flex flex-col gap-4 py-6 px-4",
        "sm:flex-row sm:items-center",
        "md:px-8 lg:px-12"
      )}>
        <p className="text-xs text-muted-foreground">
          © 2025 SharedList. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Button variant="link" size="sm" asChild className="text-xs">
            <Link href="#">Terms of Service</Link>
          </Button>
          <Button variant="link" size="sm" asChild className="text-xs">
            <Link href="#">Privacy</Link>
          </Button>
        </nav>
      </div>
    </footer>
  );
} 