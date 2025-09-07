import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface RecentAttendanceProps {
  studentId: string
}

export async function RecentAttendance({ studentId }: RecentAttendanceProps) {
  const supabase = await createClient()

  const { data: recentAttendance } = await supabase
    .from("attendance_records")
    .select(`
      *,
      attendance_sessions(
        session_date,
        session_time,
        topic,
        courses(name, code)
      )
    `)
    .eq("student_id", studentId)
    .order("marked_at", { ascending: false })
    .limit(10)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "late":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "default"
      case "absent":
        return "destructive"
      case "late":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Attendance
        </CardTitle>
        <CardDescription>Your latest attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAttendance && recentAttendance.length > 0 ? (
            recentAttendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{record.attendance_sessions.courses.name}</h3>
                    <Badge variant="outline">{record.attendance_sessions.courses.code}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(record.attendance_sessions.session_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {record.attendance_sessions.session_time}
                    </div>
                  </div>
                  {record.attendance_sessions.topic && (
                    <p className="text-sm text-gray-500 mt-1">Topic: {record.attendance_sessions.topic}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(record.status)}
                  <Badge variant={getStatusColor(record.status) as any}>{record.status}</Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No attendance records found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
