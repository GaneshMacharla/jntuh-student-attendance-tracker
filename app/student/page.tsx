import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, TrendingUp, Award, CheckCircle } from "lucide-react"
import { StudentStatsCards } from "@/components/student/student-stats-cards"
import { AttendanceOverview } from "@/components/student/attendance-overview"
import { UpcomingClasses } from "@/components/student/upcoming-classes"
import { RecentAttendance } from "@/components/student/recent-attendance"

export default async function StudentDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Get student information
  const { data: studentData } = await supabase
    .from("students")
    .select(`
      *,
      users(full_name, email),
      departments(name, code)
    `)
    .eq("id", user.id)
    .single()

  if (!studentData) redirect("/auth/login")

  // Fetch enrolled courses
  const { data: enrolledCourses } = await supabase
    .from("course_enrollments")
    .select(`
      courses(*)
    `)
    .eq("student_id", user.id)

  // Fetch attendance records
  const { data: attendanceRecords } = await supabase
    .from("attendance_records")
    .select(`
      *,
      attendance_sessions(
        session_date,
        courses(name, code)
      )
    `)
    .eq("student_id", user.id)

  // Calculate statistics
  const totalCourses = enrolledCourses?.length || 0
  const totalSessions = attendanceRecords?.length || 0
  const presentSessions = attendanceRecords?.filter((record) => record.status === "present").length || 0
  const overallAttendance = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0

  // Get current month attendance
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyRecords = attendanceRecords?.filter((record) => {
    const sessionDate = new Date(record.attendance_sessions.session_date)
    return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear
  })
  const monthlyPresent = monthlyRecords?.filter((record) => record.status === "present").length || 0
  const monthlyTotal = monthlyRecords?.length || 0
  const monthlyAttendance = monthlyTotal > 0 ? Math.round((monthlyPresent / monthlyTotal) * 100) : 0

  const stats = [
    {
      title: "Enrolled Courses",
      value: totalCourses,
      description: "Active enrollments",
      icon: BookOpen,
      trend: "This semester",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Overall Attendance",
      value: `${overallAttendance}%`,
      description: "Total attendance rate",
      icon: TrendingUp,
      trend: `${presentSessions}/${totalSessions} sessions`,
      color: overallAttendance >= 75 ? "text-green-600" : "text-orange-600",
      bgColor: overallAttendance >= 75 ? "bg-green-50" : "bg-orange-50",
    },
    {
      title: "This Month",
      value: `${monthlyAttendance}%`,
      description: "Monthly attendance",
      icon: Calendar,
      trend: `${monthlyPresent}/${monthlyTotal} sessions`,
      color: monthlyAttendance >= 75 ? "text-green-600" : "text-red-600",
      bgColor: monthlyAttendance >= 75 ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "Academic Standing",
      value: overallAttendance >= 85 ? "Excellent" : overallAttendance >= 75 ? "Good" : "Needs Improvement",
      description: "Performance status",
      icon: Award,
      trend: "Based on attendance",
      color: overallAttendance >= 85 ? "text-green-600" : overallAttendance >= 75 ? "text-blue-600" : "text-red-600",
      bgColor: overallAttendance >= 85 ? "bg-green-50" : overallAttendance >= 75 ? "bg-blue-50" : "bg-red-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {studentData.users.full_name}</h1>
        <p className="text-gray-600 mt-2">
          {studentData.roll_number} • {studentData.departments.name} • Year {studentData.year}, Semester{" "}
          {studentData.semester}
        </p>
      </div>

      {/* Stats Cards */}
      <StudentStatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingClasses studentId={user.id} />
        <RecentAttendance studentId={user.id} />
      </div>

      {/* Attendance Overview */}
      <AttendanceOverview studentId={user.id} attendanceRecords={attendanceRecords || []} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium">View Schedule</h3>
              <p className="text-sm text-gray-600">Check your upcoming classes and sessions</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium">Attendance Report</h3>
              <p className="text-sm text-gray-600">View detailed attendance analytics</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium">Course Details</h3>
              <p className="text-sm text-gray-600">View enrolled courses and performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
