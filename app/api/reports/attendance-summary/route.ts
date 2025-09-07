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
    const studentId = searchParams.get("student_id")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    // Build the query for attendance summary
    let query = `
      SELECT 
        s.id as student_id,
        s.roll_number,
        u.full_name,
        c.name as course_name,
        c.code as course_code,
        COUNT(ar.id) as total_sessions,
        COUNT(CASE WHEN ar.status = 'present' THEN 1 END) as present_count,
        COUNT(CASE WHEN ar.status = 'absent' THEN 1 END) as absent_count,
        COUNT(CASE WHEN ar.status = 'late' THEN 1 END) as late_count,
        ROUND(
          (COUNT(CASE WHEN ar.status = 'present' THEN 1 END) * 100.0 / 
           NULLIF(COUNT(ar.id), 0)), 2
        ) as attendance_percentage
      FROM students s
      JOIN users u ON s.id = u.id
      JOIN course_enrollments ce ON s.id = ce.student_id
      JOIN courses c ON ce.course_id = c.id
      LEFT JOIN attendance_sessions ats ON c.id = ats.course_id
      LEFT JOIN attendance_records ar ON ats.id = ar.session_id AND s.id = ar.student_id
    `

    const conditions = []
    if (courseId) conditions.push(`c.id = '${courseId}'`)
    if (studentId) conditions.push(`s.id = '${studentId}'`)
    if (startDate) conditions.push(`ats.session_date >= '${startDate}'`)
    if (endDate) conditions.push(`ats.session_date <= '${endDate}'`)

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    query += ` GROUP BY s.id, s.roll_number, u.full_name, c.name, c.code ORDER BY u.full_name`

    const { data: summary, error } = await supabase.rpc("execute_sql", {
      sql_query: query,
    })

    if (error) {
      // Fallback to simpler query if RPC doesn't work
      const { data: records, error: recordsError } = await supabase.from("attendance_records").select(`
          *,
          students(
            roll_number,
            users(full_name)
          ),
          attendance_sessions(
            session_date,
            courses(name, code)
          )
        `)

      if (recordsError) {
        return NextResponse.json({ error: recordsError.message }, { status: 400 })
      }

      return NextResponse.json({ summary: records })
    }

    return NextResponse.json({ summary })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
