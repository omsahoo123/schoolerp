'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { attendanceData } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function StudentAttendancePage() {
  const [month, setMonth] = useState<Date>(new Date());

  const presentDays: Date[] = [];
  const absentDays: Date[] = [];
  const holidayDays: Date[] = [];

  Object.entries(attendanceData).forEach(([date, status]) => {
    if (status === 'present') presentDays.push(new Date(date));
    else if (status === 'absent') absentDays.push(new Date(date));
    else if (status === 'holiday') holidayDays.push(new Date(date));
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
                    <DayPicker
                        month={month}
                        onMonthChange={setMonth}
                        mode="multiple"
                        min={0}
                        selected={[...presentDays, ...absentDays, ...holidayDays]}
                        modifiers={{
                            present: presentDays,
                            absent: absentDays,
                            holiday: holidayDays,
                        }}
                        modifiersClassNames={{
                            present: 'day-present',
                            absent: 'day-absent',
                            holiday: 'day-holiday',
                        }}
                    />
                    <style>{`
                        .day-present { background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); }
                        .day-absent { background-color: hsl(var(--destructive)); color: hsl(var(--destructive-foreground)); }
                        .day-holiday { background-color: hsl(var(--muted)); color: hsl(var(--muted-foreground)); }
                    `}</style>
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
