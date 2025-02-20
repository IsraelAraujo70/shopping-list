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
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface CreateListDialogProps {
  children: React.ReactNode;
}

export function CreateListDialog({ children }: CreateListDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "List name is required",
        variant: "destructive",
      });
      return;
    }

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
      <DialogContent className={cn(
        "sm:max-w-[425px]",
        "gap-6"
      )}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">New List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              List Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter list name"
              className={cn(
                "w-full",
                "focus-visible:ring-2 focus-visible:ring-ring"
              )}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className={cn(
                "w-full sm:w-auto",
                "transition-colors",
                "focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              Create List
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 