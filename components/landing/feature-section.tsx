'use client';

import { Pencil, Share2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden",
      "transition-all duration-200",
      "hover:shadow-md dark:hover:shadow-primary/10",
      "border-border/50"
    )}>
      <CardHeader>
        <div className={cn(
          "mx-auto",
          "flex h-12 w-12 items-center justify-center",
          "rounded-full",
          "bg-primary/10",
          "mb-4"
        )}>
          {icon}
        </div>
        <CardTitle className="text-xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center">{description}</p>
      </CardContent>
    </Card>
  );
}

export function FeatureSection() {
  const features = [
    {
      icon: <Pencil className="h-6 w-6 text-primary" />,
      title: "Create Lists",
      description: "Create and organize your shopping lists with ease."
    },
    {
      icon: <Share2 className="h-6 w-6 text-primary" />,
      title: "Share Instantly",
      description: "Share your lists with family and friends in real-time."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Stay Secure",
      description: "Your lists are protected with enterprise-grade security."
    }
  ];

  return (
    <section className={cn(
      "w-full py-12 md:py-24 lg:py-32",
      "bg-muted/50"
    )}>
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
} 