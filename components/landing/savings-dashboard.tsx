'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, Users, ShoppingCart } from 'lucide-react';

const monthlyData = [
  { name: 'Jan', savings: 42 },
  { name: 'Feb', savings: 63 },
  { name: 'Mar', savings: 58 },
  { name: 'Apr', savings: 78 },
  { name: 'May', savings: 85 },
  { name: 'Jun', savings: 102 },
];

const categoryData = [
  { name: 'Groceries', value: 35 },
  { name: 'Fresh Produce', value: 25 },
  { name: 'Meat & Dairy', value: 20 },
  { name: 'Snacks', value: 10 },
  { name: 'Beverages', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const userSavingsData = [
  { name: 'Week 1', regular: 120, premium: 95 },
  { name: 'Week 2', regular: 125, premium: 92 },
  { name: 'Week 3', regular: 130, premium: 90 },
  { name: 'Week 4', regular: 128, premium: 85 },
];

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 p-1 text-primary flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function SavingsDashboard() {
  const [activeTab, setActiveTab] = useState('monthly');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
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
    <section className="w-full py-12 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl font-bold mb-3"
            variants={itemVariants}
          >
            Real Savings with Premium
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            variants={itemVariants}
          >
            See how our premium users save money on their grocery shopping
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-4 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <StatCard
              title="Average Monthly Savings"
              value="$72"
              description="Per premium user"
              icon={<DollarSign className="h-4 w-4" />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Savings Growth"
              value="+18%"
              description="Increase from last month"
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Premium Users"
              value="12,500+"
              description="Saving money every month"
              icon={<Users className="h-4 w-4" />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              title="Avg. Cart Optimization"
              value="22%"
              description="Better product choices"
              icon={<ShoppingCart className="h-4 w-4" />}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-card rounded-lg border shadow-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <Tabs defaultValue="monthly" className="w-full" onValueChange={setActiveTab}>
            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">Savings Analysis</h3>
                <p className="text-sm text-muted-foreground">Track how premium users save over time</p>
              </div>
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="category">By Category</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="monthly" className="p-6 pt-0">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Savings ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Savings']} />
                    <Bar dataKey="savings" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="category" className="p-6 pt-0">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Savings']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="comparison" className="p-6 pt-0">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userSavingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Spending ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="regular" stroke="#ff8042" name="Regular Users" strokeWidth={2} />
                    <Line type="monotone" dataKey="premium" stroke="#0088FE" name="Premium Users" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
} 