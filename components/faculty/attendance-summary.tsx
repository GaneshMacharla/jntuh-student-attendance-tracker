"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface AttendanceSummaryProps {
  facultyId: string
}

// Mock data - in real app, this would come from props or API
const weeklyData = [
  { day: "Mon", present: 85, absent: 15 },
  { day: "Tue", present: 92, absent: 8 },
  { day: "Wed", present: 78, absent: 22 },
  { day: "Thu", present: 88, absent: 12 },
  { day: "Fri", present: 95, absent: 5 },
]

const courseData = [
  { name: "Machine Learning", attendance: 88, color: "#3b82f6" },
  { name: "Database Systems", attendance: 92, color: "#10b981" },
  { name: "Computer Networks", attendance: 85, color: "#f59e0b" },
  { name: "AI", attendance: 90, color: "#8b5cf6" },
]

export function AttendanceSummary({ facultyId }: AttendanceSummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Attendance Trend
          </CardTitle>
          <CardDescription>Attendance patterns for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#3b82f6" name="Present %" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course-wise Attendance</CardTitle>
          <CardDescription>Average attendance by course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseData.map((course, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: course.color }} />
                  <span className="font-medium">{course.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${course.attendance}%`,
                        backgroundColor: course.color,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{course.attendance}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
