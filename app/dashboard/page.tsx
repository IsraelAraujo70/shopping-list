'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader } from '@/components/dashboard/header';
import { ListsGrid } from '@/components/dashboard/lists-grid';
import { setLists, setLoading, setError } from '@/lib/redux/features/listsSlice';
import { useAuth } from '@clerk/nextjs';
import { RootState } from '@/lib/redux/store';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CreateListDialog } from '@/components/dashboard/create-list-dialog';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { loading, error } = useSelector((state: RootState) => state.lists);

  useEffect(() => {
    const fetchLists = async () => {
      dispatch(setLoading(true));
      try {
        const token = await getToken();
        const response = await fetch('/api/lists', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch lists');
        }

        const data = await response.json();
        dispatch(setLists(data));
      } catch (error) {
        dispatch(setError('Failed to load lists'));
        console.error('Error fetching lists:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchLists();
  }, [dispatch, getToken]);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <DashboardHeader />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <DashboardHeader />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-destructive">{error}</p>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <DashboardHeader />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
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
        
        <ListsGrid />
      </div>
    </div>
  );
}