import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to appropriate dashboard
  if (user) {
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userData?.role === "admin") {
      redirect("/admin")
    } else if (userData?.role === "faculty") {
      redirect("/faculty")
    } else if (userData?.role === "student") {
      redirect("/student")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JNTUH Attendance Tracker</h1>
          <p className="text-gray-600">Streamlined attendance management for students and faculty</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to access your dashboard and manage attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>For administrators, faculty, and students</p>
        </div>
      </div>
    </div>
  )
}
