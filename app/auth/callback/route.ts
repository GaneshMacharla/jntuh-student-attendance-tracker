import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get user data to determine redirect based on role
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Get user role from database
        const { data: userData } = await supabase.from("users").select("role").eq("email", user.email).single()

        // Redirect based on user role
        if (userData?.role === "admin") {
          return NextResponse.redirect(`${origin}/admin`)
        } else if (userData?.role === "faculty") {
          return NextResponse.redirect(`${origin}/faculty`)
        } else if (userData?.role === "student") {
          return NextResponse.redirect(`${origin}/student`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
