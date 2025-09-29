'use client';

import { useState } from 'react';
import { BarChart, FileText, Lightbulb, Loader, Users, Wallet } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { getDashboardSuggestions } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const kpiData = [
  { title: 'Total Students', value: '1,250', icon: Users, change: '+5.2% this month' },
  { title: 'Fee Collection', value: '$850k', icon: Wallet, change: '75% of target' },
  { title: 'Enrollment Rate', value: '92%', icon: FileText, change: '+2% from last year' },
  { title: 'Hostel Occupancy', value: '88%', icon: BarChart, change: '423/480 beds filled' },
];

const enrollmentData = [
  { month: 'Jan', students: 65 }, { month: 'Feb', students: 59 },
  { month: 'Mar', students: 80 }, { month: 'Apr', students: 81 },
  { month: 'May', students: 56 }, { month: 'Jun', students: 55 },
  { month: 'Jul', students: 40 },
];

const feesData = [
    { name: 'Paid', value: 850000, fill: 'hsl(var(--primary))' },
    { name: 'Due', value: 250000, fill: 'hsl(var(--muted))' },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setLoading(true);
    const dashboardSummary = `Total Students: ${kpiData[0].value}, Fee Collection: ${kpiData[1].value}, Enrollment Rate: ${kpiData[2].value}, Hostel Occupancy: ${kpiData[3].value}. Recent enrollment trend shows a dip in July.`;
    const result = await getDashboardSuggestions(dashboardSummary);
    if (result.success && result.data) {
      setSuggestions(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={handleGetSuggestions} disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
            Get AI-Powered Suggestions
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>AI Suggestions</DialogTitle>
            <DialogDescription>
              Based on the current dashboard data, here are some suggested actions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {loading ? (
                <div className='space-y-2'>
                    <Skeleton className='h-8 w-full'/>
                    <Skeleton className='h-8 w-4/5'/>
                    <Skeleton className='h-8 w-full'/>
                </div>
            ) : suggestions.length > 0 ? (
              <ul className="space-y-3 list-disc pl-5">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-foreground">{suggestion}</li>
                ))}
              </ul>
            ) : (
                <p className="text-sm text-muted-foreground">No suggestions available. Try generating them.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>New Student Enrollment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--card))'}} />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Fee Collection Status</CardTitle>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={feesData} layout="vertical" >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--card))'}} formatter={(value) => `$${Number(value).toLocaleString()}`}/>
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
