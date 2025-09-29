'use client';

import { Hotel, BedDouble, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { hostelData } from '@/lib/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function HostelsPage() {
  const totalOccupancy = hostelData.reduce((acc, h) => acc + h.occupancy, 0);
  const totalCapacity = hostelData.reduce((acc, h) => acc + h.capacity, 0);
  const overallOccupancyRate = Math.round((totalOccupancy / totalCapacity) * 100);

  const chartData = hostelData.map(hostel => ({
    name: hostel.name,
    Occupancy: hostel.occupancy,
    Capacity: hostel.capacity,
  }));

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold font-headline">Hostel Management</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hostelData.length}</div>
            <p className="text-xs text-muted-foreground">Active and managed hostels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Occupancy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOccupancy} / {totalCapacity}</div>
            <p className="text-xs text-muted-foreground">Students residing in hostels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Occupancy Rate</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallOccupancyRate}%</div>
            <Progress value={overallOccupancyRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hostel Occupancy Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--card))'}} />
              <Legend />
              <Bar dataKey="Occupancy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Capacity" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hostelData.map((hostel) => {
          const occupancyRate = Math.round((hostel.occupancy / hostel.capacity) * 100);
          return (
            <Card key={hostel.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5" />
                  {hostel.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Occupancy</span>
                    <span className="text-lg font-bold">{hostel.occupancy} / {hostel.capacity}</span>
                  </div>
                  <Progress value={occupancyRate} aria-label={`${occupancyRate}% full`} />
                </div>
                 <p className="text-sm text-center font-medium">{occupancyRate}% Full</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
