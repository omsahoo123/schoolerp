import { AppLayout } from '@/components/layout/AppLayout';
import { protectPage } from '@/lib/auth';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await protectPage('student');
  return <AppLayout user={user}>{children}</AppLayout>;
}
