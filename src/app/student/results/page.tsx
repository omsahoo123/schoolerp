import { GraduationCap, Percent } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const resultsData = [
  { subject: 'Data Structures', grade: 'A', score: 92, credits: 4 },
  { subject: 'Quantum Physics', grade: 'B+', score: 88, credits: 3 },
  { subject: 'Linear Algebra', grade: 'A-', score: 90, credits: 3 },
  { subject: 'Organic Chemistry', grade: 'B', score: 82, credits: 4 },
  { subject: 'Software Engineering', grade: 'C+', score: 78, credits: 3 },
];

export default function StudentResultsPage() {
    const totalCredits = resultsData.reduce((acc, r) => acc + r.credits, 0);
    const weightedScore = resultsData.reduce((acc, r) => acc + (r.score * r.credits), 0);
    const gpa = (weightedScore / (totalCredits * 100)) * 4.0;
    const overallPercentage = (weightedScore / (totalCredits * 100)) * 100;

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return 'bg-green-500 text-white';
        if (grade.startsWith('B')) return 'bg-blue-500 text-white';
        if (grade.startsWith('C')) return 'bg-yellow-500 text-black';
        return 'bg-red-500 text-white';
    }


  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <GraduationCap className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline">My Results</h1>
          <p className="text-muted-foreground">Your academic performance for the current semester.</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SGPA</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{gpa.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Semester Grade Point Average</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Percentage</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{overallPercentage.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">Based on current semester scores</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semester Grade Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Credits</TableHead>
                <TableHead className="text-right">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultsData.map((result) => (
                <TableRow key={result.subject}>
                  <TableCell className="font-medium">{result.subject}</TableCell>
                  <TableCell className="text-center">{result.score}</TableCell>
                  <TableCell className="text-center">{result.credits}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={cn('w-10 justify-center', getGradeColor(result.grade))}>{result.grade}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
