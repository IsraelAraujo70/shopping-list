'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { AddItemForm } from '@/components/dashboard/add-item-form';
import { ItemList } from '@/components/dashboard/item-list';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { ShareDialog } from './share-dialog';

interface List {
  id: string;
  name: string;
  items: Array<{
    id: string;
    name: string;
    estimatedPrice?: number | null;
    quantity: number;
    completed: boolean;
  }>;
}

export default function ListPage({ params }: { params: { listId: string } }) {
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchList = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/lists/${params.listId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load list');
      }

      const data = await response.json();
      setList(data);
    } catch (error) {
      console.error('Error loading list:', error);
    } finally {
      setLoading(false);
    }
  }, [getToken, params.listId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium text-destructive">List not found</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // Calculate the total number of items
  const totalItemCount = list.items.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate the total estimated price
  const totalEstimatedPrice = list.items.reduce((total, item) => {
    if (item.estimatedPrice) {
      return total + (item.estimatedPrice * item.quantity);
    }
    return total;
  }, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button 
              asChild 
              variant="ghost" 
              size="icon"
              className={cn(
                "h-8 w-8",
                "hover:bg-muted",
                "-ml-2"
              )}
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{list.name}</h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground">
            <p>{list.items.length} {list.items.length === 1 ? 'item type' : 'item types'}</p>
            <p className="sm:before:content-['•'] sm:before:mx-2 sm:before:text-muted-foreground/50">
              {totalItemCount} {totalItemCount === 1 ? 'item in total' : 'items in total'}
            </p>
            {totalEstimatedPrice > 0 && (
              <p className="sm:before:content-['•'] sm:before:mx-2 sm:before:text-muted-foreground/50">
                Estimated total: ${totalEstimatedPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>
        
        <ShareDialog listId={list.id} />
      </div>

      <div className="space-y-4">
        <AddItemForm 
          listId={list.id} 
          onItemAdded={fetchList}
        />
        <ItemList 
          listId={list.id}
          items={list.items}
          onItemUpdated={fetchList}
        />
      </div>
    </div>
  );
} 