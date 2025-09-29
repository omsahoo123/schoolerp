import { Student, Teacher, Admin, AuthenticatedUser } from './types';

// In-memory database for demonstration purposes.
// In a real application, you would use a database like Firestore or a relational database.

export let admins: Admin[] = [
  { id: 'admin01', name: 'Dr. Evelyn Reed', email: 'e.reed@university.edu', role: 'admin', avatarUrl: 'https://picsum.photos/seed/avatar1/100/100' },
];

export let teachers: Teacher[] = [
  { id: 'prof001', name: 'Prof. Alan Turing', email: 'a.turing@university.edu', role: 'teacher', department: 'Computer Science', avatarUrl: 'https://picsum.photos/seed/avatar2/100/100' },
  { id: 'prof002', name: 'Prof. Marie Curie', email: 'm.curie@university.edu', role: 'teacher', department: 'Physics', avatarUrl: 'https://picsum.photos/seed/avatar3/100/100' },
];

export let students: Student[] = [
  { id: 'stu001', name: 'Alice Johnson', email: 'alice.j@university.edu', role: 'student', course: 'Computer Science', year: 2, section: 'A', avatarUrl: 'https://picsum.photos/seed/avatar4/100/100' },
  { id: 'stu002', name: 'Bob Williams', email: 'bob.w@university.edu', role: 'student', course: 'Physics', year: 3, section: 'B', avatarUrl: 'https://picsum.photos/seed/avatar5/100/100' },
  { id: 'stu003', name: 'Charlie Brown', email: 'charlie.b@university.edu', role: 'student', course: 'Mathematics', year: 1, section: 'A', avatarUrl: 'https://picsum.photos/seed/avatar6/100/100' },
  { id: 'stu004', name: 'Diana Miller', email: 'diana.m@university.edu', role: 'student', course: 'Computer Science', year: 4, section: 'C', avatarUrl: 'https://picsum.photos/seed/avatar7/100/100' },
  { id: 'stu005', name: 'Ethan Davis', email: 'ethan.d@university.edu', role: 'student', course: 'Chemistry', year: 2, section: 'B', avatarUrl: 'https://picsum.photos/seed/avatar8/100/100' },
];

export let users: AuthenticatedUser[] = [...admins, ...teachers, ...students];

export let attendanceData: Record<string, 'present' | 'absent' | 'holiday'> = {
  '2024-07-01': 'present', '2024-07-02': 'present', '2024-07-03': 'absent',
  '2024-07-04': 'present', '2024-07-05': 'present', '2024-07-06': 'holiday',
  '2024-07-07': 'holiday', '2024-07-08': 'present', '2024-07-09': 'present',
  '2024-07-10': 'present', '2024-07-11': 'absent', '2024-07-12': 'present',
  '2024-07-15': 'present', '2024-07-16': 'present',
};

export const feeData = {
  totalFees: 5000,
  paidFees: 2500,
  installments: [
    { id: 1, amount: 2500, dueDate: '2024-08-01', status: 'Paid', paymentDate: '2024-07-15' },
    { id: 2, amount: 2500, dueDate: '2025-01-15', status: 'Upcoming' },
  ],
};

export const hostelData = [
    { name: 'Stanza Living', occupancy: 180, capacity: 200 },
    { name: 'Orion Hostel', occupancy: 120, capacity: 150 },
    { name: 'Taurus Hostel', occupancy: 95, capacity: 100 },
];

export type Note = {
  id: number;
  title: string;
  type: string;
  subject: string;
  date: string;
  class: string;
  section: string;
  description?: string;
  file?: string;
};

export let notes: Note[] = [
  { id: 1, title: 'Chapter 1: Introduction to Algorithms', type: 'Notes', subject: 'Computer Science', date: '2024-07-10', class: 'Computer Science', section: 'A' },
  { id: 2, title: 'Quantum Mechanics Problem Set', type: 'Homework', subject: 'Physics', date: '2024-07-12', class: 'Physics', section: 'B' },
  { id: 3, title: 'Calculus II Review Sheet', type: 'Notes', subject: 'Mathematics', date: '2024-07-15', class: 'Mathematics', section: 'A' },
  { id: 4, title: 'Lab Report: Titration Experiment', type: 'Homework', subject: 'Chemistry', date: '2024-07-18', class: 'Chemistry', section: 'B' },
];

// Functions to modify the in-memory data
export function addNote(note: Omit<Note, 'id' | 'date'>) {
    const newNote: Note = {
        ...note,
        id: notes.length + 1,
        date: new Date().toISOString().split('T')[0],
    };
    notes.unshift(newNote);
    return newNote;
}

export function saveAttendance(date: string, studentId: string, status: 'present' | 'absent') {
    // This is a simplified example. For a real app, you'd store attendance per student, per course.
    // For now, we'll just update a single student's record. This will affect all students viewing attendance.
    attendanceData[date] = status;
}

export function addStudent(studentData: Omit<Student, 'id' | 'role' | 'avatarUrl'>) {
    const newId = `stu${(students.length + 1).toString().padStart(3, '0')}`;
    const newStudent: Student = {
        ...studentData,
        id: newId,
        role: 'student',
        avatarUrl: `https://picsum.photos/seed/${newId}/100/100`
    };
    students.push(newStudent);
    users.push(newStudent);
    return newStudent;
}
