'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-8 p-8">
      <div className="space-y-4">
        <Skeleton className="h-12 w-[300px] mx-auto" />
        <Skeleton className="h-4 w-[500px] mx-auto" />
        <Skeleton className="h-4 w-[400px] mx-auto" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
            <Skeleton className="h-4 w-[150px] mx-auto mb-2" />
            <Skeleton className="h-4 w-[200px] mx-auto" />
          </Card>
        ))}
      </div>
    </div>
  );
} 