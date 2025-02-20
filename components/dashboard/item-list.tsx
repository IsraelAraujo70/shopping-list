'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

interface Item {
  id: string;
  name: string;
  estimatedPrice?: number | null;
  completed: boolean;
}

interface ItemListProps {
  listId: string;
  items: Item[];
  onItemUpdated: () => void;
}

export function ItemList({ listId, items, onItemUpdated }: ItemListProps) {
  const { toast } = useToast();
  const { getToken } = useAuth();

  const handleCheckboxChange = async (itemId: string, completed: boolean) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/lists/${listId}/items`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId,
          completed,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar item');
      }

      onItemUpdated();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar item. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        Nenhum item na lista ainda. Adicione seu primeiro item!
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li 
          key={item.id}
          className={cn(
            "flex items-center justify-between",
            "p-2 rounded-lg",
            "hover:bg-muted/50",
            "transition-colors"
          )}
        >
          <div className="flex items-center gap-2">
            <Checkbox
              checked={item.completed}
              onCheckedChange={(checked: boolean | 'indeterminate') => {
                handleCheckboxChange(item.id, checked as boolean);
              }}
              className="h-5 w-5"
            />
            <span className={cn(
              item.completed && "line-through text-muted-foreground"
            )}>
              {item.name}
            </span>
          </div>
          {item.estimatedPrice && (
            <span className={cn(
              "text-sm",
              item.completed ? "text-muted-foreground" : "text-foreground",
              "font-medium"
            )}>
              R$ {item.estimatedPrice.toFixed(2)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
} 