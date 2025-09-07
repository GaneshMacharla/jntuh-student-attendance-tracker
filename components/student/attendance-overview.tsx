"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, PieChartIcon } from "lucide-react"

interface AttendanceOverviewProps {
  studentId: string
  attendanceRecords: any[]
}

export function AttendanceOverview({ studentId, attendanceRecords }: AttendanceOverviewProps) {
  // Process data for charts
  const monthlyData = []
  const currentYear = new Date().getFullYear()

  for (let month = 0; month < 12; month++) {
    const monthRecords = attendanceRecords.filter((record) => {
      const sessionDate = new Date(record.attendance_sessions.session_date)
      return sessionDate.getMonth() === month && sessionDate.getFullYear() === currentYear
    })

    const present = monthRecords.filter((record) => record.status === "present").length
    const absent = monthRecords.filter((record) => record.status === "absent").length
    const late = monthRecords.filter((record) => record.status === "late").length
    const total = monthRecords.length

    monthlyData.push({
      month: new Date(currentYear, month).toLocaleDateString("en-US", { month: "short" }),
      present: total > 0 ? Math.round((present / total) * 100) : 0,
      absent: total > 0 ? Math.round((absent / total) * 100) : 0,
      late: total > 0 ? Math.round((late / total) * 100) : 0,
    })
  }

  // Overall statistics for pie chart
  const totalRecords = attendanceRecords.length
  const presentCount = attendanceRecords.filter((record) => record.status === "present").length
  const absentCount = attendanceRecords.filter((record) => record.status === "absent").length
  const lateCount = attendanceRecords.filter((record) => record.status === "late").length

  const pieData = [
    { name: "Present", value: presentCount, color: "#10b981" },
    { name: "Absent", value: absentCount, color: "#ef4444" },
    { name: "Late", value: lateCount, color: "#f59e0b" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Attendance Trend
          </CardTitle>
          <CardDescription>Your attendance percentage by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#10b981" name="Present %" />
              <Bar dataKey="late" fill="#f59e0b" name="Late %" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Overall Attendance Distribution
          </CardTitle>
          <CardDescription>Total attendance breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm">
                  {entry.name}: {entry.value} ({totalRecords > 0 ? Math.round((entry.value / totalRecords) * 100) : 0}
                  %)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
