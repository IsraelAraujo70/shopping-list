'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setLists, setLoading, setError } from '@/lib/redux/features/listsSlice';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateListDialog } from '@/components/create-list-dialog';
import { ListCard } from '@/components/list-card';

export default function DashboardPage() {
  const { user } = useUser();
  const dispatch = useDispatch();
  const { lists, loading, error } = useSelector((state: RootState) => state.lists);

  useEffect(() => {
    const fetchLists = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch('/api/lists');
        const data = await response.json();
        dispatch(setLists(data));
      } catch (err) {
        dispatch(setError('Failed to fetch lists'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchLists();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.firstName}!</h1>
        <CreateListDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New List
          </Button>
        </CreateListDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map((list) => (
          <ListCard key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
}