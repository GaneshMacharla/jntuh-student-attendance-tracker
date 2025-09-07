"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const attendanceData = [
  { month: "Jan", present: 85, absent: 15 },
  { month: "Feb", present: 88, absent: 12 },
  { month: "Mar", present: 82, absent: 18 },
  { month: "Apr", present: 90, absent: 10 },
  { month: "May", present: 87, absent: 13 },
  { month: "Jun", present: 92, absent: 8 },
]

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Overview</CardTitle>
        <CardDescription>Monthly attendance statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="present" fill="#3b82f6" name="Present %" />
            <Bar dataKey="absent" fill="#ef4444" name="Absent %" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
