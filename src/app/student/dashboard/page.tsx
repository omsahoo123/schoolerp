import Link from 'next/link';
import { CalendarCheck, CreditCard, GraduationCap, Book } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const studentFeatures = [
  {
    title: 'My Attendance',
    description: 'View your monthly and yearly attendance record.',
    icon: CalendarCheck,
    link: '/student/attendance',
    action: 'View Calendar',
  },
  {
    title: 'Fee Payment',
    description: 'Check your fee status and pay upcoming installments.',
    icon: CreditCard,
    link: '/student/fees',
    action: 'Pay Now',
  },
  {
    title: 'My Results',
    description: 'Access your semester and final exam results.',
    icon: GraduationCap,
    link: '/student/results',
    action: 'View Results',
  },
  {
    title: 'Notes & Homework',
    description: 'Download notes and view assigned homework from your teachers.',
    icon: Book,
    link: '/student/notes',
    action: 'Access Materials',
  },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome! Here's a quick overview of your academic status.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {studentFeatures.map((feature) => (
          <Card key={feature.title} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex-row gap-4 items-center">
              <div className="bg-primary/10 p-3 rounded-md">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="mt-1">{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full bg-primary hover:bg-primary/90" variant={feature.link === '/student/fees' ? 'default' : 'outline'}>
                <Link href={feature.link}>{feature.action}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
