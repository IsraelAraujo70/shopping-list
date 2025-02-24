'use client';

import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FamilyPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <DashboardHeader />
      
      <div className="space-y-6">
        <div>
          <h1 className={cn(
            "text-2xl font-bold tracking-tight",
            "md:text-3xl"
          )}>
            Family Members
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your family members and share your shopping lists with them.
          </p>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Add family members to share your shopping lists with them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  You have no family members yet.
                </p>
                <Button className={cn(
                  "transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring"
                )}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 