import { protectPage } from '@/lib/auth';
import { students } from '@/lib/db';
import type { Teacher } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';
import { Users } from 'lucide-react';

export default async function MyClassesPage() {
  const user = await protectPage('teacher');
  const teacher = user as Teacher;

  // Filter students based on the teacher's department.
  const myStudents = students.filter(student => student.course === teacher.department);
  
  // Group students by course and section
  const classes = myStudents.reduce((acc, student) => {
    const key = `${student.course} - Section ${student.section}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(student);
    return acc;
  }, {} as Record<string, typeof myStudents>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline">My Classes</h1>
          <p className="text-muted-foreground">
            Displaying students for your department: <span className="font-semibold">{teacher.department}</span>
          </p>
        </div>
      </div>

      {Object.entries(classes).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(classes).map(([className, classStudents]) => (
            <Card key={className} className="shadow-lg">
              <CardHeader>
                <CardTitle>{className}</CardTitle>
                <CardDescription>{classStudents.length} student(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Year</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={student.avatarUrl} alt={student.name} />
                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{student.id}</Badge>
                        </TableCell>
                        <TableCell>{student.year}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              There are no students currently enrolled in your department's courses.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
