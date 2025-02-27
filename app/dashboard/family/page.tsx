'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { Plus, Users, UserPlus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DashboardHeader } from '@/components/dashboard/header';

interface FamilyMember {
  id: string;
  userId: string;
  role: string;
}

interface Family {
  id: string;
  name: string;
  ownerId: string;
  members: FamilyMember[];
}

export default function FamilyPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [isCreatingFamily, setIsCreatingFamily] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  
  const { getToken, userId } = useAuth();
  const { toast } = useToast();

  const fetchFamilies = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const handleCreateFamily = async () => {
    if (!newFamilyName.trim()) {
      toast({
        title: 'Error',
        description: 'The family name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCreatingFamily(true);
      const token = await getToken();
      const response = await fetch('/api/families', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newFamilyName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create family');
      }

      const newFamily = await response.json();
      setFamilies([...families, newFamily]);
      setNewFamilyName('');
      setOpenCreateDialog(false);
      
      toast({
        title: 'Success',
        description: 'Family created successfully',
      });
    } catch (error) {
      console.error('Error creating family:', error);
      toast({
        title: 'Error',
        description: 'Could not create family',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingFamily(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedFamily) return;
    
    if (!newMemberId.trim()) {
      toast({
        title: 'Error',
        description: 'The user ID is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsAddingMember(true);
      const token = await getToken();
      const response = await fetch(`/api/families/${selectedFamily.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetUserId: newMemberId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to add member');
      }

      await fetchFamilies();
      setNewMemberId('');
      setOpenInviteDialog(false);
      
      toast({
        title: 'Success',
        description: 'Member added successfully',
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not add member',
        variant: 'destructive',
      });
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveMember = async (familyId: string, memberId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/families/${familyId}/members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetUserId: memberId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      await fetchFamilies();
      
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description: 'Could not remove member',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <DashboardHeader />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <DashboardHeader />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Families</h1>
          <p className="text-sm text-muted-foreground">
            Manage your families and share shopping lists
          </p>
        </div>
        
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Family
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Family</DialogTitle>
              <DialogDescription>
                Create a new family to share shopping lists
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Family Name</Label>
                <Input
                  id="name"
                  placeholder="Ex: My Family"
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateFamily}
                disabled={isCreatingFamily}
              >
                {isCreatingFamily ? 'Criando...' : 'Criar Família'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {families.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No families found</p>
          <p className="text-sm text-muted-foreground">
            Create your first family by clicking the &quot;New Family&quot; button
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {families.map((family) => (
            <Card key={family.id}>
              <CardHeader>
                <CardTitle>{family.name}</CardTitle>
                <CardDescription>
                  {family.members.length} {family.members.length === 1 ? 'membro' : 'membros'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Membros:</h3>
                  <ul className="space-y-1">
                    {family.members.map((member) => (
                      <li key={member.id} className="flex items-center justify-between text-sm">
                        <span>
                          {member.userId} 
                          {member.role === 'owner' && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Proprietário
                            </span>
                          )}
                        </span>
                        {family.ownerId === userId && member.userId !== userId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleRemoveMember(family.id, member.userId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog open={openInviteDialog} onOpenChange={setOpenInviteDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedFamily(family)}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Convidar Membro
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Convidar Membro</DialogTitle>
                      <DialogDescription>
                        Adicione um novo membro à família {selectedFamily?.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="userId">ID do Usuário</Label>
                        <Input
                          id="userId"
                          placeholder="Ex: user_2aB3cD4e5F6g7H8i"
                          value={newMemberId}
                          onChange={(e) => setNewMemberId(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          O ID do usuário pode ser encontrado nas configurações da conta
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleAddMember}
                        disabled={isAddingMember}
                      >
                        {isAddingMember ? 'Adicionando...' : 'Adicionar Membro'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 