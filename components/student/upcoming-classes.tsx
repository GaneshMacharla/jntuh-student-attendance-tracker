import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"

interface UpcomingClassesProps {
  studentId: string
}

export async function UpcomingClasses({ studentId }: UpcomingClassesProps) {
  const supabase = await createClient()

  // Get student's enrolled courses
  const { data: enrolledCourses } = await supabase
    .from("course_enrollments")
    .select("course_id")
    .eq("student_id", studentId)

  const courseIds = enrolledCourses?.map((enrollment) => enrollment.course_id) || []

  // Get upcoming sessions for enrolled courses
  const { data: upcomingSessions } = await supabase
    .from("attendance_sessions")
    .select(`
      *,
      courses(name, code),
      faculty(
        users(full_name)
      )
    `)
    .in("course_id", courseIds)
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
                      <User className="h-4 w-4" />
                      {session.faculty.users.full_name}
                    </div>
                  </div>
                  {session.topic && <p className="text-sm text-gray-500 mt-1">Topic: {session.topic}</p>}
                </div>
                <Badge variant={session.status === "active" ? "default" : "secondary"}>{session.status}</Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No upcoming classes scheduled</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
