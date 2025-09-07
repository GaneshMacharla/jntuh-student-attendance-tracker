"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

interface AttendanceSessionCardProps {
  session: any
}

export function AttendanceSessionCard({ session }: AttendanceSessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const totalStudents = session.attendance_records?.length || 0
  const presentStudents = session.attendance_records?.filter((record: any) => record.status === "present").length || 0
  const absentStudents = session.attendance_records?.filter((record: any) => record.status === "absent").length || 0
  const lateStudents = session.attendance_records?.filter((record: any) => record.status === "late").length || 0

  const attendanceRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{session.courses.name}</h3>
              <Badge variant="outline">{session.courses.code}</Badge>
              <Badge variant={session.status === "active" ? "default" : "secondary"}>{session.status}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {session.session_time}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {session.duration_minutes} minutes
              </div>
            </div>
            {session.topic && <p className="text-sm text-gray-600 mt-1">Topic: {session.topic}</p>}
          </div>

          <div className="flex flex-col items-end gap-2">
            {totalStudents > 0 && (
              <Badge variant={attendanceRate >= 75 ? "default" : attendanceRate >= 50 ? "secondary" : "destructive"}>
                {attendanceRate}% attendance
              </Badge>
            )}
            <Button onClick={() => setIsExpanded(!isExpanded)} variant={totalStudents > 0 ? "outline" : "default"}>
              {totalStudents > 0 ? "View/Edit Attendance" : "Mark Attendance"}
            </Button>
          </div>
        </div>

        {totalStudents > 0 && (
          <div className="flex items-center gap-6 mb-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>{presentStudents} Present</span>
            </div>
            <div className="flex items-center gap-1 text-red-600">
              <XCircle className="h-4 w-4" />
              <span>{absentStudents} Absent</span>
            </div>
            {lateStudents > 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                <span>{lateStudents} Late</span>
              </div>
            )}
          </div>
        )}

        {isExpanded && session.attendance_records && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Student Attendance</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {session.attendance_records.map((record: any) => (
                <div key={record.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{record.students.users.full_name}</span>
                    <span className="text-sm text-gray-500 ml-2">({record.students.roll_number})</span>
                  </div>
                  <Badge
                    variant={
                      record.status === "present" ? "default" : record.status === "late" ? "secondary" : "destructive"
                    }
                  >
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
