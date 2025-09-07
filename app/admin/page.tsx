import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, Calendar, TrendingUp, UserCheck } from "lucide-react"
import { AdminStatsCards } from "@/components/admin/admin-stats-cards"
import { RecentActivityFeed } from "@/components/admin/recent-activity-feed"
import { AttendanceChart } from "@/components/admin/attendance-chart"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch dashboard statistics
  const [{ count: totalStudents }, { count: totalFaculty }, { count: totalCourses }, { count: totalSessions }] =
    await Promise.all([
      supabase.from("students").select("*", { count: "exact", head: true }),
      supabase.from("faculty").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("attendance_sessions").select("*", { count: "exact", head: true }),
    ])

  const stats = [
    {
      title: "Total Students",
      value: totalStudents || 0,
      description: "Registered students",
      icon: GraduationCap,
      trend: "+12% from last month",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Faculty",
      value: totalFaculty || 0,
      description: "Active faculty members",
      icon: UserCheck,
      trend: "+3% from last month",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Courses",
      value: totalCourses || 0,
      description: "Available courses",
      icon: BookOpen,
      trend: "+8% from last month",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Attendance Sessions",
      value: totalSessions || 0,
      description: "Sessions this month",
      icon: Calendar,
      trend: "+15% from last month",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to JNTUH Attendance Tracker administration panel</p>
      </div>

      {/* Stats Cards */}
      <AdminStatsCards stats={stats} />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <RecentActivityFeed />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium">Manage Users</h3>
              <p className="text-sm text-gray-600">Add or edit student and faculty accounts</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <BookOpen className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium">Course Management</h3>
              <p className="text-sm text-gray-600">Create and manage course offerings</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Calendar className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium">View Reports</h3>
              <p className="text-sm text-gray-600">Generate attendance and performance reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
