import Link from 'next/link';
import {
  Book,
  CalendarCheck,
  CreditCard,
  FileCheck,
  GraduationCap,
  Home,
  Hotel,
  LayoutDashboard,
  LogOut,
  Notebook,
  Users,
} from 'lucide-react';

import type { AuthenticatedUser } from '@/lib/types';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { UserNav } from './UserNav';
import { Logo } from '../icons/logo';
import { signOut } from '@/lib/auth';

type AppLayoutProps = {
  user: AuthenticatedUser;
  children: React.ReactNode;
};

export function AppLayout({ user, children }: AppLayoutProps) {
  const getNavItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/admin/students', label: 'Students', icon: Users },
          { href: '/admin/hostels', label: 'Hostels', icon: Hotel },
          { href: '/admissions', label: 'Admissions', icon: GraduationCap },
        ];
      case 'teacher':
        return [
          { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/teacher/classes', label: 'My Classes', icon: Users },
          { href: '/teacher/attendance', label: 'Attendance', icon: CalendarCheck },
          { href: '/teacher/notes', label: 'Notes/Homework', icon: Notebook },
          { href: '/teacher/results', label: 'Results', icon: FileCheck },
        ];
      case 'student':
        return [
          { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
          { href: '/student/fees', label: 'Fee Payment', icon: CreditCard },
          { href: '/student/results', label: 'Results', icon: GraduationCap },
          { href: '/student/notes', label: 'Notes', icon: Book },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-10 items-center justify-center p-2 group-data-[collapsible=icon]:hidden">
             <Logo />
          </div>
           <div className="hidden h-10 items-center justify-center p-2 group-data-[collapsible=icon]:flex">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <form action={signOut} className='w-full'>
                 <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Logout">
                            <button type="submit" className='w-full'>
                                <LogOut />
                                <span>Logout</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </form>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
             <h1 className="text-lg font-semibold md:text-xl capitalize font-headline">{user.role} Portal</h1>
          </div>
          <UserNav user={user} />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
