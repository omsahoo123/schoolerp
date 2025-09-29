'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { users } from '@/lib/data';
import type { AuthenticatedUser, UserRole } from './types';

const FAKE_PASSWORD = 'password123';
const COOKIE_NAME = 'school_erp_session';

export async function signIn(role: UserRole, userId: string, password?: string) {
  const user = users.find(u => u.id === userId && u.role === role);

  if (!user || password !== FAKE_PASSWORD) {
    return { success: false, message: 'Invalid credentials. Please try again.' };
  }

  const sessionData = { userId: user.id, role: user.role };
  cookies().set(COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  // This will now handle the redirection on the server side.
  redirect(`/${user.role}/dashboard`);

  // This part is effectively unreachable but kept for type consistency if redirect doesn't happen
  return { success: true, user };
}

export async function signOut() {
  cookies().delete(COOKIE_NAME);
  redirect('/login');
}

export async function getSession(): Promise<{ user: AuthenticatedUser | null; isAuthenticated: boolean }> {
  const sessionCookie = cookies().get(COOKIE_NAME);

  if (!sessionCookie) {
    return { user: null, isAuthenticated: false };
  }

  try {
    const { userId, role } = JSON.parse(sessionCookie.value);
    const user = users.find(u => u.id === userId && u.role === role) as AuthenticatedUser | undefined;

    if (!user) {
      return { user: null, isAuthenticated: false };
    }

    return { user, isAuthenticated: true };
  } catch {
    return { user: null, isAuthenticated: false };
  }
}

export async function protectPage(role?: UserRole | UserRole[]) {
    const { user, isAuthenticated } = await getSession();
    
    if (!isAuthenticated) {
        redirect('/login');
    }

    if (role) {
        const roles = Array.isArray(role) ? role : [role];
        if (!roles.includes(user.role)) {
            // Redirect to a more appropriate page based on user's actual role
            redirect(`/${user.role}/dashboard`);
        }
    }

    return user;
}
