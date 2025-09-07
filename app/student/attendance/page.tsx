import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default async function StudentAttendancePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Get student's attendance records
  const { data: attendanceRecords } = await supabase
    .from("attendance_records")
    .select(`
      *,
      attendance_sessions(
        session_date,
        session_time,
        topic,
        duration_minutes,
        courses(name, code),
        faculty(
          users(full_name)
        )
      )
    `)
    .eq("student_id", user.id)
    .order("attendance_sessions(session_date)", { ascending: false })

  // Calculate statistics
  const totalSessions = attendanceRecords?.length || 0
  const presentSessions = attendanceRecords?.filter((record) => record.status === "present").length || 0
  const absentSessions = attendanceRecords?.filter((record) => record.status === "absent").length || 0
  const lateSessions = attendanceRecords?.filter((record) => record.status === "late").length || 0
  const overallAttendance = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-gray-600 mt-2">Track your attendance across all courses</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold">{presentSessions}</div>
            </div>
            <p className="text-xs text-muted-foreground">Present Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div className="text-2xl font-bold">{absentSessions}</div>
            </div>
            <p className="text-xs text-muted-foreground">Absent Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div className="text-2xl font-bold">{lateSessions}</div>
            </div>
            <p className="text-xs text-muted-foreground">Late Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{overallAttendance}%</div>
            <p className="text-xs text-muted-foreground">Overall Attendance</p>
            <Badge
              variant={overallAttendance >= 75 ? "default" : overallAttendance >= 50 ? "secondary" : "destructive"}
              className="mt-1"
            >
              {overallAttendance >= 75 ? "Good" : overallAttendance >= 50 ? "Average" : "Poor"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Complete history of your attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search by course or date..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="space-y-4">
            {attendanceRecords?.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {record.status === "present" && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {record.status === "absent" && <XCircle className="h-5 w-5 text-red-600" />}
                    {record.status === "late" && <AlertCircle className="h-5 w-5 text-orange-600" />}
                    <Badge
                      variant={
                        record.status === "present" ? "default" : record.status === "late" ? "secondary" : "destructive"
                      }
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-medium">
                      {record.attendance_sessions?.courses?.name} ({record.attendance_sessions?.courses?.code})
                    </div>
                    <div className="text-sm text-gray-600">{record.attendance_sessions?.topic}</div>
                    <div className="text-sm text-gray-500">
                      Faculty: {record.attendance_sessions?.faculty?.users?.full_name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {new Date(record.attendance_sessions?.session_date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">{record.attendance_sessions?.session_time}</div>
                  <div className="text-sm text-gray-500">{record.attendance_sessions?.duration_minutes} min</div>
                </div>
              </div>
            ))}
            {(!attendanceRecords || attendanceRecords.length === 0) && (
              <div className="text-center py-8 text-gray-500">No attendance records found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
