import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, Users } from "lucide-react"
import { AttendanceSessionCard } from "@/components/faculty/attendance-session-card"

export default async function AttendancePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Get today's sessions
  const { data: todaySessions } = await supabase
    .from("attendance_sessions")
    .select(`
      *,
      courses(name, code),
      attendance_records(
        *,
        students(
          roll_number,
          users(full_name)
        )
      )
    `)
    .eq("faculty_id", user.id)
    .eq("session_date", new Date().toISOString().split("T")[0])
    .order("session_time")

  // Get upcoming sessions (next 7 days)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  const { data: upcomingSessions } = await supabase
    .from("attendance_sessions")
    .select(`
      *,
      courses(name, code)
    `)
    .eq("faculty_id", user.id)
    .gt("session_date", new Date().toISOString().split("T")[0])
    .lte("session_date", nextWeek.toISOString().split("T")[0])
    .order("session_date")
    .order("session_time")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-2">Mark attendance for your classes</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Session
        </Button>
      </div>

      {/* Today's Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Sessions
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaySessions && todaySessions.length > 0 ? (
            <div className="grid gap-4">
              {todaySessions.map((session) => (
                <AttendanceSessionCard key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No sessions scheduled for today</p>
              <Button variant="outline" className="mt-2 bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Schedule a Class
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Sessions
          </CardTitle>
          <CardDescription>Sessions scheduled for the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingSessions && upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
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
                        {session.duration_minutes} min
                      </div>
                    </div>
                    {session.topic && <p className="text-sm text-gray-500 mt-1">Topic: {session.topic}</p>}
                  </div>
                  <Badge variant="secondary">{session.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No upcoming sessions scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
