'use client';

import { useState } from 'react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AttendancePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleMarkAttendance = (status: 'present' | 'absent') => {
    if (date) {
      toast({
        title: 'Attendance Marked',
        description: `All students marked as ${status} for ${format(date, 'PPP')}.`,
      });
    } else {
        toast({
            variant: 'destructive',
            title: 'No Date Selected',
            description: 'Please select a date to mark attendance.',
        })
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Mark Attendance</CardTitle>
            <CardDescription>Select a class, section, and date to mark student attendance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class/Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="phy">Physics</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Section A</SelectItem>
                    <SelectItem value="b">Section B</SelectItem>
                    <SelectItem value="c">Section C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-md border flex justify-center">
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-0"
                />
              </div>
               <div className="flex justify-end gap-2">
                <Button variant="destructive" onClick={() => handleMarkAttendance('absent')}>
                  Mark All Absent
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleMarkAttendance('present')}>
                  Mark All Present
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>1. Select the class and section from the dropdowns.</p>
            <p>2. Choose a date from the calendar.</p>
            <p>3. Mark individual students or use the "Mark All" buttons for quick entry.</p>
            <p>4. Your changes are saved automatically.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
