"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", attendance: 85 },
  { month: "Feb", attendance: 78 },
  { month: "Mar", attendance: 92 },
  { month: "Apr", attendance: 88 },
  { month: "May", attendance: 76 },
  { month: "Jun", attendance: 89 },
]

export function FacultyAttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Attendance Trends</CardTitle>
        <CardDescription>Average attendance percentage across your courses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attendance" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
