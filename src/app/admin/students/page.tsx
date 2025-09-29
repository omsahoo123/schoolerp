'use client';

import { useState } from 'react';
import { BrainCircuit, Loader, Search, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { students } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getStudentDbInsights, createStudent } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Insights = {
    insights: string;
    suggestions: string;
} | null;

const studentSchema = z.object({
    id: z.string().min(3, "Student ID must be at least 3 characters."),
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    course: z.string({ required_error: 'Please select a course.' }),
    year: z.coerce.number().min(1).max(5),
    section: z.string({ required_error: 'Please select a section.' }),
});

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<Insights>(null);
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

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.id.toLowerCase().includes(search.toLowerCase()) ||
      student.course.toLowerCase().includes(search.toLowerCase())
  );

  const handleGenerateInsights = async () => {
    setLoading(true);
    setInsights(null);
    const summary = `The database contains ${students.length} students. Fields include: id, name, email, course, year, section. Courses offered: Computer Science, Physics, Mathematics, Chemistry.`;
    const result = await getStudentDbInsights(summary);
    if (result.success && result.data) {
        setInsights(result.data);
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
        });
    }
    setLoading(false);
  };
  
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
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle className="text-2xl font-headline">Student Database</CardTitle>
                <CardDescription>Manage and view all student records.</CardDescription>
            </div>
            <div className='flex gap-2'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button onClick={handleGenerateInsights} variant="outline">
                            <BrainCircuit className="mr-2 h-4 w-4" />
                            Analyze with AI
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                        <DialogTitle>AI-Powered Database Insights</DialogTitle>
                        <DialogDescription>
                            Generative insights on student demographics, performance, and areas for improvement.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                            {loading && <div className='space-y-2'>
                                <Skeleton className='h-4 w-1/3' />
                                <Skeleton className='h-12 w-full' />
                                <Skeleton className='h-4 w-1/4 mt-4' />
                                <Skeleton className='h-12 w-full' />
                                </div>}
                            {insights && (
                                <>
                                <div>
                                    <h3 className="font-semibold text-foreground">Insights</h3>
                                    <p className="text-sm text-muted-foreground">{insights.insights}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Suggestions</h3>
                                    <p className="text-sm text-muted-foreground">{insights.suggestions}</p>
                                </div>
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Student
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
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Section</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono">{student.id}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{student.course}</Badge>
                  </TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.section}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

    