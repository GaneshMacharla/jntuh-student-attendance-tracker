import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Users, BarChart3 } from "lucide-react"

interface RecentSessionsProps {
  facultyId: string
}

export async function RecentSessions({ facultyId }: RecentSessionsProps) {
  const supabase = await createClient()

  const { data: recentSessions } = await supabase
    .from("attendance_sessions")
    .select(`
      *,
      courses(name, code),
      attendance_records(status)
    `)
    .eq("faculty_id", facultyId)
    .order("session_date", { ascending: false })
    .order("session_time", { ascending: false })
    .limit(5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Sessions
        </CardTitle>
        <CardDescription>Your recently conducted classes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSessions && recentSessions.length > 0 ? (
            recentSessions.map((session) => {
              const totalStudents = session.attendance_records.length
              const presentStudents = session.attendance_records.filter(
                (record: any) => record.status === "present",
              ).length
              const attendanceRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0

              return (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{session.courses.name}</h3>
                      <Badge variant="outline">{session.courses.code}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(session.session_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.session_time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {presentStudents}/{totalStudents} present
                      </div>
                    </div>
                    {session.topic && <p className="text-sm text-gray-500 mt-1">Topic: {session.topic}</p>}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge
                      variant={attendanceRate >= 75 ? "default" : attendanceRate >= 50 ? "secondary" : "destructive"}
                    >
                      {attendanceRate}% attendance
                    </Badge>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent sessions found</p>
              <Button variant="outline" className="mt-2 bg-transparent">
                Create Session
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
