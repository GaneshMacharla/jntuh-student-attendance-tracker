import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from "lucide-react"

interface UpcomingClassesProps {
  facultyId: string
}

export async function UpcomingClasses({ facultyId }: UpcomingClassesProps) {
  const supabase = await createClient()

  const { data: upcomingSessions } = await supabase
    .from("attendance_sessions")
    .select(`
      *,
      courses(name, code)
    `)
    .eq("faculty_id", facultyId)
    .gte("session_date", new Date().toISOString().split("T")[0])
    .order("session_date")
    .order("session_time")
    .limit(5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Classes
        </CardTitle>
        <CardDescription>Your scheduled classes for the next few days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingSessions && upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
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
                <div className="flex flex-col gap-2">
                  <Badge variant={session.status === "active" ? "default" : "secondary"}>{session.status}</Badge>
                  <Button size="sm" variant="outline">
                    Mark Attendance
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No upcoming classes scheduled</p>
              <Button variant="outline" className="mt-2 bg-transparent">
                Schedule a Class
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
