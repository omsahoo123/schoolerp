import { AppLayout } from '@/components/layout/AppLayout';
import { protectPage } from '@/lib/auth';

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const user = await protectPage('teacher');
  return <AppLayout user={user}>{children}</AppLayout>;
}
