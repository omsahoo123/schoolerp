'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { signIn } from '@/lib/auth';
import type { UserRole } from '@/lib/types';
import { Logo } from '@/components/icons/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';

type State = {
  success: boolean;
  message: string;
  role?: UserRole;
} | undefined;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [role, setRole] = useState<UserRole | ''>('');
  
  const signInWithRole = async (prevState: State, formData: FormData): Promise<State> => {
    if (!role) {
      return { success: false, message: 'Please select a role.' };
    }
    const userId = formData.get('userId') as string;
    const password = formData.get('password') as string;

    const result = await signIn(role, userId, password);
    if (result.success) {
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${result.user.name}!`,
      });
      router.push(`/${result.user.role}/dashboard`);
      return { success: true, message: 'Login successful', role: result.user.role };
    } else {
      return { success: false, message: result.message };
    }
  };

  const [state, formAction] = useFormState(signInWithRole, undefined);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
            <Logo />
        </div>
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Welcome Back!</CardTitle>
            <CardDescription>Select your role and enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => setRole(value as UserRole)} required>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input id="userId" name="userId" placeholder="e.g., admin01, prof001, stu001" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required defaultValue="password123"/>
              </div>
              
              {state && !state.success && (
                 <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Login Failed</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}

              <SubmitButton />
            </form>
            <div className='mt-4 text-center text-sm'>
              Don't have an account? <Link href="/admissions" className='underline'>Apply for admission</Link>
            </div>

             <Alert className="mt-6 bg-secondary">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Demo Credentials</AlertTitle>
                <AlertDescription>
                    <ul className="list-disc pl-5 text-sm">
                        <li><b>Admin:</b> admin01</li>
                        <li><b>Teacher:</b> prof001</li>
                        <li><b>Student:</b> stu001</li>
                    </ul>
                    <p className="mt-2 text-sm">Password for all roles: <code className="font-bold">password123</code></p>
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={pending} aria-disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}
