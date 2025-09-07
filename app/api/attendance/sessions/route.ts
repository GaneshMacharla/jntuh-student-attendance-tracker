import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("course_id")
    const facultyId = searchParams.get("faculty_id")
    const date = searchParams.get("date")

    let query = supabase
      .from("attendance_sessions")
      .select(`
        *,
        courses(name, code),
        faculty(users(full_name))
      `)
      .order("session_date", { ascending: false })
      .order("session_time", { ascending: false })

    if (courseId) {
      query = query.eq("course_id", courseId)
    }
    if (facultyId) {
      query = query.eq("faculty_id", facultyId)
    }
    if (date) {
      query = query.eq("session_date", date)
    }

    const { data: sessions, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is faculty or admin
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!userData || !["faculty", "admin"].includes(userData.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { course_id, session_date, session_time, duration_minutes, topic } = body

    const { data, error } = await supabase
      .from("attendance_sessions")
      .insert({
        course_id,
        faculty_id: user.id,
        session_date,
        session_time,
        duration_minutes: duration_minutes || 60,
        topic,
        status: "active",
      })
      .select(`
        *,
        courses(name, code),
        faculty(users(full_name))
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ session: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
