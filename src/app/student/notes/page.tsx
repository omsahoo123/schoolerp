import { Book, Download, FileText, Type } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const notesData = [
  { id: 1, title: 'Chapter 1: Introduction to Algorithms', type: 'Notes', subject: 'Computer Science', date: '2024-07-10', icon: FileText },
  { id: 2, title: 'Quantum Mechanics Problem Set', type: 'Homework', subject: 'Physics', date: '2024-07-12', icon: Type },
  { id: 3, title: 'Calculus II Review Sheet', type: 'Notes', subject: 'Mathematics', date: '2024-07-15', icon: FileText },
  { id: 4, title: 'Lab Report: Titration Experiment', type: 'Homework', subject: 'Chemistry', date: '2024-07-18', icon: Type },
];

export default function StudentNotesPage() {
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
            {notesData.map((note) => (
              <div key={note.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <note.icon className="h-8 w-8 text-muted-foreground" />
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
                <Button variant="ghost" size="icon" className="mt-2 md:mt-0">
                  <Download className="h-5 w-5" />
                  <span className="sr-only">Download</span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
