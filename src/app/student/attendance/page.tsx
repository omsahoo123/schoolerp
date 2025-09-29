'use server';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getStudentAttendance } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { protectPage } from '@/lib/auth';
import type { Student } from '@/lib/types';
import { AttendanceCalendar } from './AttendanceCalendar';

export default async function StudentAttendancePage() {
  const user = await protectPage('student');
  const student = user as Student;
  const attendanceData = getStudentAttendance(student.id);

  const presentDays: Date[] = [];
  const absentDays: Date[] = [];
  const holidayDays: Date[] = [];

  Object.entries(attendanceData).forEach(([date, status]) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset()); // Adjust for timezone issues
    if (status === 'present') presentDays.push(d);
    else if (status === 'absent') absentDays.push(d);
    else if (status === 'holiday') holidayDays.push(d);
  });

  const attendedDays = presentDays.length;
  const totalDays = presentDays.length + absentDays.length;
  const presentPercentage = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0;

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">My Attendance</h1>
        <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 shadow-lg">
                <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
                <CardDescription>Your attendance record for the selected month.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                   <AttendanceCalendar presentDays={presentDays} absentDays={absentDays} holidayDays={holidayDays} />
                </CardContent>
            </Card>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className='flex justify-between items-center'>
                            <span className="text-muted-foreground">Total Present</span>
                            <Badge className='bg-green-500 hover:bg-green-600'>{presentDays.length} Days</Badge>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span className="text-muted-foreground">Total Absent</span>
                             <Badge variant="destructive">{absentDays.length} Days</Badge>
                        </div>
                         <div className='flex justify-between items-center'>
                            <span className="text-muted-foreground">Holidays</span>
                             <Badge variant="secondary">{holidayDays.length} Days</Badge>
                        </div>
                         <div className='flex justify-between items-center pt-2 border-t'>
                            <span className="font-semibold">Percentage</span>
                             <Badge className={cn(presentPercentage >= 75 ? 'bg-primary' : 'bg-destructive')}>{presentPercentage}%</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Legend</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-primary"></div>Present</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-destructive"></div>Absent</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-muted"></div>Holiday</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
