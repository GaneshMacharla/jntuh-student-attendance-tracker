"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, TrendingUp, TrendingDown } from "lucide-react"

interface CoursePerformanceProps {
  courses: Array<{
    id: string
    name: string
    code: string
    totalSessions: number
    attendedSessions: number
    attendancePercentage: number
    trend: "up" | "down" | "stable"
  }>
}

export function CoursePerformance({ courses }: CoursePerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Course Performance
        </CardTitle>
        <CardDescription>Your attendance performance across all courses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{course.name}</div>
                  <div className="text-sm text-gray-600">{course.code}</div>
                </div>
                <div className="flex items-center gap-2">
                  {course.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                  {course.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                  <Badge
                    variant={
                      course.attendancePercentage >= 75
                        ? "default"
                        : course.attendancePercentage >= 50
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {course.attendancePercentage}%
                  </Badge>
                </div>
              </div>
              <Progress value={course.attendancePercentage} className="h-2" />
              <div className="text-sm text-gray-600">
                {course.attendedSessions} of {course.totalSessions} sessions attended
              </div>
            </div>
          ))}
          {courses.length === 0 && <div className="text-center py-4 text-gray-500">No courses enrolled</div>}
        </div>
      </CardContent>
    </Card>
  )
}
