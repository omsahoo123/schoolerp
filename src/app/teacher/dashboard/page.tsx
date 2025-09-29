import { CalendarCheck, Users, Notebook, Video, PlusCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const dashboardCards = [
  {
    title: 'Manage Attendance',
    description: 'Mark and review student attendance for your classes.',
    icon: CalendarCheck,
    link: '/teacher/attendance',
    action: 'Open Calendar',
  },
  {
    title: 'My Classes',
    description: 'View your assigned classes and student lists.',
    icon: Users,
    link: '#',
    action: 'View Classes',
  },
  {
    title: 'Add Content',
    description: 'Upload homework, notes, or create tests for students.',
    icon: Notebook,
    link: '/teacher/notes',
    action: 'Create Content',
  },
  {
    title: 'Schedule Online Class',
    description: 'Set up a new online lecture or discussion session.',
    icon: Video,
    link: '#',
    action: 'Schedule Now',
  },
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Your central hub for managing classes and students.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Student ID
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {dashboardCards.map((card) => (
          <Card key={card.title} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex-row gap-4 items-center">
              <div className="bg-primary/10 p-3 rounded-md">
                <card.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription className="mt-1">{card.description}</CardDescription>
              </div>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link href={card.link}>{card.action}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
