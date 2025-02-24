'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useDispatch } from 'react-redux';
import { removeList } from '@/lib/redux/features/listsSlice';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface List {
  id: string;
  name: string;
  items: Array<{
    id: string;
    name: string;
    completed: boolean;
  }>;
}

interface ListCardProps {
  list: List;
}

export function ListCard({ list }: ListCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const token = await getToken();
      const response = await fetch(`/api/lists/${list.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to delete list');
      }

      dispatch(removeList(list.id));
      toast({
        title: 'Success',
        description: 'List deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting list:', error);
      toast({
        title: 'Error',
        description: error instanceof Error 
          ? error.message 
          : 'Failed to delete list. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    toast({
      title: 'Coming Soon',
      description: 'Sharing functionality will be available soon!',
    });
  };

  const router = useRouter();

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "transition-all duration-200",
      "hover:shadow-md dark:hover:shadow-primary/10",
      "border-border/50",
    )}
    >
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
            onClick={handleShare}
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
            onClick={handleDelete}
            disabled={isDeleting}
            className={cn(
              "h-8 w-8",
              "text-muted-foreground",
              "hover:text-destructive hover:bg-destructive/10",
              "focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:opacity-50"
            )}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Delete list</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent 
        className="cursor-pointer"
        onClick={() => {
        router.push(`/lists/${list.id}`);
      }}>
        <p className={cn(
          "text-sm text-muted-foreground",
          "flex items-center gap-2"
        )}>
          {list.items?.length || 0} items
        </p>
      </CardContent>
    </Card>
  );
} 