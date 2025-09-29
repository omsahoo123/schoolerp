'use client';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type AttendanceCalendarProps = {
  presentDays: Date[];
  absentDays: Date[];
  holidayDays: Date[];
};

export function AttendanceCalendar({ presentDays, absentDays, holidayDays }: AttendanceCalendarProps) {
  return (
    <>
      <DayPicker
        month={new Date()}
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
          .day-present { background-color: hsl(var(--primary)) !important; color: hsl(var(--primary-foreground)) !important; }
          .day-absent { background-color: hsl(var(--destructive)) !important; color: hsl(var(--destructive-foreground)) !important; }
          .day-holiday { background-color: hsl(var(--muted)) !important; color: hsl(var(--muted-foreground)) !important; }
          .rdp-day_selected {
            background-color: transparent !important;
            color: inherit !important;
          }
      `}</style>
    </>
  );
}
