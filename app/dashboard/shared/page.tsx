'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { Share2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ListItem {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
}

interface SharedList {
  id: string;
  name: string;
  userId: string;
  items: ListItem[];
  shareId: string;
}

export default function SharedListsPage() {
  const [sharedLists, setSharedLists] = useState<SharedList[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { toast } = useToast();

  const fetchSharedLists = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch('/api/lists/shared', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load shared lists');
      }

      const data = await response.json();
      setSharedLists(data);
    } catch (error) {
      console.error('Error loading shared lists:', error);
      toast({
        title: 'Error',
        description: 'Could not load shared lists',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedLists();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Shared Lists
        </h1>
        <p className="text-sm text-muted-foreground">
          Shopping lists shared with you by other people
        </p>
      </div>

      {sharedLists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Share2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No shared lists</p>
          <p className="text-sm text-muted-foreground">
            When someone shares a list with you, it will appear here
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sharedLists.map((list) => {
            // Calculate the total number of items
            const totalItemCount = list.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
            
            return (
              <Card 
                key={list.id}
                className={cn(
                  "relative overflow-hidden",
                  "transition-all duration-200",
                  "hover:shadow-md dark:hover:shadow-primary/10",
                  "border-border/50",
                )}
              >
                <CardHeader className="pb-2">
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
                  <CardDescription>
                    Shared by: {list.userId}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      {list.items?.length || 0} {list.items?.length === 1 ? 'item type' : 'item types'}
                    </p>
                    {totalItemCount > 0 && (
                      <p className="flex items-center gap-2">
                        {totalItemCount} {totalItemCount === 1 ? 'item in total' : 'items in total'}
                      </p>
                    )}
                  </div>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 w-full"
                  >
                    <Link href={`/lists/${list.id}`}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View List
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 