'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Link2 } from 'lucide-react';
import { addContent } from '@/app/actions';
import { useRouter } from 'next/navigation';

const resultSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  class: z.string({ required_error: 'Please select a class.' }),
  section: z.string({ required_error: 'Please select a section.' }),
  subject: z.string().min(2, 'Subject is too short'),
  link: z.string().url({ message: 'Please enter a valid URL.' }),
});

export default function AddResultPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof resultSchema>>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      title: '',
      subject: '',
      link: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof resultSchema>) => {
    const result = await addContent({
      title: values.title,
      type: 'Result',
      class: values.class,
      section: values.section,
      subject: values.subject,
      link: values.link,
    });
    
    if (result.success) {
      toast({
        title: 'Result Added',
        description: `The result "${values.title}" has been shared with the class.`,
      });
      form.reset();
      router.push('/student/notes');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Upload Results</CardTitle>
        <CardDescription>Share exam or test results with your students as a PDF link.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mid-Term Exam Results" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., All Subjects" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select class..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select section..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PDF Link (URL)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Link2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="https://example.com/results.pdf" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Upload Result
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
