import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, BarChart3, Users, BookOpen, TrendingUp } from "lucide-react"
import { FacultyAttendanceChart } from "@/components/faculty/faculty-attendance-chart"

export default async function FacultyReportsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Get faculty's courses and attendance data
  const { data: facultyCourses } = await supabase
    .from("faculty")
    .select(`
      courses(
        id,
        name,
        code,
        attendance_sessions(
          id,
          session_date,
          attendance_records(
            id,
            status,
            students(
              roll_number,
              users(full_name)
            )
          )
        )
      )
    `)
    .eq("user_id", user.id)

  // Calculate statistics for faculty's courses
  const courses = facultyCourses?.[0]?.courses || []
  const totalSessions = courses.reduce((acc, course) => acc + (course.attendance_sessions?.length || 0), 0)
  const totalStudentRecords = courses.reduce(
    (acc, course) =>
      acc +
        course.attendance_sessions?.reduce(
          (sessionAcc, session) => sessionAcc + (session.attendance_records?.length || 0),
          0,
        ) || 0,
    0,
  )
  const presentRecords = courses.reduce(
    (acc, course) =>
      acc +
        course.attendance_sessions?.reduce(
          (sessionAcc, session) =>
            sessionAcc + (session.attendance_records?.filter((record) => record.status === "present").length || 0),
          0,
        ) || 0,
    0,
  )

  const overallAttendance = totalStudentRecords > 0 ? Math.round((presentRecords / totalStudentRecords) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Course Reports</h1>
          <p className="text-gray-600 mt-2">Attendance analytics for your courses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="date" className="px-3 py-2 border rounded-md" placeholder="From Date" />
            <input type="date" className="px-3 py-2 border rounded-md" placeholder="To Date" />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div className="text-2xl font-bold">{courses.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Total Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold">{totalSessions}</div>
            </div>
            <p className="text-xs text-muted-foreground">Sessions Conducted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div className="text-2xl font-bold">{totalStudentRecords}</div>
            </div>
            <p className="text-xs text-muted-foreground">Student Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div className="text-2xl font-bold">{overallAttendance}%</div>
            </div>
            <p className="text-xs text-muted-foreground">Average Attendance</p>
            <Badge variant={overallAttendance >= 75 ? "default" : "secondary"} className="mt-1">
              {overallAttendance >= 75 ? "Good" : "Needs Improvement"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Course-wise Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FacultyAttendanceChart />
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Attendance percentage by course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => {
                const courseRecords =
                  course.attendance_sessions?.reduce(
                    (acc, session) => acc + (session.attendance_records?.length || 0),
                    0,
                  ) || 0
                const coursePresentRecords =
                  course.attendance_sessions?.reduce(
                    (acc, session) =>
                      acc + (session.attendance_records?.filter((record) => record.status === "present").length || 0),
                    0,
                  ) || 0
                const courseAttendance =
                  courseRecords > 0 ? Math.round((coursePresentRecords / courseRecords) * 100) : 0

                return (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{course.name}</div>
                        <div className="text-sm text-gray-600">{course.code}</div>
                      </div>
                      <Badge variant={courseAttendance >= 75 ? "default" : "secondary"}>{courseAttendance}%</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${courseAttendance}%` }} />
                    </div>
                    <div className="text-sm text-gray-600">
                      {coursePresentRecords} of {courseRecords} records present
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
