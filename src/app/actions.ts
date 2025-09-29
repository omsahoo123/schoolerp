'use server';

import { generateStudentDatabaseInsights } from '@/ai/flows/generate-student-database-insights';
import { suggestDashboardActions } from '@/ai/flows/suggest-dashboard-actions';
import { addNote, addStudent, saveAttendance, type Note, type Student } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getDashboardSuggestions(dashboardData: string) {
  try {
    const result = await suggestDashboardActions({ dashboardData });
    return { success: true, data: result.suggestedActions };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get suggestions.' };
  }
}

export async function getStudentDbInsights(databaseSummary: string) {
    try {
      const result = await generateStudentDatabaseInsights({ databaseSummary });
      return { success: true, data: result };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Failed to generate insights.' };
    }
}

export async function addContent(note: Omit<Note, 'id' | 'date'>) {
    try {
        addNote(note);
        revalidatePath('/student/notes');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to add content.' };
    }
}

export async function submitAttendance(date: string, attendance: { [studentId: string]: 'present' | 'absent' }) {
    try {
        Object.entries(attendance).forEach(([studentId, status]) => {
            saveAttendance(date, studentId, status);
        });
        revalidatePath('/student/attendance');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to submit attendance.' };
    }
}

export async function createStudent(studentData: Omit<Student, 'role' | 'avatarUrl'>) {
    try {
        addStudent(studentData);
        revalidatePath('/admin/students');
        revalidatePath('/teacher/dashboard');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to add student.' };
    }
}
