import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, UserPlus, BookOpen, Calendar } from "lucide-react"

const recentActivities = [
  {
    id: 1,
    type: "user_created",
    message: "New student registered: John Doe",
    time: "2 minutes ago",
    icon: UserPlus,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "course_created",
    message: "New course added: Machine Learning",
    time: "15 minutes ago",
    icon: BookOpen,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "attendance_marked",
    message: "Attendance marked for CS601ES",
    time: "1 hour ago",
    icon: Calendar,
    color: "text-purple-600",
  },
  {
    id: 4,
    type: "user_created",
    message: "New faculty registered: Dr. Smith",
    time: "2 hours ago",
    icon: UserPlus,
    color: "text-green-600",
  },
  {
    id: 5,
    type: "course_updated",
    message: "Course updated: Database Systems",
    time: "3 hours ago",
    icon: BookOpen,
    color: "text-orange-600",
  },
]

export function RecentActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest system activities and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activity.type.replace("_", " ")}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
