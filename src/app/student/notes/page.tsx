import { Book, Download, FileText, Type, Youtube, Link as LinkIcon, File, Video, FileInput, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { notes } from '@/lib/db';
import { getSession } from '@/lib/auth';
import type { Student } from '@/lib/types';
import Link from 'next/link';
import { protectPage } from '@/lib/auth';

const iconMap = {
  Notes: FileText,
  Homework: Type,
  Test: File,
  PDF: FileInput,
  'YouTube Link': Youtube,
  'Zoom Link': Video,
  'Google Form': File,
  'Result': Award,
}

export default async function StudentNotesPage() {
  const user = await protectPage('student');

  if (!user || user.role !== 'student') {
    // Or redirect, or show an error message
    return <p className="text-center text-muted-foreground py-8">You must be logged in as a student to view this page.</p>;
  }

  const student = user as Student;

  const filteredNotes = notes.filter(note => note.class === student.course && note.section === student.section);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Book className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline">Notes & Homework</h1>
          <p className="text-muted-foreground">Download course materials and view assignments.</p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {filteredNotes.length > 0 ? filteredNotes.map((note) => {
              const Icon = iconMap[note.type as keyof typeof iconMap] || FileText;
              return (
              <div key={note.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Icon className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{note.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{note.date}</span>
                      <span>&bull;</span>
                      <Badge variant={note.type === 'Notes' ? 'secondary' : 'outline'}>{note.type}</Badge>
                      <span>&bull;</span>
                      <span>{note.subject}</span>
                    </div>
                  </div>
                </div>
                {note.link ? (
                  <Button asChild variant="ghost" size="icon" className="mt-2 md:mt-0">
                    <Link href={note.link} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="h-5 w-5" />
                      <span className="sr-only">Open Link</span>
                    </Link>
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="mt-2 md:mt-0">
                    <Download className="h-5 w-5" />
                    <span className="sr-only">Download</span>
                  </Button>
                )}
              </div>
            )}) : (
              <p className="text-center text-muted-foreground py-8">No notes or homework found for your class.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
