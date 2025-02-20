'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface List {
  id: string;
  name: string;
  items: any[];
}

interface ListCardProps {
  list: List;
}

export function ListCard({ list }: ListCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Link href={`/lists/${list.id}`}>{list.name}</Link>
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {list.items.length} items
        </div>
      </CardContent>
    </Card>
  );
}