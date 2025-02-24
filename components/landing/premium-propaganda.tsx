'use client';

import { BarChart3, Brain, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AlternatingFeatureProps {
  title: string;
  description: string;
  imagePosition: 'left' | 'right';
  icon: React.ReactNode;
}

function AlternatingFeature({ title, description, imagePosition, icon }: AlternatingFeatureProps) {
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

  return (
    <motion.div 
      className={cn(
        "flex flex-col md:flex-row items-center gap-12 py-16",
        imagePosition === 'right' && "md:flex-row-reverse"
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <motion.div 
        className="w-full md:w-1/2"
        variants={itemVariants}
      >
        <div className="bg-muted aspect-video rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
          <div className="text-muted-foreground text-lg">Image Placeholder</div>
        </div>
      </motion.div>
      <motion.div 
        className="w-full md:w-1/2 space-y-6"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center",
            "rounded-full",
            "bg-primary/10"
          )}>
            {icon}
          </div>
          <h3 className="text-3xl font-bold">{title}</h3>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
        <motion.button
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Learn More
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export function PremiumFeatureSection() {
  const premiumFeatures = [
    {
      title: "Financial Control",
      description: "Track your grocery spending in detail, see how much you've saved on each purchase, and set savings goals. Our financial dashboard offers intuitive charts and detailed reports for complete budget control.",
      imagePosition: 'left' as const,
      icon: <BarChart3 className="h-6 w-6 text-primary" />
    },
    {
      title: "AI-Powered Recommendations",
      description: "Our artificial intelligence analyzes your shopping habits and suggests personalized strategies to save money. Get tips on cheaper alternative products, best times to buy certain items, and how to build a healthier diet without spending more.",
      imagePosition: 'right' as const,
      icon: <Brain className="h-6 w-6 text-primary" />
    },
    {
      title: "Share your lists limitlessly",
      description: "Share your lists with your family and friends, and they can add items to your list. You can also add items to your list from their lists.",
      imagePosition: 'left' as const,
      icon: <Users className="h-6 w-6 text-primary" />
    }
  ];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.3
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7 }
    }
  };

  return (
    <section className={cn(
      "w-full py-16 md:py-24 lg:py-32",
      "bg-muted/50"
    )}>
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <motion.h2 
            className="text-4xl font-bold mb-6"
            variants={headerVariants}
          >
            Premium Features
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            variants={headerVariants}
          >
            Unlock the full potential of your shopping experience with our exclusive premium subscriber features.
          </motion.p>
        </motion.div>

        <div className="space-y-16">
          {premiumFeatures.map((feature, index) => (
            <AlternatingFeature 
              key={index}
              title={feature.title}
              description={feature.description}
              imagePosition={feature.imagePosition}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 