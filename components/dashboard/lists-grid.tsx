'use client';

import { ListCard } from '@/components/dashboard/list-card';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { cn } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/loading-skeleton';

export function ListsGrid() {
  const { items: lists, loading } = useSelector((state: RootState) => state.lists);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (lists.length === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center",
        "py-12 text-center"
      )}>
        <p className="text-lg font-medium">No lists yet</p>
        <p className="text-sm text-muted-foreground">
          Create your first list by clicking the "New List" button above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {lists.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  );
} 