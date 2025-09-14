"use client"

import React, { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BookOpen, CheckCircle } from "lucide-react"

// Hardcoded data for demonstration
const curriculumOptions = ["R22", "R25"]
const branchOptions = ["Computer Science and Engineering", "Electronics and Communication Engineering", "Mechanical Engineering"]
const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"]
const semesterOptions = ["1st Semester", "2nd Semester"]
const demoSubjects: Record<string, string[]> = {
  "R22_Computer Science and Engineering_1st Year_1st Semester": [
    "Linear Algebra and Calculus",
    "Applied Physics",
    "Programming for Problem Solving",
    "Engineering Graphics and Design",
    "English Language and Communication Skills"
  ],
  "R22_Electronics and Communication Engineering_1st Year_1st Semester": [
    "Linear Algebra and Calculus",
    "Applied Chemistry",
    "Basic Electrical Engineering",
    "Engineering Workshop",
    "English Language and Communication Skills"
  ],
  "R25_Computer Science and Engineering_2nd Year_1st Semester": [
    "Data Structures and Algorithms",
    "Database Management Systems",
    "Discrete Mathematics",
    "Object-Oriented Programming"
  ],
  // Add more subjects as needed for other combinations
}

export default function StudentDashboard() {
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [selection, setSelection] = useState({
    curriculum: "",
    branch: "",
    year: "",
    semester: "",
  })
  const [subjects, setSubjects] = useState<string[]>([])

  const handleSelectChange = (field: string, value: string) => {
    setSelection(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selection.curriculum && selection.branch && selection.year && selection.semester) {
      const key = `${selection.curriculum}_${selection.branch}_${selection.year}_${selection.semester}`
      setSubjects(demoSubjects[key] || ["No subjects found for this selection."])
      setIsDataSubmitted(true)
    }
  }

  // The loading state is no longer needed since the user check is removed
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!isDataSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="curriculum">Curriculum</Label>
                <Select onValueChange={(value) => handleSelectChange("curriculum", value)} value={selection.curriculum}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your curriculum" />
                  </SelectTrigger>
                  <SelectContent>
                    {curriculumOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="branch">Branch</Label>
                <Select onValueChange={(value) => handleSelectChange("branch", value)} value={selection.branch}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year">Year</Label>
                <Select onValueChange={(value) => handleSelectChange("year", value)} value={selection.year}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="semester">Semester</Label>
                <Select onValueChange={(value) => handleSelectChange("semester", value)} value={selection.semester}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesterOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Curriculum: **{selection.curriculum}** | Branch: **{selection.branch}** | Year: **{selection.year}** | Semester: **{selection.semester}**
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Enrolled Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {subjects.map((subject, index) => (
              <li key={index} className="text-lg text-gray-800">
                {subject}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Quick Actions (Dummy)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Quick actions section content goes here.</p>
        </CardContent>
      </Card>
    </div>
  )
}