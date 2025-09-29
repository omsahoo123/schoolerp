'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { students } from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { submitAttendance } from '@/app/actions';

type AttendanceStatus = { [studentId: string]: 'present' | 'absent' };

export default function AttendancePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus>({});
  const { toast } = useToast();
  const router = useRouter();

  const handleMarkAll = (status: 'present' | 'absent') => {
    if (!date) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a date first.' });
      return;
    }
    if (!selectedClass || !selectedSection) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a class and section.' });
        return;
    }
    const newAttendance: AttendanceStatus = {};
    filteredStudents.forEach(student => {
        newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
    toast({
        title: 'Attendance Marked',
        description: `All students marked as ${status} for ${format(date, 'PPP')}.`,
      });
  };
  
  const handleStudentAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendance(prev => ({
        ...prev,
        [studentId]: isPresent ? 'present' : 'absent',
    }));
  };

  const filteredStudents = students.filter(student => student.course === selectedClass && student.section === selectedSection);

  const handleSubmit = async () => {
    if (!date) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a date.' });
        return;
    }
    
    const result = await submitAttendance(format(date, 'yyyy-MM-dd'), attendance);

    if (result.success) {
      toast({
          title: 'Attendance Submitted',
          description: 'The attendance record has been saved successfully.',
      });
      router.refresh();
    } else {
       toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
       });
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 items-start">
      <div className="md:col-span-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Mark Attendance</CardTitle>
            <CardDescription>Select a class, section, and date to mark student attendance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class/Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Section A</SelectItem>
                    <SelectItem value="B">Section B</SelectItem>
                    <SelectItem value="C">Section C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

               {selectedClass && selectedSection && (
                <Card>
                    <CardHeader>
                        <CardTitle>Student List</CardTitle>
                        <CardDescription>
                            Class: <Badge variant="secondary">{selectedClass}</Badge> | Section: <Badge variant="secondary">{selectedSection}</Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredStudents.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={student.avatarUrl} alt={student.name} />
                                                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{student.name}</p>
                                                <p className="text-xs text-muted-foreground">{student.id}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Checkbox 
                                                    id={`absent-${student.id}`}
                                                    checked={attendance[student.id] === 'absent'}
                                                    onCheckedChange={(checked) => handleStudentAttendanceChange(student.id, !checked)}
                                                    className="data-[state=checked]:bg-destructive"
                                                />
                                                <label htmlFor={`absent-${student.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Absent
                                                </label>

                                                <Checkbox
                                                    id={`present-${student.id}`}
                                                    checked={attendance[student.id] === 'present'}
                                                    onCheckedChange={(checked) => handleStudentAttendanceChange(student.id, !!checked)}
                                                />
                                                <label htmlFor={`present-${student.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Present
                                                </label>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        ) : (
                            <p className="text-center text-muted-foreground py-4">No students found for this class and section.</p>
                        )}
                         <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => handleMarkAll('absent')}>Mark All Absent</Button>
                            <Button variant="outline" onClick={() => handleMarkAll('present')}>Mark All Present</Button>
                            <Button onClick={handleSubmit}>Submit Attendance</Button>
                        </div>
                    </CardContent>
                </Card>
               )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-0 rounded-md border"
                />
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>1. Select the class and section from the dropdowns.</p>
            <p>2. Choose a date from the calendar.</p>
            <p>3. Mark individual students or use the "Mark All" buttons for quick entry.</p>
            <p>4. Click "Submit Attendance" to save the record.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
