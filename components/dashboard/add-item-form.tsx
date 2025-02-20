'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface AddItemFormProps {
  listId: string;
  onItemAdded: () => void;
}

export function AddItemForm({ listId, onItemAdded }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do item é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      const response = await fetch(`/api/lists/${listId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao adicionar item');
      }

      setName('');
      setEstimatedPrice('');
      onItemAdded();
      toast({
        title: "Sucesso",
        description: "Item adicionado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar item. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1 space-y-2">
        <Input
          type="text"
          placeholder="Nome do item"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={cn(
            "w-full",
            "focus-visible:ring-2 focus-visible:ring-ring"
          )}
        />
        <Input
          type="number"
          placeholder="Preço estimado (opcional)"
          value={estimatedPrice}
          onChange={(e) => setEstimatedPrice(e.target.value)}
          step="0.01"
          min="0"
          className={cn(
            "w-full",
            "focus-visible:ring-2 focus-visible:ring-ring"
          )}
        />
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className={cn(
          "h-10",
          "transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Adicionar item</span>
      </Button>
    </form>
  );
} 