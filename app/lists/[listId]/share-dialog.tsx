'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Share, Trash2, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Family {
  id: string;
  name: string;
}

interface ShareDialogProps {
  listId: string;
}

interface SharedUser {
  id: string;
  userId: string;
}

export function ShareDialog({ listId }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isLoadingShares, setIsLoadingShares] = useState(false);
  
  const { getToken } = useAuth();
  const { toast } = useToast();

  const fetchFamilies = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await fetch('/api/families', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load families');
      }

      const data = await response.json();
      setFamilies(data);
    } catch (error) {
      console.error('Error loading families:', error);
      toast({
        title: 'Error',
        description: 'Could not load your families',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSharedUsers = async () => {
    try {
      setIsLoadingShares(true);
      const token = await getToken();
      const response = await fetch(`/api/lists/${listId}/share`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load shared users');
      }

      const data = await response.json();
      setSharedUsers(data);
    } catch (error) {
      console.error('Error loading shared users:', error);
      toast({
        title: 'Error',
        description: 'Could not load shared users',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingShares(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFamilies();
      fetchSharedUsers();
    }
  }, [isOpen, listId]);

  const handleShareWithFamily = async () => {
    if (!selectedFamily) {
      toast({
        title: 'Error',
        description: 'Select a family to share with',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSharing(true);
      const token = await getToken();
      const response = await fetch(`/api/lists/${listId}/share/family`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          familyId: selectedFamily,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to share with family');
      }

      await fetchSharedUsers();
      setSelectedFamily('');
      
      toast({
        title: 'Success',
        description: 'List shared with family',
      });
    } catch (error) {
      console.error('Error sharing with family:', error);
      toast({
        title: 'Error',
        description: 'Could not share list with family',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareWithUser = async () => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'Enter a user ID to share with',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSharing(true);
      const token = await getToken();
      const response = await fetch(`/api/lists/${listId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetUserId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to share with user');
      }

      await fetchSharedUsers();
      setUserId('');
      
      toast({
        title: 'Success',
        description: 'List shared with user',
      });
    } catch (error) {
      console.error('Error sharing with user:', error);
      toast({
        title: 'Error',
        description: 'Could not share list with user',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleRemoveShare = async (shareId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/lists/${listId}/share`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shareId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove share');
      }

      await fetchSharedUsers();
      
      toast({
        title: 'Success',
        description: 'Share removed successfully',
      });
    } catch (error) {
      console.error('Error removing share:', error);
      toast({
        title: 'Error',
        description: 'Could not remove share',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share List</DialogTitle>
          <DialogDescription>
            Share your shopping list with family or friends
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Share with Family</Label>
              <div className="flex space-x-2">
                <Select
                  value={selectedFamily}
                  onValueChange={setSelectedFamily}
                  disabled={isLoading || families.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a family" />
                  </SelectTrigger>
                  <SelectContent>
                    {families.map((family) => (
                      <SelectItem key={family.id} value={family.id}>
                        {family.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleShareWithFamily}
                  disabled={isSharing || !selectedFamily}
                >
                  Share
                </Button>
              </div>
              {families.length === 0 && !isLoading && (
                <p className="text-xs text-muted-foreground">
                  You don&apos;t have any families. Create a family first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId">Share with User</Label>
              <div className="flex space-x-2">
                <Input
                  id="userId"
                  placeholder="User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <Button 
                  onClick={handleShareWithUser}
                  disabled={isSharing || !userId}
                >
                  Share
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                User ID can be found in account settings
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Shared with</Label>
            {isLoadingShares ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : sharedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center border rounded-md">
                <Users className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  This list is not shared with anyone
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {sharedUsers.map((share) => (
                  <li key={share.id} className="flex items-center justify-between p-2 border rounded-md">
                    <span className="text-sm">{share.userId}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleRemoveShare(share.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 