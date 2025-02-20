'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addList } from '@/lib/redux/features/listsSlice';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export function CreateListDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to create list');

      const list = await response.json();
      dispatch(addList(list));
      toast({
        title: 'Success',
        description: 'List created successfully',
      });
      setOpen(false);
      setName('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create list',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">List Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter list name"
            />
          </div>
          <Button type="submit" className="w-full">
            Create List
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}