'use client';

import { Button } from '@/components/ui/button';
import { CreateListDialog } from '@/components/dashboard/create-list-dialog';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardHeader() {
  return (
    <div className={cn(
      "flex items-center justify-between",
      "pb-4 md:pb-6"
    )}>
      <div>
        <h1 className={cn(
          "text-2xl font-bold tracking-tight",
          "md:text-3xl"
        )}>
          My Lists
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and manage your shopping lists here.
        </p>
      </div>
      <CreateListDialog>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New List
        </Button>
      </CreateListDialog>
    </div>
  );
} 