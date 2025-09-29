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
    const d = new Date(date);
    if (status === 'present') presentDays.push(d);
    else if (status === 'absent') absentDays.push(d);
    else if (status === 'holiday') holidayDays.push(d);
  });
  
  const presentPercentage = Math.round((presentDays.length / (presentDays.length + absentDays.length)) * 100);

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
                        styles={{
                            day: {
                                borderRadius: '9999px',
                            }
                        }}
                    />
                    <style>{`
                        .day-present { 
                            background-color: #2ecc71; 
                            color: white;
                        }
                        .day-present:hover {
                            background-color: #27ae60 !important;
                            color: white !important;
                        }
                        .day-absent { 
                            background-color: #e74c3c; 
                            color: white; 
                        }
                         .day-absent:hover {
                            background-color: #c0392b !important;
                            color: white !important;
                        }
                        .day-holiday { 
                            background-color: #95a5a6; 
                            color: white;
                        }
                        .day-holiday:hover {
                            background-color: #7f8c8d !important;
                            color: white !important;
                        }
                        .rdp-day_selected:not([disabled]):hover {
                             background-color: inherit;
                        }
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
                             <Badge className={cn(presentPercentage > 75 ? 'bg-primary' : 'bg-destructive')}>{presentPercentage}%</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Legend</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#2ecc71]"></div>Present</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#e74c3c]"></div>Absent</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#95a5a6]"></div>Holiday</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
