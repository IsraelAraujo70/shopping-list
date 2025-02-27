'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { AddItemForm } from '@/components/dashboard/add-item-form';
import { ItemList } from '@/components/dashboard/item-list';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/loading-skeleton';

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

  const fetchList = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/lists/${params.listId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar a lista');
      }

      const data = await response.json();
      setList(data);
    } catch (error) {
      console.error('Erro ao carregar lista:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [params.listId]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium text-destructive">Lista não encontrada</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Voltar para o Dashboard</Link>
        </Button>
      </div>
    );
  }

  // Calcular a quantidade total de itens
  const totalItemCount = list.items.reduce((total, item) => total + item.quantity, 0);
  
  // Calcular o valor total estimado
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
                <span className="sr-only">Voltar</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{list.name}</h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground">
            <p>{list.items.length} {list.items.length === 1 ? 'tipo de item' : 'tipos de itens'}</p>
            <p className="sm:before:content-['•'] sm:before:mx-2 sm:before:text-muted-foreground/50">
              {totalItemCount} {totalItemCount === 1 ? 'item no total' : 'itens no total'}
            </p>
            {totalEstimatedPrice > 0 && (
              <p className="sm:before:content-['•'] sm:before:mx-2 sm:before:text-muted-foreground/50">
                Total estimado: ${totalEstimatedPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>
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