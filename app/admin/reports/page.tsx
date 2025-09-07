import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, BarChart3, TrendingUp, Users, BookOpen } from "lucide-react"
import { AttendanceChart } from "@/components/admin/attendance-chart"
import { ReportsTable } from "@/components/reports/reports-table"

export default async function AdminReportsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Get comprehensive attendance data
  const { data: attendanceData } = await supabase
    .from("attendance_records")
    .select(`
      *,
      attendance_sessions(
        session_date,
        session_time,
        courses(name, code, department_id, departments(name)),
        faculty(users(full_name))
      ),
      students(
        roll_number,
        users(full_name, email),
        departments(name)
      )
    `)
    .order("attendance_sessions(session_date)", { ascending: false })

  // Calculate overall statistics
  const totalRecords = attendanceData?.length || 0
  const presentRecords = attendanceData?.filter((record) => record.status === "present").length || 0
  const absentRecords = attendanceData?.filter((record) => record.status === "absent").length || 0
  const lateRecords = attendanceData?.filter((record) => record.status === "late").length || 0
  const overallAttendance = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0

  // Get department-wise statistics
  const departmentStats =
    attendanceData?.reduce(
      (acc, record) => {
        const deptName = record.students?.departments?.name || "Unknown"
        if (!acc[deptName]) {
          acc[deptName] = { total: 0, present: 0 }
        }
        acc[deptName].total++
        if (record.status === "present") acc[deptName].present++
        return acc
      },
      {} as Record<string, { total: number; present: number }>,
    ) || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive attendance insights and reports</p>
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
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="cse">Computer Science</SelectItem>
                <SelectItem value="ece">Electronics</SelectItem>
                <SelectItem value="mech">Mechanical</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" placeholder="From Date" />
            <Input type="date" placeholder="To Date" />
          </div>
        </CardContent>
      </Card>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div className="text-2xl font-bold">{overallAttendance}%</div>
            </div>
            <p className="text-xs text-muted-foreground">Overall Attendance</p>
            <Badge variant={overallAttendance >= 75 ? "default" : "secondary"} className="mt-1">
              {overallAttendance >= 75 ? "Good" : "Needs Improvement"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold">{presentRecords}</div>
            </div>
            <p className="text-xs text-muted-foreground">Present Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div className="text-2xl font-bold">{absentRecords}</div>
            </div>
            <p className="text-xs text-muted-foreground">Absent Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div className="text-2xl font-bold">{totalRecords}</div>
            </div>
            <p className="text-xs text-muted-foreground">Total Records</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <Card>
          <CardHeader>
            <CardTitle>Department-wise Attendance</CardTitle>
            <CardDescription>Attendance percentage by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(departmentStats).map(([dept, stats]) => {
                const percentage = Math.round((stats.present / stats.total) * 100)
                return (
                  <div key={dept} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{dept}</span>
                      <Badge variant={percentage >= 75 ? "default" : "secondary"}>{percentage}%</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <div className="text-sm text-gray-600">
                      {stats.present} of {stats.total} records
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Table */}
      <ReportsTable data={attendanceData || []} />
    </div>
  )
}
