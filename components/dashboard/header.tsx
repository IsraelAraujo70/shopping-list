'use client';

import { Plus, Users, Crown, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DashboardHeader() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="space-y-4">
      <nav className="border-b">
        <div className="flex h-10 items-center space-x-4">
          <Link 
            href="/dashboard" 
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-sm font-medium transition-colors",
              "hover:text-primary",
              isActive('/dashboard') 
                ? "border-b-2 border-primary text-primary" 
                : "text-muted-foreground"
            )}
          >
            <ListChecks className="h-4 w-4 mr-1" />
            Lists
          </Link>
          <Link 
            href="/dashboard/family" 
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-sm font-medium transition-colors",
              "hover:text-primary",
              isActive('/dashboard/family') 
                ? "border-b-2 border-primary text-primary" 
                : "text-muted-foreground"
            )}
          >
            <Users className="h-4 w-4 mr-1" />
            Family
          </Link>
          <Link 
            href="/dashboard/premium" 
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-sm font-medium transition-colors",
              "hover:text-primary",
              isActive('/dashboard/premium') 
                ? "border-b-2 border-primary text-primary" 
                : "text-muted-foreground"
            )}
          >
            <Crown className="h-4 w-4 mr-1" />
            Premium
          </Link>
        </div>
      </nav>
    </div>
  );
} 