'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SignUpButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
export function CallToAction() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleLearnMore = () => {
    router.push('/premium');
  };

  const { user } = useUser();

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="bg-primary p-8 md:p-12 text-primary-foreground">
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="h-5 w-5" />
                      <span className="text-sm font-medium">Premium Plan</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Ready to start saving?
                    </h2>
                    <p className="mb-6 text-primary-foreground/80">
                      Join thousands of smart shoppers who are saving money every month with our premium features.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground"></div>
                        <span>Financial tracking & insights</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground"></div>
                        <span>AI-powered shopping recommendations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground"></div>
                        <span>Advanced budget optimization</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <motion.div variants={itemVariants} className="space-y-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>Unlock premium features today</span>
                    </div>
                    <h3 className="text-2xl font-semibold">
                      Start your premium journey
                    </h3>
                    <p className="text-muted-foreground">
                      Create an account to explore all our premium features and start saving on your grocery shopping immediately.
                    </p>
                    {!user ? (
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <SignUpButton mode="modal">
                        <Button 
                          size="lg" 
                          className="w-full sm:w-auto"
                        >
                          Sign up now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </SignUpButton>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={handleLearnMore}
                        className="w-full sm:w-auto"
                      >
                        Learn more
                      </Button>
                    </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={handleLearnMore}
                      >
                        Learn more
                      </Button>
                    )}
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
} 