'use client';

import { useUser } from '@clerk/nextjs';
import { HeroSection } from '@/components/landing/hero-section';
import { FeatureSection } from '@/components/landing/feature-section';
import { SiteFooter } from '@/components/landing/site-footer';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PremiumFeatureSection } from '@/components/landing/premium-propaganda';

export default function Home() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <PremiumFeatureSection/>
      </main>
      <SiteFooter />
    </div>
  );
}