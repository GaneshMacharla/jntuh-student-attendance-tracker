import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Users, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { FacultyStatsCards } from "@/components/faculty/faculty-stats-cards"
import { UpcomingClasses } from "@/components/faculty/upcoming-classes"
import { RecentSessions } from "@/components/faculty/recent-sessions"
import { AttendanceSummary } from "@/components/faculty/attendance-summary"

export default async function FacultyDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Get faculty information
  const { data: facultyData } = await supabase
    .from("faculty")
    .select(`
      *,
      users(full_name, email),
      departments(name, code)
    `)
    .eq("id", user.id)
    .single()

  if (!facultyData) redirect("/auth/login")

  // Fetch dashboard statistics
  const [{ data: assignedCourses }, { data: todaySessions }, { data: totalSessions }, { data: studentsCount }] =
    await Promise.all([
      supabase
        .from("course_assignments")
        .select(`
        courses(*)
      `)
        .eq("faculty_id", user.id),
      supabase
        .from("attendance_sessions")
        .select("*")
        .eq("faculty_id", user.id)
        .eq("session_date", new Date().toISOString().split("T")[0]),
      supabase.from("attendance_sessions").select("*").eq("faculty_id", user.id),
      supabase
        .from("course_enrollments")
        .select("student_id")
        .in("course_id", assignedCourses?.map((ca) => ca.courses.id) || []),
    ])

  const stats = [
    {
      title: "My Courses",
      value: assignedCourses?.length || 0,
      description: "Courses assigned to you",
      icon: BookOpen,
      trend: "Active this semester",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Today's Classes",
      value: todaySessions?.length || 0,
      description: "Scheduled for today",
      icon: Calendar,
      trend: "Check your schedule",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Students",
      value: studentsCount?.length || 0,
      description: "Across all your courses",
      icon: Users,
      trend: "Enrolled students",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Sessions",
      value: totalSessions?.length || 0,
      description: "Sessions conducted",
      icon: CheckCircle,
      trend: "This semester",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {facultyData.users.full_name}</h1>
        <p className="text-gray-600 mt-2">
          {facultyData.departments.name} • {facultyData.designation}
        </p>
      </div>

      {/* Stats Cards */}
      <FacultyStatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingClasses facultyId={user.id} />
        <RecentSessions facultyId={user.id} />
      </div>

      {/* Attendance Summary */}
      <AttendanceSummary facultyId={user.id} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks for faculty members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium">Mark Attendance</h3>
              <p className="text-sm text-gray-600">Record student attendance for your classes</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Clock className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium">Schedule Class</h3>
              <p className="text-sm text-gray-600">Create new attendance sessions</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium">View Students</h3>
              <p className="text-sm text-gray-600">See enrolled students and their performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
