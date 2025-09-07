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
    const sessionId = searchParams.get("session_id")
    const studentId = searchParams.get("student_id")

    let query = supabase
      .from("attendance_records")
      .select(`
        *,
        attendance_sessions(
          session_date,
          session_time,
          courses(name, code)
        ),
        students(
          roll_number,
          users(full_name, email)
        )
      `)
      .order("marked_at", { ascending: false })

    if (sessionId) {
      query = query.eq("session_id", sessionId)
    }
    if (studentId) {
      query = query.eq("student_id", studentId)
    }

    const { data: records, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ records })
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
    const { session_id, student_id, status } = body

    const { data, error } = await supabase
      .from("attendance_records")
      .upsert({
        session_id,
        student_id,
        status,
        marked_by: user.id,
        marked_at: new Date().toISOString(),
      })
      .select(`
        *,
        attendance_sessions(
          session_date,
          session_time,
          courses(name, code)
        ),
        students(
          roll_number,
          users(full_name, email)
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ record: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
