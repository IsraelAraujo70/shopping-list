'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ListCardProps {
  list: {
    id: string;
    name: string;
    items?: {
      id: string;
      name: string;
      completed: boolean;
    }[];
  };
}

export function ListCard({ list }: ListCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all",
      "hover:shadow-md dark:hover:shadow-primary/10",
      "border border-border/50"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          <Link 
            href={`/lists/${list.id}`} 
            className={cn(
              "transition-colors",
              "hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            {list.name}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "h-8 w-8",
              "text-muted-foreground",
              "hover:text-foreground hover:bg-secondary",
              "focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share list</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "h-8 w-8",
              "text-muted-foreground",
              "hover:text-destructive hover:bg-destructive/10",
              "focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete list</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className={cn(
          "text-sm text-muted-foreground",
          "flex items-center gap-2"
        )}>
          {list.items?.length || 0} itens
        </p>
      </CardContent>
    </Card>
  );
}