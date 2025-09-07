import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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
    const { session_id, attendance_data } = body

    // attendance_data should be an array of { student_id, status }
    const records = attendance_data.map((record: any) => ({
      session_id,
      student_id: record.student_id,
      status: record.status,
      marked_by: user.id,
      marked_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase
      .from("attendance_records")
      .upsert(records)
      .select(`
        *,
        students(
          roll_number,
          users(full_name, email)
        )
      `)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: `Successfully updated attendance for ${data.length} students`,
      records: data,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
