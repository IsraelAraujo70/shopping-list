'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader } from '@/components/dashboard/header';
import { ListsGrid } from '@/components/dashboard/lists-grid';
import { setLists, setLoading, setError } from '@/lib/redux/features/listsSlice';
import { useAuth } from '@clerk/nextjs';
import { RootState } from '@/lib/redux/store';
import { LoadingSkeleton } from '@/components/loading-skeleton';

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
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-destructive">{error}</p>
        <p className="text-sm text-muted-foreground">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <ListsGrid />
    </div>
  );
}