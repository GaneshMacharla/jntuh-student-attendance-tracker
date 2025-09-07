"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react"

interface ReportsTableProps {
  data: Array<{
    id: string
    status: string
    attendance_sessions?: {
      session_date: string
      session_time: string
      courses?: {
        name: string
        code: string
        departments?: {
          name: string
        }
      }
      faculty?: {
        users?: {
          full_name: string
        }
      }
    }
    students?: {
      roll_number: string
      users?: {
        full_name: string
        email: string
      }
      departments?: {
        name: string
      }
    }
  }>
}

export function ReportsTable({ data }: ReportsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredData = data.filter(
    (record) =>
      record.students?.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.students?.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.attendance_sessions?.courses?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.attendance_sessions?.courses?.code?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const exportToCSV = () => {
    const headers = ["Student Name", "Roll Number", "Course", "Date", "Time", "Status", "Faculty", "Department"]
    const csvData = filteredData.map((record) => [
      record.students?.users?.full_name || "",
      record.students?.roll_number || "",
      `${record.attendance_sessions?.courses?.name} (${record.attendance_sessions?.courses?.code})`,
      record.attendance_sessions?.session_date || "",
      record.attendance_sessions?.session_time || "",
      record.status,
      record.attendance_sessions?.faculty?.users?.full_name || "",
      record.students?.departments?.name || "",
    ])

    const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "attendance_report.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Detailed Attendance Records</CardTitle>
            <CardDescription>Complete attendance data with filters and export options</CardDescription>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by student name, roll number, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Student</th>
                  <th className="text-left p-3 font-medium">Course</th>
                  <th className="text-left p-3 font-medium">Date & Time</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Faculty</th>
                  <th className="text-left p-3 font-medium">Department</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{record.students?.users?.full_name}</div>
                        <div className="text-sm text-gray-600">{record.students?.roll_number}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{record.attendance_sessions?.courses?.name}</div>
                        <div className="text-sm text-gray-600">{record.attendance_sessions?.courses?.code}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">
                          {record.attendance_sessions?.session_date
                            ? new Date(record.attendance_sessions.session_date).toLocaleDateString()
                            : ""}
                        </div>
                        <div className="text-sm text-gray-600">{record.attendance_sessions?.session_time}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          record.status === "present"
                            ? "default"
                            : record.status === "late"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">{record.attendance_sessions?.faculty?.users?.full_name}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">{record.students?.departments?.name}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} records
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
