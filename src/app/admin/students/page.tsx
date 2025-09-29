'use client';

import { useState } from 'react';
import { BrainCircuit, Loader, Search, UserPlus } from 'lucide-react';
import { students } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getStudentDbInsights } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type Insights = {
    insights: string;
    suggestions: string;
} | null;

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<Insights>(null);
  const { toast } = useToast();

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
                <Button className="bg-primary hover:bg-primary/90">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Student
                </Button>
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
