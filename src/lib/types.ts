export type UserRole = 'admin' | 'teacher' | 'student';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
};

export type Student = User & {
  role: 'student';
  course: string;
  year: number;
  section: string;
};

export type Teacher = User & {
  role: 'teacher';
  department: string;
};

export type Admin = User & {
  role: 'admin';
};

export type AuthenticatedUser = Student | Teacher | Admin;
