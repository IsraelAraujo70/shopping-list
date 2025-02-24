'use client';

import { DashboardHeader } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PremiumPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <DashboardHeader />
      
      <div className="space-y-6">
        <div>
          <h1 className={cn(
            "text-2xl font-bold tracking-tight",
            "md:text-3xl"
          )}>
            Premium Plans
          </h1>
          <p className="text-sm text-muted-foreground">
            Upgrade your account to access premium features and enhance your shopping experience.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className={cn(
            "flex flex-col",
            "border-border/50",
            "transition-all duration-200",
            "hover:shadow-md"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Free Plan
                <span className="text-sm font-normal text-muted-foreground">
                  Current Plan
                </span>
              </CardTitle>
              <CardDescription>
                Basic features for personal use
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-3xl font-bold mb-6">$0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Up to 5 shopping lists</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Basic item management</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className={cn(
            "flex flex-col",
            "border-primary/50",
            "transition-all duration-200",
            "hover:shadow-md",
            "relative overflow-hidden"
          )}>
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
              Recommended
            </div>
            <CardHeader>
              <CardTitle className="flex items-center">
                Premium
                <Crown className="h-4 w-4 ml-2 text-primary" />
              </CardTitle>
              <CardDescription>
                Advanced features for families
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-3xl font-bold mb-6">$4.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Unlimited shopping lists</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Family sharing (up to 5 members)</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Price tracking</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Shopping history</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Upgrade to Premium
              </Button>
            </CardFooter>
          </Card>

          <Card className={cn(
            "flex flex-col",
            "border-border/50",
            "transition-all duration-200",
            "hover:shadow-md"
          )}>
            <CardHeader>
              <CardTitle>Family Plan</CardTitle>
              <CardDescription>
                Premium features for larger families
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-3xl font-bold mb-6">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">All Premium features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Family sharing (up to 10 members)</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Choose Family Plan
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 