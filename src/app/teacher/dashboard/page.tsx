'use client';

import { useState } from 'react';
import { CalendarCheck, Users, Notebook, Video, PlusCircle, Loader } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createStudent } from '@/app/actions';
import { students } from '@/lib/db';

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

const studentSchema = z.object({
    id: z.string().min(3, "Student ID must be at least 3 characters."),
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    course: z.string({ required_error: 'Please select a course.' }),
    year: z.coerce.number().min(1).max(5),
    section: z.string({ required_error: 'Please select a section.' }),
});

export default function TeacherDashboard() {
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      year: 1,
      id: `stu${(students.length + 1).toString().padStart(3, '0')}`,
      password: 'password123',
    },
  });
  
  const onAddStudentSubmit = async (values: z.infer<typeof studentSchema>) => {
      const result = await createStudent(values);
      if (result.success) {
          toast({
              title: 'Student Added',
              description: `${values.name} has been added to the database.`,
          });
          form.reset({
            name: '',
            email: '',
            year: 1,
            id: `stu${(students.length + 1).toString().padStart(3, '0')}`,
            password: 'password123',
          });
          setAddStudentOpen(false);
      } else {
          toast({
              variant: 'destructive',
              title: 'Error',
              description: result.error,
          });
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Your central hub for managing classes and students.</p>
        </div>
        <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Student ID
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new student to the database.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onAddStudentSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="id" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student ID</FormLabel>
                                    <FormControl><Input placeholder="stu006" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl><Input type="password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <div className='grid grid-cols-3 gap-4'>
                        <FormField control={form.control} name="course" render={({ field }) => (
                            <FormItem className='col-span-2'>
                                <FormLabel>Course</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select course..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                                        <SelectItem value="Physics">Physics</SelectItem>
                                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="year" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        </div>
                        <FormField control={form.control} name="section" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Section</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select section..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="A">A</SelectItem>
                                        <SelectItem value="B">B</SelectItem>
                                        <SelectItem value="C">C</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                Add Student
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
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

    